"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { recipientJourneyDays } from "@/lib/recipient-journey";
import shellStyles from "./recipient-magazine-shell.module.css";
import routeStyles from "./recipient-magazine-route.module.css";
import letterStyles from "./recipient-magazine-letter.module.css";
import { StationArt } from "./magazine-station-art";
import { CountdownDisplay, MemoryObject, type Countdown } from "./magazine-memory";

const styles = { ...shellStyles, ...routeStyles, ...letterStyles };

type Props = {
  recipient: string;
  initialPreviewDay?: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const DEMO_WAIT_MS = (18 * 60 * 60 + 42 * 60 + 15) * 1000;

function clampDay(value: number) {
  return Math.min(recipientJourneyDays.length, Math.max(1, Math.floor(value)));
}

function toCountdown(ms: number): Countdown {
  const safe = Math.max(0, ms);
  return {
    hours: Math.floor(safe / 3_600_000),
    minutes: Math.floor((safe % 3_600_000) / 60_000),
    seconds: Math.floor((safe % 60_000) / 1000),
  };
}

export function RecipientMagazine({ recipient, initialPreviewDay }: Props) {
  const reduceMotion = Boolean(useReducedMotion());
  const [previewDay, setPreviewDay] = useState<number | null>(initialPreviewDay ? clampDay(initialPreviewDay) : null);
  const [unlockedCount, setUnlockedCount] = useState(initialPreviewDay ? clampDay(initialPreviewDay) : 1);
  const [countdown, setCountdown] = useState<Countdown>(() => toCountdown(DEMO_WAIT_MS));
  const previewTargetRef = useRef(Date.now() + DEMO_WAIT_MS);
  const totalStations = recipientJourneyDays.length;
  const allUnlocked = unlockedCount >= totalStations;
  const currentStation = recipientJourneyDays[Math.min(unlockedCount - 1, totalStations - 1)];
  const trainTop = totalStations === 1 ? 0 : ((unlockedCount - 1) / (totalStations - 1)) * 100;

  useEffect(() => {
    if (previewDay) {
      setUnlockedCount(previewDay);
      previewTargetRef.current = Date.now() + DEMO_WAIT_MS;
      return;
    }

    const storageKey = `intezaar:first-open:${recipient.toLowerCase()}`;
    const stored = window.localStorage.getItem(storageKey);
    const firstOpen = stored ? Number(stored) : Date.now();
    if (!stored || !Number.isFinite(firstOpen)) {
      window.localStorage.setItem(storageKey, String(Date.now()));
    }

    const start = Number.isFinite(firstOpen) ? firstOpen : Date.now();
    const refresh = () => {
      const elapsed = Math.max(0, Date.now() - start);
      setUnlockedCount(clampDay(Math.floor(elapsed / DAY_MS) + 1));
    };

    refresh();
    const timer = window.setInterval(refresh, 1000);
    return () => window.clearInterval(timer);
  }, [previewDay, recipient]);

  useEffect(() => {
    const storageKey = `intezaar:first-open:${recipient.toLowerCase()}`;
    const timer = window.setInterval(() => {
      if (previewDay) {
        setCountdown(toCountdown(previewTargetRef.current - Date.now()));
        return;
      }

      const firstOpen = Number(window.localStorage.getItem(storageKey)) || Date.now();
      const nextUnlock = firstOpen + unlockedCount * DAY_MS;
      setCountdown(toCountdown(nextUnlock - Date.now()));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [previewDay, recipient, unlockedCount]);

  const nextStation = useMemo(
    () => recipientJourneyDays[Math.min(unlockedCount, totalStations - 1)],
    [unlockedCount, totalStations],
  );

  function choosePreviewDay(day: number) {
    const safe = clampDay(day);
    setPreviewDay(safe);
    setUnlockedCount(safe);
    previewTargetRef.current = Date.now() + DEMO_WAIT_MS;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <main className={styles.shell}>
      <header className={`${styles.header} ${styles.screenOnly}`}>
        <Link href="/" className={styles.brand}><span>I</span><strong>Intezaar</strong></Link>
        <div className={styles.headerStatus}>
          <small>Currently open</small>
          <b>{currentStation.station}</b>
        </div>
        {allUnlocked ? <button type="button" className={styles.pdfButton} onClick={() => window.print()}>Save A4 keepsake</button> : null}
      </header>

      <section className={styles.cover}>
        <div className={styles.coverCloudOne} />
        <div className={styles.coverCloudTwo} />
        <div className={styles.coverSun} />
        <div className={styles.coverTrees} />
        <div className={styles.coverCopy}>
          <p>A private illustrated journey for {recipient}</p>
          <h1>Help this letter<br /><em>find its way home.</em></h1>
          <span>One station opens each day. Every stop carries a memory from the sender.</span>
        </div>
        <div className={styles.coverTrain} aria-hidden="true">
          <div className={styles.coverEngine}><i /><i /></div>
          <div className={styles.coverCoach}><b>POST &amp; MEMORIES</b><span>भारतीय रेल</span><i /><i /></div>
        </div>
        {!allUnlocked ? (
          <div className={styles.nextUnlockCard}>
            <small>Next station</small>
            <strong>{nextStation.station}</strong>
            <CountdownDisplay countdown={countdown} />
          </div>
        ) : (
          <div className={styles.nextUnlockCard}><small>Journey complete</small><strong>The final letter is ready.</strong></div>
        )}
      </section>

      <nav className={`${styles.demoControls} ${styles.screenOnly}`} aria-label="Demo day preview">
        <span>Demo preview:</span>
        {recipientJourneyDays.map((day, index) => (
          <button key={day.day} type="button" className={unlockedCount === index + 1 ? styles.demoActive : ""} onClick={() => choosePreviewDay(index + 1)}>
            {day.final ? "Final" : `Day ${day.day}`}
          </button>
        ))}
        {previewDay ? <button type="button" onClick={() => setPreviewDay(null)}>Use real countdown</button> : null}
      </nav>

      <section className={styles.routeBoard}>
        <svg className={styles.routeDrawing} viewBox="0 0 1000 5000" preserveAspectRatio="none" aria-hidden="true">
          <path d="M500 40 C860 320 130 650 500 980 C870 1290 160 1590 500 1940 C850 2270 150 2580 500 2940 C860 3260 170 3610 500 3970 C820 4270 260 4580 500 4920" fill="none" stroke="#49352a" strokeWidth="34" strokeLinecap="round" />
          <path d="M500 40 C860 320 130 650 500 980 C870 1290 160 1590 500 1940 C850 2270 150 2580 500 2940 C860 3260 170 3610 500 3970 C820 4270 260 4580 500 4920" fill="none" stroke="#f1c84f" strokeWidth="18" strokeLinecap="round" strokeDasharray="22 22" />
        </svg>

        <motion.div className={`${styles.routeTrain} ${styles.screenOnly}`} animate={{ top: `${trainTop}%` }} transition={{ duration: reduceMotion ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}>
          <span /><b /><i /><i />
        </motion.div>

        <div className={styles.stationList}>
          {recipientJourneyDays.map((day, index) => {
            const unlocked = index < unlockedCount;
            const current = index === unlockedCount - 1;
            const nextLocked = index === unlockedCount;

            return (
              <article key={day.day} className={`${styles.stationChapter} ${index % 2 ? styles.stationRight : styles.stationLeft} ${unlocked ? styles.unlocked : styles.locked} ${current ? styles.current : ""}`}>
                <div className={styles.stationPin}><span>{String(day.day).padStart(2, "0")}</span></div>
                <div className={styles.stationIllustration}>
                  <StationArt day={day} index={index} />
                  <div className={styles.stationLabel}>
                    <small>{day.routeLabel}</small><strong>{day.station}</strong><span>{day.weather} · {day.time}</span>
                  </div>
                </div>
                <div className={styles.memoryChapter}>
                  <p>{current ? "Today’s memory" : unlocked ? "Collected memory" : "Memory still travelling"}</p>
                  <h2>{day.postmanLine}</h2>
                  <span>{day.memory}</span>
                  <MemoryObject day={day} index={index} />
                </div>

                {!unlocked ? (
                  <div className={styles.lockOverlay}>
                    <div>
                      <span>🔒</span>
                      <small>{nextLocked ? "Next station" : `Station ${day.day}`}</small>
                      <strong>{day.station}</strong>
                      {nextLocked ? <CountdownDisplay countdown={countdown} /> : <p>Opens after the previous memory is delivered.</p>}
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className={`${styles.letterSection} ${allUnlocked ? styles.letterUnlocked : styles.letterLocked}`}>
        <div className={styles.letterDestination}>
          <span>FINAL DESTINATION</span>
          <h2>The letter has reached {recipient}.</h2>
        </div>
        <div className={styles.letterPaper}>
          <div className={styles.letterPostmark}>DELHI · JAIPUR · KONKAN · KOTTAYAM · ALAPPUZHA</div>
          <p className={styles.salutation}>Dear {recipient},</p>
          <p>Do you remember the evening we missed the bus and laughed beneath that broken shop awning?</p>
          <p>I could have sent this in a second. Instead, I wanted every station to carry one piece of it before the full letter reached you.</p>
          <p>Some memories do not belong to speed. They belong to waiting.</p>
          <p className={styles.signoff}>Still remembering,<br />Arjun</p>
        </div>
        {!allUnlocked ? <div className={styles.letterLock}><span>🔒</span><strong>The full letter opens at the last station.</strong></div> : null}
      </section>

      <section className={styles.keepsake}>
        <span>{allUnlocked ? "The complete journey is now yours" : "The keepsake is still being made"}</span>
        <h2>{allUnlocked ? "Save every station and memory together." : "The PDF unlocks after the final letter."}</h2>
        <p>The finished keepsake is formatted across clean A4 pages so the recipient can save or print the entire illustrated journey.</p>
        {allUnlocked ? <button type="button" className={`${styles.pdfButtonLarge} ${styles.screenOnly}`} onClick={() => window.print()}>Save the entire journey as an A4 PDF</button> : null}
      </section>

      <footer className={styles.footer}><strong>Intezaar</strong><span>A memory journey that reveals itself one station at a time.</span></footer>
    </main>
  );
}
