"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import styles from "./registered-delivery-gate.module.css";

type Props = {
  recipient: string;
  token: string;
};

export function RegisteredDeliveryGate({ recipient, token }: Props) {
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function requestCode() {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/letters/registered/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const result = await response.json() as { sent?: boolean; error?: string };
      if (!response.ok || !result.sent) throw new Error(result.error || "The code could not be sent.");
      setSent(true);
      setMessage("Verification code sent to the recipient email chosen by the sender.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The code could not be sent.");
    } finally {
      setBusy(false);
    }
  }

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/letters/registered/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, code }),
      });
      const result = await response.json() as { verified?: boolean; error?: string };
      if (!response.ok || !result.verified) throw new Error(result.error || "Verification failed.");
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Verification failed.");
      setBusy(false);
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>Intezaar</Link>
        <span>Registered digital mail</span>
      </header>

      <section className={styles.stage}>
        <article className={styles.card}>
          <div className={styles.registeredMark}>R</div>
          <p>REGISTERED INTEZAAR MAIL</p>
          <h1>This letter is for {recipient} only.</h1>
          <span>
            The sender requested recipient verification. The letter, sender details and private media stay sealed until the intended recipient verifies access.
          </span>

          {!sent ? (
            <button type="button" onClick={requestCode} disabled={busy}>
              {busy ? "Sending verification code…" : "Send verification code"}
            </button>
          ) : (
            <form onSubmit={verify} className={styles.form}>
              <label htmlFor="registered-code">Six-digit code</label>
              <input
                id="registered-code"
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="000000"
                required
                autoFocus
              />
              <button type="submit" disabled={busy || code.length !== 6}>
                {busy ? "Verifying…" : "Accept registered delivery"}
              </button>
              <button type="button" className={styles.resend} onClick={requestCode} disabled={busy}>
                Send a new code
              </button>
            </form>
          )}

          {message ? <div className={styles.notice} role="status">{message}</div> : null}
          <small>Verification is tied to this browser. If browser data is cleared, the recipient may need to verify again.</small>
        </article>
      </section>
    </main>
  );
}
