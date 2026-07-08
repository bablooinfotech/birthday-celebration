import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import "../styles/FinalPage.css";

import music from "../../public/music/violin.mp3";

const hearts = Array.from({ length: 20 });
const lanterns = Array.from({ length: 10 });
const stars = Array.from({ length: 120 });
const fireworks = Array.from({ length: 25 });

export default function FinalPage() {
  const fireworkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = new Audio(music);
    audio.loop = true;
    audio.volume = 0.35;

    audio.play().catch(() => {});

    const particles =
      fireworkRef.current?.querySelectorAll(".firework") || [];

    particles.forEach((particle) => {
      gsap.to(particle, {
        scale: 4,
        opacity: 0,
        duration: 2,
        repeat: -1,
        repeatDelay: Math.random() * 2,
        x: gsap.utils.random(-250, 250),
        y: gsap.utils.random(-250, 250),
        ease: "power2.out",
      });
    });

    return () => {
      audio.pause();
    };
  }, []);

  return (
    <div className="final-page">
      {/* Stars */}

      <div className="stars">
        {stars.map((_, i) => (
          <span
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Moon */}

      <motion.div
        className="moon"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
        }}
      />

      {/* Fireworks */}

      <div className="fireworks" ref={fireworkRef}>
        {fireworks.map((_, i) => (
          <span
            key={i}
            className="firework"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${10 + Math.random() * 40}%`,
            }}
          />
        ))}
      </div>

      {/* Lanterns */}

      {lanterns.map((_, i) => (
        <motion.div
          key={i}
          className="lantern"
          initial={{
            y: 500,
            x: Math.random() * window.innerWidth,
          }}
          animate={{
            y: -900,
          }}
          transition={{
            repeat: Infinity,
            duration: 15 + Math.random() * 15,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Hearts */}

      {hearts.map((_, i) => (
        <motion.div
          key={i}
          className="heart"
          initial={{
            y: 500,
            x: Math.random() * window.innerWidth,
          }}
          animate={{
            y: -900,
          }}
          transition={{
            repeat: Infinity,
            duration: 8 + Math.random() * 5,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        >
          ❤️
        </motion.div>
      ))}

      {/* Message */}

      <motion.div
        className="message"
        initial={{
          opacity: 0,
          scale: 0.7,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 2,
        }}
      >
        <motion.div
          className="big-heart"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.3,
          }}
        >
          ❤️
        </motion.div>

        <h1>No matter where life takes us,</h1>

        <h2>today I just wanted to make you smile.</h2>

        <h3>Happy Birthday ❤️</h3>
      </motion.div>

      {/* Bottom */}

      <motion.div
        className="bottom-text"
        animate={{
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
        }}
      >
        Always Keep Smiling
      </motion.div>
    </div>
  );
}