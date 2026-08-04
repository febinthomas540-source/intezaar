"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export function LetterOpening() {
  const [opened, setOpened] = useState(false);

  return (
    <section className="opening-shell">
      <div className="opening-copy">
        <p className="eyebrow">The arrival ritual</p>
        <h2>Waiting deserves a beautiful ending.</h2>
        <p>
          The letter does not become a text box at midnight. It arrives, responds to touch,
          breaks its seal and unfolds into a keepsake.
        </p>
      </div>

      <div className={`opening-stage ${opened ? "is-open" : ""}`}>
        <div className="opening-glow" />
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.button
              key="sealed"
              className="large-envelope"
              onClick={() => setOpened(true)}
              initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 1.08, filter: "blur(5px)" }}
              whileHover={{ y: -8, rotate: 1 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Break the seal and open the letter"
            >
              <span className="large-envelope-flap" />
              <span className="large-wax-seal">I</span>
              <span className="large-envelope-name">For Ananya</span>
              <span className="tap-instruction">Tap to break the seal</span>
            </motion.button>
          ) : (
            <motion.div
              key="letter"
              className="opened-letter"
              initial={{ opacity: 0, y: 35, rotateX: 18, scaleY: 0.76 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scaleY: 1 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="letter-postmark">DELHI · 04 AUG · KERALA</div>
              <p className="letter-salutation">Dear Ananya,</p>
              <p>
                I could have sent this in a second. Instead, I wanted my words to take their
                time finding you. Happy birthday to the person who still makes every distance
                feel worth crossing.
              </p>
              <p className="letter-signoff">Always yours,<br />Arjun</p>
              <button className="replay-button" onClick={() => setOpened(false)}>Seal it again</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
