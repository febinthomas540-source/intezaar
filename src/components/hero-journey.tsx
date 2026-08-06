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
          <p className="eyebrow">A private digital letter carried through Indian mail</p>
          <h1>
            A letter that
            <span> travels by train.</span>
          </h1>
          <p className="hero-lede">
            Write something meaningful. Choose 3, 5 or 7 days. Your sealed letter moves through post offices and railway stations, then arrives and can be opened.
          </p>
          <div className="hero-actions">
            <Link href="/create" className="button button-primary">Write a letter</Link>
            <Link href="/journey/demo" className="button button-ghost">See the postal journey</Link>
          </div>
          <div className="hero-trust">
            <span>Private recipient link</span>
            <span>No daily check-in required</span>
            <span>Opens only on arrival</span>
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
              <small>INTEZAAR POST &amp; RAIL</small>
              <strong>DELHI JN. → KOCHI</strong>
            </div>

            <div className="posting-animation" aria-label="A sealed digital letter is posted into a red post box">
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
                  <b>For Ananya</b>
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
                  <span>भारतीय रेल</span><small>Mail carriage</small><i /><i />
                </div>
                <div className="mail-coach short-coach">
                  <span>RM</span><small>Rail mail</small><i /><i />
                </div>
              </motion.div>
            </div>

            <div className="inland-card">
              <div className="inland-stamps"><span>DEL 04 AUG</span><span>BY RAIL</span></div>
              <div className="inland-lines">
                <small>Now travelling</small>
                <strong>Your letter is on its way.</strong>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="scroll-whisper">Follow the postal journey</div>
    </section>
  );
}
