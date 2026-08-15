"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { RecipientPhotoLayoutBridge } from "@/components/recipient-photo-layout-bridge";
import {
  decryptE2EEPayload,
  keyBase64FromUrlKey,
  readE2EEKeyFromHash,
  type E2EEEnvelope,
} from "@/lib/letter-e2ee";
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
  name?: string;
  mimeType: string;
  size: number;
  caption?: string;
  iv: string;
  photoLayout?: PhotoLayout;
  signedUrl: string;
};

type OpenedMedia = DeliveredMedia & {
  objectUrl: string;
};

type Props = {
  deliveryToken: string;
  expiresAt: string;
  recipient: string;
  sender: string;
  occasion: string;
  format: string;
  fromCity: string;
  toCity: string;
  opensAt: string;
  status: string;
  content: LetterContent | null;
  e2eePayload: E2EEEnvelope | null;
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

type E2EEStatus = "idle" | "decrypting" | "ready" | "missing-key" | "error";

type RememberedE2EEKey = {
  key: string;
  expiresAt: string;
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

function validUrlKey(value: string) {
  return readE2EEKeyFromHash(`#k=${value}`);
}

function readRememberedE2EEKey(storageKey: string) {
  try {
    const stored = JSON.parse(window.localStorage.getItem(storageKey) || "null") as Partial<RememberedE2EEKey> | null;
    const key = typeof stored?.key === "string" ? validUrlKey(stored.key) : null;
    const expiry = typeof stored?.expiresAt === "string" ? new Date(stored.expiresAt).getTime() : Number.NaN;
    if (!key || !Number.isFinite(expiry) || Date.now() >= expiry) {
      window.localStorage.removeItem(storageKey);
      return null;
    }
    return key;
  } catch {
    return null;
  }
}

function rememberE2EEKey(storageKey: string, key: string, expiresAt: string) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify({ key, expiresAt } satisfies RememberedE2EEKey));
  } catch {
    // The complete URL still works when persistent browser storage is blocked.
  }
}

