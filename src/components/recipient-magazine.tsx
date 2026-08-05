"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { recipientJourneyDays, type RecipientJourneyDay } from "@/lib/recipient-journey";
import styles from "./recipient-magazine.module.css";

type Props = {
  recipient: string;
  initialPreviewDay?: number;
};

type Countdown = {
  hours: number;
  minutes: number;
  seconds: number;
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

function StationArt({ day, index }: { day: RecipientJourneyDay; index: number }) {
  const rain = day.scene === "konkan" || day.scene === "kottayam";
  const palms = day.scene === "konkan" || day.scene === "kottayam" || day.scene === "alappuzha";
  const colors = [
    ["#8dd0e4", "#f4c86f", "#d65a3b", "#53965d"],
    ["#8cc8e0", "#e9aa54", "#c95c36", "#7f8c4e"],
    ["#729aaa", "#b9d3c3", "#b64732", "#39734c"],
    ["#637f80", "#a7c9b2", "#d15537", "#356543"],
    ["#526e8f", "#efb76b", "#b84131", "#3f7755"],
  ][index];

  return (
    <svg viewBox="0 0 760 430" className={styles.stationSvg} role="img" aria-label={`Illustrated ${day.station} station`}>
      <rect width="760" height="430" rx="28" fill={colors[0]} />
      <circle cx="615" cy="76" r="46" fill={colors[1]} stroke="#3f2b24" strokeWidth="7" />
      <path d="M0 220 C120 155 220 220 330 170 C430 125 545 205 760 140 V330 H0Z" fill={colors[3]} stroke="#2f4c33" strokeWidth="7" />
      <path d="M0 290 C150 250 255 310 390 265 C510 225 620 285 760 250 V430 H0Z" fill="#315744" stroke="#263e31" strokeWidth="7" />
      <rect x="92" y="178" width="300" height="150" rx="9" fill="#f5dda1" stroke="#493329" strokeWidth="8" />
      <path d="M62 185 L240 90 L424 185Z" fill={colors[2]} stroke="#493329" strokeWidth="8" />
      <rect x="128" y="232" width="76" height="96" fill="#6f9fb3" stroke="#493329" strokeWidth="7" />
      <rect x="242" y="220" width="110" height="62" fill="#a8d7df" stroke="#493329" strokeWidth="7" />
      <rect x="470" y="202" width="206" height="72" rx="6" fill="#f4cf5a" stroke="#493329" strokeWidth="8" />
      <text x="573" y="232" textAnchor="middle" fontFamily="Georgia,serif" fontSize="19" fontWeight="700" fill="#3c2a22">{day.station.toUpperCase()}</text>
      <text x="573" y="256" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="11" letterSpacing="2" fill="#5e4031">{day.routeLabel.toUpperCase()}</text>
      {palms ? (
        <g transform="translate(655 155)">
          <path d="M0 128 C8 80 8 35 20 0" fill="none" stroke="#5c3a27" strokeWidth="12" strokeLinecap="round" />
          <path d="M20 4 C-22 -8 -55 5 -78 28 C-35 23 -8 17 20 8Z" fill="#4b9557" stroke="#2d5b38" strokeWidth="6" />
          <path d="M20 4 C58 -19 92 -14 117 5 C73 7 46 11 21 11Z" fill="#5aa761" stroke="#2d5b38" strokeWidth="6" />
          <path d="M21 6 C51 30 66 57 64 84 C42 48 29 24 17 11Z" fill="#3d804c" stroke="#2d5b38" strokeWidth="6" />
        </g>
      ) : (
        <g transform="translate(650 178)">
          <rect x="-9" y="30" width="18" height="120" rx="9" fill="#5a3927" />
          <circle cx="0" cy="20" r="55" fill="#4d8a52" stroke="#2d5936" strokeWidth="7" />
          <circle cx="-38" cy="48" r="39" fill="#5a9a5f" stroke="#2d5936" strokeWidth="6" />
        </g>
      )}
      <path d="M0 352 H760" stroke="#4b342a" strokeWidth="16" />
      <path d="M0 388 H760" stroke="#4b342a" strokeWidth="16" />
      {Array.from({ length: 14 }, (_, item) => (
        <rect key={item} x={item * 58 - 6} y="342" width="26" height="64" rx="4" fill="#9b795d" stroke="#4b342a" strokeWidth="4" />
      ))}
      <g transform="translate(400 295)">
        <rect x="0" y="0" width="150" height="62" rx="13" fill="#b94230" stroke="#4b2d26" strokeWidth="7" />
        <rect x="150" y="7" width="145" height="55" rx="10" fill="#f2d8a7" stroke="#4b2d26" strokeWidth="7" />
        <rect x="20" y="13" width="70" height="21" rx="5" fill="#e7d1aa" />
        <circle cx="45" cy="68" r="17" fill="#2b211e" stroke="#9e7c63" strokeWidth="6" />
        <circle cx="120" cy="68" r="17" fill="#2b211e" stroke="#9e7c63" strokeWidth="6" />
        <circle cx="190" cy="68" r="17" fill="#2b211e" stroke="#9e7c63" strokeWidth="6" />
        <circle cx="260" cy="68" r="17" fill="#2b211e" stroke="#9e7c63" strokeWidth="6" />
      </g>
      {rain ? (
        <g stroke="#e7f5f4" strokeWidth="4" strokeLinecap="round" opacity=".72">
          {Array.from({ length: 24 }, (_, item) => {
            const x = (item * 73) % 760;
            const y = 20 + ((item * 47) % 250);
            return <path key={item} d={`M${x} ${y} l-16 34`} />;
          })}
        </g>
      ) : null}
      <g fill="#26211e">
        <path d="M72 65 q16 -15 32 0 q-16 -7 -32 0" />
        <path d="M123 44 q13 -12 27 0 q-13 -6 -27 0" />
      </g>
    </svg>
  );
}

function MemoryObject({ day, index }: { day: RecipientJourneyDay; index: number }) {
  if (index === 0) {
    return (
      <figure className={`${styles.memoryObject} ${styles.photoObject}`}>
        <img src="/demo-memory-photo.svg" alt="A sample sender photograph at a rainy bus stop" />
        <figcaption>“That rainy evening when neither of us wanted the bus to come.”</figcaption>
      </figure>
    );
  }

  if (index === 1) {
    return (
      <div className={`${styles.memoryObject} ${styles.postcardObject}`}>
        <small>POSTCARD FROM JAIPUR</small>
        <p>Every journey felt shorter when someone waited at the end.</p>
        <b>— copied from an old notebook</b>
      </div>
    );
  }

  if (index === 2) {
    return (
      <div className={`${styles.memoryObject} ${styles.voiceObject}`}>
        <small>VOICE TRACE · 00:07</small>
        <div className={styles.waveform} aria-hidden="true">
          {[18, 35, 23, 51, 31, 63, 26, 46, 20, 55, 29, 60].map((height, item) => <i key={item} style={{ height }} />)}
        </div>
        <button type="button">▶ Play the rain and laughter</button>
      </div>
    );
  }

  if (index === 3) {
    return (
      <div className={`${styles.memoryObject} ${styles.ticketObject}`}>
        <small>OLD BUS TICKET</small>
        <strong>KOTTAYAM → HOME</strong>
        <span>2 teas · 1 missed bus · no hurry</span>
        <b>₹ 6.00</b>
      </div>
    );
  }

  return (
    <div className={`${styles.memoryObject} ${styles.envelopeObject}`}>
      <div className={styles.envelopeFlap} />
      <span>I</span>
      <small>FOR THE FINAL STATION</small>
    </div>
  );
}

function CountdownDisplay({ countdown }: { countdown: Countdown }) {
  return (
    <div className={styles.countdown} aria-live="polite">
      <span><b>{String(countdown.hours).padStart(2, "0")}</b><small>hours</small></span>
      <i>:</i>
      <span><b>{String(countdown.minutes).padStart(2, "0")}</b><small>minutes</small></span>
      <i>:</i>
      <span><b>{String(countdown.seconds).padStart(2, "0")}</b><small>seconds</small></span>
    </div>
  );
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
