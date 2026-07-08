import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../styles/Birthdaycake.css';

/**
 * BirthdayCake
 * ------------
 * A CSS-only "3D feeling" birthday cake with flickering candles.
 * Tapping "Blow Candles" extinguishes the flames, puffs smoke, bursts
 * confetti, gently fades any background music, reveals a wish, then
 * offers a "Navigate to Roses" button.
 *
 * No external animation library required — everything is CSS keyframes
 * driven by a small amount of React state/timers.
 */

export interface BirthdayCakeProps {
  /** How many candles sit on top of the cake. Default 5. */
  candleCount?: number;
  /** Message revealed after the candles are blown out. */
  wishText?: string;
  /** Fires the instant "Blow Candles" is tapped — hook your own music fade here too. */
  onBlowCandles?: () => void;
  /** Fires when the user taps "Navigate to Roses" at the end. */
  onNavigateRoses?: () => void;
  /**
   * Optional ref to an existing <audio> element playing background music.
   * If provided, its volume is smoothly faded down when the candles are blown.
   */
  // musicRef?: React.RefObject<HTMLAudioElement>;
  musicRef?: React.RefObject<HTMLAudioElement | null>;
  /** Target volume (0-1) to fade the background music down to. Default 0.12. */
  fadeToVolume?: number;
  className?: string;
}

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  rotation: number;
  drift: number;
  color: string;
  shape: 'rect' | 'circle';
}

interface SmokeWisp {
  id: number;
  left: number;
  delay: number;
}

const CONFETTI_COLORS = ['#d4af7a', '#e8a0a0', '#f3eee6', '#b4884f', '#8a5a6b'];
let confettiUid = 0;
let smokeUid = 0;

const BirthdayCake: React.FC<BirthdayCakeProps> = ({
  candleCount = 5,
  wishText = 'Your wish is already on its way…',
  onBlowCandles,
  onNavigateRoses,
  musicRef,
  fadeToVolume = 0.12,
  className,
}) => {
  const [blown, setBlown] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [smoke, setSmoke] = useState<SmokeWisp[]>([]);
  const [showWish, setShowWish] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const timers = useRef<number[]>([]);

  const fadeMusic = useCallback(() => {
    const audio = musicRef?.current;
    if (!audio) return;
    const startVolume = audio.volume;
    const targetVolume = Math.min(startVolume, fadeToVolume);
    const steps = 24;
    const stepDuration = 900 / steps;
    let step = 0;
    const id = window.setInterval(() => {
      step += 1;
      const t = step / steps;
      audio.volume = startVolume + (targetVolume - startVolume) * t;
      if (step >= steps) window.clearInterval(id);
    }, stepDuration);
  }, [musicRef, fadeToVolume]);

  const spawnConfetti = useCallback(() => {
    const pieces: ConfettiPiece[] = Array.from({ length: 46 }).map(() => ({
      id: confettiUid++,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      duration: 2.2 + Math.random() * 1.3,
      rotation: Math.random() * 720 - 360,
      drift: Math.random() * 80 - 40,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    }));
    setConfetti(pieces);
  }, []);

  const spawnSmoke = useCallback(() => {
    const wisps: SmokeWisp[] = Array.from({ length: candleCount }).map((_, i) => ({
      id: smokeUid++,
      left: i,
      delay: Math.random() * 0.3,
    }));
    setSmoke(wisps);
  }, [candleCount]);

  const handleBlow = useCallback(() => {
    if (blown) return;
    setBlown(true);
    onBlowCandles?.();
    fadeMusic();
    spawnSmoke();
    spawnConfetti();

    timers.current.push(
      window.setTimeout(() => setShowWish(true), 900),
      window.setTimeout(() => setShowNav(true), 1900)
    );
  }, [blown, onBlowCandles, fadeMusic, spawnSmoke, spawnConfetti]);

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const removeConfettiPiece = useCallback((id: number) => {
    setConfetti((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const removeSmokeWisp = useCallback((id: number) => {
    setSmoke((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return (
    <div className={`bc-root ${className ?? ''}`}>
      <div className="bc-confetti-layer" aria-hidden="true">
        {confetti.map((p) => (
          <span
            key={p.id}
            className={`bc-confetti bc-confetti--${p.shape}`}
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              backgroundColor: p.color,
              ['--bc-rot' as any]: `${p.rotation}deg`,
              ['--bc-drift' as any]: `${p.drift}px`,
            }}
            onAnimationEnd={() => removeConfettiPiece(p.id)}
          />
        ))}
      </div>

      <div className="bc-stage">
        <div className="bc-cake" role="img" aria-label="Birthday cake with candles">
          <div className="bc-candles">
            {Array.from({ length: candleCount }).map((_, i) => (
              <div className="bc-candle-wrap" key={i} style={{ ['--bc-seed' as any]: i }}>
                <div className={`bc-flame-wrap ${blown ? 'bc-flame-wrap--out' : ''}`}>
                  <div className="bc-flame">
                    <span className="bc-flame-core" />
                  </div>
                  {blown && smoke.some((s) => s.left === i) && (
                    <div
                      className="bc-smoke"
                      style={{ animationDelay: `${smoke.find((s) => s.left === i)?.delay ?? 0}s` }}
                      onAnimationEnd={() => {
                        const w = smoke.find((s) => s.left === i);
                        if (w) removeSmokeWisp(w.id);
                      }}
                    >
                      <span />
                      <span />
                      <span />
                    </div>
                  )}
                </div>
                <div className="bc-candle" />
              </div>
            ))}
          </div>

          <div className="bc-tier bc-tier--top">
            <div className="bc-drip" />
          </div>
          <div className="bc-tier bc-tier--bottom">
            <div className="bc-drip" />
          </div>
          <div className="bc-plate" />
          <div className="bc-shadow" />
        </div>

        <div className={`bc-wish ${showWish ? 'bc-wish--visible' : ''}`}>
          <p className="bc-wish-text">{wishText}</p>
        </div>
      </div>

      <div className="bc-actions">
        {!blown ? (
          <button type="button" className="bc-btn bc-btn--primary" onClick={handleBlow}>
            Blow Candles
          </button>
        ) : (
          <button
            type="button"
            className={`bc-btn bc-btn--roses ${showNav ? 'bc-btn--visible' : ''}`}
            onClick={onNavigateRoses}
            disabled={!showNav}
          >
            BABY_SURPRISE😎
          </button>
        )}
      </div>
    </div>
  );
};

export default BirthdayCake;