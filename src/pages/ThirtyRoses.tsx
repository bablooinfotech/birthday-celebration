import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/ThirtyRoses.css";

const compliments = [
  "Your smile is my favorite place.",
  "You make ordinary days magical.",
  "You're more beautiful than the stars.",
  "My heart feels home with you.",
  "You're my lucky charm.",
  "You brighten every moment.",
  "You deserve endless happiness.",
  "You are truly one of a kind.",
  "Your laugh is my favorite song.",
  "You're my safe place.",
  "You make life colorful.",
  "You're my sunshine.",
  "You are incredibly precious.",
  "You inspire me every day.",
  "You make everything better.",
  "You're effortlessly amazing.",
  "You are my favorite hello.",
  "You make my heart smile.",
  "You're beautiful inside and out.",
  "You're my happiest thought.",
  "You deserve every flower.",
  "You're wonderfully unique.",
  "You make my world brighter.",
  "You're my greatest blessing.",
  "Your kindness is beautiful.",
  "You are unforgettable.",
  "You make love feel easy.",
  "You are my favorite person.",
  "You're absolutely adorable.",
  "Forever grateful for you."
];

export default function ThirtyRoses() {
  const [opened, setOpened] = useState<boolean[]>(Array(30).fill(false));
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const allOpened = useMemo(
    () => opened.every(Boolean),
    [opened]
  );

  const handleOpen = (index: number) => {
    if (opened[index]) return;

    const copy = [...opened];
    copy[index] = true;
    setOpened(copy);

    setMessage(compliments[index]);
  };

  return (
    <div className="rosePage">

      <motion.h2
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🌹 Open Every Rose
      </motion.h2>

      <div className="roseGrid">
        {opened.map((item, index) => (
          <motion.button
            key={index}
            whileTap={{ scale: 0.9 }}
            className={`rose ${item ? "opened" : ""}`}
            onClick={() => handleOpen(index)}
          >
            <AnimatePresence mode="wait">
              {item ? (
                <motion.span
                  key="open"
                  initial={{ scale: 0.2, rotate: -90 }}
                  animate={{
                    scale: 1,
                    rotate: 0
                  }}
                  exit={{ scale: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  🌹
                </motion.span>
              ) : (
                <motion.span
                  key="lock"
                  initial={{ scale: 1 }}
                  animate={{
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2
                  }}
                >
                  🔒
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {message && !allOpened && (
          <motion.div
            className="compliment"
            key={message}
            initial={{
              opacity: 0,
              y: 40,
              scale: 0.7
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}
            exit={{
              opacity: 0
            }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {allOpened && (
          <motion.div
            className="finishBox"
            initial={{
              opacity: 0,
              scale: 0.3
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
          >
            <motion.div
              className="heart"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [-3, 3, -3]
              }}
              transition={{
                repeat: Infinity,
                duration: 1.3
              }}
            >
              ❤️
            </motion.div>

            <h3>Every rose was for you.</h3>

            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className="continueBtn"
              onClick={() => navigate("/romantic")}
            >
              Continue →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}