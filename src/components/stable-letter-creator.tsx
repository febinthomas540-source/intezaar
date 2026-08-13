"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Navigation } from "@/components/navigation";
import {
  LetterPreview,
  initialPhotoPlacements,
  type LetterFormat,
  type PhotoItem,
  type PhotoPatch,
  type VideoItem,
  type VoiceItem,
} from "@/components/letter-preview";
import {
  MAX_DELIVERY_MS,
  MAX_LETTER_CHARS,
  MAX_MEDIA_ITEMS,
  MAX_TOTAL_MEDIA_BYTES,
  MEDIA_LIMIT_BYTES,
  MIN_DELIVERY_MS,
  mediaLimitLabel,
} from "@/lib/letter-rules";
import {
  completeMediaUpload,
  createSecureLetter,
  draftFingerprint,
  encryptAndUploadMedia,
  readSavedLetter,
  saveSecureLetter,
  type SecureDraft,
  type SecureLetterResult,
  type SecureMediaItem,
} from "@/lib/secure-letter-client";

const DRAFT_KEY = "intezaar:create-draft:v3";
const LEGACY_CONTACT_KEY = "intezaar:create-contacts:v1";
const MINUTE_MS = 60 * 1000;

const occasions = [
  "Just because",
  "Birthday",
  "Anniversary",
  "Farewell",
  "Apology",
  "Wedding",
  "Celebration",
];

const writingStarters = [
  { label: "Start warmly", text: "I have been wanting to tell you this for a while." },
  { label: "Remember a moment", text: "There is one small moment I still carry with me." },
  { label: "Say it honestly", text: "I should have said this more clearly before." },
  { label: "Look ahead", text: "What I hope for you from here is simple." },
];

type FormatDefinition = {
  id: LetterFormat;
  name: string;
  description: string;
};

type ArrivalPreset = "express" | "next-day" | "3-days" | "5-days" | "7-days" | "custom";
type SealState = "idle" | "sealing" | "sealed";
type PostState = "idle" | "posting" | "posted";
type StablePhotoItem = PhotoItem & { size: number; file: File; mimeType: string; lastModified: number };
type StableVoiceItem = VoiceItem & { size: number; file: File; mimeType: string; lastModified: number };
type StableVideoItem = VideoItem & { file: File; mimeType: string; lastModified: number };

type Draft = {
  sender: string;
  recipient: string;
  recipientEmail: string;
  occasion: string;
  heading: string;
  letter: string;
  closing: string;
  format: LetterFormat;
  fromCity: string;
  toCity: string;
  arrivalDate: string;
  arrivalTime: string;
  arrivalPreset: ArrivalPreset;
};

