"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RainGlass } from "./rain-glass";
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
const DEMO_WAIT_MS = (18 * 60 * 60 + 42 * 60 + 15) * 1000;

function toCountdown(ms: number): Countdown {
  const safe = Math.max(0, ms);
  return {
    hours: Math.floor(safe / 3_600_000),
    minutes: Math.floor((safe % 3_600_000) / 60_000),
    seconds: Math.floor((safe % 60_000) / 1000),
  };
}

function CountdownDisplay({ value }: { value: Countdown }) {
  return (
    <div className={styles.countdown} aria-live="polite">
      <span><b>{String(value.hours).padStart(2, "0")}</b><small>hours</small></span>
      <span><b>{String(value.minutes).padStart(2, "0")}</b><small>minutes</small></span>
      <span><b>{String(value.seconds).padStart(2, "0")}</b><small>seconds</small></span>
    </div>
  );
}

export function RaahiPrototype({ recipient, previewDay }: Props) {
  const forceUnlocked = Number(previewDay) >= 2;
  const [secondUnlocked, setSecondUnlocked] = useState(forceUnlocked);
  const [countdown, setCountdown] = useState<Countdown>(() => toCountdown(DEMO_WAIT_MS));

  useEffect(() => {
    if (forceUnlocked) {
      setSecondUnlocked(true);
      return;
    }

    const storageKey = `intezaar:real-first-open:${recipient.toLowerCase()}`;
    const existing = Number(window.localStorage.getItem(storageKey));
    const firstOpen = Number.isFinite(existing) && existing > 0 ? existing : Date.now();
    if (!existing) window.localStorage.setItem(storageKey, String(firstOpen));

    const update = () => {
      const remaining = firstOpen + DAY_MS - Date.now();
      setCountdown(toCountdown(remaining));
      if (remaining <= 0) setSecondUnlocked(true);
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [forceUnlocked, recipient]);

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>Intezaar</Link>
        <span>A private journey for {recipient}</span>
      </header>

      <section className={styles.opening}>
        <RainGlass intensity="medium" className="recipient-rain" />
        <div className={styles.grain} />
        <div className={styles.openingCopy}>
          <p>Memory 01 · Open now</p>
          <h1>Something reached the roof before it reached you.</h1>
          <span>Take your time. The next part will not open today.</span>
        </div>

        <article className={styles.memorySheet}>
          <small>From Arjun · kept since July 2019</small>
          <img
            src="https://images.pexels.com/photos/15814837/pexels-photo-15814837.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="An old room with photographs and warm window light"
          />
          <blockquote>“I still remember how quiet the room became after everyone left.”</blockquote>
          <p>We did not take many photographs that day. Somehow this is the one I kept.</p>
        </article>

        <div className={styles.progress}><b>01</b><span>of 05 memories</span></div>
      </section>

      <section className={`${styles.nextChapter} ${secondUnlocked ? styles.isUnlocked : styles.isLocked}`}>
        <RainGlass intensity="soft" className="recipient-rain" />
        <div className={styles.nextBackdrop} />
        <div className={styles.nextContent}>
          {!secondUnlocked ? (
            <>
              <p>Memory 02 · Still closed</p>
              <h2>The next room is already here. You just cannot enter it yet.</h2>
              <span>Return to this same link when the light changes.</span>
              <CountdownDisplay value={countdown} />
            </>
          ) : (
            <article className={styles.unlockedMemory}>
              <small>Memory 02 · Written fragment</small>
              <h2>“Every journey felt shorter when someone waited at the end.”</h2>
              <p>Copied from the back page of an old notebook. The handwriting was already fading.</p>
            </article>
          )}
        </div>
      </section>

      <section className={styles.returnSection}>
        <p>There are still {secondUnlocked ? "three" : "four"} memories and one sealed letter ahead.</p>
        <h2>This page is not finished with you yet.</h2>
        <span>The journey keeps everything that has already opened. Nothing disappears when tomorrow arrives.</span>
      </section>

      <footer className={styles.footer}>
        <strong>Intezaar</strong>
        <span>Some memories need time before they make sense.</span>
      </footer>
    </main>
  );
}
