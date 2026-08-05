"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { recipientJourneyDays } from "@/lib/recipient-journey";
import styles from "./recipient-demo.module.css";

type RecipientDemoProps = {
  recipient: string;
};

type JourneyPhase =
  | "notification"
  | "platform"
  | "arriving"
  | "stopped"
  | "revealed"
  | "departing"
  | "waiting"
  | "opened";

function playArrivalCue() {
  if (typeof window === "undefined" || !window.AudioContext) return;

  const context = new AudioContext();
  const gain = context.createGain();
  const now = context.currentTime;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.07, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.35);
  gain.connect(context.destination);

  const whistle = context.createOscillator();
  whistle.type = "sine";
  whistle.frequency.setValueAtTime(320, now);
  whistle.frequency.exponentialRampToValueAtTime(200, now + 1.15);
  whistle.connect(gain);
  whistle.start(now);
  whistle.stop(now + 1.3);

  window.setTimeout(() => void context.close(), 1500);
}

function phaseHasReveal(phase: JourneyPhase) {
  return ["revealed", "departing", "waiting", "opened"].includes(phase);
}

export function RecipientDemo({ recipient }: RecipientDemoProps) {
  const [dayIndex, setDayIndex] = useState(0);
  const [phase, setPhase] = useState<JourneyPhase>("notification");
  const reduceMotion = useReducedMotion();
  const currentDay = recipientJourneyDays[dayIndex];

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const instant = Boolean(reduceMotion);

    if (phase === "platform") {
      timer = setTimeout(() => setPhase("arriving"), instant ? 40 : 380);
    } else if (phase === "arriving") {
      timer = setTimeout(() => setPhase("stopped"), instant ? 50 : 2200);
    } else if (phase === "stopped") {
      timer = setTimeout(() => setPhase("revealed"), instant ? 60 : 900);
    } else if (phase === "departing") {
      timer = setTimeout(() => setPhase("waiting"), instant ? 80 : 1800);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [phase, reduceMotion]);

  function beginDay(index: number) {
    setDayIndex(index);
    setPhase("platform");
    playArrivalCue();
  }

  const trainX =
    phase === "platform"
      ? "-118%"
      : phase === "arriving" || phase === "stopped" || phase === "revealed"
        ? "0%"
        : "122%";

  const postmanVisible = ["stopped", "revealed", "departing"].includes(phase);

  return (
    <main className={styles.shell}>
      <div className={styles.grain} aria-hidden="true" />

      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Intezaar home">
          <span>I</span>
          <strong>Intezaar</strong>
        </Link>
        <small>Recipient experience</small>
      </header>

      <AnimatePresence mode="wait">
        {phase === "notification" ? (
          <motion.section
            key="notification"
            className={styles.messageScene}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -16 }}
          >
            <div className={styles.phone}>
              <div className={styles.phoneTop}><span>8:42</span><i /></div>
              <div className={styles.notificationLabel}>Private message</div>

              <motion.div
                className={styles.messageBubble}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className={styles.messageSender}>
                  <span>I</span>
                  <div><strong>Intezaar</strong><small>now</small></div>
                </div>
                <p><strong>{recipient},</strong> a letter has started travelling to you.</p>
                <p>Today&apos;s train is waiting at Delhi.</p>
                <div className={styles.messageLink}>intezaar.app/r/{recipient.toLowerCase().replace(/\s+/g, "-")}</div>
                <button type="button" onClick={() => beginDay(0)}>Open today&apos;s delivery</button>
              </motion.div>

              <div className={styles.phoneHint}>This is what arrives on the recipient&apos;s phone.</div>
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="journey"
            className={styles.journeyPage}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className={styles.previewBar}>
              <div>
                <span>Preview controls</span>
                <strong>Experience each recipient day</strong>
              </div>
              <div className={styles.dayControls}>
                {recipientJourneyDays.map((day, index) => (
                  <button
                    key={day.day}
                    type="button"
                    className={index === dayIndex ? styles.dayActive : ""}
                    onClick={() => beginDay(index)}
                  >
                    {day.final ? "Final" : `Day ${day.day}`}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.journeyHeader}>
              <div>
                <p>Private delivery for {recipient}</p>
                <h1>Today&apos;s train <em>has arrived.</em></h1>
              </div>
              <div className={styles.dayStamp}>
                <span>DAY</span>
                <strong>{String(currentDay.day).padStart(2, "0")}</strong>
                <small>OF {recipientJourneyDays.length}</small>
              </div>
            </div>

            <div className={styles.journeySurface}>
              <div className={styles.futureTrack} aria-hidden="true">
                {recipientJourneyDays.map((day, index) => (
                  <div
                    key={day.day}
                    className={`${styles.futureStop} ${index <= dayIndex ? styles.futurePast : ""} ${index > dayIndex ? styles.futureLocked : ""}`}
                  >
                    <span>{day.station}</span>
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {phase === "waiting" ? (
                  <motion.section
                    key={`waiting-${dayIndex}`}
                    className={styles.waitingStage}
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <span>Today&apos;s delivery is complete</span>
                    <h2>The train has left {currentDay.station}.</h2>
                    <p>Tomorrow&apos;s station stays blurred until the next delivery.</p>
                    <div className={styles.waitingTime}>Next train · tomorrow · 8:42 PM</div>
                    <div className={styles.waitingActions}>
                      <button type="button" onClick={() => beginDay(dayIndex)}>Replay today</button>
                      {dayIndex < recipientJourneyDays.length - 1 && (
                        <button type="button" onClick={() => beginDay(dayIndex + 1)}>Preview next day</button>
                      )}
                    </div>
                  </motion.section>
                ) : phase === "opened" ? (
                  <motion.section
                    key="opened-letter"
                    className={styles.finalLetter}
                    initial={reduceMotion ? false : { opacity: 0, y: 28, rotateX: 8 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  >
                    <div className={styles.letterPostmark}>DELHI · FIVE STATIONS · ALAPPUZHA</div>
                    <p className={styles.salutation}>Dear {recipient},</p>
                    <p>Do you remember the evening we missed the bus and laughed beneath that broken shop awning?</p>
                    <p>I could have sent this in a second. I wanted every station to carry a piece of it first.</p>
                    <p className={styles.signoff}>Still remembering,<br />Arjun</p>
                    <button type="button" onClick={() => beginDay(4)}>Replay final arrival</button>
                  </motion.section>
                ) : (
                  <motion.section
                    key={`station-${dayIndex}`}
                    className={`${styles.stationScene} ${styles[currentDay.scene]}`}
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className={styles.stationAtmosphere} aria-hidden="true">
                      <div className={styles.skyGlow} />
                      <div className={styles.cloud cloudOne} />
                      <div className={styles.cloud cloudTwo} />
                      <div className={styles.stationRoof} />
                      <div className={styles.platformLights} />
                      <div className={styles.treeGroupLeft}><i /><i /><i /></div>
                      <div className={styles.treeGroupRight}><i /><i /><i /></div>
                      <div className={styles.bushRow} />
                      <div className={styles.railTrack} />
                    </div>

                    <div className={styles.stationBoard}>
                      <small>{currentDay.routeLabel}</small>
                      <strong>{currentDay.station}</strong>
                      <span>{currentDay.weather} · {currentDay.time}</span>
                    </div>

                    <motion.div
                      className={styles.train}
                      initial={false}
                      animate={{ x: trainX }}
                      transition={{
                        duration: reduceMotion ? 0.01 : phase === "arriving" ? 2.05 : phase === "departing" ? 1.75 : 0.35,
                        ease: phase === "arriving" ? [0.16, 1, 0.3, 1] : [0.45, 0, 0.55, 1],
                      }}
                    >
                      <div className={styles.engine}>
                        <span className={styles.engineWindow} />
                        <span className={styles.engineLight} />
                        <i /><i />
                      </div>
                      <div className={styles.mailCoach}>
                        <span>भारतीय रेल</span>
                        <strong>RAILWAY MAIL SERVICE</strong>
                        <i /><i />
                      </div>
                    </motion.div>

                    <AnimatePresence>
                      {postmanVisible && (
                        <motion.div
                          className={styles.postman}
                          initial={reduceMotion ? false : { opacity: 0, x: -50, y: 20 }}
                          animate={{ opacity: 1, x: 0, y: 0 }}
                          exit={reduceMotion ? undefined : { opacity: 0, x: 60 }}
                          transition={{ duration: 0.65 }}
                        >
                          <span className={styles.postmanCap} />
                          <span className={styles.postmanHead} />
                          <span className={styles.postmanBody} />
                          <span className={styles.postmanBag} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className={styles.sceneLayout}>
                      <div className={styles.copyCard}>
                        <span className={styles.copyLabel}>{currentDay.artifactLabel}</span>
                        <h2>{currentDay.memory}</h2>
                        <p>{currentDay.postmanLine}</p>
                      </div>

                      <div className={`${styles.artifactCard} ${styles[currentDay.artifactType]}`}>
                        <small>{currentDay.artifactLabel}</small>
                        <strong>{currentDay.detail}</strong>
                        <p>{currentDay.memory}</p>
                        {currentDay.artifactType === "voice" ? <button type="button">Play 00:07</button> : null}
                        {currentDay.final ? (
                          <button type="button" onClick={() => setPhase("opened")}>Open the letter</button>
                        ) : phase === "revealed" ? (
                          <button type="button" onClick={() => setPhase("departing")}>Let the train leave</button>
                        ) : null}
                      </div>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
