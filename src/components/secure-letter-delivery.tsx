"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./secure-letter-delivery.module.css";

type LetterContent = {
  heading: string;
  message: string;
  closing: string;
};

type PhotoLayout = {
  fit: "cover" | "contain";
  zoom: number;
  cropX: number;
  cropY: number;
  x: number;
  y: number;
  width: number;
  aspectRatio: number;
  zIndex: number;
};

type DeliveredMedia = {
  id: string;
  kind: "photo" | "voice" | "video";
  path: string;
  name: string;
  mimeType: string;
  size: number;
  caption: string;
  iv: string;
  photoLayout?: PhotoLayout;
  signedUrl: string;
};

type OpenedMedia = DeliveredMedia & {
  objectUrl: string;
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
  mediaKey: string;
  media: DeliveredMedia[];
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

function bytesFromBase64(value: string) {
  const binary = window.atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function mediaSize(bytes: number) {
  if (bytes < 1_048_576) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
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
  mediaKey,
  media,
}: Props) {
  const storageKey = useMemo(
    () => `intezaar:received:${recipient}:${opensAt}`,
    [recipient, opensAt],
  );
  const [received, setReceived] = useState(false);
  const [opened, setOpened] = useState(false);
  const [countdown, setCountdown] = useState(() => countdownTo(opensAt));
  const [openedMedia, setOpenedMedia] = useState<OpenedMedia[]>([]);
  const [mediaStatus, setMediaStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

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

  useEffect(() => {
    if (!content || !mediaKey || !media.length) {
      setOpenedMedia([]);
      setMediaStatus("idle");
      return;
    }

    let cancelled = false;
    const objectUrls: string[] = [];
    setMediaStatus("loading");

    const decrypt = async () => {
      try {
        const key = await window.crypto.subtle.importKey(
          "raw",
          bytesFromBase64(mediaKey),
          { name: "AES-GCM" },
          false,
          ["decrypt"],
        );
        const decrypted: OpenedMedia[] = [];

        for (const item of media) {
          const response = await fetch(item.signedUrl, { cache: "no-store" });
          if (!response.ok) throw new Error(`Could not retrieve ${item.name}.`);
          const plaintext = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: bytesFromBase64(item.iv) },
            key,
            await response.arrayBuffer(),
          );
          const objectUrl = URL.createObjectURL(new Blob([plaintext], { type: item.mimeType }));
          objectUrls.push(objectUrl);
          decrypted.push({ ...item, objectUrl });
        }

        if (cancelled) {
          objectUrls.forEach((url) => URL.revokeObjectURL(url));
          return;
        }
        setOpenedMedia(decrypted);
        setMediaStatus("ready");
      } catch (error) {
        console.error("Private media decryption failed:", error);
        if (!cancelled) setMediaStatus("error");
      }
    };

    void decrypt();
    return () => {
      cancelled = true;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [content, media, mediaKey]);

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
              {sender} posted this letter for {recipient}. The message and private media have not been sent to this browser yet.
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

          {media.length ? (
            <section className={styles.privateMedia} aria-label="Private media inside this letter">
              <header>
                <small>SEALED WITH THE LETTER</small>
                <strong>{media.length} private media item{media.length === 1 ? "" : "s"}</strong>
              </header>

              {mediaStatus === "loading" ? <p className={styles.mediaNotice}>Decrypting the private media on this device…</p> : null}
              {mediaStatus === "error" ? <p className={styles.mediaError}>The private media could not be opened. Refresh the page and try again.</p> : null}

              {mediaStatus === "ready" ? (
                <div className={styles.mediaGrid}>
                  {openedMedia.map((item) => (
                    <figure key={item.id} className={`${styles.mediaCard} ${styles[`media_${item.kind}`] || ""}`}>
                      {item.kind === "photo" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.objectUrl}
                          alt={item.caption || item.name}
                          style={{
                            objectFit: item.photoLayout?.fit || "cover",
                            objectPosition: `${item.photoLayout?.cropX || 50}% ${item.photoLayout?.cropY || 50}%`,
                          }}
                        />
                      ) : null}
                      {item.kind === "voice" ? <audio controls preload="metadata" src={item.objectUrl} /> : null}
                      {item.kind === "video" ? <video controls playsInline preload="metadata" src={item.objectUrl} /> : null}
                      <figcaption>
                        <strong>{item.caption || (item.kind === "voice" ? "A voice note" : item.kind === "video" ? "A private video" : "A photograph")}</strong>
                        <small>{mediaSize(item.size)}</small>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ) : null}
            </section>
          ) : null}

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
