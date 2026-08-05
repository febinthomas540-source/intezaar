"use client";

import { AnimatePresence, motion } from "motion/react";
import { JourneyStage } from "@/lib/journey";

function SceneArtwork({ stage }: { stage: JourneyStage }) {
  const hasArrived = stage.progress >= 100;

  return (
    <div className={`scene-art scene-${stage.palette}`} aria-hidden="true">
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
        className="letter-flight-shadow"
        initial={{ opacity: 0 }}
        animate={hasArrived ? { opacity: 0.28, scaleX: 1 } : { opacity: [0.08, 0.16, 0.08], scaleX: [0.72, 1.05, 0.72] }}
        transition={hasArrived ? { duration: 1.8, delay: 0.45 } : { duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          left: "50%",
          bottom: "17%",
          width: 112,
          height: 18,
          marginLeft: -56,
          borderRadius: "50%",
          background: "rgba(18, 25, 22, .55)",
          filter: "blur(9px)",
          zIndex: 2,
        }}
      />

      <motion.div
        className={`journey-envelope ${hasArrived ? "journey-envelope-arrived" : "journey-envelope-travelling"}`}
        initial={hasArrived ? { x: 95, y: -42, rotate: 5, scale: 1 } : { x: -105, y: 8, rotate: -5 }}
        animate={
          hasArrived
            ? { x: 0, y: 74, rotate: 0, scale: 0.96 }
            : {
                x: [-105, -48, 34, 112, 58, -105],
                y: [8, -24, -7, -31, -12, 8],
                rotate: [-5, 2, -2, 4, 0, -5],
                scale: [0.98, 1.03, 1, 1.04, 1.01, 0.98],
              }
        }
        transition={
          hasArrived
            ? { duration: 2.2, ease: [0.22, 1, 0.36, 1] }
            : { duration: 13.5, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <span className="journey-envelope-flap" />
        <span className="journey-wax">I</span>
      </motion.div>

      <motion.div
        className="letter-flight-status"
        key={hasArrived ? "arrived" : "travelling"}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 0.72, y: 0 }}
        transition={{ delay: 0.55, duration: 0.7 }}
        style={{
          position: "absolute",
          right: 24,
          top: 22,
          zIndex: 7,
          padding: "8px 12px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,.22)",
          background: "rgba(9, 28, 27, .42)",
          backdropFilter: "blur(10px)",
          color: "rgba(255,250,240,.9)",
          fontSize: 10,
          letterSpacing: ".14em",
          textTransform: "uppercase",
        }}
      >
        {hasArrived ? "Arrived safely" : "Still travelling"}
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
        <SceneArtwork stage={stage} />
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