export function SecureLetterDelivery({
  deliveryToken,
  expiresAt,
  recipient,
  sender,
  occasion,
  format,
  fromCity,
  toCity,
  opensAt,
  status,
  content,
  e2eePayload,
  mediaKey,
  media,
}: Props) {
  const e2eeKeyStorageKey = useMemo(
    () => `intezaar:e2ee-key:v1:${deliveryToken}`,
    [deliveryToken],
  );
  const storageKey = useMemo(
    () => `intezaar:received:${recipient}:${opensAt}`,
    [recipient, opensAt],
  );
  const [received, setReceived] = useState(false);
  const [opened, setOpened] = useState(false);
  const [countdown, setCountdown] = useState(() => countdownTo(opensAt));
  const [e2eeContent, setE2eeContent] = useState<LetterContent | null>(null);
  const [e2eeMedia, setE2eeMedia] = useState<DeliveredMedia[]>([]);
  const [e2eeMediaKey, setE2eeMediaKey] = useState("");
  const [e2eeStatus, setE2eeStatus] = useState<E2EEStatus>(e2eePayload ? "decrypting" : "idle");
  const [keyRevision, setKeyRevision] = useState(0);
  const [recoveryLink, setRecoveryLink] = useState("");
  const [recoveryError, setRecoveryError] = useState("");
  const [recoveryBusy, setRecoveryBusy] = useState(false);
  const [openedMedia, setOpenedMedia] = useState<OpenedMedia[]>([]);
  const [mediaStatus, setMediaStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  const activeContent = content || e2eeContent;
  const activeMedia = e2eePayload ? e2eeMedia : media;
  const activeMediaKey = e2eePayload ? e2eeMediaKey : mediaKey;
  const hasArrivedPayload = Boolean(content || e2eePayload);
  const positionedPhotos = openedMedia
    .filter((item) => item.kind === "photo")
    .map((item) => ({
      id: item.id,
      name: item.name || "Photograph",
      caption: item.caption || "",
      photoLayout: item.photoLayout,
    }));

  useEffect(() => {
    try {
      setReceived(window.sessionStorage.getItem(storageKey) === "yes");
    } catch {
      // Session storage is optional.
    }
  }, [storageKey]);

  useEffect(() => {
    const urlKey = readE2EEKeyFromHash();
    if (urlKey) rememberE2EEKey(e2eeKeyStorageKey, urlKey, expiresAt);
  }, [e2eeKeyStorageKey, expiresAt]);

  useEffect(() => {
    if (!e2eePayload) {
      setE2eeContent(null);
      setE2eeMedia([]);
      setE2eeMediaKey("");
      setE2eeStatus("idle");
      return;
    }

    let cancelled = false;
    setE2eeStatus("decrypting");
    setE2eeContent(null);
    setE2eeMedia([]);
    setE2eeMediaKey("");

    const decrypt = async () => {
      const hashKey = readE2EEKeyFromHash();
      const urlKey = hashKey || readRememberedE2EEKey(e2eeKeyStorageKey);
      if (!urlKey) {
        if (!cancelled) setE2eeStatus("missing-key");
        return;
      }

      try {
        const payload = await decryptE2EEPayload(e2eePayload, urlKey);
        if (cancelled) return;
        rememberE2EEKey(e2eeKeyStorageKey, urlKey, expiresAt);
        const privateById = new Map(payload.media.map((item) => [item.id, item]));
        const mergedMedia = media.map((item) => {
          const privateItem = privateById.get(item.id);
          return {
            ...item,
            name: privateItem?.name || "Private attachment",
            caption: privateItem?.caption || "",
            photoLayout: privateItem?.photoLayout,
          };
        });

        setE2eeContent({
          heading: payload.heading,
          message: payload.message,
          closing: payload.closing,
        });
        setE2eeMedia(mergedMedia);
        setE2eeMediaKey(keyBase64FromUrlKey(urlKey));
        setE2eeStatus("ready");
      } catch (error) {
        console.error("End-to-end letter decryption failed:", error);
        if (!cancelled) setE2eeStatus("error");
      }
    };

    void decrypt();
    return () => {
      cancelled = true;
    };
  }, [e2eeKeyStorageKey, e2eePayload, expiresAt, keyRevision, media]);

  async function recoverFromCompleteLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!e2eePayload || recoveryBusy) return;

    setRecoveryBusy(true);
    setRecoveryError("");
    try {
      const pastedUrl = new URL(recoveryLink.trim(), window.location.origin);
      const expectedPath = `/receive/${deliveryToken}`;
      const urlKey = pastedUrl.pathname === expectedPath
        ? readE2EEKeyFromHash(pastedUrl.hash)
        : null;
      if (!urlKey) {
        throw new Error("Paste the complete private link for this letter, including everything after #k=.");
      }

      // Verify locally before remembering anything. The key and plaintext are
      // never included in this request or sent back to Intezaar.
      await decryptE2EEPayload(e2eePayload, urlKey);
      rememberE2EEKey(e2eeKeyStorageKey, urlKey, expiresAt);

      const currentUrl = new URL(window.location.href);
      currentUrl.hash = `k=${urlKey}`;
      window.history.replaceState(null, "", currentUrl);
      setRecoveryLink("");
      setKeyRevision((revision) => revision + 1);
    } catch (error) {
      setRecoveryError(
        error instanceof Error
          ? error.message
          : "That private link could not unlock this letter.",
      );
    } finally {
      setRecoveryBusy(false);
    }
  }

  useEffect(() => {
    if (hasArrivedPayload || status !== "posted") return;
    const timer = window.setInterval(() => {
      const next = countdownTo(opensAt);
      setCountdown(next);
      if (next.total <= 0) {
        window.clearInterval(timer);
        window.location.reload();
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [hasArrivedPayload, opensAt, status]);

  useEffect(() => {
    if (!activeContent || !activeMediaKey || !activeMedia.length) {
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
          bytesFromBase64(activeMediaKey),
          { name: "AES-GCM" },
          false,
          ["decrypt"],
        );
        const decrypted: OpenedMedia[] = [];

        for (const item of activeMedia) {
          const displayName = item.name || "private attachment";
          const response = await fetch(item.signedUrl, { cache: "no-store" });
          if (!response.ok) throw new Error(`Could not retrieve ${displayName}.`);
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
  }, [activeContent, activeMedia, activeMediaKey]);

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

  if (!activeContent && !e2eePayload) {
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

  if (e2eePayload && !activeContent) {
    const missingKey = e2eeStatus === "missing-key";
    const failed = e2eeStatus === "error";
    return (
      <main className={styles.page}>
        <header className={styles.header}>
          <Link href="/" className={styles.brand}>Intezaar</Link>
          <span>End-to-end encrypted delivery</span>
        </header>
        <section className={styles.arrived}>
          <p>End-to-end encrypted</p>
          <h1>
            {missingKey
              ? "This email opened without the private key."
              : failed
                ? "This encrypted letter could not be opened on this device."
                : "Decrypting your letter on this device…"}
          </h1>
          <span>
            {missingKey
              ? "Email apps can open a different browser from the one that first received the key. Paste the sender's complete private link below to unlock this letter on this browser."
              : failed
                ? "The saved key did not unlock this letter. Paste the complete private link originally shared by the sender to recover securely."
                : "The ciphertext has arrived. Your browser is using the private key from this link; Intezaar does not receive that key."}
          </span>
          {missingKey || failed ? (
            <form className={styles.keyRecovery} onSubmit={recoverFromCompleteLink}>
              <label htmlFor="complete-private-link">Sender&apos;s complete private link</label>
              <input
                id="complete-private-link"
                type="url"
                inputMode="url"
                autoComplete="off"
                value={recoveryLink}
                onChange={(event) => setRecoveryLink(event.target.value)}
                placeholder="https://intezaar.in/receive/…#k=…"
                required
              />
              <button type="submit" disabled={recoveryBusy || !recoveryLink.trim()}>
                {recoveryBusy ? "Checking private link…" : "Unlock on this browser"}
              </button>
              {recoveryError ? <p role="alert">{recoveryError}</p> : null}
              <small>
                The key is checked and remembered only on this device until the letter expires. If you do not have the complete link, ask the sender to share it again.
              </small>
            </form>
          ) : null}
        </section>
      </main>
    );
  }

  if (!activeContent) return null;

  if (!opened) {
    return (
      <main className={styles.page}>
        <header className={styles.header}>
          <Link href="/" className={styles.brand}>Intezaar</Link>
          <span>Delivered for {recipient}</span>
        </header>

        <section className={styles.arrived}>
          <p>{e2eePayload ? "End-to-end encrypted · decrypted on this device" : "Delivered by Intezaar Mail"}</p>
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

  const paragraphs = activeContent.message.split(/\n\s*\n/).filter(Boolean);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>Intezaar</Link>
        <span>{e2eePayload ? "Opened end-to-end encrypted letter" : "Opened private letter"}</span>
      </header>

      <section className={styles.reader}>
        <div className={styles.readerToolbar}>
          <div><small>{e2eePayload ? "Decrypted on this device" : "Delivered by Intezaar Mail"}</small><strong>{formatLabel(format)} letter</strong></div>
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
            <h1>{activeContent.heading || `Dear ${recipient},`}</h1>
            {paragraphs.map((paragraph, index) => (
              <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
            ))}
            <p className={styles.closing}>{activeContent.closing || `With care,\n${sender}`}</p>
          </div>

          {activeMedia.length ? (
            <section className={styles.privateMedia} aria-label="Private media inside this letter">
              <header>
                <small>SEALED WITH THE LETTER</small>
                <strong>{activeMedia.length} private media item{activeMedia.length === 1 ? "" : "s"}</strong>
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
                          alt={item.caption || item.name || "Private photograph"}
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
            <span>{e2eePayload ? "End-to-end encrypted" : "Posted with patience"}</span>
          </footer>
        </article>

        <RecipientPhotoLayoutBridge photos={positionedPhotos} />

        <div className={styles.keepsakeActions}>
          <button type="button" onClick={() => window.print()}>Save or print keepsake</button>
          <Link href="/create">Write a letter back</Link>
        </div>
      </section>
    </main>
  );
}
