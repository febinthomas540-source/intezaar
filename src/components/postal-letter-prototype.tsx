"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./postal-letter-prototype.module.css";

export type RecipientLetterFormat =
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

type RecipientPhoto = { src: string; caption?: string; alt?: string };
type RecipientVoice = { src: string; title: string };
type RecipientVideo = { src: string; caption?: string; poster?: string };

type Props = {
  recipient: string;
  sender?: string;
  occasion?: string;
  format?: RecipientLetterFormat;
  openingTime?: string;
  previewDay?: number;
  duration?: number;
  fromCity?: string;
  toCity?: string;
  heading?: string;
  message?: string;
  closing?: string;
  photos?: RecipientPhoto[];
  voices?: RecipientVoice[];
  videos?: RecipientVideo[];
  demoMode?: boolean;
};

type JourneyStop = {
  place: string;
  label: string;
  detail: string;
};

const formatNames: Record<RecipientLetterFormat, string> = {
  classic: "Classic letter",
  postcard: "Postcard",
  folded: "Folded card",
  airmail: "Airmail letter",
  inland: "Inland letter",
  telegram: "Digital telegram",
  photo: "Photo letter",
  festival: "Celebration card",
  typewriter: "Typewritten letter",
  minimal: "Minimal letter",
};

function safeDuration(value: number | undefined) {
  return value === 3 || value === 7 ? value : 5;
}

function readableTime(value: string) {
  const [hourString, minute = "00"] = value.split(":");
  const hour = Number(hourString);
  if (!Number.isFinite(hour)) return value;
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute} ${suffix}`;
}

function makeStops(duration: number, fromCity: string, toCity: string): JourneyStop[] {
  const fiveDay: JourneyStop[] = [
    { place: fromCity, label: "Posted", detail: "The sealed letter has entered the Intezaar mail route." },
    { place: "Mathura Junction", label: "Sorted for the night mail", detail: "It has left the first sorting office and is moving by rail." },
    { place: "Mumbai Central Mail", label: "Halfway there", detail: "New postal marks have been added. The envelope remains sealed." },
    { place: "Konkan route", label: "Arriving tomorrow", detail: "The night mail is moving through rain towards the destination city." },
    { place: toCity, label: "Delivered", detail: "The journey is complete. The wax seal can now be broken." },
  ];

  if (duration === 3) {
    return [
      fiveDay[0],
      { place: "Central India mail exchange", label: "Travelling by rail", detail: "The letter is moving overnight towards its destination." },
      fiveDay[4],
    ];
  }

  if (duration === 7) {
    return [
      fiveDay[0],
      fiveDay[1],
      { place: "Kota Junction", label: "Southbound mail", detail: "A fresh railway mark has been added to the route card." },
      { place: "Vadodara mail exchange", label: "Still travelling", detail: "The letter is safe inside its envelope. Nothing needs to be opened yet." },
      fiveDay[2],
      fiveDay[3],
      fiveDay[4],
    ];
  }

  return fiveDay;
}

function LetterPaper({
  recipient,
  sender,
  occasion,
  format,
  fromCity,
  toCity,
  heading,
  message,
  closing,
  photos,
  voices,
  videos,
  onFold,
}: Required<Pick<Props, "recipient" | "sender" | "occasion" | "format" | "fromCity" | "toCity" | "heading" | "message" | "closing" | "photos" | "voices" | "videos">> & { onFold: () => void }) {
  const paragraphs = message.split(/\n\s*\n/).filter(Boolean);
  const extras = photos.length + voices.length + videos.length;

  return (
    <section className={styles.reader} aria-label={`Opened ${formatNames[format]} for ${recipient}`}>
      <div className={styles.readerToolbar}>
        <div><small>Delivered by Intezaar Mail</small><strong>{formatNames[format]}</strong></div>
        <button type="button" onClick={onFold}>Fold letter</button>
      </div>

      <article className={`${styles.letter} ${styles[`letter_${format}`]}`}>
        {format === "folded" ? (
          <div className={styles.foldedCover}><small>{occasion}</small><strong>For {recipient}</strong><span>Opened with patience</span></div>
        ) : null}

        {format === "festival" ? (
          <div className={styles.festivalBanner}><small>Intezaar celebration mail</small><strong>{occasion}</strong><span>For {recipient}</span></div>
        ) : null}

        {format === "telegram" ? (
          <div className={styles.telegramHeader}><span>तार · TELEGRAM</span><strong>PERSONAL · DELIVERED</strong></div>
        ) : null}

        {format === "inland" ? <div className={styles.inlandFold}><span>Opened along the fold</span></div> : null}

        <header className={styles.letterHeader}>
          <div><small>From</small><strong>{sender}</strong></div>
          <div><small>To</small><strong>{recipient}</strong></div>
          <div className={styles.postmark}>{fromCity.toUpperCase()}<br />BY RAIL<br />{toCity.toUpperCase()}</div>
        </header>

        {format === "photo" && photos[0] ? (
          <figure className={styles.photoCover}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos[0].src} alt={photos[0].alt || photos[0].caption || "Photograph enclosed with the letter"} />
            {photos[0].caption ? <figcaption>{photos[0].caption}</figcaption> : null}
          </figure>
        ) : null}

        {format === "postcard" && photos[0] ? (
          <figure className={styles.postcardPhoto}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos[0].src} alt={photos[0].alt || photos[0].caption || "Postcard photograph"} />
            {photos[0].caption ? <figcaption>{photos[0].caption}</figcaption> : null}
          </figure>
        ) : null}

        <div className={styles.letterCopy}>
          <small>{occasion}</small>
          <h1>{heading}</h1>
          {paragraphs.map((paragraph, index) => <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>)}
          <p className={styles.signoff}>{closing}</p>
        </div>

        {photos.length > (format === "photo" || format === "postcard" ? 1 : 0) ? (
          <div className={styles.photoGallery}>
            {photos.slice(format === "photo" || format === "postcard" ? 1 : 0).map((photo, index) => (
              <figure key={`${photo.src}-${index}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.src} alt={photo.alt || photo.caption || `Photograph ${index + 1}`} />
                {photo.caption ? <figcaption>{photo.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
        ) : null}

        {voices.length ? (
          <section className={styles.mediaSection} aria-label="Voice notes inside the letter">
            <h2>Voice notes</h2>
            {voices.map((voice, index) => (
              <div className={styles.audioCard} key={`${voice.src}-${index}`}>
                <div><span>▶</span><strong>{voice.title}</strong></div>
                <audio controls preload="metadata" src={voice.src} />
              </div>
            ))}
          </section>
        ) : null}

        {videos.length ? (
          <section className={styles.mediaSection} aria-label="Videos inside the letter">
            <h2>Videos</h2>
            {videos.map((video, index) => (
              <figure className={styles.videoCard} key={`${video.src}-${index}`}>
                <video controls playsInline preload="metadata" poster={video.poster} src={video.src} />
                {video.caption ? <figcaption>{video.caption}</figcaption> : null}
              </figure>
            ))}
          </section>
        ) : null}

        <footer className={styles.letterFooter}>
          <span>{extras ? `${extras} personal extra${extras === 1 ? "" : "s"} enclosed` : "Words only"}</span>
          <span>Posted with patience</span>
        </footer>
      </article>

      <div className={styles.keepsakeActions}>
        <button type="button" onClick={() => window.print()}>Save or print keepsake</button>
        <Link href="/create">Write a letter back</Link>
      </div>
    </section>
  );
}

