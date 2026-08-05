"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export function LetterOpening() {
  const [received, setReceived] = useState(false);
  const [opened, setOpened] = useState(false);

  const reset = () => {
    setOpened(false);
    setReceived(false);
  };

  return (
    <section className="opening-shell">
      <div className="opening-copy">
        <p className="eyebrow">The arrival ritual</p>
        <h2>The journey ends in someone’s hands.</h2>
        <p>
          The recipient does not simply see an “open” button. The postman offers the travelled
          envelope, they take it into their hands, and only then does the wax seal become theirs.
        </p>
      </div>

      <div className={`opening-stage ${opened ? "is-open" : ""} ${received ? "is-received" : ""}`}>
        <div className="opening-glow" />
        <AnimatePresence mode="wait">
          {!received ? (
            <motion.div
              key="delivery"
              className="delivery-handover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <div className="delivery-door" aria-hidden="true">
                <span className="door-frame" />
                <span className="door-handle" />
              </div>

              <motion.div
                className="postman-delivery-arm"
                initial={{ x: 150, rotate: 8 }}
                animate={{ x: 0, rotate: -2 }}
                transition={{ duration: 1.1, delay: .25, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="delivery-sleeve" />
                <span className="delivery-hand"><i /><i /><i /><i /></span>
                <span className="delivery-envelope">
                  <b>For Ananya</b>
                  <em>I</em>
                </span>
              </motion.div>

              <motion.div
                className="recipient-hand"
                animate={{ x: [100, 100, 20], y: [55, 55, 8], rotate: [12, 12, -5] }}
                transition={{ duration: 2.6, times: [0, .45, 1], repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
                aria-hidden="true"
              >
                <span className="recipient-wrist" />
                <span className="recipient-palm"><i /><i /><i /><i /></span>
              </motion.div>

              <div className="delivery-copy">
                <span>Delivered at the promised moment</span>
                <h3>Your letter has reached the door.</h3>
                <p>Take it from the postman. The seal will open only after it is in your hands.</p>
                <button type="button" className="receive-letter-button" onClick={() => setReceived(true)}>
                  Receive the letter
                </button>
              </div>
            </motion.div>
          ) : !opened ? (
            <motion.button
              key="sealed"
              className="large-envelope received-envelope"
              onClick={() => setOpened(true)}
              initial={{ opacity: 0, x: 160, y: 28, rotate: 8, scale: .82 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 1.08, filter: "blur(5px)" }}
              transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, rotate: 1 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Break the seal and open the received letter"
            >
              <motion.span
                className="receiving-hand-under-envelope"
                initial={{ x: 150, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: .9 }}
                aria-hidden="true"
              >
                <i /><i /><i /><i />
              </motion.span>
              <span className="large-envelope-flap" />
              <span className="large-wax-seal">I</span>
              <span className="large-envelope-name">For Ananya</span>
              <span className="tap-instruction">Now it is in your hands · tap the seal</span>
            </motion.button>
          ) : (
            <motion.div
              key="letter"
              className="opened-letter"
              initial={{ opacity: 0, y: 35, rotateX: 18, scaleY: 0.76 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scaleY: 1 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="letter-postmark">DELHI · TEN MEMORIES · KERALA</div>
              <p className="letter-salutation">Dear Ananya,</p>
              <p>
                Do you remember the evening we missed the bus and stood beneath that broken
                shop awning while the rain came sideways? We were tired, late and laughing at
                absolutely nothing. I did not know then that such an ordinary moment would become
                one of the places I return to whenever I miss you.
              </p>
              <p>
                I could have sent these words in a second. I wanted them to travel slowly because
                some memories deserve time to find their way home.
              </p>
              <p className="letter-signoff">Still remembering,<br />Arjun</p>
              <button className="replay-button" onClick={reset}>Experience the delivery again</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
