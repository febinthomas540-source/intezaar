"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./postal-letter-prototype.module.css";

type Props = {
  recipient: string;
  previewDay?: number;
  duration?: number;
  fromCity?: string;
  toCity?: string;
  demoMode?: boolean;
};

type JourneyStop = {
  place: string;
  label: string;
  detail: string;
};

function safeDuration(value: number | undefined) {
  return value === 3 || value === 7 ? value : 5;
}

function makeStops(duration: number, fromCity: string, toCity: string): JourneyStop[] {
  const fiveDay: JourneyStop[] = [
    { place: fromCity, label: "Posted", detail: "The sealed letter has entered the Intezaar mail route." },
    { place: "Mathura Junction", label: "Sorted for the night mail", detail: "It has left the first sorting office and is moving by rail." },
    { place: "Mumbai Central Mail", label: "Halfway there", detail: "Postal marks have been added. The envelope remains sealed." },
    { place: "Konkan route", label: "Arriving tomorrow", detail: "The train is moving through rain towards the destination city." },
    { place: toCity, label: "Delivered", detail: "The journey is complete. The seal can now be broken." },
  ];

  if (duration === 3) {
    return [fiveDay[0], { place: "Central India mail exchange", label: "Travelling by rail", detail: "The letter is moving overnight towards its destination." }, fiveDay[4]];
  }

  if (duration === 7) {
    return [
      fiveDay[0],
      fiveDay[1],
      { place: "Kota Junction", label: "Southbound mail", detail: "A new railway mark has been added to the route card." },
      { place: "Vadodara mail exchange", label: "Still travelling", detail: "Nothing needs to be opened yet. The letter is safe inside its envelope." },
      fiveDay[2],
      fiveDay[3],
      fiveDay[4],
    ];
  }

  return fiveDay;
}

