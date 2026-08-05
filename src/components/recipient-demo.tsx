"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import styles from "./recipient-demo.module.css";

type RecipientDemoProps = {
  recipient: string;
};

export function RecipientDemo({ recipient }: RecipientDemoProps) {
  const [opened, setOpened] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <main className={styles.shell}>
      <div className={styles.grain} aria-hidden="true" />

      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Intezaar home">
          <span>I</span>
          <strong>Intezaar</strong>
        </Link>
        <small>Recipient preview</small>
      </header>

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.section
            key="message"
            className={styles.messageScene}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -14 }}
          >
            <div className={styles.phone}>
              <div className={styles.phoneTop}>
                <span>8:42</span>
                <i />
              </div>

              <div className={styles.notificationLabel}>Private message</div>

              <motion.div
                className={styles.messageBubble}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.55 }}
              >
                <div className={styles.messageSender}>
                  <span>I</span>
                  <div>
                    <strong>Intezaar</strong>
                    <small>now</small>
                  </div>
                </div>
                <p><strong>{recipient},</strong> a letter has started travelling to you.</p>
                <p>It is not ready to open yet. You can follow it until it arrives.</p>
                <div className={styles.messageLink}>intezaar.vercel.app/r/{recipient.toLowerCase().replace(/\s+/g, "-")}</div>
                <button type="button" onClick={() => setOpened(true)}>Open private delivery</button>
              </motion.div>

              <div className={styles.phoneHint}>This is the message the recipient receives.</div>
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="landing"
            className={styles.landing}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className={styles.postmark}>DELHI · DISPATCHED · 08:42 PM</div>

            <div className={styles.recipientCopy}>
              <p className={styles.eyebrow}>Private delivery for {recipient}</p>
              <h1>Something is<br /><em>travelling to you.</em></h1>
              <p className={styles.lede}>The letter stays sealed. The journey does not.</p>
            </div>

            <div className={styles.deliveryCard}>
              <div className={styles.envelope} aria-hidden="true">
                <span className={styles.flap} />
                <span className={styles.wax}>I</span>
                <small>For {recipient}</small>
              </div>

              <div className={styles.status}>
                <div>
                  <span>Current stop</span>
                  <strong>New Delhi Sorting Office</strong>
                </div>
                <div>
                  <span>Arrives</span>
                  <strong>Sunday · 8:00 PM</strong>
                </div>
              </div>

              <div className={styles.track} aria-label="Delhi to Alappuzha route progress">
                <i className={styles.trackFill} />
                <span className={styles.activeStop}>Delhi</span>
                <span>Mumbai</span>
                <span>Mangaluru</span>
                <span>Alappuzha</span>
              </div>

              <div className={styles.clue}>
                <span>First memory trace</span>
                <p>“Do you remember the rain at the bus stop?”</p>
                <small>The sender remains hidden until the journey chooses to reveal them.</small>
              </div>

              <Link href="/journey/demo" className={styles.primaryAction}>Follow the letter</Link>
              <button type="button" className={styles.secondaryAction} onClick={() => setOpened(false)}>See the message again</button>
            </div>

            <p className={styles.previewNote}>Preview mode · a real recipient would only see their own private journey.</p>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
