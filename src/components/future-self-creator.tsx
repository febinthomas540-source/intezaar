"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { trackFirstPartyEvent } from "@/components/first-party-analytics";
import {
  createSecureLetter,
  draftFingerprint,
  saveSecureLetter,
  type SecureDraft,
  type SecureLetterResult,
} from "@/lib/secure-letter-client";
import { MAX_DELIVERY_MS, MIN_DELIVERY_MS } from "@/lib/letter-rules";
import styles from "./future-self-creator.module.css";

const DRAFT_KEY = "intezaar:future-self-draft:v1";
const DAY = 24 * 60 * 60 * 1000;

const reasons = [
  "Where I am in life right now",
  "Something I do not want to forget",
  "A promise to myself",
  "For a difficult day",
  "A milestone",
  "A reminder to myself",
  "Just because",
];

const prompts = [
  "Right now, the thing taking up most of my mind is…",
  "One thing I hope you never forget about this version of us is…",
  "If life feels very different when you read this, remember…",
  "Something I am trying to become brave enough to do is…",
];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toDateInput(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toTimeInput(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function momentAfter(days: number) {
  const date = new Date(Date.now() + days * DAY);
  date.setHours(20, 0, 0, 0);
  if (date.getTime() < Date.now() + MIN_DELIVERY_MS) {
    date.setTime(Date.now() + MIN_DELIVERY_MS + 60 * 60 * 1000);
  }
  return { date: toDateInput(date), time: toTimeInput(date) };
}

function readableMoment(dateValue: string, timeValue: string) {
  const date = new Date(`${dateValue}T${timeValue}:00`);
  if (!Number.isFinite(date.getTime())) return "Choose a future moment";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function validateMoment(dateValue: string, timeValue: string) {
  const timestamp = new Date(`${dateValue}T${timeValue}:00`).getTime();
  if (!Number.isFinite(timestamp)) return "Choose a valid future date and time.";
  if (timestamp < Date.now() + MIN_DELIVERY_MS) return "Choose a moment at least 12 hours from now.";
  if (timestamp > Date.now() + MAX_DELIVERY_MS) return "During beta, Future Me letters can wait up to 30 days.";
  return "";
}

export function FutureSelfCreator() {
  const initial = useMemo(() => momentAfter(14), []);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState(reasons[0]);
  const [message, setMessage] = useState("");
  const [closing, setClosing] = useState("From me, before this day arrived.");
  const [arrivalDate, setArrivalDate] = useState(initial.date);
  const [arrivalTime, setArrivalTime] = useState(initial.time);
  const [sealed, setSealed] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SecureLetterResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [draftReady, setDraftReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Record<string, unknown>;
        if (typeof saved.name === "string") setName(saved.name);
        if (typeof saved.email === "string") setEmail(saved.email);
        if (typeof saved.reason === "string" && reasons.includes(saved.reason)) setReason(saved.reason);
        if (typeof saved.message === "string") setMessage(saved.message);
        if (typeof saved.closing === "string") setClosing(saved.closing);
        if (typeof saved.arrivalDate === "string" && typeof saved.arrivalTime === "string" && !validateMoment(saved.arrivalDate, saved.arrivalTime)) {
          setArrivalDate(saved.arrivalDate);
          setArrivalTime(saved.arrivalTime);
        }
      }
    } catch {
      window.localStorage.removeItem(DRAFT_KEY);
    } finally {
      setDraftReady(true);
    }
  }, []);

  useEffect(() => {
    if (!draftReady || result) return;
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ name, email, reason, message, closing, arrivalDate, arrivalTime }));
  }, [draftReady, result, name, email, reason, message, closing, arrivalDate, arrivalTime]);

  const emailValid = !email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canContinue = Boolean(name.trim() && message.trim() && emailValid);
  const arrivalError = validateMoment(arrivalDate, arrivalTime);
  const progress = ["Today", "Future moment", "Seal", "Kept"];

  function choosePreset(days: number) {
    const next = momentAfter(days);
    setArrivalDate(next.date);
    setArrivalTime(next.time);
    setError("");
  }

  function insertPrompt(prompt: string) {
    setMessage((current) => current.trim() ? `${current.trim()}\n\n${prompt}` : prompt);
    trackFirstPartyEvent("StartWriting");
  }

  function goToFuture() {
    if (!canContinue) {
      setError(!emailValid ? "Enter a valid email address or leave it blank." : "Add your name and write something for future you first.");
      return;
    }
    setError("");
    setStep(2);
    trackFirstPartyEvent("ReachedArrival");
  }

  function goToSeal() {
    if (arrivalError) {
      setError(arrivalError);
      return;
    }
    setError("");
    setStep(3);
  }

  async function postLetter() {
    if (!sealed || posting) return;
    setPosting(true);
    setError("");

    const draft: SecureDraft = {
      sender: name.trim(),
      senderEmail: "",
      senderNotifications: false,
      recipient: `Future ${name.trim()}`,
      recipientEmail: email.trim(),
      recipientNotifications: Boolean(email.trim()),
      registeredDelivery: false,
      occasion: reason,
      heading: "A letter from my past self",
      letter: message.trim(),
      closing: closing.trim(),
      format: "minimal",
      fromCity: "",
      toCity: "",
      arrivalDate,
      arrivalTime,
    };

    try {
      const secure = await createSecureLetter(draft, []);
      saveSecureLetter(secure, draftFingerprint(draft, []));
      window.localStorage.removeItem(DRAFT_KEY);
      setResult(secure);
      setStep(4);
      trackFirstPartyEvent("LetterPosted");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The letter could not be posted. Please try again.");
    } finally {
      setPosting(false);
    }
  }

  async function copyLink() {
    if (!result?.recipientUrl) return;
    await navigator.clipboard.writeText(result.recipientUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function shareLink() {
    if (!result?.recipientUrl) return;
    if (navigator.share) {
      await navigator.share({ title: "My Intezaar Future Me letter", text: "A private letter I wrote for a later version of me.", url: result.recipientUrl });
      return;
    }
    await copyLink();
  }

  return (
    <main className={styles.page}>
      <div className={styles.stars} aria-hidden="true" />
      <header className={styles.header}>
        <Link href="/" className={styles.brand}><span>I</span><strong>Intezaar</strong></Link>
        <div className={styles.mode}>FUTURE ME · PRIVATE LETTER</div>
        <Link href="/future-self" className={styles.back}>About Future Me</Link>
      </header>

      <section className={styles.intro}>
        <p className={styles.eyebrow}>A letter across time</p>
        <h1>{step === 1 ? "Write to the person you’ll become." : step === 2 ? "Choose when these words return." : step === 3 ? "Close today. Leave it for later." : "Your letter is waiting in the future."}</h1>
        <p>{step < 4 ? "Different from an ordinary Intezaar letter: this one is from you, to you, with time in between." : "Keep the private link somewhere safe. If you added your email, Intezaar will also use it for the delivery flow."}</p>
      </section>

      <nav className={styles.progress} aria-label="Future Me progress">
        {progress.map((label, index) => {
          const number = index + 1;
          const active = step === number;
          const done = step > number;
          return <div key={label} className={`${styles.progressItem} ${active ? styles.active : ""} ${done ? styles.done : ""}`}><span>{done ? "✓" : number}</span><small>{label}</small></div>;
        })}
      </nav>

      <section className={styles.stage}>
        {step === 1 ? (
          <div className={styles.card}>
            <div className={styles.cardHeading}>
              <p>FROM TODAY</p>
              <h2>What should future you hear?</h2>
              <span>Your draft stays on this device until you post it.</span>
            </div>

            <label className={styles.field}>
              <span>Your name</span>
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" maxLength={80} />
            </label>

            <label className={styles.field}>
              <span>Email for future delivery <em>optional</em></span>
              <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" type="email" autoComplete="email" maxLength={254} />
              <small>If you leave this blank, keep the private link yourself.</small>
            </label>

            <label className={styles.field}>
              <span>Why are you writing this?</span>
              <select value={reason} onChange={(event) => setReason(event.target.value)}>
                {reasons.map((item) => <option value={item} key={item}>{item}</option>)}
              </select>
            </label>

            <div className={styles.promptShelf}>
              <span>Need a first line?</span>
              <div>{prompts.map((prompt) => <button type="button" key={prompt} onClick={() => insertPrompt(prompt)}>{prompt}</button>)}</div>
            </div>

            <label className={`${styles.field} ${styles.letterField}`}>
              <span>Dear future me,</span>
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} onFocus={() => trackFirstPartyEvent("StartWriting")} placeholder="Tell future you what this moment feels like. What are you hoping for? What are you afraid you might forget?" maxLength={4000} />
              <small>{message.length}/4000 characters</small>
            </label>

            <label className={styles.field}>
              <span>Sign off</span>
              <input value={closing} onChange={(event) => setClosing(event.target.value)} placeholder="From me, before this day arrived." maxLength={240} />
            </label>

            {error ? <p className={styles.error}>{error}</p> : null}
            <div className={styles.actions}><button type="button" className={styles.primary} onClick={goToFuture}>Choose the future moment →</button></div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className={styles.card}>
            <div className={styles.cardHeading}>
              <p>THE DISTANCE</p>
              <h2>When should this come back to you?</h2>
              <span>During public beta, Future Me letters can wait for up to 30 days.</span>
            </div>

            <div className={styles.presetGrid}>
              {[{ d: 3, l: "3 days" }, { d: 7, l: "1 week" }, { d: 14, l: "2 weeks" }, { d: 28, l: "4 weeks" }].map((item) => (
                <button type="button" key={item.d} onClick={() => choosePreset(item.d)}><strong>{item.l}</strong><span>from today</span></button>
              ))}
            </div>

            <div className={styles.dateGrid}>
              <label className={styles.field}><span>Date</span><input type="date" value={arrivalDate} min={toDateInput(new Date())} max={toDateInput(new Date(Date.now() + MAX_DELIVERY_MS))} onChange={(event) => setArrivalDate(event.target.value)} /></label>
              <label className={styles.field}><span>Time</span><input type="time" value={arrivalTime} onChange={(event) => setArrivalTime(event.target.value)} /></label>
            </div>

            <div className={styles.futureTicket}>
              <small>THIS LETTER RETURNS</small>
              <strong>{readableMoment(arrivalDate, arrivalTime)}</strong>
              <span>Until then, the words stay sealed.</span>
            </div>

            {(error || arrivalError) ? <p className={styles.error}>{error || arrivalError}</p> : null}
            <div className={styles.actions}><button type="button" className={styles.secondary} onClick={() => { setError(""); setStep(1); }}>← Back</button><button type="button" className={styles.primary} onClick={goToSeal}>Preview and seal →</button></div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className={`${styles.card} post-panel`}>
            <div className={styles.cardHeading}>
              <p>THE SEAL</p>
              <h2>A private time capsule in letter form.</h2>
              <span>Read the outside one last time. The message itself stays yours.</span>
            </div>

            <div className={`${styles.envelopePreview} ${sealed ? styles.envelopeSealed : ""}`}>
              <div className={styles.envelopeTop}><span>INTEZAAR · FUTURE ME</span><span>{readableMoment(arrivalDate, arrivalTime)}</span></div>
              <div className={styles.envelopeBody}>
                <small>FROM</small><strong>{name}</strong>
                <small>TO</small><strong>Future {name}</strong>
                <p>{reason}</p>
              </div>
              <button type="button" className={styles.waxSeal} onClick={() => setSealed(true)} disabled={sealed}>{sealed ? "✓" : "I"}</button>
              <div className={styles.sealInstruction}>{sealed ? "SEALED FOR FUTURE YOU" : "PRESS THE SEAL"}</div>
            </div>

            {error ? <p className={styles.error}>{error}</p> : null}
            <div className={`${styles.actions} nostalgia-form-actions`}>
              <button type="button" className={styles.secondary} onClick={() => { setSealed(false); setError(""); setStep(2); }} disabled={posting}>← Back</button>
              <button type="button" className={styles.primary} onClick={postLetter} disabled={!sealed || posting}>{posting ? "Posting securely…" : sealed ? "Post to future me" : "Seal the letter first"}</button>
            </div>
          </div>
        ) : null}

        {step === 4 && result ? (
          <div className={`${styles.card} ${styles.successCard}`}>
            <div className={styles.orbitSeal}>I</div>
            <p className={styles.eyebrow}>POSTED ACROSS TIME</p>
            <h2>The next person to read it will be you — a little further down the road.</h2>
            <div className={styles.futureTicket}>
              <small>OPENS</small>
              <strong>{readableMoment(arrivalDate, arrivalTime)}</strong>
              <span>Keep the private link safe until then.</span>
            </div>
            <div className={styles.linkBox}><input readOnly value={result.recipientUrl} aria-label="Private Future Me letter link" /><button type="button" onClick={copyLink}>{copied ? "Copied" : "Copy"}</button></div>
            <div className={styles.actions}><button type="button" className={styles.primary} onClick={shareLink}>Share / save private link</button><Link href="/future-self" className={styles.secondary}>Back to Future Me</Link></div>
            <p className={styles.privateNote}>This is a private bearer link. Anyone who obtains it could reach the recipient view, so keep it somewhere you trust.</p>
          </div>
        ) : null}
      </section>

      <footer className={styles.footer}>A reflective writing experience · Not therapy or clinical mental-health care · Public beta</footer>
    </main>
  );
}
