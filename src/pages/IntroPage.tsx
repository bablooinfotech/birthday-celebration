import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import "../styles/IntroPage.css";
// romantic-app\src\styles\IntroPage.css
/**
 * Magical Intro Page
 * -------------------
 * Night sky -> glowing moon -> floating clouds -> an envelope flies up
 * into the moonlight -> cinematic typewriter reveal -> tap-to-continue.
 *
 * Mobile only by design (see IntroPage.css — desktop viewports get a
 * polite "open on your phone" message instead of the scene).
 */

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
}

interface IntroPageProps {
  /** Route to navigate to after the tap. Ignored if onComplete is passed. */
  nextRoute?: string;
  /** Called instead of built-in navigation, if provided. */
  onComplete?: () => void;
  /** The line that types itself out. */
  message?: string;
  /** Milliseconds per character for the typewriter effect. */
  typeSpeed?: number;
}

type Phase = "envelope" | "typing" | "prompt" | "exiting";

const STAR_COUNT = 70;

const generateStars = (): Star[] =>
  Array.from({ length: STAR_COUNT }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 1.8 + 1,
    delay: Math.random() * 4,
    duration: Math.random() * 2.5 + 2.2,
  }));

/** Simple typewriter hook — reveals `text` one character at a time. */
function useTypewriter(
  text: string,
  speed: number,
  start: boolean,
  onDone?: () => void
): string {
  const [display, setDisplay] = useState<string>("");

  useEffect(() => {
    if (!start) return;

    let i = 0;
    setDisplay("");

    const id = window.setInterval(() => {
      i += 1;
      setDisplay(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(id);
        onDone?.();
      }
    }, speed);

    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, text, speed]);

  return display;
}