export function PostalLetterPrototype({
  recipient,
  previewDay,
  duration: requestedDuration,
  fromCity = "Delhi",
  toCity = "Kochi",
  demoMode = false,
}: Props) {
  const duration = safeDuration(requestedDuration);
  const initialDay = Math.min(duration, Math.max(1, Math.floor(previewDay ?? 2)));
  const [currentDay, setCurrentDay] = useState(initialDay);
  const [opened, setOpened] = useState(false);
  const stops = useMemo(() => makeStops(duration, fromCity, toCity), [duration, fromCity, toCity]);
  const currentStop = stops[currentDay - 1];
  const arrived = currentDay >= duration;
  const progress = duration > 1 ? ((currentDay - 1) / (duration - 1)) * 100 : 100;

  function chooseDay(day: number) {
    setCurrentDay(day);
    setOpened(false);
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>Intezaar</Link>
        <span>Private digital mail for {recipient}</span>
      </header>

      <section className={styles.stage}>
        <div className={styles.rain} aria-hidden="true" />
        <div className={styles.paperGrain} aria-hidden="true" />

        <aside className={styles.summary}>
          <p>Intezaar post &amp; rail</p>
          <h1>{arrived ? `${recipient}, your letter has arrived.` : `${recipient}, a letter is travelling to you.`}</h1>
          <span>
            {arrived
              ? "The journey is complete. Break the seal whenever you are ready."
              : `This sealed letter is on a ${duration}-day cinematic Indian mail journey from ${fromCity} to ${toCity}.`}
          </span>
          <div className={styles.routeFacts}>
            <div><small>Posted from</small><strong>{fromCity}</strong></div>
            <div><small>Arriving in</small><strong>{toCity}</strong></div>
            <div><small>Journey</small><strong>{duration} days</strong></div>
          </div>
          <p className={styles.disclaimer}>Illustrative postal route only. This is not physical postage or live railway tracking.</p>
        </aside>

        <div className={styles.mailCard}>
          <div className={styles.cardHeader}>
            <span>PRIVATE LETTER · BY RAIL</span>
            <b>DAY {currentDay} / {duration}</b>
          </div>

          <div className={styles.postmarks} aria-hidden="true">
            <span>{fromCity.toUpperCase()} GPO</span>
            <span>RAIL MAIL</span>
            <span>{arrived ? "DELIVERED" : "IN TRANSIT"}</span>
          </div>

          <div className={styles.route} aria-label={`Letter journey progress: day ${currentDay} of ${duration}`}>
            <div className={styles.routeLine}><i style={{ width: `${progress}%` }} /></div>
            {stops.map((stop, index) => {
              const completed = index <= currentDay - 1;
              return (
                <span
                  key={`${stop.place}-${index}`}
                  className={`${styles.routeNode} ${completed ? styles.routeNodeComplete : ""}`}
                  style={{ left: `${(index / (duration - 1)) * 100}%` }}
                  title={stop.place}
                />
              );
            })}
          </div>

          <div className={styles.currentStop}>
            <small>{arrived ? "Final update" : "Current postal update"}</small>
            <h2>{currentStop.place}</h2>
            <strong>{currentStop.label}</strong>
            <p>{currentStop.detail}</p>
          </div>

          {!opened ? (
            <button
              type="button"
              className={`${styles.envelope} ${arrived ? styles.envelopeReady : styles.envelopeLocked}`}
              onClick={() => arrived && setOpened(true)}
              disabled={!arrived}
              aria-label={arrived ? "Break the wax seal and open the letter" : `Letter is sealed until day ${duration}`}
            >
              <span className={styles.address}>For {recipient}</span>
              <span className={styles.flap} />
              <span className={styles.wax}>I</span>
              <span className={styles.instruction}>{arrived ? "Break the seal" : `Sealed until arrival · ${duration - currentDay} day${duration - currentDay === 1 ? "" : "s"} left`}</span>
            </button>
          ) : (
            <article className={styles.letter}>
              <div className={styles.letterMark}>{fromCity.toUpperCase()} · BY RAIL · {toCity.toUpperCase()}</div>
              <p className={styles.salutation}>Dear {recipient},</p>
              <p>
                I could have sent this in a second. I wanted it to take its time, pass through a few stations and arrive as something you would pause to open.
              </p>
              <p>
                There are ordinary moments I still carry with me: the conversations that ran late, the plans that changed, and the quiet ways you made difficult days feel lighter. This letter is simply my way of saying that none of it was ordinary to me.
              </p>
              <p className={styles.signoff}>With all the words I kept,<br />Someone who remembered</p>
              <div className={styles.attachments}>
                <span>Optional photograph</span>
                <span>Short memory</span>
                <span>Voice note</span>
              </div>
              <div className={styles.letterActions}>
                <button type="button" onClick={() => window.print()}>Save or print the letter</button>
                <button type="button" onClick={() => setOpened(false)}>Fold the letter</button>
              </div>
            </article>
          )}

          {demoMode ? (
            <div className={styles.demoControls} aria-label="Preview journey days">
              <span>Preview the journey</span>
              <div>
                {stops.map((stop, index) => (
                  <button key={stop.place} type="button" className={currentDay === index + 1 ? styles.activeDay : ""} onClick={() => chooseDay(index + 1)}>
                    Day {index + 1}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className={styles.explainer}>
        <p>What the recipient experiences</p>
        <h2>A sealed letter, a visible route and one satisfying arrival.</h2>
        <div>
          <article><span>01</span><h3>They open the private link</h3><p>The letter stays sealed while a simple postal update shows where it is in the storybook route.</p></article>
          <article><span>02</span><h3>They check only when they want</h3><p>There are no streaks, chapters or daily obligations. The journey continues without them.</p></article>
          <article><span>03</span><h3>They break the seal</h3><p>On arrival day the letter unfolds, optional extras appear inside and the page can be printed.</p></article>
        </div>
      </section>
    </main>
  );
}
