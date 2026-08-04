"use client";

import { AnimatePresence, motion } from "motion/react";
import { JourneyStage } from "@/lib/journey";

function SceneArtwork({ palette }: { palette: JourneyStage["palette"] }) {
  return (
    <div className={`scene-art scene-${palette}`} aria-hidden="true">
      <div className="scene-sun" />
      <div className="scene-clouds scene-clouds-back" />
      <div className="scene-clouds scene-clouds-front" />
      <div className="scene-land scene-land-back" />
      <div className="scene-land scene-land-front" />
      <div className="scene-water" />
      <div className="scene-palm scene-palm-one"><i /><b /><em /></div>
      <div className="scene-palm scene-palm-two"><i /><b /><em /></div>
      <div className="scene-rain" />
      <div className="scene-sand scene-sand-one" />
      <div className="scene-sand scene-sand-two" />
      <div className="scene-cityline" />
      <motion.div
        className="journey-envelope"
        animate={{ y: [0, -10, 0], rotate: [-1.5, 1.5, -1.5] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="journey-envelope-flap" />
        <span className="journey-wax">I</span>
      </motion.div>
      <div className="scene-grain" />
    </div>
  );
}

export function JourneyStageCard({ stage }: { stage: JourneyStage }) {
  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={stage.id}
        className="journey-stage-card"
        initial={{ opacity: 0, y: 20, filter: "blur(7px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -14, filter: "blur(5px)" }}
        transition={{ duration: 0.55 }}
      >
        <SceneArtwork palette={stage.palette} />
        <div className="journey-stage-overlay" />
        <div className="journey-stage-content">
          <div>
            <p className="eyebrow">{stage.eyebrow}</p>
            <h2>{stage.title}</h2>
            <p>{stage.description}</p>
          </div>
          <div className="journey-stage-meta">
            <div><span>Now passing</span><strong>{stage.region}</strong></div>
            <div><span>Outside</span><strong>{stage.temperature}</strong></div>
            <div><span>Atmosphere</span><strong>{stage.ambience}</strong></div>
          </div>
        </div>
      </motion.article>
    </AnimatePresence>
  );
}
