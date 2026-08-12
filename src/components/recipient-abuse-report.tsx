"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import styles from "./recipient-abuse-report.module.css";

const categories = [
  { value: "immediate_danger", label: "Immediate danger or credible threat" },
  { value: "terrorism_or_violence", label: "Terrorism, violent extremism or serious violence" },
  { value: "child_sexual_exploitation", label: "Child sexual exploitation or abuse" },
  { value: "sexual_exploitation_or_intimate_abuse", label: "Sexual exploitation or non-consensual intimate content" },
  { value: "harassment_or_stalking", label: "Harassment, stalking or unwanted contact" },
  { value: "fraud_or_extortion", label: "Fraud, scam, blackmail or extortion" },
  { value: "hate_or_threats", label: "Hate, intimidation or threatening abuse" },
  { value: "privacy_or_impersonation", label: "Privacy violation or impersonation" },
  { value: "spam_or_other", label: "Spam or another safety concern" },
] as const;

type Props = {
  token: string;
};

export function RecipientAbuseReport({ token }: Props) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || reference) return;
    setError("");

    if (!category) {
      setError("Choose the reason for the report.");
      return;
    }
    if (details.trim() && !consent) {
      setError("Confirm the safety-review notice before sharing report details.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/letters/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          category,
          details: details.trim(),
          urgent,
          consentToShareDetails: details.trim() ? consent : false,
        }),
      });
      const result = await response.json() as { error?: string; reference?: string };
      if (!response.ok || !result.reference) {
        throw new Error(result.error || "The report could not be recorded.");
      }
      setReference(result.reference);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The report could not be recorded.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside className={styles.shell} aria-label="Safety reporting">
      {!open ? (
        <button type="button" className={styles.reportLink} onClick={() => setOpen(true)}>
          Report this delivery
        </button>
      ) : (
        <div className={styles.panel}>
          <div className={styles.headingRow}>
            <div>
              <p className={styles.eyebrow}>Safety & abuse</p>
              <h2>Report this delivery</h2>
            </div>
            {!reference ? (
              <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Close report form">×</button>
            ) : null}
          </div>

          {reference ? (
            <div className={styles.success} role="status">
              <strong>Report received.</strong>
              <p>Reference <b>{reference}</b>. This delivery has been flagged for safety review.</p>
              <p>Intezaar does not automatically decrypt or reveal the private letter when you report it.</p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <p className={styles.explainer}>
                You can report a delivery without sharing its private letter. Current end-to-end encrypted letters are not automatically read or scanned by Intezaar.
              </p>

              <label className={styles.field}>
                <span>What are you concerned about?</span>
                <select value={category} onChange={(event) => setCategory(event.target.value)} required>
                  <option value="">Choose a reason</option>
                  {categories.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </label>

              <label className={styles.checkRow}>
                <input type="checkbox" checked={urgent} onChange={(event) => setUrgent(event.target.checked)} />
                <span>
                  <strong>There may be an immediate risk of serious harm.</strong>
                  <small>Intezaar is not an emergency service. If someone is in immediate danger, contact the appropriate local emergency service or law-enforcement authority.</small>
                </span>
              </label>

              <label className={styles.field}>
                <span>Details for safety review <small>optional</small></span>
                <textarea
                  value={details}
                  onChange={(event) => setDetails(event.target.value.slice(0, 1200))}
                  rows={5}
                  maxLength={1200}
                  placeholder="Describe the concern. You do not need to paste the whole letter."
                />
                <small>{details.length}/1200</small>
              </label>

              {details.trim() ? (
                <label className={styles.consentRow}>
                  <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
                  <span>I understand that anything I type in this report is sent to Intezaar for safety review and is not end-to-end encrypted.</span>
                </label>
              ) : null}

              {error ? <p className={styles.error} role="alert">{error}</p> : null}

              <div className={styles.actions}>
                <button type="submit" className={styles.submit} disabled={busy || !category || Boolean(details.trim() && !consent)}>
                  {busy ? "Sending report…" : "Submit safety report"}
                </button>
                <Link href="/community-guidelines" className={styles.guidelines}>Community Guidelines</Link>
              </div>

              <p className={styles.privacyNote}>
                The report includes the delivery identifier, selected category, triage information and any details you voluntarily provide. It never includes the browser-only decryption key.
              </p>
            </form>
          )}
        </div>
      )}
    </aside>
  );
}
