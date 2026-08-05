"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import styles from "./raahi-prototype.module.css";

type Props = {
  recipient: string;
  previewDay?: number;
};

type Countdown = {
  hours: number;
  minutes: number;
  seconds: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const INITIAL_DEMO_WAIT = (18 * 60 * 60 + 42 * 60 + 15) * 1000;

function toCountdown(value: number): Countdown {
  const safe = Math.max(0, value);
  return {
    hours: Math.floor(safe / 3_600_000),
    minutes: Math.floor((safe % 3_600_000) / 60_000),
    seconds: Math.floor((safe % 60_000) / 1000),
  };
}

function CountdownClock({ value }: { value: Countdown }) {
  return (
    <div className={styles.countdown} aria-live="polite">
      <span><b>{String(value.hours).padStart(2, "0")}</b><small>hours</small></span>
      <i>:</i>
      <span><b>{String(value.minutes).padStart(2, "0")}</b><small>minutes</small></span>
      <i>:</i>
      <span><b>{String(value.seconds).padStart(2, "0")}</b><small>seconds</small></span>
    </div>
  );
}

function Raahi({ flying = false, className = "" }: { flying?: boolean; className?: string }) {
  return (
    <motion.div
      className={`${styles.raahi} ${flying ? styles.raahiFlying : ""} ${className}`}
      animate={flying ? { y: [0, -8, 0], rotate: [-1, 1, -1] } : { y: [0, -3, 0] }}
      transition={{ duration: flying ? 3.4 : 4.4, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 360 260" role="presentation">
        <defs>
          <linearGradient id="wing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f5f0e8" />
            <stop offset="1" stopColor="#b9c5c2" />
          </linearGradient>
          <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f7f4ed" />
            <stop offset=".58" stopColor="#c8d0cd" />
            <stop offset="1" stopColor="#83918f" />
          </linearGradient>
          <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#4d372b" floodOpacity=".22" />
          </filter>
        </defs>

        {flying ? (
          <g filter="url(#softShadow)">
            <path d="M165 127 C112 83 69 49 17 35 C55 84 82 126 128 157 C143 163 158 153 165 127Z" fill="url(#wing)" stroke="#4d4b49" strokeWidth="6" strokeLinejoin="round" />
            <path d="M205 124 C239 68 282 39 342 28 C309 78 284 126 239 158 C223 165 211 151 205 124Z" fill="url(#wing)" stroke="#4d4b49" strokeWidth="6" strokeLinejoin="round" />
            <path d="M128 151 C105 171 84 191 68 220 C103 216 132 210 154 188" fill="#aeb9b7" stroke="#4d4b49" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M238 154 C260 174 279 194 290 222 C258 214 230 208 208 188" fill="#aeb9b7" stroke="#4d4b49" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <ellipse cx="184" cy="145" rx="63" ry="72" fill="url(#body)" stroke="#4d4b49" strokeWidth="7" />
            <circle cx="201" cy="91" r="39" fill="#dce4e1" stroke="#4d4b49" strokeWidth="7" />
            <circle cx="214" cy="83" r="5" fill="#2f2a28" />
            <path d="M233 97 L266 105 L235 116Z" fill="#d7a64d" stroke="#4d4b49" strokeWidth="5" strokeLinejoin="round" />
            <path d="M159 129 C174 143 199 146 221 132" fill="none" stroke="#728988" strokeWidth="8" strokeLinecap="round" />
            <path d="M156 172 C177 184 201 186 224 173" fill="none" stroke="#728988" strokeWidth="7" strokeLinecap="round" opacity=".65" />
          </g>
        ) : (
          <g filter="url(#softShadow)">
            <path d="M111 197 C89 207 69 224 54 244 C84 241 112 235 135 222" fill="#aeb9b7" stroke="#4d4b49" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="169" cy="157" rx="67" ry="77" fill="url(#body)" stroke="#4d4b49" strokeWidth="7" />
            <path d="M139 132 C97 117 67 121 32 145 C73 153 105 168 145 180" fill="url(#wing)" stroke="#4d4b49" strokeWidth="7" strokeLinejoin="round" />
            <circle cx="196" cy="93" r="42" fill="#dce4e1" stroke="#4d4b49" strokeWidth="7" />
            <circle cx="210" cy="83" r="5" fill="#2f2a28" />
            <path d="M229 97 L266 107 L232 119Z" fill="#d7a64d" stroke="#4d4b49" strokeWidth="5" strokeLinejoin="round" />
            <path d="M146 136 C165 150 194 153 218 137" fill="none" stroke="#728988" strokeWidth="8" strokeLinecap="round" />
            <path d="M153 178 C174 188 198 189 220 178" fill="none" stroke="#728988" strokeWidth="7" strokeLinecap="round" opacity=".65" />
            <path d="M155 224 L150 247 M193 225 L203 247" stroke="#b36c3d" strokeWidth="7" strokeLinecap="round" />
          </g>
        )}

        <g transform={flying ? "translate(149 173) rotate(4)" : "translate(156 185) rotate(-3)"}>
          <rect width="96" height="58" rx="5" fill="#f7e7bf" stroke="#5a3c2f" strokeWidth="5" />
          <path d="M3 4 L48 35 L93 4" fill="#ead3a2" stroke="#5a3c2f" strokeWidth="4" strokeLinejoin="round" />
          <circle cx="48" cy="34" r="13" fill="#b94332" stroke="#7d2d25" strokeWidth="4" />
          <text x="48" y="40" textAnchor="middle" fontFamily="Georgia,serif" fontSize="16" fontWeight="700" fill="#f9e8c0">I</text>
        </g>
      </svg>
    </motion.div>
  );
}

export function RaahiPrototype({ recipient, previewDay }: Props) {
  const reduceMotion = Boolean(useReducedMotion());
  const forcedSecondDay = Number(previewDay) >= 2;
  const [now, setNow] = useState(Date.now());
  const [unlockAt, setUnlockAt] = useState<number | null>(null);

  useEffect(() => {
    const key = `intezaar:raahi-first-open:${recipient.toLowerCase()}`;
    const stored = Number(window.localStorage.getItem(key));
    const firstOpen = Number.isFinite(stored) && stored > 0 ? stored : Date.now();

    if (!stored || !Number.isFinite(stored)) {
      window.localStorage.setItem(key, String(firstOpen));
    }

    setUnlockAt(firstOpen + DAY_MS);
    setNow(Date.now());

    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [recipient]);

  const secondLandingOpen = forcedSecondDay || Boolean(unlockAt && now >= unlockAt);
  const countdown = useMemo(
    () => toCountdown(unlockAt ? unlockAt - now : INITIAL_DEMO_WAIT),
    [now, unlockAt],
  );

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Intezaar home">
          <span>I</span><strong>Intezaar</strong>
        </Link>
        <div className={styles.headerNote}>
          <small>Private journey for</small>
          <b>{recipient}</b>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.paperGrain} />
        <div className={styles.sun} />
        <div className={`${styles.cloud} ${styles.cloudOne}`} />
        <div className={`${styles.cloud} ${styles.cloudTwo}`} />
        <div className={styles.heroBirds}><i /><i /><i /></div>

        <div className={styles.heroCopy}>
          <p>Intezaar presents</p>
          <h1>A little messenger<br />is carrying something<br /><em>home to you.</em></h1>
          <span>Raahi will stop once each day and leave one memory behind.</span>
        </div>

        <Raahi flying className={styles.heroRaahi} />

        <div className={styles.heroPostmark} aria-hidden="true">
          <span>FIRST FLIGHT</span>
          <b>05 AUG 2026</b>
          <small>HANDLE WITH MEMORY</small>
        </div>

        <div className={styles.rooftops} aria-hidden="true">
          <div className={styles.roofA}><i /><i /></div>
          <div className={styles.roofB}><i /></div>
          <div className={styles.roofC}><i /><i /><i /></div>
          <div className={styles.waterTank}>INTEZAAR</div>
          <div className={styles.palm}><i /><i /><i /><i /></div>
        </div>

        <div className={styles.scrollPrompt}>Follow Raahi’s dotted path ↓</div>
      </section>

      <section className={styles.storyBoard}>
        <svg className={styles.flightPath} viewBox="0 0 1000 2100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M740 0 C860 210 710 350 492 438 C252 535 175 715 325 875 C493 1056 774 966 791 1244 C804 1455 604 1532 489 1680 C391 1804 448 1966 610 2100" fill="none" stroke="#5d4639" strokeWidth="15" strokeLinecap="round" strokeDasharray="3 36" />
        </svg>

        <div className={styles.decorCloudA} />
        <div className={styles.decorCloudB} />
        <div className={styles.decorKite} />
        <div className={styles.decorTree}><i /><i /><i /></div>

        <article className={styles.firstLanding}>
          <div className={styles.landingBadge}><span>LANDING 01</span><b>The first rooftop</b></div>

          <div className={styles.rooftopScene}>
            <div className={styles.skyWindow} />
            <div className={styles.clothesline}>
              <i /><i /><i /><i />
            </div>
            <div className={styles.polaroid}>
              <img src="/demo-memory-photo.svg" alt="A sample memory from a rainy evening" />
              <span>That rainy evening</span>
            </div>
            <div className={styles.captionNote}>
              <small>Today’s memory</small>
              <p>“Neither of us wanted the bus to come.”</p>
              <span>— saved by Arjun</span>
            </div>
            <Raahi className={styles.perchedRaahi} />
            <div className={styles.rooftopWall} />
          </div>

          <div className={styles.memoryText}>
            <span>Delivered today</span>
            <h2>The first thing Raahi carried was not the letter.</h2>
            <p>It was one small moment the sender did not want time to erase.</p>
          </div>
        </article>

        <div className={styles.betweenLandings}>
          <Raahi flying className={styles.midFlightRaahi} />
          <p>Raahi has left the first rooftop. The next memory is still crossing the sky.</p>
        </div>

        <article className={`${styles.secondLanding} ${secondLandingOpen ? styles.secondOpen : styles.secondLocked}`}>
          <div className={styles.landingBadge}><span>LANDING 02</span><b>The old clock tower</b></div>

          <div className={styles.clockScene}>
            <div className={styles.clockSun} />
            <div className={styles.tower}>
              <div className={styles.clockFace}><i /><b>12</b><span>6</span></div>
              <div className={styles.towerWindow} />
              <div className={styles.towerDoor} />
            </div>
            <div className={styles.towerBranch} />
            <div className={styles.postcard}>
              <small>POSTCARD · 02</small>
              <p>Every journey felt shorter when someone waited at the end.</p>
            </div>
          </div>

          {!secondLandingOpen ? (
            <div className={styles.cloudLock}>
              <div className={styles.lockCloudOne} />
              <div className={styles.lockCloudTwo} />
              <div className={styles.lockMessage}>
                <span>Raahi is still flying</span>
                <strong>The next memory opens in</strong>
                <CountdownClock value={countdown} />
                <small>The cloud will clear automatically.</small>
              </div>
            </div>
          ) : (
            <motion.div
              className={styles.openMessage}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .7 }}
            >
              <span>Delivered at Landing 02</span>
              <h2>A postcard the sender never posted.</h2>
              <p>Another small piece of the story has arrived.</p>
            </motion.div>
          )}
        </article>

        <section className={styles.continuation}>
          <span>{secondLandingOpen ? "The route continues" : "Still in flight"}</span>
          <h2>More landings wait beyond the clouds.</h2>
          <p>Photos, voice notes, handwritten memories and the sealed final letter will follow this same path.</p>
          <div className={styles.futureClouds}><i /><i /><i /></div>
        </section>
      </section>

      <footer className={styles.footer}>
        <strong>Intezaar</strong>
        <span>Send a memory. Let it find its way home.</span>
      </footer>
    </main>
  );
}
