"use client";

import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";

const occasions = ["Just because", "Birthday", "Anniversary", "Farewell", "Apology", "Wedding", "Celebration"];

type LetterFormat = "classic" | "postcard" | "folded" | "airmail";
type PhotoItem = { id: string; name: string; url: string; caption: string };
type VoiceItem = { id: string; name: string; url: string; label: string };

const formats: Array<{
  id: LetterFormat;
  name: string;
  description: string;
  photoLimit: number;
  voiceLimit: number;
}> = [
  { id: "classic", name: "Classic letter", description: "A full handwritten-style page for longer words.", photoLimit: 2, voiceLimit: 2 },
  { id: "postcard", name: "Postcard", description: "One strong photograph with a shorter message beside it.", photoLimit: 1, voiceLimit: 1 },
  { id: "folded", name: "Folded card", description: "A cover, an inside message and space for a small photo set.", photoLimit: 3, voiceLimit: 1 },
  { id: "airmail", name: "Airmail letter", description: "A lighter postal sheet with route marks and compact media.", photoLimit: 2, voiceLimit: 1 },
];

function formatName(format: LetterFormat) {
  return formats.find((item) => item.id === format)?.name ?? "Classic letter";
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
}) {
  const message = letter.trim() || "Your letter will appear here as you write.";

  return (
    <article className={`letter-live-preview letter-format-${format}`} aria-label={`${formatName(format)} live preview`}>
      <div className="letter-preview-toolbar">
        <span>Live preview</span>
        <strong>{formatName(format)}</strong>
      </div>

      {format === "folded" ? (
        <div className="folded-cover">
          <small>{occasion}</small>
          <h3>{heading.trim() || `For ${recipient || "someone special"}`}</h3>
          <span>Open the card →</span>
        </div>
      ) : null}

      <div className="letter-preview-paper">
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

        <div className="letter-preview-copy">
          <small>{occasion}</small>
          <h3>{heading.trim() || `Dear ${recipient || "you"},`}</h3>
          <p>{message}</p>
          <em>{closing.trim() || (sender ? `With love, ${sender}` : "Your closing")}</em>
        </div>

        {format !== "postcard" && photos.length ? (
          <div className={`letter-preview-photos photo-count-${Math.min(photos.length, 3)}`}>
            {photos.map((photo) => (
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

        <footer>
          <span>{format === "airmail" ? "BY AIR MAIL" : format === "postcard" ? "POST CARD" : "PRIVATE LETTER"}</span>
          <span>{photos.length} photo{photos.length === 1 ? "" : "s"} · {voices.length} voice note{voices.length === 1 ? "" : "s"}</span>
        </footer>
      </div>
    </article>
  );
}

export default function CreatePage() {
  const [step, setStep] = useState(1);
  const [created, setCreated] = useState(false);
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
  const [fromCity, setFromCity] = useState("Delhi");
  const [toCity, setToCity] = useState("Kochi");
  const objectUrls = useRef(new Set<string>());

  const selectedFormat = formats.find((item) => item.id === format) ?? formats[0];
  const canContinue = sender.trim().length > 0 && recipient.trim().length > 0 && letter.trim().length > 0;
  const mediaCount = photos.length + voices.length;

  const progressCopy = useMemo(() => [
    "Format & words",
    "Photos & voice",
    "Postal journey",
    "Review & seal",
  ], []);

  function selectFormat(nextFormat: LetterFormat) {
    const next = formats.find((item) => item.id === nextFormat) ?? formats[0];
    photos.slice(next.photoLimit).forEach((item) => {
      URL.revokeObjectURL(item.url);
      objectUrls.current.delete(item.url);
    });
    voices.slice(next.voiceLimit).forEach((item) => {
      URL.revokeObjectURL(item.url);
      objectUrls.current.delete(item.url);
    });
    setPhotos((current) => current.slice(0, next.photoLimit));
    setVoices((current) => current.slice(0, next.voiceLimit));
    setFormat(nextFormat);
  }

  function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const available = Math.max(0, selectedFormat.photoLimit - photos.length);
    const added = files.slice(0, available).map((file) => {
      const url = URL.createObjectURL(file);
      objectUrls.current.add(url);
      return { id: crypto.randomUUID(), name: file.name, url, caption: "" };
    });
    setPhotos((current) => [...current, ...added]);
    event.target.value = "";
  }

  function addVoices(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const available = Math.max(0, selectedFormat.voiceLimit - voices.length);
    const added = files.slice(0, available).map((file) => {
      const url = URL.createObjectURL(file);
      objectUrls.current.add(url);
      return { id: crypto.randomUUID(), name: file.name, url, label: "" };
    });
    setVoices((current) => [...current, ...added]);
    event.target.value = "";
  }

  function updatePhoto(id: string, caption: string) {
    setPhotos((current) => current.map((item) => item.id === id ? { ...item, caption } : item));
  }

  function updateVoice(id: string, label: string) {
    setVoices((current) => current.map((item) => item.id === id ? { ...item, label } : item));
  }

  function removePhoto(id: string) {
    setPhotos((current) => {
      const target = current.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
        objectUrls.current.delete(target.url);
      }
      return current.filter((item) => item.id !== id);
    });
  }

  function removeVoice(id: string) {
    setVoices((current) => {
      const target = current.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
        objectUrls.current.delete(target.url);
      }
      return current.filter((item) => item.id !== id);
    });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreated(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const linkBase = `name=${encodeURIComponent(recipient)}&duration=${journeyDays}&from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}&format=${format}`;
  const recipientLink = `/receive/demo?${linkBase}&day=1`;
  const arrivalLink = `/receive/demo?${linkBase}&day=${journeyDays}`;

  const preview = (
    <LiveLetterPreview
      format={format}
      sender={sender}
      recipient={recipient}
      occasion={occasion}
      heading={heading}
      letter={letter}
      closing={closing}
      photos={photos}
      voices={voices}
    />
  );

  return (
    <main className="nostalgia-create">
      <Navigation />
      <section className="nostalgia-create-layout">
        <aside className="nostalgia-create-photo">
          <div className="postal-create-scene" aria-hidden="true">
            <div className="postal-create-rain" />
            <div className="postal-create-train" />
            <div className="postal-create-platform" />
            <div className="postal-create-box">
              <span className="postal-create-box-title"><small>डाक</small>INTEZAAR MAIL</span>
              <span className="postal-create-box-slot">LETTERS</span>
              <span className="postal-create-box-wave"><i /><i /><i /></span>
              <span className="postal-create-box-time">NEXT COLLECTION<b>17:00</b></span>
            </div>
            <div className="postal-create-letters">
              <span className="postal-create-envelope" />
              <span className="postal-create-envelope" />
              <span className="postal-create-envelope" />
              <span className="postal-create-wax">I</span>
            </div>
          </div>

          <div className="postal-create-copy">
            <p className="nostalgia-eyebrow">Create it your way</p>
            <h1>Choose the form your words should take.</h1>
            <p>
              Write a classic letter, make a postcard, open a folded card or send it as airmail. Every word, photograph, caption and voice note stays editable.
            </p>
          </div>
        </aside>

        <div className="nostalgia-create-form-wrap letter-studio-wrap">
          {!created ? (
            <form className="nostalgia-form letter-studio-form" onSubmit={submit}>
              <nav className="letter-stepper" aria-label="Letter creation progress">
                {progressCopy.map((label, index) => {
                  const number = index + 1;
                  return (
                    <button key={label} type="button" className={step === number ? "active" : step > number ? "complete" : ""} onClick={() => number <= step && setStep(number)} disabled={number > step}>
                      <span>{number}</span><small>{label}</small>
                    </button>
                  );
                })}
              </nav>

              {step === 1 ? (
                <section className="nostalgia-form-section letter-editor-section">
                  <div className="nostalgia-form-heading"><span>01</span><div><h2>Choose a format and write</h2><p>Start with the shape of the letter. You can change it later without losing your words.</p></div></div>

                  <div className="letter-format-grid" role="group" aria-label="Choose a letter format">
                    {formats.map((item) => (
                      <button key={item.id} type="button" className={format === item.id ? "active" : ""} onClick={() => selectFormat(item.id)} aria-pressed={format === item.id}>
                        <span className={`format-miniature format-miniature-${item.id}`} aria-hidden="true"><i /><i /></span>
                        <strong>{item.name}</strong>
                        <small>{item.description}</small>
                      </button>
                    ))}
                  </div>

                  <div className="letter-editor-layout">
                    <div className="letter-editor-fields">
                      <div className="nostalgia-form-grid">
                        <label>From<input value={sender} onChange={(event) => setSender(event.target.value)} placeholder="Arjun" autoComplete="name" /></label>
                        <label>To<input value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="Ananya" required /></label>
                      </div>
                      <div className="nostalgia-form-grid">
                        <label>Occasion
                          <select value={occasion} onChange={(event) => setOccasion(event.target.value)}>
                            {occasions.map((item) => <option key={item}>{item}</option>)}
                          </select>
                        </label>
                        <label>Heading<input value={heading} onChange={(event) => setHeading(event.target.value)} placeholder={`Dear ${recipient || "you"},`} /></label>
                      </div>
                      <label>Your letter
                        <textarea value={letter} onChange={(event) => setLetter(event.target.value)} rows={12} placeholder="Write what you want them to receive…" required />
                      </label>
                      <label>Closing<input value={closing} onChange={(event) => setClosing(event.target.value)} placeholder={sender ? `With love, ${sender}` : "With love,"} /></label>
                    </div>
                    {preview}
                  </div>

                  <div className="nostalgia-form-actions">
                    <button className="nostalgia-button nostalgia-button-primary" type="button" disabled={!canContinue} onClick={() => setStep(2)}>Add photos and voice</button>
                  </div>
                </section>
              ) : null}

              {step === 2 ? (
                <section className="nostalgia-form-section letter-editor-section">
                  <div className="nostalgia-form-heading"><span>02</span><div><h2>Place photos and voice inside</h2><p>These become part of the chosen letter design. Add captions, rename voice notes, remove them or change the format at any time.</p></div></div>

                  <div className="letter-editor-layout">
                    <div className="letter-editor-fields media-editor-fields">
                      <section className="media-upload-panel">
                        <header><div><span>Photographs</span><strong>{photos.length} of {selectedFormat.photoLimit}</strong></div><p>{format === "postcard" ? "The photograph becomes the postcard image." : "Photos are arranged inside the letter automatically."}</p></header>
                        {photos.length < selectedFormat.photoLimit ? (
                          <label className="media-dropzone">＋ Add your photos<input type="file" accept="image/*" multiple onChange={addPhotos} /></label>
                        ) : null}
                        <div className="media-item-list">
                          {photos.map((photo, index) => (
                            <article className="media-item" key={photo.id}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={photo.url} alt="" />
                              <div><strong>Photo {index + 1}</strong><input value={photo.caption} onChange={(event) => updatePhoto(photo.id, event.target.value)} placeholder="Add an editable caption" /></div>
                              <button type="button" onClick={() => removePhoto(photo.id)} aria-label={`Remove ${photo.name}`}>Remove</button>
                            </article>
                          ))}
                        </div>
                      </section>

                      <section className="media-upload-panel">
                        <header><div><span>Voice notes</span><strong>{voices.length} of {selectedFormat.voiceLimit}</strong></div><p>Record on your phone first, then add the audio file here.</p></header>
                        {voices.length < selectedFormat.voiceLimit ? (
                          <label className="media-dropzone">＋ Add a voice note<input type="file" accept="audio/*" multiple onChange={addVoices} /></label>
                        ) : null}
                        <div className="media-item-list">
                          {voices.map((voice, index) => (
                            <article className="media-item media-item-audio" key={voice.id}>
                              <span className="media-audio-icon">▶</span>
                              <div><strong>Voice note {index + 1}</strong><input value={voice.label} onChange={(event) => updateVoice(voice.id, event.target.value)} placeholder="Give this recording a title" /><audio controls src={voice.url} preload="metadata" /></div>
                              <button type="button" onClick={() => removeVoice(voice.id)} aria-label={`Remove ${voice.name}`}>Remove</button>
                            </article>
                          ))}
                        </div>
                      </section>

                      {!mediaCount ? <p className="nostalgia-form-note">Photos and voice are optional. The letter remains complete without them.</p> : null}
                    </div>
                    {preview}
                  </div>

                  <div className="nostalgia-form-actions">
                    <button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => setStep(1)}>Back to words</button>
                    <button className="nostalgia-button nostalgia-button-primary" type="button" onClick={() => setStep(3)}>{mediaCount ? `Continue with ${mediaCount} media item${mediaCount === 1 ? "" : "s"}` : "Continue without media"}</button>
                  </div>
                </section>
              ) : null}

              {step === 3 ? (
                <section className="nostalgia-form-section">
                  <div className="nostalgia-form-heading"><span>03</span><div><h2>Choose the postal journey</h2><p>The design is ready. Now decide how long the sealed letter should take to arrive.</p></div></div>
                  <label>How many days should the letter travel?</label>
                  <div className="nostalgia-length-options" role="group" aria-label="Journey length">
                    {[3, 5, 7].map((count) => (
                      <button key={count} type="button" className={journeyDays === count ? "active" : ""} onClick={() => setJourneyDays(count)}>{count} days</button>
                    ))}
                  </div>
                  <div className="nostalgia-form-grid" style={{ marginTop: 24 }}>
                    <label>Posted from<input value={fromCity} onChange={(event) => setFromCity(event.target.value)} placeholder="Delhi" /></label>
                    <label>Arriving in<input value={toCity} onChange={(event) => setToCity(event.target.value)} placeholder="Kochi" /></label>
                  </div>
                  <p className="nostalgia-form-note">The route is a cinematic Indian mail interpretation, not physical postage or live GPS tracking.</p>
                  <div className="nostalgia-form-actions">
                    <button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => setStep(2)}>Back to media</button>
                    <button className="nostalgia-button nostalgia-button-primary" type="button" onClick={() => setStep(4)}>Review everything</button>
                  </div>
                </section>
              ) : null}

              {step === 4 ? (
                <section className="nostalgia-form-section letter-review-section">
                  <div className="nostalgia-form-heading"><span>04</span><div><h2>Review and seal</h2><p>Nothing is locked yet. Return to any completed step to edit the format, words, captions, photographs, voice notes or route.</p></div></div>
                  <div className="letter-review-grid">
                    {preview}
                    <div className="letter-review-summary">
                      <div className="nostalgia-success-ticket"><span>{formatName(format)}</span><strong>{fromCity || "Delhi"} → {toCity || "Kochi"} · {journeyDays} days</strong></div>
                      <dl>
                        <div><dt>From</dt><dd>{sender}</dd></div>
                        <div><dt>For</dt><dd>{recipient}</dd></div>
                        <div><dt>Occasion</dt><dd>{occasion}</dd></div>
                        <div><dt>Photos</dt><dd>{photos.length}</dd></div>
                        <div><dt>Voice notes</dt><dd>{voices.length}</dd></div>
                      </dl>
                      <div className="quick-edit-buttons">
                        <button type="button" onClick={() => setStep(1)}>Edit format & words</button>
                        <button type="button" onClick={() => setStep(2)}>Edit photos & voice</button>
                        <button type="button" onClick={() => setStep(3)}>Edit journey</button>
                      </div>
                      <p className="nostalgia-form-note">Prototype only: selected media is previewed locally in this browser and is not yet uploaded or transferred to the recipient link.</p>
                    </div>
                  </div>
                  <div className="nostalgia-form-actions">
                    <button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => setStep(3)}>Back</button>
                    <button className="nostalgia-button nostalgia-button-primary" type="submit">Seal letter and create demo link</button>
                  </div>
                </section>
              ) : null}
            </form>
          ) : (
            <section className="nostalgia-create-success">
              <p className="nostalgia-eyebrow">The private preview is ready</p>
              <h2>Your {formatName(format).toLowerCase()} is prepared for {recipient}.</h2>
              <p>Its format, words and local media preview remain editable from this creator. Secure media storage and recipient transfer will be connected in the production backend.</p>
              <div className="nostalgia-success-ticket"><span>Intezaar mail · {fromCity} to {toCity}</span><strong>{journeyDays}-day journey · {photos.length} photos · {voices.length} voice notes</strong></div>
              <div className="nostalgia-success-actions">
                <Link href={recipientLink} className="nostalgia-button nostalgia-button-primary">Open recipient journey</Link>
                <Link href={arrivalLink} className="nostalgia-button nostalgia-button-ghost">Preview arrival day</Link>
                <button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => { setCreated(false); setStep(1); }}>Edit the letter</button>
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