const formats: FormatDefinition[] = [
  { id: "classic", name: "Classic letter", description: "Warm paper for a personal letter." },
  { id: "minimal", name: "Minimal letter", description: "Clean and quiet with generous space." },
  { id: "typewriter", name: "Typewritten letter", description: "An archival typewriter treatment." },
  { id: "airmail", name: "Airmail letter", description: "Postal edging and route marks." },
  { id: "inland", name: "Inland letter", description: "Inspired by folded Indian inland mail." },
  { id: "postcard", name: "Postcard", description: "A compact postal card." },
  { id: "folded", name: "Folded card", description: "A cover and a message inside." },
  { id: "photo", name: "Photo letter", description: "A visual letter with free photo placement." },
  { id: "festival", name: "Celebration card", description: "Maroon and gold for special days." },
  { id: "telegram", name: "Digital telegram", description: "Short words with a heritage feel." },
];

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toDateInput(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toTimeInput(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function futureDate(days: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return toDateInput(date);
}

function safePresetMoment(hours: number) {
  const minimum = Date.now() + hours * 60 * 60 * 1000;
  return new Date(Math.ceil(minimum / MINUTE_MS) * MINUTE_MS + MINUTE_MS);
}

function selectedMoment(dateValue: string, timeValue: string) {
  if (!dateValue || !timeValue) return Number.NaN;
  return new Date(`${dateValue}T${timeValue}:00`).getTime();
}

function arrivalErrorFor(dateValue: string, timeValue: string) {
  const timestamp = selectedMoment(dateValue, timeValue);
  if (!Number.isFinite(timestamp)) return "Choose a valid arrival date and time.";
  const now = Date.now();
  if (timestamp < now + MIN_DELIVERY_MS) return "Choose an arrival at least 12 hours from now.";
  if (timestamp > now + MAX_DELIVERY_MS) return "Choose an arrival within 30 days.";
  return "";
}

function readableDate(dateValue: string) {
  if (!dateValue) return "Selected arrival date";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${dateValue}T12:00:00`));
}

function formatName(format: LetterFormat) {
  return formats.find((item) => item.id === format)?.name ?? "Classic letter";
}

function fileSize(bytes: number) {
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

function validEmail(value: string) {
  return !value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function validArrivalPreset(value: unknown): value is ArrivalPreset {
  return value === "express" || value === "next-day" || value === "3-days" || value === "5-days" || value === "7-days" || value === "custom";
}

export function StableLetterCreator() {
  const [step, setStep] = useState(1);
  const [created, setCreated] = useState(false);
  const [draftReady, setDraftReady] = useState(false);
  const [format, setFormat] = useState<LetterFormat>("classic");
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [occasion, setOccasion] = useState("Just because");
  const [heading, setHeading] = useState("");
  const [letter, setLetter] = useState("");
  const [closing, setClosing] = useState("");
  const [fromCity, setFromCity] = useState("Delhi");
  const [toCity, setToCity] = useState("Kochi");
  const [arrivalDate, setArrivalDate] = useState(() => futureDate(5));
  const [arrivalTime, setArrivalTime] = useState("20:00");
  const [arrivalPreset, setArrivalPreset] = useState<ArrivalPreset>("5-days");
  const [arrivalError, setArrivalError] = useState("");
  const [photos, setPhotos] = useState<StablePhotoItem[]>([]);
  const [voices, setVoices] = useState<StableVoiceItem[]>([]);
  const [videos, setVideos] = useState<StableVideoItem[]>([]);
  const [mediaError, setMediaError] = useState("");
  const [sealState, setSealState] = useState<SealState>("idle");
  const [sealStatus, setSealStatus] = useState("Ready to seal");
  const [postState, setPostState] = useState<PostState>("idle");
  const [postStatus, setPostStatus] = useState("Ready for the post box");
  const [secureResult, setSecureResult] = useState<SecureLetterResult | null>(null);
  const [pendingSecureResult, setPendingSecureResult] = useState<SecureLetterResult | null>(null);
  const [pendingFingerprint, setPendingFingerprint] = useState("");
  const [secureBusy, setSecureBusy] = useState(false);
  const [secureStatus, setSecureStatus] = useState("Continue to share");
  const [secureError, setSecureError] = useState("");
  const [copied, setCopied] = useState(false);
  const timers = useRef<number[]>([]);
  const objectUrls = useRef(new Set<string>());

  const mediaCount = photos.length + voices.length + videos.length;
  const mediaBytes = photos.reduce((total, item) => total + item.size, 0)
    + voices.reduce((total, item) => total + item.size, 0)
    + videos.reduce((total, item) => total + item.size, 0);
  const mediaSlotsLeft = Math.max(0, MAX_MEDIA_ITEMS - mediaCount);
  const wordCount = letter.trim() ? letter.trim().split(/\s+/).length : 0;
  const canContinue = Boolean(sender.trim() && recipient.trim() && letter.trim());
  const currentStep = created ? 6 : step;
  const progress = ["Write", "Personalise", "Arrival", "Seal", "Post", "Share"];
  const minArrival = toDateInput(new Date());
  const maxArrival = toDateInput(new Date(Date.now() + MAX_DELIVERY_MS));

  const recommendedFormats = useMemo<LetterFormat[]>(() => {
    if (letter.length > 1200) return ["classic", "minimal", "typewriter"];
    if (occasion !== "Just because") return ["festival", "folded", "classic"];
    return ["classic", "photo", "airmail"];
  }, [letter.length, occasion]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(DRAFT_KEY);
      const draft = saved ? JSON.parse(saved) as Partial<Draft> : {};
      const legacyContacts = JSON.parse(window.localStorage.getItem(LEGACY_CONTACT_KEY) || "{}") as { recipientEmail?: unknown };

      if (typeof draft.sender === "string") setSender(draft.sender);
      if (typeof draft.recipient === "string") setRecipient(draft.recipient);
      if (typeof draft.recipientEmail === "string") setRecipientEmail(draft.recipientEmail);
      else if (typeof legacyContacts.recipientEmail === "string") setRecipientEmail(legacyContacts.recipientEmail);
      if (typeof draft.occasion === "string") setOccasion(draft.occasion);
      if (typeof draft.heading === "string") setHeading(draft.heading);
      if (typeof draft.letter === "string") setLetter(draft.letter);
      if (typeof draft.closing === "string") setClosing(draft.closing);
      if (formats.some((item) => item.id === draft.format)) setFormat(draft.format as LetterFormat);
      if (typeof draft.fromCity === "string") setFromCity(draft.fromCity);
      if (typeof draft.toCity === "string") setToCity(draft.toCity);

      const savedDate = typeof draft.arrivalDate === "string" ? draft.arrivalDate : "";
      const savedTime = typeof draft.arrivalTime === "string" ? draft.arrivalTime : "";
      if (savedDate && savedTime && !arrivalErrorFor(savedDate, savedTime)) {
        setArrivalDate(savedDate);
        setArrivalTime(savedTime);
        setArrivalPreset(validArrivalPreset(draft.arrivalPreset) ? draft.arrivalPreset : "custom");
      }
    } catch {
      try {
        window.localStorage.removeItem(DRAFT_KEY);
      } catch {
        // Draft persistence is optional; the creator still works in memory.
      }
    } finally {
      setDraftReady(true);
    }
  }, []);

  useEffect(() => {
    if (!draftReady) return;
    const draft: Draft = {
      sender,
      recipient,
      recipientEmail: recipientEmail.trim(),
      occasion,
      heading,
      letter,
      closing,
      format,
      fromCity,
      toCity,
      arrivalDate,
      arrivalTime,
      arrivalPreset,
    };
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // Autosave is best-effort; storage restrictions must never break writing.
    }
  }, [draftReady, sender, recipient, recipientEmail, occasion, heading, letter, closing, format, fromCity, toCity, arrivalDate, arrivalTime, arrivalPreset]);

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  function later(delay: number, action: () => void) {
    const timer = window.setTimeout(action, delay);
    timers.current.push(timer);
  }

  function resetCeremony(targetStep: number) {
    if (targetStep < 4) {
      setSealState("idle");
      setSealStatus("Ready to seal");
    }
    if (targetStep < 5) {
      setPostState("idle");
      setPostStatus("Ready for the post box");
    }
    setSecureError("");
    setStep(targetStep);
  }

  function insertStarter(text: string) {
    setLetter((current) => current.trim() ? `${current.trim()}\n\n${text}` : text);
  }

  function updatePhoto(id: string, patch: PhotoPatch) {
    setPhotos((current) => current.map((photo) => photo.id === id ? { ...photo, ...patch } : photo));
  }

  function canAddFiles(files: File[], kind: "photo" | "voice" | "video") {
    const limit = MEDIA_LIMIT_BYTES[kind];
    const wrongType = files.find((file) => {
      if (kind === "photo") return !file.type.startsWith("image/");
      if (kind === "voice") return !file.type.startsWith("audio/");
      return !file.type.startsWith("video/");
    });
    if (wrongType) return `Choose a valid ${kind === "voice" ? "voice note" : kind} file.`;
    if (files.some((file) => file.size > limit)) return `The ${kind === "voice" ? "voice note" : kind} must be ${mediaLimitLabel(kind)} or smaller.`;
    if (mediaBytes + files.reduce((total, file) => total + file.size, 0) > MAX_TOTAL_MEDIA_BYTES) return "Private media can be no more than 30 MB in total per letter.";
    return "";
  }

  function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    setMediaError("");
    const files = Array.from(event.target.files ?? []).slice(0, mediaSlotsLeft);
    event.target.value = "";
    if (!files.length) return;
    const error = canAddFiles(files, "photo");
    if (error) return setMediaError(error);

    const startingIndex = photos.length;
    const added = files.map((file, index): StablePhotoItem => {
      const id = crypto.randomUUID();
      const url = URL.createObjectURL(file);
      const placement = initialPhotoPlacements[startingIndex + index] ?? initialPhotoPlacements[0];
      objectUrls.current.add(url);
      const image = new Image();
      image.onload = () => updatePhoto(id, { aspectRatio: clamp(image.naturalWidth / Math.max(1, image.naturalHeight), .55, 1.9) });
      image.src = url;
      return {
        id,
        name: file.name,
        url,
        size: file.size,
        file,
        mimeType: file.type,
        lastModified: file.lastModified,
        caption: "",
        fit: "cover",
        zoom: 1,
        cropX: 50,
        cropY: 50,
        x: placement.x,
        y: placement.y,
        width: placement.width,
        aspectRatio: 4 / 3,
        zIndex: startingIndex + index + 1,
      };
    });
    setPhotos((current) => [...current, ...added]);
  }

  function addVoices(event: ChangeEvent<HTMLInputElement>) {
    setMediaError("");
    const files = Array.from(event.target.files ?? []).slice(0, mediaSlotsLeft);
    event.target.value = "";
    if (!files.length) return;
    const error = canAddFiles(files, "voice");
    if (error) return setMediaError(error);

    const added: StableVoiceItem[] = files.map((file) => {
      const url = URL.createObjectURL(file);
      objectUrls.current.add(url);
      return {
        id: crypto.randomUUID(),
        name: file.name,
        url,
        label: "",
        size: file.size,
        file,
        mimeType: file.type,
        lastModified: file.lastModified,
      };
    });
    setVoices((current) => [...current, ...added]);
  }

  function addVideo(event: ChangeEvent<HTMLInputElement>) {
    setMediaError("");
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!mediaSlotsLeft) return setMediaError("Remove one media item before adding a video.");
    if (videos.length) return setMediaError("Only one video can be added to a letter.");
    const error = canAddFiles([file], "video");
    if (error) return setMediaError(error);
    const url = URL.createObjectURL(file);
    objectUrls.current.add(url);
    setVideos([{
      id: crypto.randomUUID(),
      name: file.name,
      url,
      caption: "",
      size: file.size,
      file,
      mimeType: file.type,
      lastModified: file.lastModified,
    }]);
  }

  function removeMedia(kind: "photo" | "voice" | "video", id: string) {
    const remove = <T extends { id: string; url: string }>(items: T[]) => {
      const target = items.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
        objectUrls.current.delete(target.url);
      }
      return items.filter((item) => item.id !== id);
    };
    if (kind === "photo") setPhotos(remove);
    if (kind === "voice") setVoices(remove);
    if (kind === "video") setVideos(remove);
  }

  function chooseHours(hours: number, preset: ArrivalPreset) {
    const target = safePresetMoment(hours);
    setArrivalDate(toDateInput(target));
    setArrivalTime(toTimeInput(target));
    setArrivalPreset(preset);
    setArrivalError("");
  }

  function chooseDays(days: number, preset: ArrivalPreset) {
    const target = safePresetMoment(days * 24);
    setArrivalDate(toDateInput(target));
    setArrivalTime(toTimeInput(target));
    setArrivalPreset(preset);
    setArrivalError("");
  }

  function continueToSeal() {
    const error = arrivalErrorFor(arrivalDate, arrivalTime);
    setArrivalError(error);
    if (!error) setStep(4);
  }

  function startSeal() {
    if (sealState !== "idle") return;
    setSealState("sealing");
    setSealStatus("Folding your letter…");
    later(750, () => setSealStatus("Closing the envelope…"));
    later(1500, () => setSealStatus("Pressing the wax seal…"));
    later(2350, () => {
      setSealState("sealed");
      setSealStatus("Your letter is sealed");
    });
  }

  function finishSeal() {
    setSealState("sealed");
    setSealStatus("Your letter is sealed");
  }

  function startPost() {
    if (postState !== "idle" || sealState !== "sealed") return;
    setPostState("posting");
    setPostStatus("Taking it to the post box…");
    later(850, () => setPostStatus("Posting your letter…"));
    later(1750, () => setPostStatus("Marking it for dispatch…"));
    later(2850, () => {
      setPostState("posted");
      setPostStatus("Your letter has been posted");
    });
  }

  function finishPost() {
    setPostState("posted");
    setPostStatus("Your letter has been posted");
  }

  function secureDraft(): SecureDraft {
    return {
      sender: sender.trim(),
      recipient: recipient.trim(),
      recipientEmail: recipientEmail.trim(),
      occasion,
      heading,
      letter,
      closing,
      format,
      fromCity,
      toCity,
      arrivalDate,
      arrivalTime,
    };
  }

  function secureMedia(): SecureMediaItem[] {
    const photoMedia: SecureMediaItem[] = photos.map((photo) => ({
      id: photo.id,
      kind: "photo",
      file: photo.file,
      name: photo.name,
      mimeType: photo.mimeType,
      size: photo.size,
      lastModified: photo.lastModified,
      caption: photo.caption,
      photoLayout: {
        fit: photo.fit,
        zoom: photo.zoom,
        cropX: photo.cropX,
        cropY: photo.cropY,
        x: photo.x,
        y: photo.y,
        width: photo.width,
        aspectRatio: photo.aspectRatio,
        zIndex: photo.zIndex,
      },
    }));
    const voiceMedia: SecureMediaItem[] = voices.map((voice) => ({
      id: voice.id,
      kind: "voice",
      file: voice.file,
      name: voice.name,
      mimeType: voice.mimeType,
      size: voice.size,
      lastModified: voice.lastModified,
      caption: voice.label,
    }));
    const videoMedia: SecureMediaItem[] = videos.map((video) => ({
      id: video.id,
      kind: "video",
      file: video.file,
      name: video.name,
      mimeType: video.mimeType,
      size: video.size,
      lastModified: video.lastModified,
      caption: video.caption,
    }));
    return [...photoMedia, ...voiceMedia, ...videoMedia];
  }

  async function continueToShare() {
    if (secureBusy) return;
    setSecureBusy(true);
    setSecureError("");

    const draft = secureDraft();
    const media = secureMedia();
    const fingerprint = draftFingerprint(draft, media);
    const saved = readSavedLetter(fingerprint);

    if (saved) {
      setSecureResult(saved);
      setSecureBusy(false);
      setCreated(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    let result = pendingSecureResult && pendingFingerprint === fingerprint
      ? pendingSecureResult
      : null;

    try {
      if (!result) {
        setSecureStatus("Securing your letter…");
        result = await createSecureLetter(draft, media);
        setPendingSecureResult(result);
        setPendingFingerprint(fingerprint);
      }

      if (result.mediaUpload?.items.length) {
        setSecureStatus(`Encrypting media 0 of ${result.mediaUpload.items.length}…`);
        await encryptAndUploadMedia(result.mediaUpload, media, (completed, total) => {
          setSecureStatus(`Encrypting media ${completed} of ${total}…`);
        });
        setSecureStatus("Confirming private media…");
        result = await completeMediaUpload(result, result.mediaUpload.items.map((item) => item.id));
      }

      saveSecureLetter(result, fingerprint);
      setSecureResult(result);
      setPendingSecureResult(null);
      setPendingFingerprint("");
      setSecureStatus("Continue to share");
      setCreated(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSecureError(error instanceof Error ? error.message : "The letter could not be stored securely.");
      setSecureStatus(result?.mediaUpload?.items.length ? "Retry encrypted media upload" : "Try secure posting again");
    } finally {
      setSecureBusy(false);
    }
  }

  async function copyShareLink() {
    const url = secureResult?.recipientUrl;
    if (!url) return;
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
    } else {
      const field = document.createElement("textarea");
      field.value = url;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
    later(1800, () => setCopied(false));
  }

  async function shareLetter() {
    const url = secureResult?.recipientUrl;
    if (!url) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: `A letter for ${recipient}`, text: "A private Intezaar letter has been posted for you.", url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    await copyShareLink();
  }

  const preview = (
    <LetterPreview
      format={format}
      sender={sender}
      recipient={recipient}
      occasion={occasion}
      heading={heading}
      letter={letter}
      closing={closing}
      photos={photos}
      voices={voices}
      videos={videos}
      onUpdatePhoto={updatePhoto}
      onRemovePhoto={(id) => removeMedia("photo", id)}
    />
  );

  const registered = Boolean(recipientEmail.trim());
  const emailOkay = validEmail(recipientEmail);
  const currentArrivalError = step === 3 ? arrivalErrorFor(arrivalDate, arrivalTime) : "";
  const deliveryMessage = secureResult?.emailDelivery?.message;
  const mediaMessage = secureResult?.mediaReady
    ? `${secureResult.mediaCount || 0} media item${secureResult.mediaCount === 1 ? "" : "s"} encrypted and stored privately.`
    : "Your letter text is encrypted behind a private token.";

  return (
    <main className="nostalgia-create creation-flow-v2 seal-post-flow">
      <Navigation />
      <section className="nostalgia-create-layout">
        <aside className="nostalgia-create-photo">
          <div className="postal-create-scene" aria-hidden="true"><div className="postal-create-rain" /><div className="postal-create-train" /><div className="postal-create-platform" /><div className="postal-create-box"><span className="postal-create-box-title"><small>डाक</small>INTEZAAR MAIL</span><span className="postal-create-box-slot">LETTERS</span><span className="postal-create-box-wave"><i /><i /><i /></span><span className="postal-create-box-time">NEXT COLLECTION<b>17:00</b></span></div><div className="postal-create-letters"><span className="postal-create-envelope" /><span className="postal-create-envelope" /><span className="postal-create-envelope" /><span className="postal-create-wax">I</span></div></div>
          <div className="postal-create-copy"><p className="nostalgia-eyebrow">Write. Seal. Post. Await.</p><h1>Turn a digital message into something truly sent.</h1><p>Write the letter, choose its arrival, seal the envelope and post it into the Intezaar box.</p></div>
        </aside>

        <div className="nostalgia-create-form-wrap creation-main">
          <nav className="creation-stepper" aria-label="Letter creation progress">
            {progress.map((label, index) => {
              const number = index + 1;
              return <button key={label} type="button" className={currentStep === number ? "active" : currentStep > number ? "complete" : ""} disabled={number > currentStep || created || Boolean(secureResult) || sealState === "sealing" || postState === "posting" || secureBusy} onClick={() => number < currentStep && resetCeremony(number)}><span>{currentStep > number ? "✓" : number}</span><small>{label}</small></button>;
            })}
          </nav>

          {!created ? (
            <form className="nostalgia-form creation-form" onSubmit={(event: FormEvent<HTMLFormElement>) => event.preventDefault()}>
              {step === 1 ? <section className="nostalgia-form-section creation-panel creation-write-panel">
                <header className="creation-section-head"><div><span>Step 1 of 6</span><h2>Write your letter</h2><p>Say what you want them to receive when the letter arrives.</p></div><small>Draft saves on this device</small></header>
                <div className="nostalgia-form-grid"><label>From<input value={sender} onChange={(event) => setSender(event.target.value)} placeholder="Your name" /></label><label>To<input value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="Their name" /></label></div>
                <div className="nostalgia-form-grid"><label>Occasion<select value={occasion} onChange={(event) => setOccasion(event.target.value)}>{occasions.map((item) => <option key={item}>{item}</option>)}</select></label><label>Opening<input value={heading} onChange={(event) => setHeading(event.target.value)} placeholder={`Dear ${recipient || "you"},`} /></label></div>
                <div className="writing-help"><strong>Need a starting line?</strong><div>{writingStarters.map((starter) => <button key={starter.label} type="button" onClick={() => insertStarter(starter.text)}>{starter.label}</button>)}</div></div>
                <label>Your letter<textarea value={letter} onChange={(event) => setLetter(event.target.value)} rows={15} maxLength={MAX_LETTER_CHARS} placeholder="Write what you want them to receive…" /></label>
                <div className="writing-counter"><span>{wordCount} words</span><span>{letter.length.toLocaleString()} / {MAX_LETTER_CHARS.toLocaleString()} characters</span></div>
                <label>Closing<input value={closing} onChange={(event) => setClosing(event.target.value)} placeholder={sender ? `With love, ${sender}` : "With love,"} /></label>
                <div className="nostalgia-form-actions"><button className="nostalgia-button nostalgia-button-primary" type="button" disabled={!canContinue} onClick={() => setStep(2)}>Continue to personalise</button></div>
              </section> : null}

              {step === 2 ? <section className="nostalgia-form-section creation-panel">
                <header className="creation-section-head"><div><span>Step 2 of 6</span><h2>Personalise it</h2><p>Choose the paper and add optional memories only when they belong inside the letter.</p></div><small>{mediaCount} of {MAX_MEDIA_ITEMS} media slots used</small></header>
                <section className="recommended-formats"><h3>Suggested for this letter</h3><div>{recommendedFormats.map((id) => { const item = formats.find((entry) => entry.id === id)!; return <button key={id} type="button" className={format === id ? "active" : ""} onClick={() => setFormat(id)}><span className={`format-miniature format-miniature-${id}`} aria-hidden="true"><i /><i /></span><strong>{item.name}</strong><small>{item.description}</small></button>; })}</div></section>
                <details className="format-library-disclosure"><summary>More letter styles <span>Optional</span></summary><div className="letter-format-grid">{formats.map((item) => <button key={item.id} type="button" className={format === item.id ? "active" : ""} onClick={() => setFormat(item.id)}><span className={`format-miniature format-miniature-${item.id}`} aria-hidden="true"><i /><i /></span><strong>{item.name}</strong><small>{item.description}</small></button>)}</div></details>
                <div className="creation-personalise-layout"><div className="compact-media-studio"><header><h3>Optional media</h3><p>Add up to three total items.</p></header><div className="media-choice-row"><label className={mediaSlotsLeft ? "" : "disabled"}>＋ Photo<input type="file" accept="image/*" multiple disabled={!mediaSlotsLeft} onChange={addPhotos} /></label><label className={mediaSlotsLeft ? "" : "disabled"}>＋ Voice<input type="file" accept="audio/*" multiple disabled={!mediaSlotsLeft} onChange={addVoices} /></label><label className={mediaSlotsLeft && !videos.length ? "" : "disabled"}>＋ Video<input type="file" accept="video/*" disabled={!mediaSlotsLeft || Boolean(videos.length)} onChange={addVideo} /></label></div>{mediaError ? <p className="media-error" role="alert">{mediaError}</p> : null}<p className="media-limit-copy">Photos {mediaLimitLabel("photo")} · voice {mediaLimitLabel("voice")} · video {mediaLimitLabel("video")} · 30 MB total.</p><div className="media-item-list compact-media-list">{photos.length ? <div className="photo-edit-inside-note"><strong>{photos.length} photo{photos.length === 1 ? "" : "s"} placed</strong><span>Drag them directly on the letter. Resize, zoom, crop and caption below the preview.</span></div> : null}{voices.map((voice, index) => <article className="media-item media-item-audio" key={voice.id}><span className="media-audio-icon">▶</span><div><strong>Voice note {index + 1}</strong><input value={voice.label} onChange={(event) => setVoices((current) => current.map((item) => item.id === voice.id ? { ...item, label: event.target.value } : item))} placeholder="Editable title" /><audio controls src={voice.url} /></div><button type="button" onClick={() => removeMedia("voice", voice.id)}>Remove</button></article>)}{videos.map((video) => <article className="media-item media-item-video" key={video.id}><video controls playsInline src={video.url} /><div><strong>Video · {fileSize(video.size)}</strong><input value={video.caption} onChange={(event) => setVideos((current) => current.map((item) => item.id === video.id ? { ...item, caption: event.target.value } : item))} placeholder="Editable caption" /></div><button type="button" onClick={() => removeMedia("video", video.id)}>Remove</button></article>)}</div><p className="media-privacy-note">Selected media is encrypted in this browser and uploaded privately only after you post the letter.</p></div><details className="creation-preview-disclosure" open><summary>Preview what they will open</summary>{preview}</details></div>
                <div className="nostalgia-form-actions"><button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => resetCeremony(1)}>Back to writing</button><button className="nostalgia-button nostalgia-button-primary" type="button" onClick={() => setStep(3)}>Choose arrival</button></div>
              </section> : null}

              {step === 3 ? <section className="nostalgia-form-section creation-panel">
                <header className="creation-section-head"><div><span>Step 3 of 6</span><h2>Choose when it should arrive</h2><p>The letter stays sealed until the date and time you choose.</p></div><small>Free during public beta</small></header>
                <div className="journey-duration-cards" role="group" aria-label="Quick arrival choices">
                  <button type="button" className={`express-choice ${arrivalPreset === "express" ? "active" : ""}`} onClick={() => chooseHours(12, "express")}><strong>12 hours</strong><span>Intezaar Express</span></button>
                  <button type="button" className={arrivalPreset === "next-day" ? "active" : ""} onClick={() => chooseHours(24, "next-day")}><strong>Next day</strong><span>Priority arrival</span></button>
                  <button type="button" className={arrivalPreset === "3-days" ? "active" : ""} onClick={() => chooseDays(3, "3-days")}><strong>3 days</strong><span>A short wait</span></button>
                  <button type="button" className={arrivalPreset === "5-days" ? "active" : ""} onClick={() => chooseDays(5, "5-days")}><strong>5 days</strong><span>A meaningful pause</span></button>
                  <button type="button" className={arrivalPreset === "7-days" ? "active" : ""} onClick={() => chooseDays(7, "7-days")}><strong>7 days</strong><span>A slower arrival</span></button>
                </div>
                <p className="arrival-preset-note" data-invalid={String(Boolean(arrivalError || currentArrivalError))}>{arrivalError || currentArrivalError || "Intezaar Express starts at 12 hours. Slower journeys keep the waiting ritual at the centre."}</p>
                <div className="arrival-postal-grid"><section className="arrival-card"><span>Arrival</span><h3>{readableDate(arrivalDate)}</h3><label>Arrival date<input type="date" min={minArrival} max={maxArrival} value={arrivalDate} onChange={(event) => { setArrivalDate(event.target.value); setArrivalPreset("custom"); setArrivalError(""); }} /></label><label>Opening time<input type="time" value={arrivalTime} onChange={(event) => { setArrivalTime(event.target.value); setArrivalPreset("custom"); setArrivalError(""); }} /></label><p>{recipient || "The recipient"} will see a sealed letter before this moment.</p></section><section className="arrival-card postal-route-card"><span>Postal route</span><h3>{fromCity || "Origin"} → {toCity || "Destination"}</h3><label>Posted from<input value={fromCity} onChange={(event) => setFromCity(event.target.value)} /></label><label>Arriving in<input value={toCity} onChange={(event) => setToCity(event.target.value)} /></label><p>The route is cinematic, not live postal or railway tracking.</p></section></div>
                <section className="registered-delivery-option"><div><span>Optional privacy</span><h3>Registered Intezaar Mail</h3><p>Add the recipient’s email only if you want them to verify with a one-time code before sender details, the letter or private media are released.</p></div><label>Recipient email (optional)<input type="email" inputMode="email" autoComplete="email" maxLength={254} value={recipientEmail} onChange={(event) => setRecipientEmail(event.target.value)} placeholder="name@example.com" /></label><small data-active={String(registered)}>{registered ? "Registered delivery enabled · recipient verification required" : "Leave blank for ordinary private-link delivery"}</small>{!emailOkay ? <p className="registered-delivery-error" role="alert">Enter a valid email address or leave it blank.</p> : null}</section>
                <div className="final-review-strip"><div><small>From</small><strong>{sender}</strong></div><div><small>For</small><strong>{recipient}</strong></div><div><small>Arrival</small><strong>{readableDate(arrivalDate)}</strong></div><div><small>Opens</small><strong>{arrivalTime}</strong></div></div>
                <div className="nostalgia-form-actions"><button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => resetCeremony(2)}>Back to personalise</button><button className="nostalgia-button nostalgia-button-primary" type="button" disabled={!emailOkay || Boolean(currentArrivalError)} onClick={continueToSeal}>Continue to seal</button></div>
              </section> : null}

              {step === 4 ? <section className="nostalgia-form-section creation-panel ceremony-panel">
                <header className="creation-section-head"><div><span>Step 4 of 6</span><h2>Seal the letter</h2><p>This is the moment it stops being a draft and becomes something sent.</p></div><small>{formatName(format)}</small></header>
                <div className={`seal-stage seal-${sealState}`} aria-live="polite"><div className="seal-paper"><span>{heading || `Dear ${recipient},`}</span><i /><i /><i /></div><div className="seal-envelope"><span className="seal-envelope-back" /><span className="seal-envelope-flap" /><span className="seal-wax">I</span><strong>For {recipient}</strong></div><div className="ceremony-status"><span>{sealState === "sealed" ? "SEALED" : "INTEZAAR MAIL"}</span><strong>{sealStatus}</strong></div></div>
                <div className="ceremony-summary"><div><small>From</small><strong>{fromCity}</strong></div><div><small>To</small><strong>{toCity}</strong></div><div><small>Opens</small><strong>{readableDate(arrivalDate)} · {arrivalTime}</strong></div></div>
                <div className="nostalgia-form-actions">{sealState === "idle" ? <><button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => resetCeremony(3)}>Go back and edit</button><button className="nostalgia-button nostalgia-button-primary" type="button" onClick={startSeal}>Seal the letter</button></> : null}{sealState === "sealing" ? <button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={finishSeal}>Finish animation</button> : null}{sealState === "sealed" ? <><button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => { setSealState("idle"); setSealStatus("Ready to seal"); }}>Unseal and edit</button><button className="nostalgia-button nostalgia-button-primary" type="button" onClick={() => setStep(5)}>Continue to the post box</button></> : null}</div>
              </section> : null}

              {step === 5 ? <section className="nostalgia-form-section creation-panel ceremony-panel post-panel">
                <header className="creation-section-head"><div><span>Step 5 of 6</span><h2>{postState === "posted" ? "Your letter has been posted" : "Post your letter"}</h2><p>{postState === "posted" ? "It will stay sealed until the moment you chose." : "Drop it into the Intezaar box and let the waiting begin."}</p></div><small>{fromCity.toUpperCase()} COLLECTION</small></header>
                <div className={`post-stage post-${postState}`} aria-live="polite"><div className="post-atmosphere"><span /><span /><span /></div><div className="posting-envelope"><span>For {recipient}</span><i>I</i></div><div className="intezaar-postbox"><strong><small>डाक</small>INTEZAAR MAIL</strong><span className="postbox-slot">LETTERS</span><span className="postbox-door"><i>POSTED</i></span><span className="postbox-base" /></div><div className="ceremony-status post-status"><span>{postState === "posted" ? "POSTED" : "FINAL COLLECTION"}</span><strong>{postStatus}</strong></div></div>
                <div className="ceremony-summary"><div><small>Posted from</small><strong>{fromCity}</strong></div><div><small>Going to</small><strong>{toCity}</strong></div><div><small>Arrives</small><strong>{readableDate(arrivalDate)} · {arrivalTime}</strong></div></div>
                {secureError ? <p className="secure-letter-error media-error" role="alert">{secureError}</p> : null}
                <div className="nostalgia-form-actions">{postState === "idle" ? <><button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => setStep(4)}>Back to sealed letter</button><button className="nostalgia-button nostalgia-button-primary" type="button" onClick={startPost}>Post the letter</button></> : null}{postState === "posting" ? <button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={finishPost}>Finish animation</button> : null}{postState === "posted" ? <button className="nostalgia-button nostalgia-button-primary" type="button" disabled={secureBusy} onClick={continueToShare}>{secureBusy ? secureStatus : pendingSecureResult ? "Retry encrypted media upload" : secureStatus}</button> : null}</div>
              </section> : null}
            </form>
          ) : <section className="nostalgia-create-success creation-share-panel posted-share-panel"><p className="nostalgia-eyebrow">Step 6 of 6 · Posted</p><h2>Your letter is on its way.</h2><p>{registered ? `Registered delivery is enabled for ${recipient}. They will verify with the code sent to their email before the letter can be released.` : `Send the private link to ${recipient}. They will see a sealed letter and its arrival date before they can open it.`}</p><div className="posted-stamp-card"><span>POSTED</span><strong>{fromCity} → {toCity}</strong><p>Opens {readableDate(arrivalDate)} at {arrivalTime}</p></div><div className="share-link-box"><span>Private recipient link</span><code>{secureResult?.recipientUrl || ""}</code><button type="button" onClick={copyShareLink}>{copied ? "Copied" : "Copy link"}</button></div><div className="nostalgia-success-actions"><button className="nostalgia-button nostalgia-button-primary" type="button" onClick={shareLetter}>Share letter link</button>{secureResult?.recipientUrl ? <Link href={secureResult.recipientUrl} className="nostalgia-button nostalgia-button-ghost">Open recipient link</Link> : null}<button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => { setCreated(false); setPostState("posted"); setStep(5); }}>Back to posted letter</button></div><p className="prototype-transfer-note">{deliveryMessage ? `${deliveryMessage} ${mediaMessage}` : mediaMessage}</p></section>}
        </div>
      </section>
    </main>
  );
}
