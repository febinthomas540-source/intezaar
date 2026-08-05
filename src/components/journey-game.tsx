"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { JourneyStage, demoJourney } from "@/lib/journey";
import { JourneyStageCard } from "@/components/journey-stage";
import { LetterOpening } from "@/components/letter-opening";
import styles from "./journey-game.module.css";

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  utterance.voice =
    voices.find((voice) => voice.lang === "en-IN") ??
    voices.find((voice) => voice.lang.startsWith("en-GB")) ??
    voices.find((voice) => voice.lang.startsWith("en")) ??
    null;
  utterance.rate = 0.92;
  utterance.pitch = 0.96;
  window.speechSynthesis.speak(utterance);
}

function Postman({ stage }: { stage: JourneyStage }) {
  return (
    <section className={styles.postmanCard}>
      <div className={styles.postmanScene} aria-hidden="true">
        <motion.div
          className={styles.postman}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className={styles.cap} />
          <span className={styles.face}><i /><b /></span>
          <span className={styles.body} />
          <span className={styles.bag}>✉</span>
          <span className={styles.arm} />
        </motion.div>
        <div className={styles.postmanShadow} />
      </div>
      <div className={styles.postmanCopy}>
        <span className={styles.kicker}>Arin, your postman</span>
        <AnimatePresence mode="wait">
          <motion.p
            key={stage.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            “{stage.postmanLine}”
          </motion.p>
        </AnimatePresence>
        <button type="button" onClick={() => speak(stage.postmanLine)}>
          <span>◉</span> Hear the postman
        </button>
      </div>
    </section>
  );
}

function ActivityPanel({
  stage,
  completed,
  onComplete,
}: {
  stage: JourneyStage;
  completed: boolean;
  onComplete: () => void;
}) {
  const [taps, setTaps] = useState(0);
  const [lit, setLit] = useState<boolean[]>([false, false, false]);
  const [choice, setChoice] = useState<string | null>(null);
  const [holding, setHolding] = useState(false);

  const finishTapActivity = () => {
    const next = taps + 1;
    setTaps(next);
    if (next >= 3) onComplete();
  };

  const toggleLamp = (index: number) => {
    const next = lit.map((value, itemIndex) => itemIndex === index ? true : value);
    setLit(next);
    if (next.every(Boolean)) onComplete();
  };

  const chooseRoute = (value: string) => {
    setChoice(value);
    window.setTimeout(onComplete, 450);
  };

  const holdUmbrella = () => {
    if (completed) return;
    setHolding(true);
    window.setTimeout(() => {
      setHolding(false);
      onComplete();
    }, 1300);
  };

  return (
    <section className={styles.activityCard}>
      <div className={styles.activityHead}>
        <div>
          <span>Today’s small mission</span>
          <h3>{stage.activity.title}</h3>
          <p>{stage.activity.instruction}</p>
        </div>
        <div className={completed ? styles.rewardComplete : styles.rewardPending}>
          {completed ? "Stamp earned" : "Reward waiting"}
        </div>
      </div>

      <div className={styles.activityPlayground}>
        {stage.activity.type === "stamp" && (
          <button
            type="button"
            className={`${styles.bigStamp} ${completed ? styles.bigStampDone : ""}`}
            onClick={onComplete}
          >
            <span>{stage.stamp}</span>
            <small>{completed ? "POSTMARKED" : "PRESS TO STAMP"}</small>
          </button>
        )}

        {stage.activity.type === "wind" && (
          <button
            type="button"
            className={styles.windGame}
            onClick={finishTapActivity}
            disabled={completed}
          >
            <motion.span
              animate={completed ? { x: 0, rotate: 0 } : { x: [-50, 45, -35, 0], rotate: [-8, 6, -4, 0] }}
              transition={{ duration: 3.2, repeat: completed ? 0 : Infinity }}
            >
              ✉
            </motion.span>
            <small>{completed ? "Safe in the post bag" : `${Math.min(taps, 3)} of 3 catches`}</small>
          </button>
        )}

        {stage.activity.type === "lamps" && (
          <div className={styles.lampGame}>
            {lit.map((isLit, index) => (
              <button
                type="button"
                key={index}
                className={isLit || completed ? styles.lampLit : ""}
                onClick={() => toggleLamp(index)}
                aria-label={`Light lantern ${index + 1}`}
              >
                <i />
                <span />
              </button>
            ))}
          </div>
        )}

        {stage.activity.type === "route" && (
          <div className={styles.routeChoices}>
            {["Scenic route", "Old postal road"].map((option) => (
              <button
                type="button"
                key={option}
                className={choice === option ? styles.routeSelected : ""}
                onClick={() => chooseRoute(option)}
                disabled={completed}
              >
                <span>{option === "Scenic route" ? "☾" : "↟"}</span>
                <strong>{option}</strong>
                <small>{option === "Scenic route" ? "Slower views, same arrival" : "Classic road, warm lights"}</small>
              </button>
            ))}
          </div>
        )}

        {stage.activity.type === "umbrella" && (
          <button
            type="button"
            className={`${styles.umbrellaGame} ${holding || completed ? styles.umbrellaHolding : ""}`}
            onClick={holdUmbrella}
            disabled={completed}
          >
            <span className={styles.umbrella}>☂</span>
            <span className={styles.rainLines} />
            <small>{completed ? "The envelope is dry" : holding ? "Keep holding…" : "Hold to shelter the letter"}</small>
          </button>
        )}

        {stage.activity.type === "boat" && (
          <button
            type="button"
            className={styles.boatGame}
            onClick={finishTapActivity}
            disabled={completed}
          >
            <motion.span
              animate={completed ? { x: 80, rotate: 0 } : { x: [-55, 15, -25], y: [0, -4, 0] }}
              transition={{ duration: 2.8, repeat: completed ? 0 : Infinity }}
            >
              ◢
            </motion.span>
            <i />
            <small>{completed ? "Harbour crossed" : `${Math.min(taps, 3)} of 3 pushes`}</small>
          </button>
        )}
      </div>

      <AnimatePresence>
        {completed && (
          <motion.div
            className={styles.rewardToast}
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
          >
            <span>{stage.stamp}</span>
            <div>
              <strong>{stage.activity.reward}</strong>
              <small>Added to the journey passport</small>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Passport({ completedIds }: { completedIds: Set<string> }) {
  return (
    <section className={styles.passport}>
      <div className={styles.passportHead}>
        <span>Journey passport</span>
        <strong>{completedIds.size}/{demoJourney.length} stamps</strong>
      </div>
      <div className={styles.stampGrid}>
        {demoJourney.map((stage) => {
          const earned = completedIds.has(stage.id);
          return (
            <div key={stage.id} className={earned ? styles.stampEarned : styles.stampLocked}>
              <span>{earned ? stage.stamp : "?"}</span>
              <small>{stage.city}</small>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function JourneyGame() {
  const [index, setIndex] = useState(0);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<"journey" | "passport">("journey");
  const stage = useMemo(() => demoJourney[index], [index]);
  const completed = completedIds.has(stage.id);

  const completeStage = () => {
    setCompletedIds((current) => {
      const next = new Set(current);
      next.add(stage.id);
      return next;
    });
  };

  return (
    <>
      <section className={styles.gameHeader}>
        <div>
          <p>Private journey · For Ananya</p>
          <h1>A letter is travelling<br />from Delhi to Kerala.</h1>
        </div>
        <div className={styles.arrivalCard}>
          <span>Arriving in</span>
          <strong>3 sleeps</strong>
          <small>17 August · 12:00 AM</small>
        </div>
      </section>

      <section className={styles.gameShell}>
        <div className={styles.mainColumn}>
          <JourneyStageCard stage={stage} />
          <Postman stage={stage} />
          <ActivityPanel
            key={stage.id}
            stage={stage}
            completed={completed}
            onComplete={completeStage}
          />
        </div>

        <aside className={styles.sideColumn}>
          <div className={styles.tabs}>
            <button type="button" className={tab === "journey" ? styles.tabActive : ""} onClick={() => setTab("journey")}>Journey</button>
            <button type="button" className={tab === "passport" ? styles.tabActive : ""} onClick={() => setTab("passport")}>Passport</button>
          </div>

          {tab === "journey" ? (
            <div className={styles.timeline}>
              <div className={styles.timelineHead}>
                <span>Ten travel chapters</span>
                <strong>{stage.progress}%</strong>
              </div>
              <div className={styles.progress}><i style={{ width: `${stage.progress}%` }} /></div>
              <div className={styles.chapterList}>
                {demoJourney.map((item, itemIndex) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setIndex(itemIndex)}
                    className={itemIndex === index ? styles.chapterActive : ""}
                  >
                    <span>{completedIds.has(item.id) ? "✓" : itemIndex + 1}</span>
                    <div><strong>{item.city}</strong><small>{item.region}</small></div>
                    <i>{item.stamp}</i>
                  </button>
                ))}
              </div>
              <div className={styles.clueCard}>
                <span>Today’s trace</span>
                <p>“{stage.clue}”</p>
                <small>A new clue appears with every chapter.</small>
              </div>
            </div>
          ) : (
            <Passport completedIds={completedIds} />
          )}
        </aside>
      </section>

      <div className={styles.openingDivider}><span>Preview the final arrival</span></div>
      <LetterOpening />
    </>
  );
}
