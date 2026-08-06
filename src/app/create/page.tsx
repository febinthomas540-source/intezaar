"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";

const occasions = ["Just because", "Birthday", "Anniversary", "Farewell", "Apology", "Wedding", "Celebration"];
const MAX_LETTER_CHARS = 4000;
const MAX_MEDIA_ITEMS = 3;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const DRAFT_KEY = "intezaar:create-draft:v2";

type LetterFormat =
  | "classic"
  | "postcard"
  | "folded"
  | "airmail"
  | "inland"
  | "telegram"
  | "photo"
  | "festival"
  | "typewriter"
  | "minimal";

type FormatCategory = "Letter papers" | "Cards & photos" | "Heritage";
type PhotoItem = { id: string; name: string; url: string; caption: string };
type VoiceItem = { id: string; name: string; url: string; label: string };
type VideoItem = { id: string; name: string; url: string; caption: string; size: number };
type FormatDefinition = { id: LetterFormat; name: string; category: FormatCategory; description: string };

type SavedDraft = {
  sender: string;
  recipient: string;
  occasion: string;
  heading: string;
  letter: string;
  closing: string;
  format: LetterFormat;
  journeyDays: number;
  fromCity: string;
  toCity: string;
  arrivalTime: string;
  arrivalZone: string;
};

const formatCategories: FormatCategory[] = ["Letter papers", "Cards & photos", "Heritage"];

const formats: FormatDefinition[] = [
  { id: "classic", name: "Classic letter", category: "Letter papers", description: "A warm full page for longer, personal words." },
  { id: "minimal", name: "Minimal letter", category: "Letter papers", description: "A clean modern page with generous space." },
  { id: "typewriter", name: "Typewritten letter", category: "Letter papers", description: "An archival page with a mature typewriter feel." },
  { id: "airmail", name: "Airmail letter", category: "Letter papers", description: "A light postal sheet with route marks and edging." },
  { id: "inland", name: "Inland letter", category: "Letter papers", description: "A folded blue-green sheet inspired by Indian inland mail." },
  { id: "postcard", name: "Postcard", category: "Cards & photos", description: "One strong photograph with a shorter message." },
  { id: "folded", name: "Folded card", category: "Cards & photos", description: "A cover followed by the message inside." },
  { id: "photo", name: "Photo letter", category: "Cards & photos", description: "A large photograph leads into the complete letter." },
  { id: "festival", name: "Celebration card", category: "Cards & photos", description: "A maroon-and-gold design for Indian celebrations." },
  { id: "telegram", name: "Digital telegram", category: "Heritage", description: "Short direct words presented like a preserved telegram." },
];

const writingStarters = [
  { label: "Start warmly", text: "I have been wanting to tell you this for a while." },
  { label: "Remember a moment", text: "There is one small moment I still carry with me." },
  { label: "Say it honestly", text: "I should have said this more clearly before." },
  { label: "Look ahead", text: "What I hope for you from here is simple." },
];

function formatName(format: LetterFormat) {
  return formats.find((item) => item.id === format)?.name ?? "Classic letter";
}

function formatMark(format: LetterFormat) {
  const marks: Record<LetterFormat, string> = {
    classic: "PRIVATE LETTER",
    postcard: "POST CARD",
    folded: "FOLDED CARD",
    airmail: "BY AIR MAIL",
    inland: "INLAND LETTER",
    telegram: "DIGITAL TELEGRAM",
    photo: "PHOTO LETTER",
    festival: "CELEBRATION MAIL",
    typewriter: "TYPEWRITTEN LETTER",
    minimal: "PRIVATE NOTE",
  };
  return marks[format];
}

function formatFileSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function LiveLetterPreview({
  format,
  sender,
  recipient,
  occasion,
  heading,
  letter,
  closing,
  photos,
  voices,
  videos,
}: {
  format: LetterFormat;
  sender: string;
  recipient: string;
  occasion: string;
  heading: string;
  letter: string;
  closing: string;
  photos: PhotoItem[];
  voices: VoiceItem[];
  videos: VideoItem[];
}) {
  const message = letter.trim() || "Your letter will appear here as you write.";
  const galleryPhotos = format === "postcard" ? [] : format === "photo" ? photos.slice(1) : photos;

  return (
    <article className={`letter-live-preview letter-format-${format}`} aria-label={`${formatName(format)} preview`}>
      <div className="letter-preview-toolbar"><span>Recipient preview</span><strong>{formatName(format)}</strong></div>

      {format === "folded" ? (
        <div className="folded-cover"><small>{occasion}</small><h3>{heading.trim() || `For ${recipient || "someone special"}`}</h3><span>Open the card →</span></div>
      ) : null}

      {format === "festival" ? (
        <div className="festival-cover"><small>Intezaar celebration mail</small><strong>{occasion}</strong><span>For {recipient || "someone special"}</span></div>
      ) : null}

      <div className="letter-preview-paper">
        {format === "telegram" ? <div className="telegram-strip"><span>तार · TELEGRAM</span><strong>PRIORITY: PERSONAL</strong></div> : null}
        {format === "inland" ? <div className="inland-fold-guide" aria-hidden="true"><span>Fold here</span><i /><i /></div> : null}

        <header className="letter-preview-address">
          <div><small>From</small><strong>{sender || "Your name"}</strong></div>
          <div><small>To</small><strong>{recipient || "Their name"}</strong></div>
          <span className="letter-preview-postmark">INTEZAAR MAIL<br />POSTED WITH PATIENCE</span>
        </header>

        {format === "postcard" && photos[0] ? (
          <figure className="postcard-main-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos[0].url} alt={photos[0].caption || photos[0].name} />
            {photos[0].caption ? <figcaption>{photos[0].caption}</figcaption> : null}
          </figure>
        ) : null}

        {format === "photo" ? (
          photos[0] ? (
            <figure className="photo-letter-cover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photos[0].url} alt={photos[0].caption || photos[0].name} />
              {photos[0].caption ? <figcaption>{photos[0].caption}</figcaption> : null}
            </figure>
          ) : <div className="photo-letter-placeholder">Your cover photograph will appear here</div>
        ) : null}

        <div className="letter-preview-copy">
          <small>{occasion}</small>
          <h3>{heading.trim() || `Dear ${recipient || "you"},`}</h3>
          <p>{message}</p>
          <em>{closing.trim() || (sender ? `With love, ${sender}` : "Your closing")}</em>
        </div>

        {galleryPhotos.length ? (
          <div className={`letter-preview-photos photo-count-${Math.min(galleryPhotos.length, 3)}`}>
            {galleryPhotos.map((photo) => (
              <figure key={photo.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.caption || photo.name} />
                {photo.caption ? <figcaption>{photo.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
        ) : null}

        {voices.length ? (
          <div className="letter-preview-voices">
            {voices.map((voice) => (
              <div key={voice.id}>
                <span className="voice-play-mark">▶</span>
                <p><strong>{voice.label || "A voice note inside this letter"}</strong><small>{voice.name}</small></p>
                <audio controls src={voice.url} preload="metadata" aria-label={voice.label || voice.name} />
              </div>
            ))}
          </div>
        ) : null}

        {videos.length ? (
          <div className="letter-preview-videos">
            {videos.map((video) => (
              <figure key={video.id}>
                <video controls playsInline preload="metadata" src={video.url} aria-label={video.caption || video.name} />
                <figcaption><strong>{video.caption || "A video inside this letter"}</strong><small>{video.name} · {formatFileSize(video.size)}</small></figcaption>
              </figure>
            ))}
          </div>
        ) : null}

        <footer><span>{formatMark(format)}</span><span>{photos.length + voices.length + videos.length} optional item{photos.length + voices.length + videos.length === 1 ? "" : "s"}</span></footer>
      </div>
    </article>
  );
}

export default function CreatePage() {
  const [step, setStep] = useState(1);
  const [created, setCreated] = useState(false);
  const [draftReady, setDraftReady] = useState(false);
  const [format, setFormat] = useState<LetterFormat>("classic");
  const [journeyDays, setJourneyDays] = useState(5);
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("Ananya");
  const [occasion, setOccasion] = useState("Just because");
  const [heading, setHeading] = useState("");
  const [letter, setLetter] = useState("");
  const [closing, setClosing] = useState("");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [voices, setVoices] = useState<VoiceItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [mediaError, setMediaError] = useState("");
  const [fromCity, setFromCity] = useState("Delhi");
  const [toCity, setToCity] = useState("Kochi");
  const [arrivalTime, setArrivalTime] = useState("20:00");
  const [arrivalZone, setArrivalZone] = useState("Recipient local time");
  const [prototypeConfirmed, setPrototypeConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const objectUrls = useRef(new Set<string>());

  const mediaCount = photos.length + voices.length + videos.length;
  const mediaSlotsLeft = Math.max(0, MAX_MEDIA_ITEMS - mediaCount);
  const wordCount = letter.trim() ? letter.trim().split(/\s+/).length : 0;
  const canContinue = sender.trim().length > 0 && recipient.trim().length > 0 && letter.trim().length >= 20;
  const currentStep = created ? 5 : step;

  const recommendedFormats = useMemo<LetterFormat[]>(() => {
    if (letter.length > 1200) return ["classic", "minimal", "typewriter"];
    if (occasion !== "Just because") return ["festival", "folded", "classic"];
    return ["classic", "minimal", "postcard"];
  }, [letter.length, occasion]);

  const progressCopy = ["Write", "Personalise", "Journey", "Arrival & payment", "Share"];

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const draft = JSON.parse(saved) as Partial<SavedDraft>;
        if (typeof draft.sender === "string") setSender(draft.sender);
        if (typeof draft.recipient === "string") setRecipient(draft.recipient);
        if (typeof draft.occasion === "string") setOccasion(draft.occasion);
        if (typeof draft.heading === "string") setHeading(draft.heading);
        if (typeof draft.letter === "string") setLetter(draft.letter);
        if (typeof draft.closing === "string") setClosing(draft.closing);
        if (formats.some((item) => item.id === draft.format)) setFormat(draft.format as LetterFormat);
        if ([3, 5, 7].includes(Number(draft.journeyDays))) setJourneyDays(Number(draft.journeyDays));
        if (typeof draft.fromCity === "string") setFromCity(draft.fromCity);
        if (typeof draft.toCity === "string") setToCity(draft.toCity);
        if (typeof draft.arrivalTime === "string") setArrivalTime(draft.arrivalTime);
        if (typeof draft.arrivalZone === "string") setArrivalZone(draft.arrivalZone);
      }
    } catch {
      window.localStorage.removeItem(DRAFT_KEY);
    } finally {
      setDraftReady(true);
    }
  }, []);

  useEffect(() => {
    if (!draftReady) return;
    const draft: SavedDraft = { sender, recipient, occasion, heading, letter, closing, format, journeyDays, fromCity, toCity, arrivalTime, arrivalZone };
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [draftReady, sender, recipient, occasion, heading, letter, closing, format, journeyDays, fromCity, toCity, arrivalTime, arrivalZone]);

  useEffect(() => {
    return () => {
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.current.clear();
    };
  }, []);

  function insertStarter(text: string) {
    setLetter((current) => current.trim() ? `${current.trim()}\n\n${text}` : text);
  }

  function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    setMediaError("");
    const files = Array.from(event.target.files ?? []);
    const added = files.slice(0, mediaSlotsLeft).map((file) => {
      const url = URL.createObjectURL(file);
      objectUrls.current.add(url);
      return { id: crypto.randomUUID(), name: file.name, url, caption: "" };
    });
    setPhotos((current) => [...current, ...added]);
    event.target.value = "";
  }

  function addVoices(event: ChangeEvent<HTMLInputElement>) {
    setMediaError("");
    const files = Array.from(event.target.files ?? []);
    const added = files.slice(0, mediaSlotsLeft).map((file) => {
      const url = URL.createObjectURL(file);
      objectUrls.current.add(url);
      return { id: crypto.randomUUID(), name: file.name, url, label: "" };
    });
    setVoices((current) => [...current, ...added]);
    event.target.value = "";
  }

  function addVideo(event: ChangeEvent<HTMLInputElement>) {
    setMediaError("");
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (mediaSlotsLeft < 1) return setMediaError("Remove one media item before adding a video.");
    if (videos.length) return setMediaError("A letter can contain one video clip. Remove it before replacing it.");
    if (!file.type.startsWith("video/")) return setMediaError("Choose a video file. MP4 or WebM works best.");
    if (file.size > MAX_VIDEO_BYTES) return setMediaError("This video is larger than 50 MB. Choose a shorter or compressed clip.");
    const url = URL.createObjectURL(file);
    objectUrls.current.add(url);
    setVideos([{ id: crypto.randomUUID(), name: file.name, url, caption: "", size: file.size }]);
  }

  function updatePhoto(id: string, caption: string) {
    setPhotos((current) => current.map((item) => item.id === id ? { ...item, caption } : item));
  }

  function updateVoice(id: string, label: string) {
    setVoices((current) => current.map((item) => item.id === id ? { ...item, label } : item));
  }

  function updateVideo(id: string, caption: string) {
    setVideos((current) => current.map((item) => item.id === id ? { ...item, caption } : item));
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
    setMediaError("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!prototypeConfirmed) return;
    setCreated(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const linkBase = `name=${encodeURIComponent(recipient)}&duration=${journeyDays}&from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}&format=${format}&time=${encodeURIComponent(arrivalTime)}`;
  const recipientLink = `/receive/demo?${linkBase}&day=1`;
  const arrivalLink = `/receive/demo?${linkBase}&day=${journeyDays}`;
  const publicShareUrl = `https://intezaar.vercel.app${recipientLink}`;

  async function copyShareLink() {
    await navigator.clipboard?.writeText(publicShareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function shareLetter() {
    if (navigator.share) {
      await navigator.share({ title: `A letter for ${recipient}`, text: "A private Intezaar letter is on its way.", url: publicShareUrl });
      return;
    }
    await copyShareLink();
  }

  const preview = (
    <LiveLetterPreview format={format} sender={sender} recipient={recipient} occasion={occasion} heading={heading} letter={letter} closing={closing} photos={photos} voices={voices} videos={videos} />
  );

  return (
    <main className="nostalgia-create creation-flow-v2">
      <Navigation />
      <section className="nostalgia-create-layout">
        <aside className="nostalgia-create-photo">
          <div className="postal-create-scene" aria-hidden="true">
            <div className="postal-create-rain" /><div className="postal-create-train" /><div className="postal-create-platform" />
            <div className="postal-create-box"><span className="postal-create-box-title"><small>डाक</small>INTEZAAR MAIL</span><span className="postal-create-box-slot">LETTERS</span><span className="postal-create-box-wave"><i /><i /><i /></span><span className="postal-create-box-time">NEXT COLLECTION<b>17:00</b></span></div>
            <div className="postal-create-letters"><span className="postal-create-envelope" /><span className="postal-create-envelope" /><span className="postal-create-envelope" /><span className="postal-create-wax">I</span></div>
          </div>
          <div className="postal-create-copy">
            <p className="nostalgia-eyebrow">One letter. A complete journey.</p>
            <h1>Write first. Decide the rest afterwards.</h1>
            <p>The next steps are always visible: personalise it, choose the journey, set its arrival, complete payment and share the private link.</p>
          </div>
        </aside>

        <div className="nostalgia-create-form-wrap creation-main">
          <nav className="creation-stepper" aria-label="Letter creation progress">
            {progressCopy.map((label, index) => {
              const number = index + 1;
              return (
                <button key={label} type="button" className={currentStep === number ? "active" : currentStep > number ? "complete" : ""} disabled={number > currentStep || created} onClick={() => !created && number < currentStep && setStep(number)}>
                  <span>{currentStep > number ? "✓" : number}</span><small>{label}</small>
                </button>
              );
            })}
          </nav>

          {!created ? (
            <form className="nostalgia-form creation-form" onSubmit={submit}>
              {step === 1 ? (
                <section className="nostalgia-form-section creation-panel creation-write-panel">
                  <header className="creation-section-head"><div><span>Step 1 of 5</span><h2>Write the letter</h2><p>No style decision yet. Begin with the person and what you need to say.</p></div><small>Draft saves on this device</small></header>

                  <div className="nostalgia-form-grid">
                    <label>From<input value={sender} onChange={(event) => setSender(event.target.value)} placeholder="Your name" autoComplete="name" /></label>
                    <label>To<input value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="Their name" required /></label>
                  </div>
                  <div className="nostalgia-form-grid">
                    <label>Occasion<select value={occasion} onChange={(event) => setOccasion(event.target.value)}>{occasions.map((item) => <option key={item}>{item}</option>)}</select></label>
                    <label>Opening<input value={heading} onChange={(event) => setHeading(event.target.value)} placeholder={`Dear ${recipient || "you"},`} /></label>
                  </div>

                  <div className="writing-help">
                    <strong>Need a starting line?</strong>
                    <div>{writingStarters.map((starter) => <button key={starter.label} type="button" onClick={() => insertStarter(starter.text)}>{starter.label}</button>)}</div>
                  </div>

                  <label>Your letter
                    <textarea value={letter} onChange={(event) => setLetter(event.target.value)} rows={15} maxLength={MAX_LETTER_CHARS} placeholder="Write what you want them to receive. It can be simple, imperfect and completely yours…" required />
                  </label>
                  <div className="writing-counter"><span>{wordCount} words</span><span>{letter.length.toLocaleString()} / {MAX_LETTER_CHARS.toLocaleString()} characters</span></div>
                  <label>Closing<input value={closing} onChange={(event) => setClosing(event.target.value)} placeholder={sender ? `With love, ${sender}` : "With love,"} /></label>
                  <p className="creation-help-copy">There is no perfect length. A specific honest paragraph is stronger than a long generic message.</p>

                  <div className="nostalgia-form-actions"><button className="nostalgia-button nostalgia-button-primary" type="button" disabled={!canContinue} onClick={() => setStep(2)}>Continue to personalise</button></div>
                </section>
              ) : null}

              {step === 2 ? (
                <section className="nostalgia-form-section creation-panel">
                  <header className="creation-section-head"><div><span>Step 2 of 5</span><h2>Personalise it</h2><p>Your letter is already complete. Style and media are optional.</p></div><small>{mediaCount} of {MAX_MEDIA_ITEMS} media slots used</small></header>

                  <section className="recommended-formats">
                    <h3>Suggested for this letter</h3>
                    <div>{recommendedFormats.map((id) => {
                      const item = formats.find((entry) => entry.id === id)!;
                      return <button key={id} type="button" className={format === id ? "active" : ""} onClick={() => setFormat(id)}><span className={`format-miniature format-miniature-${id}`} aria-hidden="true"><i /><i /></span><strong>{item.name}</strong><small>{item.description}</small></button>;
                    })}</div>
                  </section>

                  <details className="format-library-disclosure">
                    <summary>Browse all 10 letter formats <span>Optional</span></summary>
                    <div className="letter-format-library">
                      {formatCategories.map((category) => (
                        <section className="letter-format-group" key={category}>
                          <header><strong>{category}</strong><span>{formats.filter((item) => item.category === category).length} formats</span></header>
                          <div className="letter-format-grid">
                            {formats.filter((item) => item.category === category).map((item) => (
                              <button key={item.id} type="button" className={format === item.id ? "active" : ""} onClick={() => setFormat(item.id)} aria-pressed={format === item.id}>
                                <span className={`format-miniature format-miniature-${item.id}`} aria-hidden="true"><i /><i /></span><strong>{item.name}</strong><small>{item.description}</small>
                              </button>
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>
                  </details>

                  <div className="creation-personalise-layout">
                    <div className="compact-media-studio">
                      <header><h3>Optional media</h3><p>Add up to three total items. One video counts as one item.</p></header>
                      <div className="media-choice-row">
                        <label className={mediaSlotsLeft ? "" : "disabled"}>＋ Photo<input type="file" accept="image/*" multiple disabled={!mediaSlotsLeft} onChange={addPhotos} /></label>
                        <label className={mediaSlotsLeft ? "" : "disabled"}>＋ Voice<input type="file" accept="audio/*" multiple disabled={!mediaSlotsLeft} onChange={addVoices} /></label>
                        <label className={mediaSlotsLeft && !videos.length ? "" : "disabled"}>＋ Video<input type="file" accept="video/mp4,video/webm,video/quicktime" disabled={!mediaSlotsLeft || Boolean(videos.length)} onChange={addVideo} /></label>
                      </div>
                      {mediaError ? <p className="media-error" role="alert">{mediaError}</p> : null}

                      <div className="media-item-list compact-media-list">
                        {photos.map((photo, index) => (
                          <article className="media-item" key={photo.id}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}<img src={photo.url} alt="" />
                            <div><strong>Photo {index + 1}</strong><input value={photo.caption} onChange={(event) => updatePhoto(photo.id, event.target.value)} placeholder="Editable caption" /></div>
                            <button type="button" onClick={() => removeMedia("photo", photo.id)}>Remove</button>
                          </article>
                        ))}
                        {voices.map((voice, index) => (
                          <article className="media-item media-item-audio" key={voice.id}><span className="media-audio-icon">▶</span><div><strong>Voice note {index + 1}</strong><input value={voice.label} onChange={(event) => updateVoice(voice.id, event.target.value)} placeholder="Editable title" /><audio controls src={voice.url} preload="metadata" /></div><button type="button" onClick={() => removeMedia("voice", voice.id)}>Remove</button></article>
                        ))}
                        {videos.map((video) => (
                          <article className="media-item media-item-video" key={video.id}><video controls playsInline preload="metadata" src={video.url} /><div><strong>Video · {formatFileSize(video.size)}</strong><input value={video.caption} onChange={(event) => updateVideo(video.id, event.target.value)} placeholder="Editable caption" /></div><button type="button" onClick={() => removeMedia("video", video.id)}>Remove</button></article>
                        ))}
                      </div>
                      <p className="media-privacy-note">Files stay in this browser session in the prototype. Text edits are saved locally; media is not.</p>
                    </div>

                    <details className="creation-preview-disclosure" open>
                      <summary>Preview what they will open</summary>
                      {preview}
                    </details>
                  </div>

                  <div className="nostalgia-form-actions"><button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => setStep(1)}>Back to writing</button><button className="nostalgia-button nostalgia-button-primary" type="button" onClick={() => setStep(3)}>Choose the journey</button></div>
                </section>
              ) : null}

              {step === 3 ? (
                <section className="nostalgia-form-section creation-panel">
                  <header className="creation-section-head"><div><span>Step 3 of 5</span><h2>Choose the postal journey</h2><p>Short enough to understand. Long enough to make the arrival matter.</p></div></header>

                  <div className="journey-duration-cards" role="group" aria-label="Journey length">
                    {[3, 5, 7].map((count) => <button key={count} type="button" className={journeyDays === count ? "active" : ""} onClick={() => setJourneyDays(count)}><strong>{count} days</strong><span>{count === 3 ? "A short wait" : count === 5 ? "The balanced journey" : "A slower arrival"}</span></button>)}
                  </div>
                  <div className="nostalgia-form-grid">
                    <label>Posted from<input value={fromCity} onChange={(event) => setFromCity(event.target.value)} placeholder="Delhi" /></label>
                    <label>Arriving in<input value={toCity} onChange={(event) => setToCity(event.target.value)} placeholder="Kochi" /></label>
                  </div>
                  <div className="journey-summary-card"><span>Intezaar Mail</span><strong>{fromCity || "Origin"} → {toCity || "Destination"}</strong><p>The sealed letter will show simple station progress for {journeyDays} days. The route is cinematic—not live railway or postal tracking.</p></div>

                  <div className="nostalgia-form-actions"><button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => setStep(2)}>Back to personalise</button><button className="nostalgia-button nostalgia-button-primary" type="button" onClick={() => setStep(4)}>Set arrival and payment</button></div>
                </section>
              ) : null}

              {step === 4 ? (
                <section className="nostalgia-form-section creation-panel">
                  <header className="creation-section-head"><div><span>Step 4 of 5</span><h2>Arrival and payment</h2><p>Choose when it can be opened, review everything, then continue to the private link.</p></div></header>

                  <div className="arrival-payment-grid">
                    <section className="arrival-card">
                      <span>Arrival</span><h3>After {journeyDays} days</h3>
                      <label>Opening time<input type="time" value={arrivalTime} onChange={(event) => setArrivalTime(event.target.value)} /></label>
                      <label>Time basis<select value={arrivalZone} onChange={(event) => setArrivalZone(event.target.value)}><option>Recipient local time</option><option>Sender local time</option><option>India Standard Time</option></select></label>
                      <p>The recipient sees the sealed letter and route before this time. They do not need to return every day.</p>
                    </section>

                    <section className="prototype-checkout">
                      <div><span>Payment</span><strong>Prototype checkout</strong></div>
                      <p>No card details are requested and no payment is taken in this build. A secure payment provider will be connected before public launch.</p>
                      <dl><div><dt>Product</dt><dd>{formatName(format)}</dd></div><div><dt>Journey</dt><dd>{journeyDays} days</dd></div><div><dt>Media</dt><dd>{mediaCount} optional items</dd></div><div><dt>Arrival</dt><dd>{arrivalTime} · {arrivalZone}</dd></div></dl>
                      <label className="prototype-confirm"><input type="checkbox" checked={prototypeConfirmed} onChange={(event) => setPrototypeConfirmed(event.target.checked)} /><span>I understand this creates a demonstration link and does not take payment or securely transfer my uploaded files.</span></label>
                    </section>
                  </div>

                  <div className="final-review-strip"><div><small>From</small><strong>{sender}</strong></div><div><small>For</small><strong>{recipient}</strong></div><div><small>Route</small><strong>{fromCity} → {toCity}</strong></div><div><small>Arrival</small><strong>{journeyDays} days · {arrivalTime}</strong></div></div>

                  <div className="nostalgia-form-actions"><button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => setStep(3)}>Back to journey</button><button className="nostalgia-button nostalgia-button-primary" type="submit" disabled={!prototypeConfirmed}>Create demonstration link</button></div>
                </section>
              ) : null}
            </form>
          ) : (
            <section className="nostalgia-create-success creation-share-panel">
              <p className="nostalgia-eyebrow">Step 5 of 5 · Share</p>
              <h2>Your letter link is ready.</h2>
              <p>Send this link to {recipient}. In the production version it will carry the encrypted letter and uploaded media. This prototype link opens the sample recipient journey.</p>

              <div className="share-link-box"><span>Private recipient link</span><code>{publicShareUrl}</code><button type="button" onClick={copyShareLink}>{copied ? "Copied" : "Copy link"}</button></div>
              <div className="share-summary"><span>{formatName(format)}</span><strong>{fromCity} → {toCity} · {journeyDays} days · opens at {arrivalTime}</strong><p>{mediaCount} optional media item{mediaCount === 1 ? "" : "s"}</p></div>
              <div className="nostalgia-success-actions"><button className="nostalgia-button nostalgia-button-primary" type="button" onClick={shareLetter}>Share letter link</button><Link href={recipientLink} className="nostalgia-button nostalgia-button-ghost">Preview recipient journey</Link><Link href={arrivalLink} className="nostalgia-button nostalgia-button-ghost">Preview arrival</Link><button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => { setCreated(false); setPrototypeConfirmed(false); setStep(1); }}>Edit the letter</button></div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
