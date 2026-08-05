"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function HeroJourney() {
  return (
    <section className="hero-shell">
      <div className="hero-atmosphere" aria-hidden="true">
        <div className="postal-glow" />
        <div className="sun-haze" />
        <div className="dust dust-one" />
        <div className="dust dust-two" />
        <div className="telegraph-line telegraph-one" />
        <div className="telegraph-line telegraph-two" />
        <div className="distant-hills" />
        <div className="near-hills" />
        <div className="platform-shadow" />
      </div>

      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-copy"
        >
          <p className="eyebrow">Indian post box · railway mail · a memory carried home</p>
          <h1>
            Send a letter through
            <span> an old Indian postal world.</span>
          </h1>
          <p className="hero-lede">
            Drop your words into a red post box. Let them travel by rail, road and monsoon air.
            The recipient returns for postmarks, station memories and little fragments of the past
            until the letter finally arrives to be opened.
          </p>
          <div className="hero-actions">
            <Link href="/create" className="button button-primary">Post a memory</Link>
            <Link href="/journey/demo" className="button button-ghost">Enter the railway journey</Link>
          </div>
          <div className="hero-trust">
            <span>Private sealed link</span>
            <span>No app required</span>
            <span>Old post office atmosphere</span>
          </div>
        </motion.div>

        <motion.div
          className="hero-letter-world"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15 }}
        >
          <div className="postal-stage">
            <div className="station-board">
              <small>INTEZAAR MAIL</small>
              <strong>DELHI JN. → KERALA</strong>
            </div>

            <motion.div
              className="postbox-monument"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="postbox-top" />
              <span className="postbox-slot" />
              <span className="postbox-mark">POST</span>
            </motion.div>

            <div className="postal-track" />
            <div className="mail-train-scene">
              <motion.div
                className="mail-train"
                animate={{ x: [-240, 250] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <div className="engine-coach">
                  <i />
                  <i />
                  <b />
                </div>
                <div className="mail-coach">
                  <span>भारतीय रेल</span>
                  <small>Post &amp; Memories</small>
                  <i />
                  <i />
                </div>
                <div className="mail-coach short-coach">
                  <span>RM</span>
                  <small>Rail Mail</small>
                  <i />
                  <i />
                </div>
              </motion.div>
            </div>

            <div className="inland-card">
              <div className="inland-stamps">
                <span>DEL 04 AUG</span>
                <span>CROSSES BY RAIL</span>
              </div>
              <div className="inland-lines">
                <small>Current chapter</small>
                <strong>Some memories deserve to travel slowly.</strong>
                <p>Dusty platforms, chai, rain on the window and a name written by hand.</p>
              </div>
            </div>

            <motion.div
              className="travelling-envelope"
              animate={{ x: [0, 18, 0], y: [0, -8, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="envelope-flap" />
              <span className="mini-seal">❤</span>
            </motion.div>

            <div className="floating-note floating-note-one">Stamped in Delhi · arriving in Kerala</div>
            <div className="floating-note floating-note-two">The train carries one more clue tomorrow</div>
          </div>
        </motion.div>
      </div>

      <div className="scroll-whisper">Scroll into the postal journey</div>
    </section>
  );
}
