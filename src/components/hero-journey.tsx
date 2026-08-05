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
          <p className="eyebrow">A letter carried by post and rail</p>
          <h1>
            Post a memory.
            <span> Let it travel home.</span>
          </h1>
          <p className="hero-lede">
            Seal your words. Choose the arrival day. Let someone feel the journey before they open it.
          </p>
          <div className="hero-actions">
            <Link href="/create" className="button button-primary">Post a memory</Link>
            <Link href="/journey/demo" className="button button-ghost">See the journey</Link>
          </div>
          <div className="hero-trust">
            <span>Private link</span>
            <span>Opens on time</span>
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

            <div className="posting-animation" aria-label="A person posts a sealed letter into the red post box">
              <motion.div
                className="posting-arm"
                animate={{ x: [150, 150, 42, 12, 12, 150], y: [34, 34, 10, 4, 4, 34], rotate: [8, 8, -3, -8, -8, 8] }}
                transition={{ duration: 6.8, times: [0, .13, .42, .56, .72, 1], repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="posting-sleeve" />
                <span className="posting-hand"><i /><i /><i /><i /></span>
                <motion.span
                  className="posting-letter"
                  animate={{ x: [0, 0, -6, -12, -12, 0], y: [0, 0, 5, 30, 54, 0], rotate: [-5, -5, -2, 1, 4, -5], opacity: [1, 1, 1, 1, 0, 0] }}
                  transition={{ duration: 6.8, times: [0, .13, .42, .56, .72, 1], repeat: Infinity, ease: "easeInOut" }}
                >
                  <b>For someone remembered</b>
                  <em />
                </motion.span>
              </motion.div>
              <motion.span
                className="posting-confirmation"
                animate={{ opacity: [0, 0, 0, 1, 1, 0], y: [8, 8, 8, 0, 0, -5] }}
                transition={{ duration: 6.8, times: [0, .55, .66, .72, .88, 1], repeat: Infinity }}
              >
                Posted · 8:42 PM
              </motion.span>
            </div>

            <div className="postbox-monument">
              <span className="postbox-top" />
              <span className="postbox-slot" />
              <span className="postbox-mark">POST</span>
            </div>

            <div className="postal-track" />
            <div className="mail-train-scene">
              <motion.div
                className="mail-train"
                animate={{ x: [-240, 250] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <div className="engine-coach"><i /><i /><b /></div>
                <div className="mail-coach">
                  <span>भारतीय रेल</span><small>Post &amp; Memories</small><i /><i />
                </div>
                <div className="mail-coach short-coach">
                  <span>RM</span><small>Rail Mail</small><i /><i />
                </div>
              </motion.div>
            </div>

            <div className="inland-card">
              <div className="inland-stamps"><span>DEL 04 AUG</span><span>BY RAIL</span></div>
              <div className="inland-lines">
                <small>Now travelling</small>
                <strong>Some memories should arrive slowly.</strong>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="scroll-whisper">Follow the letter</div>
    </section>
  );
}
