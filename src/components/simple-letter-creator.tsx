"use client";

import { useEffect, useMemo, useState } from "react";
import { Navigation } from "@/components/navigation";
import {
  createSecureLetter,
  draftFingerprint,
  readSavedLetter,
  saveSecureLetter,
  type SecureDraft,
  type SecureLetterResult,
} from "@/lib/secure-letter-client";
import { MAX_DELIVERY_MS, MIN_DELIVERY_MS } from "@/lib/letter-rules";
import styles from "./simple-letter-creator.module.css";

const DRAFT_KEY = "intezaar:create-draft:v3";

type Stage = "write" | "arrival" | "posted";
type ArrivalChoice = "3-days" | "5-days" | "7-days" | "custom";

type StoredDraft = Partial<SecureDraft> & {
  arrivalPreset?: string;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function dateInput(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function timeInput(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function futureMoment(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(20, 0, 0, 0);
  return date;
}

function timestampFor(date: string, time: string) {
  if (!date || !time) return Number.NaN;
  return new Date(`${date}T${time}:00`).getTime();
}

function arrivalErrorFor(date: string, time: string) {
  const timestamp = timestampFor(date, time);
  if (!Number.isFinite(timestamp)) return "Choose when the letter should arrive.";
  if (timestamp < Date.now() + MIN_DELIVERY_MS) return "Choose a time at least 12 hours from now.";
  if (timestamp > Date.now() + MAX_DELIVERY_MS) return "Choose a time within the next 30 days.";
  return "";
}

function readableDate(date: string) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "long",
  }).format(new Date(`${date}T12:00:00`));
}

function readableTime(time: string) {
  if (!time) return "";
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function safeStoredDraft() {
  try {
    return JSON.parse(window.localStorage.getItem(DRAFT_KEY) || "{}") as StoredDraft;
  } catch {
    return {} as StoredDraft;
  }
}

export function SimpleLetterCreator() {
  const defaultMoment = useMemo(() => futureMoment(5), []);
  const [ready, setReady] = useState(false);
  const [stage, setStage] = useState<Stage>("write");
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("");
  const [letter, setLetter] = useState("");
  const [occasion, setOccasion] = useState("Just because");
  const [heading, setHeading] = useState("");
  const [closing, setClosing] = useState("");
  const [format, setFormat] = useState<SecureDraft["format"]>("classic");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [arrivalDate, setArrivalDate] = useState(() => dateInput(defaultMoment));
  const [arrivalTime, setArrivalTime] = useState(() => timeInput(defaultMoment));
  const [arrivalChoice, setArrivalChoice] = useState<ArrivalChoice>("5-days");
  const [posting, setPosting] = useState(false);
  const [postStatus, setPostStatus] = useState("Seal & post letter");
  const [error, setError] = useState("");
  const [result, setResult] = useState<SecureLetterResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = safeStoredDraft();
    const fallback = futureMoment(5);

    if (typeof saved.sender === "string") setSender(saved.sender);
    if (typeof saved.recipient === "string") setRecipient(saved.recipient);
    if (typeof saved.letter === "string") setLetter(saved.letter);
    if (typeof saved.occasion === "string") setOccasion(saved.occasion);
    if (typeof saved.heading === "string") setHeading(saved.heading);
    if (typeof saved.closing === "string") setClosing(saved.closing);
    if (typeof saved.format === "string") setFormat(saved.format);
    if (typeof saved.fromCity === "string") setFromCity(saved.fromCity);
    if (typeof saved.toCity === "string") setToCity(saved.toCity);

    const savedDate = typeof saved.arrivalDate === "string" ? saved.arrivalDate : "";
    const savedTime = typeof saved.arrivalTime === "string" ? saved.arrivalTime : "";
    if (savedDate && savedTime && !arrivalErrorFor(savedDate, savedTime)) {
      setArrivalDate(savedDate);
      setArrivalTime(savedTime);
      const choice = saved.arrivalPreset;
      setArrivalChoice(choice === "3-days" || choice === "5-days" || choice === "7-days" ? choice : "custom");
    } else {
      setArrivalDate(dateInput(fallback));
      setArrivalTime(timeInput(fallback));
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || stage === "posted") return;
    const next: StoredDraft = {
      sender,
      recipient,
      recipientEmail: "",
      occasion,
      heading,
      letter,
      closing,
      format,
      fromCity,
      toCity,
      arrivalDate,
      arrivalTime,
      arrivalPreset: arrivalChoice,
    };
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
    } catch {
      // Autosave is helpful but never required to write a letter.
    }
  }, [ready, stage, sender, recipient, occasion, heading, letter, closing, format, fromCity, toCity, arrivalDate, arrivalTime, arrivalChoice]);

  function chooseDays(days: 3 | 5 | 7) {
    const target = futureMoment(days);
    setArrivalDate(dateInput(target));
    setArrivalTime(timeInput(target));
    setArrivalChoice(`${days}-days` as ArrivalChoice);
    setError("");
  }

  function continueToArrival() {
    if (!sender.trim() || !recipient.trim() || !letter.trim()) {
      setError("Add your name, their name, and the letter first.");
      return;
    }
    setError("");
    setStage("arrival");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function secureDraft(): SecureDraft {
    return {
      sender: sender.trim(),
      recipient: recipient.trim(),
      recipientEmail: "",
      occasion: occasion || "Just because",
      heading: heading.trim() || `Dear ${recipient.trim()},`,
      letter: letter.trim(),
      closing: closing.trim() || `— ${sender.trim()}`,
      format,
      fromCity: fromCity.trim(),
      toCity: toCity.trim(),
      arrivalDate,
      arrivalTime,
    };
  }

  async function postLetter() {
    const arrivalError = arrivalErrorFor(arrivalDate, arrivalTime);
    if (arrivalError) {
      setError(arrivalError);
      return;
    }

    setPosting(true);
    setError("");
    setPostStatus("Sealing your letter…");

    const draft = secureDraft();
    const fingerprint = draftFingerprint(draft, []);
    const saved = readSavedLetter(fingerprint);

    try {
      const posted = saved || await createSecureLetter(draft, []);
      if (!saved) saveSecureLetter(posted, fingerprint);
      setPostStatus("Posted");
      setResult(posted);
      setStage("posted");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (postError) {
      setPostStatus("Try posting again");
      setError(postError instanceof Error ? postError.message : "The letter could not be posted. Please try again.");
    } finally {
      setPosting(false);
    }
  }

  async function copyLink() {
    if (!result?.recipientUrl) return;
    await navigator.clipboard.writeText(result.recipientUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function shareLink() {
    if (!result?.recipientUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `A letter for ${recipient}`,
          text: `I posted a private Intezaar letter for you. It opens ${readableDate(arrivalDate)} at ${readableTime(arrivalTime)}.`,
          url: result.recipientUrl,
        });
        return;
      } catch (shareError) {
        if (shareError instanceof DOMException && shareError.name === "AbortError") return;
      }
    }
    await copyLink();
  }

  function startAgain() {
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      // Ignore storage restrictions.
    }
    setSender("");
    setRecipient("");
    setLetter("");
    setOccasion("Just because");
    setHeading("");
    setClosing("");
    setFormat("classic");
    setFromCity("");
    setToCity("");
    const target = futureMoment(5);
    setArrivalDate(dateInput(target));
    setArrivalTime(timeInput(target));
    setArrivalChoice("5-days");
    setResult(null);
    setError("");
    setPostStatus("Seal & post letter");
    setStage("write");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!ready) return null;

  return (
    <main className={styles.page}>
      <Navigation />
      <div className={styles.shell}>
        <header className={styles.brandIntro}>
          <span className={styles.postmark}>INTEZAAR MAIL</span>
          <p>A private letter that waits for the right moment.</p>
        </header>

        {stage !== "posted" ? (
          <div className={styles.progress} aria-label="Letter progress">
            <div data-active={String(stage === "write")} data-complete={String(stage === "arrival")}><span>1</span><strong>Write</strong></div>
            <i />
            <div data-active={String(stage === "arrival")}><span>2</span><strong>Choose arrival</strong></div>
          </div>
        ) : null}

        {stage === "write" ? (
          <section className={styles.card}>
            <div className={styles.heading}>
              <span>Step 1 of 2</span>
              <h1>Write the letter.</h1>
              <p>Start with the words. Everything else can wait.</p>
            </div>

            <div className={styles.names}>
              <label>
                <span>From</span>
                <input autoComplete="name" value={sender} onChange={(event) => setSender(event.target.value)} placeholder="Your name" />
              </label>
              <label>
                <span>To</span>
                <input value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="Their name" />
              </label>
            </div>

            <label className={styles.letterField}>
              <span>Your letter</span>
              <textarea autoFocus value={letter} onChange={(event) => setLetter(event.target.value)} placeholder="Write what you want them to read…" rows={14} />
            </label>

            <div className={styles.autosave}><span>Saved on this device</span><span>{letter.trim() ? `${letter.trim().split(/\s+/).length} words` : "Start writing"}</span></div>

            {error ? <p className={styles.error} role="alert">{error}</p> : null}

            <button className={styles.primary} type="button" onClick={continueToArrival}>
              Choose when it arrives
            </button>
          </section>
        ) : null}

        {stage === "arrival" ? (
          <section className={`${styles.card} ${styles.arrivalCard} post-panel`}>
            <button className={styles.back} type="button" onClick={() => { setStage("write"); setError(""); }}>← Back to letter</button>

            <div className={styles.heading}>
              <span>Step 2 of 2</span>
              <h1>When should it arrive?</h1>
              <p>Until then, {recipient || "they"} will only see a sealed letter and the opening time.</p>
            </div>

            <div className={styles.arrivalChoices} role="group" aria-label="Choose arrival">
              <button type="button" data-active={String(arrivalChoice === "3-days")} onClick={() => chooseDays(3)}><strong>3 days</strong><span>A short wait</span></button>
              <button type="button" data-active={String(arrivalChoice === "5-days")} onClick={() => chooseDays(5)}><strong>5 days</strong><span>Recommended</span></button>
              <button type="button" data-active={String(arrivalChoice === "7-days")} onClick={() => chooseDays(7)}><strong>7 days</strong><span>Take the long way</span></button>
              <button type="button" data-active={String(arrivalChoice === "custom")} onClick={() => setArrivalChoice("custom")}><strong>Pick a date</strong><span>Custom</span></button>
            </div>

            {arrivalChoice === "custom" ? (
              <div className={styles.customArrival}>
                <label><span>Date</span><input type="date" value={arrivalDate} min={dateInput(new Date())} max={dateInput(new Date(Date.now() + MAX_DELIVERY_MS))} onChange={(event) => { setArrivalDate(event.target.value); setError(""); }} /></label>
                <label><span>Time</span><input type="time" value={arrivalTime} onChange={(event) => { setArrivalTime(event.target.value); setError(""); }} /></label>
              </div>
            ) : null}

            <div className={styles.arrivalSummary}>
              <span>THE LETTER OPENS</span>
              <strong>{readableDate(arrivalDate)}</strong>
              <p>{readableTime(arrivalTime)}</p>
            </div>

            <details className={styles.optional}>
              <summary>Make the journey personal <span>Optional</span></summary>
              <p>Add the two cities only if you want them used in the postal journey.</p>
              <div className={styles.names}>
                <label><span>Travelling from</span><input value={fromCity} onChange={(event) => setFromCity(event.target.value)} placeholder="e.g. Delhi" /></label>
                <label><span>Travelling to</span><input value={toCity} onChange={(event) => setToCity(event.target.value)} placeholder="e.g. Kochi" /></label>
              </div>
            </details>

            <div className={styles.review}>
              <div><span>From</span><strong>{sender}</strong></div>
              <div><span>For</span><strong>{recipient}</strong></div>
              <p>One private letter. No account. The complete private link is yours to share after posting.</p>
            </div>

            {error ? <p className={styles.error} role="alert">{error}</p> : null}

            <div className={`nostalgia-form-actions ${styles.actions}`}>
              <button className={styles.primary} type="button" disabled={posting} onClick={postLetter}>
                {posting ? "Posting securely…" : postStatus}
              </button>
            </div>
          </section>
        ) : null}

        {stage === "posted" && result ? (
          <section className={`${styles.card} ${styles.success}`}>
            <div className={styles.seal} aria-hidden="true">I</div>
            <span className={styles.postedLabel}>POSTED</span>
            <h1>Your letter is on its way.</h1>
            <p>Share the private link with <strong>{recipient}</strong>. It stays sealed until <strong>{readableDate(arrivalDate)} at {readableTime(arrivalTime)}</strong>.</p>

            <button className={styles.primary} type="button" onClick={shareLink}>Share the letter</button>
            <button className={styles.secondary} type="button" onClick={copyLink}>{copied ? "Link copied" : "Copy private link"}</button>

            <div className={styles.privateLink}>
              <span>PRIVATE RECIPIENT LINK</span>
              <code>{result.recipientUrl}</code>
            </div>

            <button className={styles.textButton} type="button" onClick={startAgain}>Write another letter</button>
          </section>
        ) : null}
      </div>
    </main>
  );
}
