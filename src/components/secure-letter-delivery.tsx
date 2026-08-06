"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./secure-letter-delivery.module.css";

type LetterContent = {
  heading: string;
  message: string;
  closing: string;
};

type Props = {
  recipient: string;
  sender: string;
  occasion: string;
  format: string;
  fromCity: string;
  toCity: string;
  opensAt: string;
  status: string;
  content: LetterContent | null;
};

type Countdown = {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function countdownTo(value: string): Countdown {
  const total = Math.max(0, new Date(value).getTime() - Date.now());
  return {
    total,
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total / 3_600_000) % 24),
    minutes: Math.floor((total / 60_000) % 60),
    seconds: Math.floor((total / 1_000) % 60),
  };
}

function readableMoment(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatLabel(value: string) {
  return value
    .replace("typewriter", "typewritten")
    .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}

export function SecureLetterDelivery({
  recipient,
  sender,
  occasion,
  format,
  fromCity,
  toCity,
  opensAt,
  status,
  content,
}: Props) {
  const storageKey = useMemo(
    () => `intezaar:received:${recipient}:${opensAt}`,
    [recipient, opensAt],
  );
  const [received, setReceived] = useState(false);
  const [opened, setOpened] = useState(false);
  const [countdown, setCountdown] = useState(() => countdownTo(opensAt));

  useEffect(() => {
    try {
      setReceived(window.sessionStorage.getItem(storageKey) === "yes");
    } catch {
      // Session storage is optional.
    }
  }, [storageKey]);

  useEffect(() => {
    if (content || status !== "posted") return;
    const timer = window.setInterval(() => {
      const next = countdownTo(opensAt);
      setCountdown(next);
      if (next.total <= 0) {
        window.clearInterval(timer);
        window.location.reload();
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [content, opensAt, status]);

  function receiveLetter() {
    setReceived(true);
    try {
      window.sessionStorage.setItem(storageKey, "yes");
    } catch {
      // The experience still works without persistence.
    }
  }

  if (status === "cancelled" || status === "expired") {
    return (
      <main className={styles.page}>
        <header className={styles.header}>
          <Link href="/" className={styles.brand}>Intezaar</Link>
          <span>Private digital mail</span>
        </header>
        <section className={styles.unavailable}>
          <div className={styles.smallSeal}>I</div>
          <p>{status === "cancelled" ? "This letter was withdrawn" : "This letter is no longer available"}</p>
          <h1>The envelope cannot be opened.</h1>
          <span>Intezaar is digital mail, not physical postage.</span>
        </section>
      </main>
    );
  }

  if (!received) {
    return (
      <main className={styles.page}>
        <header className={styles.header}>
          <Link href="/" className={styles.brand}>Intezaar</Link>
          <span>Private digital mail</span>
        </header>

        <section className={styles.invitation}>
          <div className={styles.postOfficeWall} aria-hidden="true">
            <span>INTEZAAR POST OFFICE</span>
          </div>
          <div className={styles.invitationCopy}>
            <p>Private mail for {recipient}</p>
            <h1>A letter has been posted for you.</h1>
            <span>{sender} chose a moment for these words to arrive.</span>
            <dl>
              <div><dt>From</dt><dd>{fromCity || sender}</dd></div>
              <div><dt>Opens</dt><dd>{readableMoment(opensAt)}</dd></div>
              <div><dt>Format</dt><dd>{formatLabel(format)} letter</dd></div>
            </dl>
            <button type="button" onClick={receiveLetter}>Receive the letter</button>
            <small>The message remains sealed until the selected opening time.</small>
          </div>

          <div className={styles.invitationEnvelope} aria-hidden="true">
            <span className={styles.envelopeFlap} />
            <strong>For {recipient}</strong>
            <i>I</i>
            <em>PRIVATE</em>
          </div>
        </section>
      </main>
    );
  }

  if (!content) {
    return (
      <main className={styles.page}>
        <header className={styles.header}>
          <Link href="/" className={styles.brand}>Intezaar</Link>
          <span>Private digital mail for {recipient}</span>
        </header>

        <section className={styles.waitingRoom}>
          <div className={styles.postboxScene} aria-hidden="true">
            <div className={styles.postboxSign}>INTEZAAR POST OFFICE</div>
            <div className={styles.postbox}>
              <small>डाक</small>
              <strong>INTEZAAR MAIL</strong>
              <span>LETTERS</span>
              <em>SEALED</em>
            </div>
          </div>

          <div className={styles.waitingCopy}>
            <p>Your letter is safely sealed</p>
            <h1>It will open when the chosen moment arrives.</h1>
            <span>
              {sender} posted this letter for {recipient}. The message itself has not been sent to this browser yet.
            </span>

            <div className={styles.countdown} aria-label="Time remaining until the letter opens">
              <div><strong>{countdown.days}</strong><small>Days</small></div>
              <div><strong>{String(countdown.hours).padStart(2, "0")}</strong><small>Hours</small></div>
              <div><strong>{String(countdown.minutes).padStart(2, "0")}</strong><small>Minutes</small></div>
              <div><strong>{String(countdown.seconds).padStart(2, "0")}</strong><small>Seconds</small></div>
            </div>

            <div className={styles.deliveryCard}>
              <div><small>Posted from</small><strong>{fromCity || "Intezaar Post Office"}</strong></div>
              <div><small>Arriving for</small><strong>{toCity || recipient}</strong></div>
              <div><small>Opens</small><strong>{readableMoment(opensAt)}</strong></div>
            </div>

            <p className={styles.disclaimer}>Digital delivery only—not physical postage or live tracking.</p>
          </div>
        </section>
      </main>
    );
  }

  if (!opened) {
    return (
      <main className={styles.page}>
        <header className={styles.header}>
          <Link href="/" className={styles.brand}>Intezaar</Link>
          <span>Delivered for {recipient}</span>
        </header>

        <section className={styles.arrived}>
          <p>Delivered by Intezaar Mail</p>
          <h1>{recipient}, your letter has arrived.</h1>
          <span>The chosen moment is here. The wax seal can now be broken.</span>
          <div className={styles.arrivedEnvelope} aria-hidden="true">
            <span className={styles.envelopeFlap} />
            <strong>For {recipient}</strong>
            <i>I</i>
            <em>DELIVERED</em>
          </div>
          <button type="button" onClick={() => setOpened(true)}>Break the seal</button>
        </section>
      </main>
    );
  }

  const paragraphs = content.message.split(/\n\s*\n/).filter(Boolean);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>Intezaar</Link>
        <span>Opened private letter</span>
      </header>

      <section className={styles.reader}>
        <div className={styles.readerToolbar}>
          <div><small>Delivered by Intezaar Mail</small><strong>{formatLabel(format)} letter</strong></div>
          <button type="button" onClick={() => setOpened(false)}>Fold letter</button>
        </div>

        <article className={`${styles.letter} ${styles[`format_${format}`] || ""}`}>
          <header>
            <div><small>From</small><strong>{sender}</strong></div>
            <div><small>To</small><strong>{recipient}</strong></div>
            <span>{occasion}</span>
          </header>
          <div className={styles.letterCopy}>
            <small>{occasion}</small>
            <h1>{content.heading || `Dear ${recipient},`}</h1>
            {paragraphs.map((paragraph, index) => (
              <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
            ))}
            <p className={styles.closing}>{content.closing || `With care,\n${sender}`}</p>
          </div>
          <footer>
            <span>{fromCity || "Intezaar"} → {toCity || recipient}</span>
            <span>Posted with patience</span>
          </footer>
        </article>

        <div className={styles.keepsakeActions}>
          <button type="button" onClick={() => window.print()}>Save or print keepsake</button>
          <Link href="/create">Write a letter back</Link>
        </div>
      </section>
    </main>
  );
}