const IntroPage: React.FC<IntroPageProps> = ({
  nextRoute = "/birthday",
  onComplete,
  message = "Someone has something special for you...",
  typeSpeed = 50,
}) => {
  const navigate = useNavigate();
  const [stars] = useState<Star[]>(generateStars);
  const [phase, setPhase] = useState<Phase>("envelope");

  const envelopeRef = useRef<HTMLDivElement | null>(null);
  const moonRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const cloud1Ref = useRef<HTMLDivElement | null>(null);
  const cloud2Ref = useRef<HTMLDivElement | null>(null);
  const cloud3Ref = useRef<HTMLDivElement | null>(null);

  const typedText = useTypewriter(message, typeSpeed, phase === "typing", () => {
    window.setTimeout(() => setPhase("prompt"), 900);
  });

  // ---- Ambient loops: clouds drifting + moon breathing glow ----
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(cloud1Ref.current, {
        xPercent: 20,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(cloud2Ref.current, {
        xPercent: -24,
        duration: 13,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(cloud3Ref.current, {
        xPercent: 16,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(glowRef.current, {
        opacity: 0.55,
        scale: 1.1,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
    return () => ctx.revert();
  }, []);

  // ---- The envelope's flight toward the moon ----
  useEffect(() => {
    const envelope = envelopeRef.current;
    const moon = moonRef.current;
    if (!envelope || !moon) return;

    const eRect = envelope.getBoundingClientRect();
    const mRect = moon.getBoundingClientRect();
    const deltaX = mRect.left + mRect.width / 2 - (eRect.left + eRect.width / 2);
    const deltaY = mRect.top + mRect.height / 2 - (eRect.top + eRect.height / 2);

    const tl = gsap.timeline({ delay: 0.6 });

    tl.fromTo(
      envelope,
      { opacity: 0, y: 30, scale: 0.85 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" }
    )
      .to(envelope, {
        x: deltaX * 0.32 - 26,
        y: deltaY * 0.5,
        rotate: -12,
        duration: 0.9,
        ease: "power1.out",
      })
      .to(envelope, {
        x: deltaX * 0.78 + 18,
        y: deltaY * 0.82,
        rotate: 9,
        duration: 0.85,
        ease: "power1.inOut",
      })
      .to(envelope, {
        x: deltaX,
        y: deltaY,
        rotate: 0,
        scale: 0.2,
        opacity: 0,
        duration: 0.7,
        ease: "power2.in",
        onComplete: () => {
          gsap.fromTo(
            glowRef.current,
            { scale: 1 },
            { scale: 1.35, opacity: 1, duration: 0.35, yoyo: true, repeat: 1, ease: "sine.inOut" }
          );
          setPhase("typing");
        },
      });

    return () => {
      tl.kill();
    };
  }, []);

  const handleTap = useCallback(() => {
    if (phase !== "prompt") return;
    setPhase("exiting");
    window.setTimeout(() => {
      if (onComplete) onComplete();
      else navigate(nextRoute);
    }, 900);
  }, [phase, onComplete, navigate, nextRoute]);

  return (
    <div className="ip-wrapper">
      {/* Desktop fallback — this experience is mobile only */}
      <div className="ip-desktop-block">
        <span className="ip-desktop-moon">🌙</span>
        <p>This little moment was made for your phone.</p>
        <p className="ip-desktop-sub">Open this page on a mobile device to see it.</p>
      </div>

      <div
        className={`ip-root ip-phase-${phase}`}
        onClick={handleTap}
        role="button"
        aria-label={phase === "prompt" ? "Tap to continue" : undefined}
      >
        {/* Stars */}
        <div className="ip-sky" aria-hidden="true">
          {stars.map((s) => (
            <span
              key={s.id}
              className="ip-star"
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                width: s.size,
                height: s.size,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.duration}s`,
              }}
            />
          ))}
        </div>

        {/* Moonlight beam */}
        <div className="ip-moonlight" aria-hidden="true" />

        {/* Clouds */}
        <div className="ip-clouds" aria-hidden="true">
          <div ref={cloud1Ref} className="ip-cloud ip-cloud-1" />
          <div ref={cloud2Ref} className="ip-cloud ip-cloud-2" />
          <div ref={cloud3Ref} className="ip-cloud ip-cloud-3" />
        </div>

        {/* Moon */}
        <div className="ip-moon-wrap" aria-hidden="true">
          <div ref={glowRef} className="ip-moon-glow" />
          <div ref={moonRef} className="ip-moon">
            <span className="ip-crater ip-crater-1" />
            <span className="ip-crater ip-crater-2" />
            <span className="ip-crater ip-crater-3" />
          </div>
        </div>

        {/* Envelope */}
        <div ref={envelopeRef} className="ip-envelope" aria-hidden="true">
          <svg viewBox="0 0 64 48" className="ip-envelope-svg">
            <defs>
              <linearGradient id="ip-env-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fffdf6" />
                <stop offset="100%" stopColor="#e7d9b8" />
              </linearGradient>
            </defs>
            <rect x="1" y="1" width="62" height="46" rx="4" fill="url(#ip-env-grad)" stroke="#d8c69f" strokeWidth="1" />
            <path d="M2 3 L32 28 L62 3" fill="none" stroke="#c9b587" strokeWidth="1.4" />
            <circle cx="32" cy="24" r="7" fill="#c8544a" />
            <path
              d="M32 21.2c-1.4-1.6-4.4-0.6-4.2 1.4c0.15 1.5 2.3 3 4.2 4.6c1.9-1.6 4.05-3.1 4.2-4.6c0.2-2-2.8-3-4.2-1.4z"
              fill="#fff3ec"
              opacity="0.9"
            />
          </svg>
        </div>

        {/* Text content */}
        <div className="ip-content">
          {(phase === "typing" || phase === "prompt" || phase === "exiting") && (
            <p className="ip-typewriter">
              {typedText}
              {phase === "typing" && <span className="ip-cursor">|</span>}
            </p>
          )}

          {(phase === "prompt" || phase === "exiting") && (
            <p className="ip-tap-prompt">
              Tap anywhere <span className="ip-heart">❤️</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntroPage;