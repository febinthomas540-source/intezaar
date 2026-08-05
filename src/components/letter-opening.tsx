"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export function LetterOpening() {
  const [opened, setOpened] = useState(false);

  return (
    <section className="opening-shell">
      <div className="opening-copy">
        <p className="eyebrow">The arrival ritual</p>
        <h2>The journey ends where the memory began.</h2>
        <p>
          At the promised moment, the seal opens. The letter arrives with every postcard,
          trace and private memory gathered along the road—something to return to long after
          the first reading.
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
              <span className="tap-instruction">The memory has arrived · tap the seal</span>
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
              <button className="replay-button" onClick={() => setOpened(false)}>Fold it away again</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
