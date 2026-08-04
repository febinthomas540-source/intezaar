"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function HeroJourney() {
  return (
    <section className="hero-shell">
      <div className="hero-atmosphere" aria-hidden="true">
        <div className="star-field star-field-one" />
        <div className="star-field star-field-two" />
        <div className="moon" />
        <div className="cloud cloud-one" />
        <div className="cloud cloud-two" />
        <div className="distant-hills" />
        <div className="near-hills" />
        <div className="water-reflection" />
      </div>

      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-copy"
        >
          <p className="eyebrow">A message should feel like it travelled for you.</p>
          <h1>
            Send a letter that
            <span> travels before it arrives.</span>
          </h1>
          <p className="hero-lede">
            Choose the moment. Seal your words. Let someone watch them cross cities,
            deserts, rain and coastlines before the letter finally opens.
          </p>
          <div className="hero-actions">
            <Link href="/create" className="button button-primary">Begin a journey</Link>
            <Link href="/journey/demo" className="button button-ghost">Experience the demo</Link>
          </div>
          <div className="hero-trust">
            <span>Private link</span>
            <span>No app required</span>
            <span>Opens exactly on time</span>
          </div>
        </motion.div>

        <motion.div
          className="hero-letter-world"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15 }}
        >
          <div className="route-card">
            <div className="route-card-topline">
              <span>Delhi</span>
              <span className="route-status">Travelling</span>
              <span>Kerala</span>
            </div>
            <div className="route-track">
              <div className="route-track-fill" />
              <div className="route-node route-node-start" />
              <div className="route-node route-node-mid" />
              <div className="route-node route-node-end" />
              <motion.div
                className="travelling-envelope"
                animate={{ x: [0, 8, 0], y: [0, -6, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="envelope-flap" />
                <span className="mini-seal">❤</span>
              </motion.div>
            </div>
            <div className="route-scene-name">
              <small>Current chapter</small>
              <strong>Crossing the monsoon hills</strong>
            </div>
            <div className="route-weather">
              <span>23°C</span>
              <span>Rainfall · forest birds</span>
            </div>
          </div>
          <div className="floating-note floating-note-one">3 sleeps until arrival</div>
          <div className="floating-note floating-note-two">A new clue tomorrow</div>
        </motion.div>
      </div>

      <div className="scroll-whisper">Scroll into the journey</div>
    </section>
  );
}
