"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import styles from "./letter-opening.module.css";

function playKnock() {
  if (typeof window === "undefined" || !window.AudioContext) return;

  const context = new AudioContext();
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.11, context.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18);
  gain.connect(context.destination);

  [0, 0.23].forEach((delay) => {
    const oscillator = context.createOscillator();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(118, context.currentTime + delay);
    oscillator.frequency.exponentialRampToValueAtTime(74, context.currentTime + delay + 0.12);
    oscillator.connect(gain);
    oscillator.start(context.currentTime + delay);
    oscillator.stop(context.currentTime + delay + 0.18);
  });

  window.setTimeout(() => void context.close(), 800);
}

export function LetterOpening() {
  const [arrivalStarted, setArrivalStarted] = useState(false);
  const [received, setReceived] = useState(false);
  const [opened, setOpened] = useState(false);
  const reduceMotion = useReducedMotion();

  const startArrival = () => {
    playKnock();
    setArrivalStarted(true);
  };

  const reset = () => {
    setOpened(false);
    setReceived(false);
    setArrivalStarted(false);
  };

  return (
    <section className="opening-shell" aria-labelledby="arrival-title">
      <div className="opening-copy">
        <p className="eyebrow">Arrival</p>
        <h2 id="arrival-title">A knock.<br />Then the letter.</h2>
        <p>Receive it. Break the seal. Read what travelled all this way.</p>
      </div>

      <div className={styles.stage}>
        <AnimatePresence mode="wait">
          {!received ? (
            <motion.div
              key="arrival"
              className={styles.arrivalScene}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={styles.outside} aria-hidden="true">
                <div className={styles.rain} />
                <div className={styles.lamp} />
                <motion.div
                  className={styles.postman}
                  initial={reduceMotion ? false : { x: -54, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className={styles.postmanCap} />
                  <span className={styles.postmanHead} />
                  <span className={styles.postmanBody} />
                  <span className={styles.postmanBag} />
                  <motion.span
                    className={styles.postmanArm}
                    animate={arrivalStarted && !reduceMotion ? { rotate: [-8, -2, -8] } : undefined}
                    transition={{ duration: 1.1, repeat: arrivalStarted ? 1 : 0 }}
                  />
                </motion.div>
              </div>

              <div className={styles.inside}>
                <div className={styles.door} aria-hidden="true">
                  <span className={styles.letterSlot} />
                  <motion.span
                    className={styles.envelope}
                    initial={false}
                    animate={
                      arrivalStarted
                        ? reduceMotion
                          ? { x: "-50%", y: 88, rotate: 2 }
                          : {
                              x: "-50%",
                              y: [0, 4, 86],
                              rotate: [0, -1, 3],
                              scale: [1, 0.98, 0.94],
                            }
                        : { x: "-50%", y: -38, rotate: -2 }
                    }
                    transition={{ duration: 1.65, times: [0, 0.42, 1], ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className={styles.envelopeName}>For Ananya</span>
                    <span className={styles.seal}>I</span>
                  </motion.span>
                </div>

                <div className={styles.copy}>
                  <span>{arrivalStarted ? "Delivered" : "Wednesday · 7:42 PM"}</span>
                  <h3>{arrivalStarted ? "It is here." : "Someone is at the door."}</h3>
                  <p>{arrivalStarted ? "Pick it up." : "Two quiet knocks."}</p>
                  <button type="button" onClick={arrivalStarted ? () => setReceived(true) : startArrival}>
                    {arrivalStarted ? "Pick up the letter" : "Hear the knock"}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : !opened ? (
            <motion.div
              key="received"
              className={styles.receivedStage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                type="button"
                className={styles.receivedEnvelope}
                onClick={() => setOpened(true)}
                initial={reduceMotion ? false : { y: 52, rotate: -4, scale: 0.9 }}
                animate={{ y: 0, rotate: 0, scale: 1 }}
                whileHover={reduceMotion ? undefined : { y: -7, rotate: 0.7 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Break the wax seal and open the letter"
              >
                <span className={styles.receivedSeal}>I</span>
                <span className={styles.receivedName}>For Ananya</span>
                <span className={styles.receivedInstruction}>Break the seal</span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="letter"
              className="opened-letter"
              initial={reduceMotion ? false : { opacity: 0, y: 35, rotateX: 18, scaleY: 0.76 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scaleY: 1 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="letter-postmark">DELHI · TEN MEMORIES · KERALA</div>
              <p className="letter-salutation">Dear Ananya,</p>
              <p>
                Do you remember the evening we missed the bus and laughed beneath that broken shop awning? I did not know then that such an ordinary moment would become one of the places I return to whenever I miss you.
              </p>
              <p>
                I could have sent this in a second. I wanted it to take its time.
              </p>
              <p className="letter-signoff">Still remembering,<br />Arjun</p>
              <button className="replay-button" onClick={reset}>Replay arrival</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
