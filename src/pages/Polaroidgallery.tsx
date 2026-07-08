import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import '../styles/PolaroidGallery.css';

/**
 * PolaroidGallery
 * ----------------
 * A mobile-first, swipeable stack of "polaroid" photos sourced from Cloudinary.
 *
 * Install peer dependency:
 *   npm install framer-motion
 */

export interface PolaroidImage {
  /** Unique id, also used to seed the card's tilt so it's stable across renders */
  id: string;
  /** Cloudinary public ID, e.g. "memories/paris_01". Used with `cloudName` to build the URL. */
  publicId?: string;
  /** Fully-qualified image URL — used if publicId/cloudName aren't supplied. */
  url?: string;
  /** Small caption printed on the polaroid's bottom strip. */
  caption: string;
}

export interface PolaroidGalleryProps {
  images: PolaroidImage[];
  /** Cloudinary cloud name, required if using `publicId` on images. */
  cloudName?: string;
  /** Called when the user taps the primary "Continue" action. */
  onContinue?: () => void;
  /** Called when the user taps "Navigate Timeline". */
  onNavigateTimeline?: () => void;
  /** Called every time the visible photo changes (swipe forward/back). */
  onIndexChange?: (index: number) => void;
  className?: string;
}

const VISIBLE_STACK = 3;
const SWIPE_DISTANCE_THRESHOLD = 110;
const SWIPE_VELOCITY_THRESHOLD = 500;

/** Builds a Cloudinary delivery URL, or falls back to a plain url. */
function cloudinaryUrl(
  cloudName: string | undefined,
  publicId: string | undefined,
  url: string | undefined,
  transform: string
): string {
  if (cloudName && publicId) {
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${publicId}`;
  }
  return url ?? '';
}

/** Deterministic pseudo-random tilt per card, seeded by id so the stack looks
 * hand-tossed but never jitters between re-renders. */
function seededTilt(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const normalized = (hash % 1000) / 1000; // roughly -1..1
  return normalized * 6; // max ~6deg tilt either way
}

interface Heart {
  id: number;
  left: number;
  delay: number;
  duration: number;
  scale: number;
  burst?: boolean;
}

let heartUid = 0;

const PolaroidGallery: React.FC<PolaroidGalleryProps> = ({
  images,
  cloudName,
  onContinue,
  onNavigateTimeline,
  onIndexChange,
  className,
}) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const isDragging = useRef(false);

  const current = images[index];

  // Ambient hearts drift up continuously at low density — a quiet atmosphere,
  // not confetti.
  useEffect(() => {
    const spawnAmbient = () => {
      setHearts((prev) => {
        const trimmed = prev.length > 10 ? prev.slice(prev.length - 10) : prev;
        return [
          ...trimmed,
          {
            id: heartUid++,
            left: Math.random() * 88 + 4,
            delay: 0,
            duration: 7 + Math.random() * 4,
            scale: 0.45 + Math.random() * 0.5,
          },
        ];
      });
    };
    const intervalId = window.setInterval(spawnAmbient, 2200);
    spawnAmbient();
    return () => window.clearInterval(intervalId);
  }, []);

  const removeHeart = useCallback((id: number) => {
    setHearts((prev) => prev.filter((h) => h.id !== id));
  }, []);

  /** A small burst of hearts on every swipe — the gallery "liking" the moment. */
  const burstHearts = useCallback(() => {
    setHearts((prev) => [
      ...prev,
      ...Array.from({ length: 4 }).map(() => ({
        id: heartUid++,
        left: 38 + Math.random() * 24,
        delay: Math.random() * 0.15,
        duration: 1.3 + Math.random() * 0.5,
        scale: 0.6 + Math.random() * 0.5,
        burst: true,
      })),
    ]);
  }, []);

  const advance = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      setIndex((prev) => {
        const nextIndex = prev + dir;
        if (nextIndex < 0 || nextIndex > images.length - 1) return prev;
        onIndexChange?.(nextIndex);
        return nextIndex;
      });
      burstHearts();
    },
    [images.length, onIndexChange, burstHearts]
  );

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      isDragging.current = false;
      if (info.offset.x < -SWIPE_DISTANCE_THRESHOLD || info.velocity.x < -SWIPE_VELOCITY_THRESHOLD) {
        advance(1);
      } else if (info.offset.x > SWIPE_DISTANCE_THRESHOLD || info.velocity.x > SWIPE_VELOCITY_THRESHOLD) {
        advance(-1);
      }
    },
    [advance]
  );

  const bgUrl = useMemo(
    () => cloudinaryUrl(cloudName, current?.publicId, current?.url, 'e_blur:1200,q_auto,w_80'),
    [cloudName, current]
  );

  if (!images.length) {
    return <div className="pg-empty">No memories yet.</div>;
  }

  return (
    <div className={`pg-root ${className ?? ''}`}>
      {/* Cinematic blurred backdrop, crossfades with each swipe */}
      <AnimatePresence>
        <motion.div
          key={`${current.id}-bg`}
          className="pg-bg"
          style={{ backgroundImage: `url(${bgUrl})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        />
      </AnimatePresence>
      <div className="pg-vignette" />

      <div className="pg-hearts-layer" aria-hidden="true">
        {hearts.map((h) => (
          <span
            key={h.id}
            className={`pg-heart ${h.burst ? 'pg-heart--burst' : 'pg-heart--ambient'}`}
            style={{
              left: `${h.left}%`,
              animationDelay: `${h.delay}s`,
              animationDuration: `${h.duration}s`,
              ['--pg-heart-scale' as any]: h.scale,
            }}
            onAnimationEnd={() => removeHeart(h.id)}
          >
            ♥
          </span>
        ))}
      </div>

      <div className="pg-stage">
        <div className="pg-stack">
          <AnimatePresence initial={false} custom={direction}>
            {images
              .slice(index, index + VISIBLE_STACK)
              .map((img, i) => {
                const isTop = i === 0;
                const tilt = seededTilt(img.id);
                const imgUrl = cloudinaryUrl(cloudName, img.publicId, img.url, 'f_auto,q_auto,w_900');

                return (
                  <motion.div
                    key={img.id}
                    className={`pg-card ${isTop ? 'pg-card--top' : ''}`}
                    style={{ zIndex: VISIBLE_STACK - i }}
                    drag={isTop ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.7}
                    onDragStart={() => {
                      isDragging.current = true;
                    }}
                    onDragEnd={isTop ? handleDragEnd : undefined}
                    initial={
                      isTop
                        ? { opacity: 0, scale: 0.92, y: 24, rotate: tilt }
                        : { opacity: 1, scale: 1 - i * 0.05, y: i * 14, rotate: tilt }
                    }
                    animate={{ opacity: 1, scale: 1 - i * 0.05, y: i * 14, rotate: tilt }}
                    exit={{
                      x: direction === 1 ? -420 : 420,
                      opacity: 0,
                      scale: 0.85,
                      rotate: tilt + (direction === 1 ? -18 : 18),
                      filter: 'blur(6px)',
                      transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
                    }}
                    transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                    whileTap={isTop ? { scale: 1.02 } : undefined}
                  >
                    <div className="pg-photo-wrap">
                      <img src={imgUrl} alt={img.caption} className="pg-photo" draggable={false} />
                    </div>
                    <p className="pg-caption">{img.caption}</p>
                  </motion.div>
                );
              })
              .reverse()}
          </AnimatePresence>
        </div>

        <div className="pg-progress" role="tablist" aria-label="Photo progress">
          {images.map((_, i) => (
            <span
              key={i}
              className={`pg-dot ${i === index ? 'pg-dot--active' : ''} ${i < index ? 'pg-dot--seen' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="pg-actions">
        <button type="button" className="pg-btn pg-btn--ghost" onClick={onNavigateTimeline}>
          Timeline
        </button>
        <button type="button" className="pg-btn pg-btn--primary" onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default PolaroidGallery;