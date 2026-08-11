"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./sender-growth-prompt.module.css";

type StoredManageState = {
  manageToken?: unknown;
  opensAt?: unknown;
};

const MANAGE_KEY = "intezaar:last-manage-token:v1";

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function SenderGrowthPrompt() {
  const [manageToken, setManageToken] = useState("");
  const [email, setEmail] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const promptKey = useMemo(
    () => manageToken ? `intezaar:sender-growth:${manageToken.slice(0, 14)}` : "",
    [manageToken],
  );

  useEffect(() => {
    let frame = 0;

    const inspect = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const posted = document.querySelector(".posted-share-panel");
        if (!posted) return;

        try {
          const raw = window.localStorage.getItem(MANAGE_KEY);
          const saved = raw ? JSON.parse(raw) as StoredManageState : null;
          const token = typeof saved?.manageToken === "string" ? saved.manageToken : "";
          if (!/^[A-Za-z0-9_-]{40,60}$/.test(token)) return;

          const key = `intezaar:sender-growth:${token.slice(0, 14)}`;
          if (window.sessionStorage.getItem(key) === "done") return;
          setManageToken(token);
          setVisible(true);
        } catch {
          // The normal posted-letter screen still works if storage is unavailable.
        }
      });
    };

    const observer = new MutationObserver(inspect);
    observer.observe(document.body, { childList: true, subtree: true });
    inspect();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  function dismiss() {
    if (promptKey) {
      try {
        window.sessionStorage.setItem(promptKey, "done");
      } catch {
        // Dismissal only needs to last for this render when storage is unavailable.
      }
    }
    setVisible(false);
  }

  async function saveNotification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!manageToken || busy) return;
    if (!validEmail(email)) {
      setStatus("Enter a valid email address.");
      return;
    }

    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/letters/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manageToken,
          email: email.trim(),
          notifyOnOpen: true,
        }),
      });
      const result = await response.json() as {
        saved?: boolean;
        notificationSent?: boolean;
        error?: string;
      };
      if (!response.ok || !result.saved) {
        throw new Error(result.error || "The notification preference could not be saved.");
      }
      setStatus(result.notificationSent
        ? "Saved — this letter had already been opened, so the update was sent now."
        : "Saved. We’ll email you once when this letter is opened.");
      if (promptKey) {
        try {
          window.sessionStorage.setItem(promptKey, "done");
        } catch {
          // The saved server preference still applies.
        }
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The notification preference could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  async function sharePublicIdea() {
    const url = `${window.location.origin}/sent-a-letter`;
    const text = "I just sent a letter that has to wait before it can be opened. The private letter stays private.";

    if (navigator.share) {
      try {
        await navigator.share({ title: "I sent a letter that has to wait", text, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setStatus("Public share copied. Your private letter link was not included.");
    } catch {
      setStatus("Your private letter stays private. Share the public Intezaar page if you want to share the idea.");
    }
  }

  if (!visible) return null;

  return (
    <aside className={styles.shell} aria-label="Optional sender follow-up">
      <div className={styles.topline}>
        <div>
          <p className={styles.eyebrow}>Optional follow-up</p>
          <h2>Want to know when the seal is opened?</h2>
        </div>
        <button className={styles.close} type="button" onClick={dismiss} aria-label="Dismiss">×</button>
      </div>

      <p className={styles.copy}>
        Add your email for one delivery update. This does not create an account, and the notification contains no letter text, media or decryption key.
      </p>

      <form className={styles.form} onSubmit={saveNotification}>
        <label htmlFor="sender-open-notification-email">Your email</label>
        <input
          id="sender-open-notification-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={254}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />
        <button type="submit" disabled={busy}>{busy ? "Saving…" : "Email me when opened"}</button>
      </form>
      <p className={styles.note}>Your email is delivery metadata, not part of the end-to-end encrypted letter content.</p>
      {status ? <p className={styles.status} role="status">{status}</p> : null}

      <div className={styles.divider} />

      <div className={styles.publicShare}>
        <strong>Share the idea, not the letter.</strong>
        <p>Post a generic Intezaar message without the recipient name, letter content, opening date or private link.</p>
        <button className={styles.shareButton} type="button" onClick={sharePublicIdea}>Share “I sent a letter”</button>
      </div>
    </aside>
  );
}
