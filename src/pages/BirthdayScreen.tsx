import React, { useCallback, useMemo, useState } from "react";
// import { motion, AnimatePresence, Variants } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/birthdayPage.css";

/**
 * Premium Birthday Screen
 * ------------------------
 * Animated dusk sky -> floating hearts -> falling rose petals ->
 * "Happy Birthday" reveal -> gift box that shakes -> tap to open ->
 * confetti burst -> navigate to the Gallery.
 *
 * Built entirely with Motion (framer-motion). Mobile only.
 */

interface Heart {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
}

interface Petal {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
}

interface ConfettiPiece {
  id: number;
  color: string;
  size: number;
  burstX: number;
  burstY: number;
  driftX: number;
  rotate: number;
  delay: number;
  shape: "rect" | "circle";
}

interface BirthdayScreenProps {
  /** Her name, shown beneath "Happy Birthday" */
  name: string;
  /** Subtitle message */
  message?: string;
  /** Route to navigate to once the gift is opened */
  nextRoute?: string;
  /** Called instead of built-in navigation, if provided */
  onComplete?: () => void;
}

type Phase = "intro" | "ready" | "opening" | "exiting";

const HEART_COUNT = 14;
const PETAL_COUNT = 18;
const CONFETTI_COLORS = ["#f4c9c0", "#e8b4b8", "#d4af37", "#fff3e6", "#c96b6b", "#f7dcae"];

const generateHearts = (): Heart[] =>
  Array.from({ length: HEART_COUNT }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: Math.random() * 12 + 12,
    delay: Math.random() * 6,
    duration: Math.random() * 5 + 7,
  }));

const generatePetals = (): Petal[] =>
  Array.from({ length: PETAL_COUNT }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: Math.random() * 10 + 12,
    delay: Math.random() * 8,
    duration: Math.random() * 4 + 7,
    drift: Math.random() * 60 - 30,
  }));

const generateConfetti = (): ConfettiPiece[] =>
  Array.from({ length: 46 }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 130 + 60;
    return {
      id: i,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: Math.random() * 7 + 5,
      burstX: Math.cos(angle) * distance,
      burstY: Math.sin(angle) * distance,
      driftX: (Math.random() - 0.5) * 80,
      rotate: Math.random() * 720 - 360,
      delay: Math.random() * 0.15,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    };
  });

const headlineVariants: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const BirthdayScreen: React.FC<BirthdayScreenProps> = ({
  name="VEEBHA",
  message = "Hope today becomes your happiest day.",
  nextRoute = "/gallery",
  onComplete,
}) => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("intro");
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  const hearts = useMemo(generateHearts, []);
  const petals = useMemo(generatePetals, []);

  const handleGiftReady = useCallback(() => setPhase("ready"), []);

  const handleTapGift = useCallback(() => {
    if (phase !== "ready") return;
    setConfetti(generateConfetti());
    setPhase("opening");

    window.setTimeout(() => setPhase("exiting"), 1300);
    window.setTimeout(() => {
      if (onComplete) onComplete();
      else navigate(nextRoute);
    }, 2000);
  }, [phase, onComplete, navigate, nextRoute]);

  return (
    <div className={`bd-root bd-phase-${phase}`}>
      {/* Ambient aurora sky blobs */}
      <div className="bd-sky" aria-hidden="true">
        <motion.div
          className="bd-aurora bd-aurora-1"
          animate={{ x: [0, 30, -10, 0], y: [0, -20, 10, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="bd-aurora bd-aurora-2"
          animate={{ x: [0, -25, 15, 0], y: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="bd-aurora bd-aurora-3"
          animate={{ x: [0, 18, -18, 0], y: [0, -12, 12, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Twinkling stars */}
      <div className="bd-stars" aria-hidden="true">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="bd-star"
            style={{
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              width: Math.random() * 1.6 + 1,
              height: Math.random() * 1.6 + 1,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Floating hearts */}
      <div className="bd-hearts" aria-hidden="true">
        {hearts.map((h) => (
          <motion.span
            key={h.id}
            className="bd-heart"
            style={{ left: `${h.left}%`, fontSize: h.size }}
            initial={{ y: "110vh", opacity: 0 }}
            animate={{ y: "-15vh", opacity: [0, 1, 1, 0], x: [0, 10, -10, 0] }}
            transition={{
              duration: h.duration,
              delay: h.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ❤
          </motion.span>
        ))}
      </div>

      {/* Falling rose petals */}
      <div className="bd-petals" aria-hidden="true">
        {petals.map((p) => (
          <motion.span
            key={p.id}
            className="bd-petal"
            style={{ left: `${p.left}%`, width: p.size, height: p.size * 0.8 }}
            initial={{ y: "-10vh", opacity: 0, rotate: 0 }}
            animate={{
              y: "110vh",
              opacity: [0, 1, 1, 0],
              x: [0, p.drift, 0],
              rotate: 360,
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="bd-content">
        <motion.h1
          className="bd-headline"
          initial="hidden"
          animate="visible"
          variants={headlineVariants}
        >
          Happy Birthday
        </motion.h1>

        <motion.h2
          className="bd-name"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.7 }}
        >
          {name}
        </motion.h2>

        <motion.p
          className="bd-message"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 1.3 }}
        >
          {message}
        </motion.p>

        {/* Gift box */}
        <motion.div
          className="bd-gift-wrap"
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
          onAnimationComplete={handleGiftReady}
        >
          <motion.div
            className="bd-gift"
            onClick={handleTapGift}
            role="button"
            aria-label="Open your gift"
            animate={
              phase === "ready"
                ? { rotate: [0, -4, 4, -4, 0], scale: [1, 1.03, 1] }
                : phase === "opening"
                ? { scale: [1, 1.15, 0], opacity: [1, 1, 0] }
                : {}
            }
            transition={
              phase === "ready"
                ? { duration: 1.1, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }
                : { duration: 0.8, ease: "easeIn" }
            }
          >
            <div className="bd-gift-lid" />
            <div className="bd-gift-box" />
            <div className="bd-ribbon-v" />
            <div className="bd-ribbon-h" />
            <div className="bd-bow">
              <span className="bd-bow-loop bd-bow-loop-left" />
              <span className="bd-bow-loop bd-bow-loop-right" />
              <span className="bd-bow-knot" />
            </div>
          </motion.div>

          <AnimatePresence>
            {phase === "ready" && (
              <motion.p
                className="bd-tap-hint"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Tap your gift
              </motion.p>
            )}
          </AnimatePresence>

          {/* Light burst on open */}
          <AnimatePresence>
            {phase === "opening" && (
              <motion.div
                className="bd-burst"
                initial={{ scale: 0, opacity: 0.9 }}
                animate={{ scale: 3.2, opacity: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Confetti */}
      <div className="bd-confetti-layer" aria-hidden="true">
        <AnimatePresence>
          {phase === "opening" &&
            confetti.map((c) => (
              <motion.span
                key={c.id}
                className={`bd-confetti bd-confetti-${c.shape}`}
                style={{
                  width: c.size,
                  height: c.shape === "rect" ? c.size * 0.4 : c.size,
                  backgroundColor: c.color,
                }}
                initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                animate={{
                  x: [0, c.burstX, c.burstX + c.driftX],
                  y: [0, c.burstY, c.burstY + 260],
                  opacity: [1, 1, 0],
                  rotate: c.rotate,
                }}
                transition={{ duration: 1.6, delay: c.delay, ease: "easeOut" }}
              />
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BirthdayScreen;