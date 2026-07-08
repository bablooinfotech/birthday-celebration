import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import "../../styles/landingPage.css";

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
}

interface LoadingScreenProps {
  musicSrc?: string;
  nextRoute?: string;
  duration?: number;
  onComplete?: () => void;
}

const STAR_COUNT = 55;

const generateStars = (): Star[] =>
  Array.from({ length: STAR_COUNT }, (_, i) => ({
    id: i,
    top: Math.random() * 65,
    left: Math.random() * 100,
    size: Math.random() * 1.8 + 1,
    delay: Math.random() * 4,
    duration: Math.random() * 2.5 + 2.2,
  }));

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  musicSrc = "/audio/cinematic-ambient.mp3",
  nextRoute = "/intro",
  duration = 4000,
  onComplete,
}) => {
  const navigate = useNavigate();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const moonRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const cloud1Ref = useRef<HTMLDivElement | null>(null);
  const cloud2Ref = useRef<HTMLDivElement | null>(null);
  const cloud3Ref = useRef<HTMLDivElement | null>(null);

  const [stars] = useState<Star[]>(generateStars);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      audio.volume = 0.55;

      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const resume = () => {
            audio.play().catch(() => {});

            window.removeEventListener("touchstart", resume);
            window.removeEventListener("click", resume);
          };

          window.addEventListener("touchstart", resume, {
            once: true,
          });

          window.addEventListener("click", resume, {
            once: true,
          });
        });
      }
    }

    const ctx = gsap.context(() => {
      // Cloud animation
      gsap.to(cloud1Ref.current, {
        xPercent: 18,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(cloud2Ref.current, {
        xPercent: -22,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(cloud3Ref.current, {
        xPercent: 14,
        duration: 13,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      const tl = gsap.timeline({
        defaults: {
          ease: "power2.out",
        },
      });

      // Moon animation
      tl.fromTo(
        moonRef.current,
        {
          opacity: 0,
          scale: 0.55,
          y: 24,
          filter: "blur(6px)",
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 2.4,
        },
        0.3
      );

      // Glow animation
      tl.fromTo(
        glowRef.current,
        {
          opacity: 0,
          scale: 0.8,
        },
        {
          opacity: 0.85,
          scale: 1,
          duration: 2.2,
          ease: "sine.out",
        },
        0.3
      );

      tl.to(
        glowRef.current,
        {
          opacity: 0.55,
          scale: 1.12,
          duration: 2.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        },
        2.6
      );

      // Progress
      const progressObj = {
        value: 0,
      };

      tl.to(
        progressObj,
        {
          value: 100,
          duration: duration / 1000,
          ease: "power1.inOut",
          onUpdate: () => {
            setProgress(progressObj.value);
          },
        },
        0
      );
    });

    const timer = window.setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else {
        navigate(nextRoute);
      }
    }, duration);

    return () => {
      window.clearTimeout(timer);
      ctx.revert();
    };
  }, [duration, musicSrc, navigate, nextRoute, onComplete]);

  return (
    <div className="cls-root">
      <audio
        ref={audioRef}
        src={musicSrc}
        preload="auto"
        loop
        playsInline
      />

      {/* Stars */}
      <div className="cls-sky" aria-hidden="true">
        {stars.map((star) => (
          <span
            key={star.id}
            className="cls-star"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: star.size,
              height: star.size,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Clouds */}
      <div className="cls-clouds" aria-hidden="true">
        <div ref={cloud1Ref} className="cls-cloud cls-cloud-1" />
        <div ref={cloud2Ref} className="cls-cloud cls-cloud-2" />
        <div ref={cloud3Ref} className="cls-cloud cls-cloud-3" />
      </div>

      {/* Moon */}
      <div className="cls-moon-wrap" aria-hidden="true">
        <div ref={glowRef} className="cls-moon-glow" />

        <div ref={moonRef} className="cls-moon">
          <span className="cls-crater cls-crater-1" />
          <span className="cls-crater cls-crater-2" />
          <span className="cls-crater cls-crater-3" />
        </div>
      </div>

      {/* Content */}
      <div className="cls-content">
        <motion.p
          className="cls-text"
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.9,
            delay: 0.5,
            ease: "easeOut",
          }}
        >
          Loading your surprise

          <span className="cls-dots">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{
                  opacity: [0.15, 1, 0.15],
                }}
                transition={{
                  duration: 1.3,
                  repeat: Infinity,
                  delay: i * 0.22,
                  ease: "easeInOut",
                }}
              >
                .
              </motion.span>
            ))}
          </span>
        </motion.p>

        <div className="cls-progress-track">
          <div
            className="cls-progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />

          <div
            className="cls-progress-glint"
            style={{
              left: `calc(${progress}% - 14px)`,
            }}
          />
        </div>

        <motion.span
          className="cls-progress-pct"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.6,
            delay: 0.6,
          }}
        >
          {Math.round(progress)}%
        </motion.span>
      </div>
    </div>
  );
};

export default LoadingScreen;