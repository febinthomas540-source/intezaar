"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./recipient-growth-prompt.module.css";

type Props = {
  token: string;
  enabled: boolean;
};

type RecipientAction = "opened" | "write_back" | "future_self" | "share_idea";

export function RecipientGrowthPrompt({ token, enabled }: Props) {
  const [active, setActive] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const sessionKey = useMemo(
    () => `intezaar:recipient-growth:${token.slice(0, 14)}`,
    [token],
  );

  function record(action: RecipientAction) {
    if (!enabled) return;
    void fetch("/api/letters/recipient-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, action }),
      cache: "no-store",
      keepalive: true,
    }).catch(() => {
      // Growth events must never interfere with reading the private letter.
    });
  }

  useEffect(() => {
    if (!enabled) return;

    try {
      if (window.sessionStorage.getItem(sessionKey) === "opened") {
        setActive(true);
      }
    } catch {
      // The conversion panel can still appear after the current seal-open action.
    }

    const onClick = (event: MouseEvent) => {
      const button = (event.target as HTMLElement | null)?.closest("button");
      if (!button || button.textContent?.trim() !== "Break the seal") return;

      record("opened");
      try {
        window.sessionStorage.setItem(sessionKey, "opened");
      } catch {
        // Persistence is optional.
      }
      window.setTimeout(() => setActive(true), 0);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [enabled, sessionKey]);

  function writeBack() {
    record("write_back");
    window.location.assign("/create");
  }

  function futureSelf() {
    record("future_self");
  }

  async function shareIdea() {
    record("share_idea");
    const url = `${window.location.origin}/received-a-letter`;
    const text = "Someone sent me an Intezaar letter I had to wait to open. The private letter stayed private.";

    if (navigator.share) {
      try {
        await navigator.share({ title: "Someone sent me a letter I had to wait to open", text, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setShareStatus("Public share copied. Your private letter link was not included.");
    } catch {
      setShareStatus("Share the public Intezaar page if you want to share the idea. Your private letter stays private.");
    }
  }

  if (!enabled || !active) return null;

  return (
    <section className={styles.section} aria-label="Write your own Intezaar letter">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>The wait can travel forward</p>
          <h2>Someone waited to send you this. Want to send a letter of your own?</h2>
          <p>
            Start a private letter for someone else, or leave something for your future self. You do not need an account to begin.
          </p>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={writeBack}>Write a letter back</button>
          <Link href="/future-self" className={styles.secondary} onClick={futureSelf}>Write to future me</Link>
          <button type="button" className={styles.share} onClick={shareIdea}>Share the Intezaar idea</button>
          <p className={styles.privacy}>Sharing this idea never includes this letter, its private URL, its opening date or its contents.</p>
          {shareStatus ? <p className={styles.status} role="status">{shareStatus}</p> : null}
        </div>
      </div>
    </section>
  );
}