export function PostalLetterPrototype({
  recipient,
  sender = "Someone special",
  occasion = "Just because",
  format = "classic",
  openingTime = "20:00",
  previewDay,
  duration: requestedDuration,
  fromCity = "Delhi",
  toCity = "Kochi",
  heading = `Dear ${recipient},`,
  message = "I could have sent this in a second. I wanted it to take its time, pass through a few stations and arrive as something you would pause to open.\n\nThere are ordinary moments I still carry with me: the conversations that ran late, the plans that changed, and the quiet ways you made difficult days feel lighter. This letter is simply my way of saying that none of it was ordinary to me.",
  closing = `With all the words I kept,\n${sender}`,
  photos = [],
  voices = [],
  videos = [],
  demoMode = false,
}: Props) {
  const duration = safeDuration(requestedDuration);
  const initialDay = Math.min(duration, Math.max(1, Math.floor(previewDay ?? 1)));
  const [currentDay, setCurrentDay] = useState(initialDay);
  const [entered, setEntered] = useState(demoMode);
  const [opened, setOpened] = useState(false);
  const stops = useMemo(() => makeStops(duration, fromCity, toCity), [duration, fromCity, toCity]);
  const currentStop = stops[currentDay - 1];
  const arrived = currentDay >= duration;
  const progress = ((currentDay - 1) / (duration - 1)) * 100;
  const daysLeft = Math.max(0, duration - currentDay);
  const storageKey = `intezaar:received:${recipient}:${fromCity}:${toCity}`;

  useEffect(() => {
    if (demoMode) return;
    try {
      if (window.sessionStorage.getItem(storageKey) === "yes") setEntered(true);
    } catch {
      // The experience still works when browser storage is unavailable.
    }
  }, [demoMode, storageKey]);

  function receiveLetter() {
    setEntered(true);
    try {
      window.sessionStorage.setItem(storageKey, "yes");
    } catch {
      // No persistence is required for the core experience.
    }
  }

  function chooseDay(day: number) {
    setCurrentDay(day);
    setOpened(false);
  }

  if (!entered) {
    return (
      <main className={styles.shell}>
        <header className={styles.header}>
          <Link href="/" className={styles.brand}>Intezaar</Link>
          <span>Private digital mail</span>
        </header>

        <section className={styles.invitation}>
          <div className={styles.invitationRain} aria-hidden="true" />
          <div className={styles.invitationCopy}>
            <p>Private mail for {recipient}</p>
            <h1>A letter has been posted for you.</h1>
            <span>
              {sender === "Someone special" ? "Someone chose not to send these words instantly." : `${sender} chose not to send these words instantly.`}
              {` The sealed letter will travel from ${fromCity} to ${toCity} for ${duration} days.`}
            </span>
            <dl>
              <div><dt>Journey</dt><dd>{duration} days</dd></div>
              <div><dt>Opens</dt><dd>{readableTime(openingTime)} on arrival</dd></div>
              <div><dt>Format</dt><dd>{formatNames[format]}</dd></div>
            </dl>
            <button type="button" onClick={receiveLetter}>Receive the letter</button>
            <small>This private link reveals only the delivery experience until the chosen arrival.</small>
          </div>

          <div className={styles.invitationEnvelope} aria-hidden="true">
            <div className={styles.invitationPostmark}>{fromCity.toUpperCase()} GPO<br />BY RAIL</div>
            <span className={styles.invitationFlap} />
            <strong>For {recipient}</strong>
            <i>I</i>
            <em>SEALED</em>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>Intezaar</Link>
        <span>Private digital mail for {recipient}</span>
      </header>

      {opened ? (
        <LetterPaper
          recipient={recipient}
          sender={sender}
          occasion={occasion}
          format={format}
          fromCity={fromCity}
          toCity={toCity}
          heading={heading}
          message={message}
          closing={closing}
          photos={photos}
          voices={voices}
          videos={videos}
          onFold={() => setOpened(false)}
        />
      ) : (
        <section className={styles.stage}>
          <div className={styles.rain} aria-hidden="true" />
          <div className={styles.paperGrain} aria-hidden="true" />

          <aside className={styles.summary}>
            <p>{arrived ? "Delivered by Intezaar Mail" : "Your sealed letter is moving"}</p>
            <h1>{arrived ? `${recipient}, it has arrived.` : `A letter is on its way to you.`}</h1>
            <span>
              {arrived
                ? `The journey from ${fromCity} is complete. It can now be opened.`
                : `${sender === "Someone special" ? "Someone" : sender} posted this ${formatNames[format].toLowerCase()} from ${fromCity}. It remains sealed until it reaches ${toCity}.`}
            </span>

            <div className={styles.routeFacts}>
              <div><small>From</small><strong>{fromCity}</strong></div>
              <div><small>To</small><strong>{toCity}</strong></div>
              <div><small>Opens</small><strong>{readableTime(openingTime)}</strong></div>
            </div>

            {!arrived ? (
              <div className={styles.noPressure}><strong>No daily check-in needed.</strong><span>The journey continues even when you close this page.</span></div>
            ) : null}
            <p className={styles.disclaimer}>Cinematic postal route only—not physical postage or live railway tracking.</p>
          </aside>

          <div className={styles.mailCard}>
            <div className={styles.cardHeader}>
              <span>{formatNames[format]} · Private</span>
              <b>{arrived ? "DELIVERED" : `DAY ${currentDay} / ${duration}`}</b>
            </div>

            <div className={styles.postmarks} aria-hidden="true">
              <span>{fromCity.toUpperCase()} GPO</span>
              <span>RAIL MAIL</span>
              <span>{arrived ? "ARRIVED" : "IN TRANSIT"}</span>
            </div>

            <div className={styles.route} aria-label={`Letter journey progress: day ${currentDay} of ${duration}`}>
              <div className={styles.routeLine}><i style={{ width: `${progress}%` }} /></div>
              {stops.map((stop, index) => (
                <span
                  key={`${stop.place}-${index}`}
                  className={`${styles.routeNode} ${index <= currentDay - 1 ? styles.routeNodeComplete : ""}`}
                  style={{ left: `${(index / (duration - 1)) * 100}%` }}
                  title={stop.place}
                />
              ))}
            </div>

            <div className={styles.currentStop}>
              <small>{arrived ? "Final postal update" : "Current postal update"}</small>
              <h2>{currentStop.place}</h2>
              <strong>{currentStop.label}</strong>
              <p>{currentStop.detail}</p>
            </div>

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
              <span className={styles.instruction}>
                {arrived ? "Break the seal" : `Sealed · ${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}
              </span>
            </button>

            {!arrived ? <p className={styles.arrivalNote}>Ready to open at {readableTime(openingTime)} on the final day.</p> : null}

            {demoMode ? (
              <div className={styles.demoControls} aria-label="Preview journey days">
                <span>Demo controls</span>
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
      )}

      {demoMode && !opened ? (
        <section className={styles.explainer}>
          <p>Recipient experience</p>
          <h2>One private link. One sealed letter. One arrival worth opening.</h2>
          <div>
            <article><span>01</span><h3>Receive the mail</h3><p>The recipient immediately understands who the experience is for, how long it travels and when it opens.</p></article>
            <article><span>02</span><h3>Follow without obligation</h3><p>A simple station update makes the wait visible. There are no streaks, chapters or daily tasks.</p></article>
            <article><span>03</span><h3>Open the real format</h3><p>The selected letter design unfolds with its words, photographs, voice notes and videos inside.</p></article>
          </div>
        </section>
      ) : null}
    </main>
  );
}
