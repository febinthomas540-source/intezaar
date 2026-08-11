"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./onam-campaign.module.css";

const ATHAM_START_UTC = Date.parse("2026-08-15T18:30:00.000Z"); // 16 Aug 2026, 00:00 IST
const THIRUVONAM_OPEN_UTC = "2026-08-26T01:30:00.000Z"; // 26 Aug 2026, 07:00 IST
const PENDING_LEAD_KEY = "intezaar:meta-pending-lead:v1";

// FEBIN PROOFING NOTE:
// If a Malayalam line is added later, have a fluent Malayalam speaker proof it
// before rendering it here. We intentionally do not guess the translation.
const MALAYALAM_LINE_REQUIRES_PROOF = "";

const CREATE_HREF = `/create?occasion=${encodeURIComponent("Onam")}&opensAt=${encodeURIComponent(THIRUVONAM_OPEN_UTC)}&campaign=onam2026`;

function deadlineCopy(now: number) {
  if (now < ATHAM_START_UTC) {
    const days = Math.max(1, Math.ceil((ATHAM_START_UTC - now) / 86_400_000));
    return `${days} day${days === 1 ? "" : "s"} left before Onam begins`;
  }

  const opening = Date.parse(THIRUVONAM_OPEN_UTC);
  if (now < opening) return "Onam has begun — write before Thiruvonam morning";
  return "Thiruvonam 2026 has arrived";
}

function queueOrFireLead() {
  const payload = {
    content_name: "Onam 2026 letter",
    content_category: "onam_campaign",
  };
  const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;

  if (fbq) {
    fbq("track", "Lead", payload);
    return;
  }

  try {
    window.sessionStorage.setItem(PENDING_LEAD_KEY, JSON.stringify(payload));
  } catch {
    // The CTA must always work even if browser storage is unavailable.
  }
}

function CampaignCta() {
  return (
    <Link href={CREATE_HREF} className={styles.cta} onClick={queueOrFireLead}>
      Write your Onam letter
      <span aria-hidden="true">→</span>
    </Link>
  );
}

export function OnamCampaign() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brandMark} aria-hidden="true">I</span>
        <span className={styles.brand}>Intezaar</span>
        <span className={styles.campaignLabel}>ONAM · 2026</span>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>A private letter for home</p>
          <h1>This Onam,<br /><em>write home.</em></h1>
          {MALAYALAM_LINE_REQUIRES_PROOF ? (
            <p className={styles.malayalam}>{MALAYALAM_LINE_REQUIRES_PROOF}</p>
          ) : null}
          <p className={styles.lede}>
            Seal a letter today. It opens with Thiruvonam morning in Kerala, wherever you are.
          </p>

          <div className={styles.deadline} aria-live="polite">
            <span className={styles.deadlineDot} aria-hidden="true" />
            <div>
              <small>WRITE BEFORE THE FESTIVAL BEGINS</small>
              <strong>{deadlineCopy(now)}</strong>
            </div>
          </div>

          <div className={styles.openingLine}>
            <small>THE SEAL OPENS</small>
            <strong>Thiruvonam · 26 August 2026 · 7:00 AM IST</strong>
          </div>

          <CampaignCta />

          <div className={styles.trust} aria-label="Intezaar privacy highlights">
            <span>End-to-end encrypted</span>
            <span>No account</span>
            <span>Private link</span>
          </div>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <div className={styles.pookalam}>
            <span /><span /><span /><span />
          </div>
          <div className={styles.letter}>
            <small>PRIVATE ONAM LETTER</small>
            <strong>For home</strong>
            <p>Open on Thiruvonam morning</p>
            <i>I</i>
          </div>
          <div className={styles.routeTag}>
            <small>FROM</small>
            <strong>WHEREVER YOU ARE</strong>
            <span>→</span>
            <small>HOME</small>
            <strong>KERALA</strong>
          </div>
        </div>
      </section>

      <section className={styles.story}>
        <div className={styles.storyLead}>
          <p className={styles.eyebrow}>The distance is real. The letter can wait.</p>
          <h2>Let your words arrive with the morning at home.</h2>
        </div>
        <div className={styles.storySteps}>
          <article>
            <span>01</span>
            <div>
              <strong>Write from where you are</strong>
              <p>A few honest paragraphs are enough. Add a photo, voice note or video only if it belongs inside the letter.</p>
            </div>
          </article>
          <article>
            <span>02</span>
            <div>
              <strong>Seal it for Kerala time</strong>
              <p>The Onam link pre-selects the opening moment: 7:00 AM IST on Thiruvonam, 26 August 2026.</p>
            </div>
          </article>
          <article>
            <span>03</span>
            <div>
              <strong>Share the private link</strong>
              <p>Before the chosen moment they see a sealed letter. The message stays encrypted until the opening time arrives.</p>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.final}>
        <div className={styles.finalSeal} aria-hidden="true">I</div>
        <p className={styles.eyebrow}>For the people who make Kerala feel like home</p>
        <h2>Write it before the celebrations begin.<br />Let it open on Thiruvonam morning.</h2>
        <CampaignCta />
        <small>Private digital delivery · Not physical post · Opens 26 August 2026 at 7:00 AM IST</small>
      </section>
    </main>
  );
}
