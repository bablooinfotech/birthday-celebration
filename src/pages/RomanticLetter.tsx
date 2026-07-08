import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/RomanticLetter.css";

const paragraphs = [
  "To the most beautiful soul I've ever known,",
  "Some people come into our lives quietly, but somehow they leave the loudest impact. You became one of the brightest parts of my world without even trying.",
  "Every smile of yours feels like sunshine after rain. Every conversation stays with me longer than you probably realize.",
  "You deserve kindness, laughter, peace, and every beautiful thing this world can offer. Never let anyone make you believe otherwise.",
  "Thank you for existing. Thank you for being you. And today, I simply hope this little surprise makes you smile.",
  "Happy Birthday ❤️"
];

export default function RomanticLetter() {

  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [unfold, setUnfold] = useState(false);
  const [visibleParagraphs, setVisibleParagraphs] = useState(0);

  useEffect(() => {
    if (!unfold) return;

    const interval = setInterval(() => {
      setVisibleParagraphs((v) => {
        if (v >= paragraphs.length) {
          clearInterval(interval);
          return v;
        }
        return v + 1;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [unfold]);

  useEffect(() => {
    const audio = new Audio("/music/violin.mp3");
    audio.loop = true;
    audio.volume = 0.35;

    if (unfold) {
      audio.play().catch(() => {});
    }

    return () => {
      audio.pause();
    };
  }, [unfold]);

  return (
    <div className="letterPage">

      {!opened && (
        <motion.div
          className="envelope"
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setOpened(true);

            setTimeout(() => {
              setUnfold(true);
            }, 1200);
          }}
        >
          <motion.div
            className="envelopeFlap"
            animate={{
              rotateX: opened ? 180 : 0
            }}
            transition={{
              duration: 0.8
            }}
          />

          <div className="envelopeBody">
            Tap To Open ❤️
          </div>
        </motion.div>
      )}

      <AnimatePresence>

        {opened && (

          <motion.div
            className="paperWrapper"
            initial={{
              y: 250,
              opacity: 0
            }}
            animate={{
              y: 0,
              opacity: 1
            }}
            transition={{
              duration: 1.2
            }}
          >

            <motion.div
              className="paper"
              animate={{
                scaleY: unfold ? 1 : .2
              }}
              transition={{
                duration: 1
              }}
            >

              {paragraphs.map((text, i) => (

                <AnimatePresence key={i}>

                  {visibleParagraphs > i && (

                    <motion.div
                      className="paragraph"
                      initial={{
                        opacity: 0,
                        y: 25
                      }}
                      animate={{
                        opacity: 1,
                        y: 0
                      }}
                      transition={{
                        duration: 1
                      }}
                    >

                      <TypeWriter text={text} />

                    </motion.div>

                  )}

                </AnimatePresence>

              ))}

              {visibleParagraphs >= paragraphs.length && (

                <motion.button
                  className="nextBtn"
                  initial={{
                    opacity: 0,
                    y: 30
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  whileTap={{
                    scale: .95
                  }}
                  onClick={() => navigate("/final")}
                >
                  Next →
                </motion.button>

              )}

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}

function TypeWriter({ text }: { text: string }) {

  const [display, setDisplay] = useState("");

  useEffect(() => {

    let index = 0;

    const timer = setInterval(() => {

      index++;

      setDisplay(text.slice(0, index));

      if (index >= text.length) {

        clearInterval(timer);

      }

    }, 35);

    return () => clearInterval(timer);

  }, [text]);

  return (
    <p>{display}</p>
  );
}