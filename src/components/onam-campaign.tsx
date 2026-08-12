"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./onam-campaign.module.css";

const ATHAM_START_UTC = Date.parse("2026-08-15T18:30:00.000Z"); // 16 Aug 2026, 00:00 IST
const THIRUVONAM_OPEN_UTC = "2026-08-26T01:30:00.000Z"; // 26 Aug 2026, 07:00 IST
const PENDING_LEAD_KEY = "intezaar:meta-pending-lead:v1";

// FEBIN PROOFING NOTE:
// Keep the Malayalam line empty until a fluent Malayalam speaker has proofed it.
// Do not ship an AI-guessed translation in this campaign.
const MALAYALAM_LINE_REQUIRES_PROOF = "";

const templates = [
  {
    id: "parents",
    label: "For Amma & Acha",
    note: "For the words you usually leave for the phone call.",
    heading: "Dear Amma and Acha,",
    starter: "I may be away from home this Onam, but this morning my mind is with you. I keep thinking about the little things that make Onam at home feel like ours — the sounds, the food, the flowers, and all of us being under the same roof.\n\nWhat I miss most this year is…",
    motif: "lamp",
  },
  {
    id: "family",
    label: "For everyone back home",
    note: "A family letter for the table you wish you were sitting at.",
    heading: "To everyone at home,",
    starter: "Happy Onam from far away. I wish I could walk into the house this morning and be part of the noise, the food and the small arguments that somehow make the day feel complete.\n\nIf I were there with you today, the first thing I would do is…",
    motif: "leaf",
  },
  {
    id: "grandparents",
    label: "For grandparents",
    note: "A quieter letter built around memory and gratitude.",
    heading: "Dear Ammachi and Appacha,",
    starter: "Onam always brings back memories of home, and so many of those memories have you in them. Even from far away, I can picture the house, the morning and the familiar routines I grew up with.\n\nOne Onam memory I still carry with me is…",
    motif: "flower",
  },
  {
    id: "partner",
    label: "For someone you love",
    note: "For couples spending this Onam in different places.",
    heading: "My love,",
    starter: "This Onam feels a little different because you are not beside me. I wanted to leave you something slower than a message — something that could wait for the morning and arrive with the day itself.\n\nWhat I wish we were doing together today is…",
    motif: "seal",
  },
  {
    id: "from-abroad",
    label: "From abroad, with Onam love",
    note: "For anyone carrying Kerala with them somewhere else.",
    heading: "From far away, to home,",
    starter: "There are days when distance feels ordinary, and then there are days like Onam when every kilometre suddenly feels visible. Today I am thinking about home more than usual.\n\nThe piece of Kerala I carry with me wherever I go is…",
    motif: "boat",
  },
] as const;

function createHref(template?: (typeof templates)[number]) {
  const params = new URLSearchParams({
    occasion: "Celebration",
    opensAt: THIRUVONAM_OPEN_UTC,
    campaign: "onam2026",
    format: "festival",
  });

  if (template) {
    params.set("heading", template.heading);
    params.set("starter", template.starter);
    params.set("template", template.id);
  }

  return `/create?${params.toString()}`;
}

function deadlineCopy(now: number) {
  if (now < ATHAM_START_UTC) {
    const days = Math.max(1, Math.ceil((ATHAM_START_UTC - now) / 86_400_000));
    return `${days} day${days === 1 ? "" : "s"} left before Onam begins`;
  }

  const opening = Date.parse(THIRUVONAM_OPEN_UTC);
  if (now < opening) return "Onam has begun — write before Thiruvonam morning";
  return "Thiruvonam 2026 has arrived";
}

function queueOrFireLead(contentName = "Onam 2026 letter") {
  const payload = {
    content_name: contentName,
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
    // The link must always work even if browser storage is unavailable.
  }
}

function CampaignCta({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href={createHref()}
      className={`${styles.cta} ${compact ? styles.ctaCompact : ""}`}
      onClick={() => queueOrFireLead()}
    >
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
        <Link href="/" className={styles.brandLink} aria-label="Intezaar home">
          <span className={styles.brandMark} aria-hidden="true">I</span>
          <span className={styles.brand}>Intezaar</span>
        </Link>
        <span className={styles.campaignLabel}>ONAM · 2026</span>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroDecor} aria-hidden="true">
          <span className={styles.bananaLeafLeft} />
          <span className={styles.bananaLeafRight} />
          <span className={styles.flowerScatterOne} />
          <span className={styles.flowerScatterTwo} />
        </div>

        <div className={styles.heroCopy}>
          <div className={styles.postmark} aria-hidden="true">
            <span>HOME IS</span>
            <strong>WHERE ONAM IS</strong>
          </div>
          <p className={styles.eyebrow}>A private letter for home</p>
          <h1>This Onam,<br /><em>write home.</em></h1>
          {MALAYALAM_LINE_REQUIRES_PROOF ? (
            <p className={styles.malayalam}>{MALAYALAM_LINE_REQUIRES_PROOF}</p>
          ) : null}
          <p className={styles.lede}>
            Seal a letter today. It opens with Thiruvonam morning in Kerala, wherever you are.
          </p>

          <CampaignCta />

          <div className={styles.deadline} aria-live="polite">
            <span className={styles.deadlineFlower} aria-hidden="true">✿</span>
            <div>
              <small>WRITE BEFORE THE FESTIVAL BEGINS</small>
              <strong>{deadlineCopy(now)}</strong>
            </div>
          </div>

          <div className={styles.openingLine}>
            <small>THE SEAL OPENS</small>
            <strong>Thiruvonam · 26 August 2026 · 7:00 AM IST</strong>
          </div>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <div className={styles.lamp}>
            <i />
            <b />
            <span />
          </div>
          <div className={styles.pookalam}>
            <span /><span /><span /><span />
          </div>
          <div className={styles.envelope}>
            <span className={styles.envelopeFlap} />
            <small>FOR HOME</small>
            <strong>Open on<br />Thiruvonam morning</strong>
            <i>I</i>
          </div>
        </div>
      </section>

      <section className={styles.trustBar} aria-label="Intezaar privacy highlights">
        <span><b aria-hidden="true">⌁</b> End-to-end encrypted</span>
        <span><b aria-hidden="true">○</b> No account required</span>
        <span><b aria-hidden="true">↗</b> Private recipient link</span>
      </section>

      <section className={styles.templates}>
        <div className={styles.sectionHeading}>
          <span className={styles.floralRule} aria-hidden="true">✿</span>
          <p className={styles.eyebrow}>Not sure how to begin?</p>
          <h2>Begin with an Onam template.</h2>
          <p>These are starting points, not finished greetings. Choose one, make it yours, then let it wait for Thiruvonam morning.</p>
        </div>

        <div className={styles.templateGrid}>
          {templates.map((template) => (
            <Link
              key={template.id}
              href={createHref(template)}
              className={styles.templateCard}
              onClick={() => queueOrFireLead(`Onam template · ${template.id}`)}
            >
              <div className={`${styles.templateArt} ${styles[`motif_${template.motif}`]}`} aria-hidden="true">
                <span /><i /><b />
              </div>
              <div className={styles.templateCopy}>
                <small>ONAM LETTER STARTER</small>
                <strong>{template.label}</strong>
                <p>{template.note}</p>
              </div>
              <span className={styles.templateArrow} aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.distanceStory}>
        <div className={styles.nightScene} aria-hidden="true">
          <div className={styles.window}><span /><span /><span /></div>
          <div className={styles.deskLamp}><i /><b /></div>
          <div className={styles.writingFigure}><span /><i /></div>
          <div className={styles.deskLetter}>For home</div>
        </div>
        <div className={styles.distanceCopy}>
          <p className={styles.eyebrow}>Miles apart. Heart always home.</p>
          <h2>Let your words reach Kerala at the right moment.</h2>
          <p>
            Write from wherever life has taken you. Intezaar keeps the letter sealed until the morning you chose, and an optional email can tell them when the seal is ready to open.
          </p>
          <div className={styles.routeLine}>
            <span>WHEREVER YOU ARE</span>
            <i />
            <strong>KERALA</strong>
          </div>
        </div>
      </section>

      <section className={styles.story}>
        <div className={styles.storyLead}>
          <p className={styles.eyebrow}>One letter. One morning.</p>
          <h2>The waiting is part of the gift.</h2>
        </div>
        <div className={styles.storySteps}>
          <article>
            <span>01</span>
            <div>
              <strong>Write from where you are</strong>
              <p>Start from blank or use one of the Onam starters. Add a photo, voice note or short video only if it belongs inside the letter.</p>
            </div>
          </article>
          <article>
            <span>02</span>
            <div>
              <strong>Seal it for Kerala time</strong>
              <p>The Onam flow pre-selects 7:00 AM IST on Thiruvonam, 26 August 2026. You can review the moment before posting.</p>
            </div>
          </article>
          <article>
            <span>03</span>
            <div>
              <strong>Share the private link</strong>
              <p>The recipient sees a sealed delivery before arrival. If you add their email, Intezaar can notify them again when the chosen opening moment arrives.</p>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.final}>
        <div className={styles.finalDecor} aria-hidden="true">
          <div className={styles.finalPookalam} />
          <div className={styles.finalLamp}><i /><span /></div>
        </div>
        <div className={styles.finalCopy}>
          <p className={styles.eyebrow}>For the people who make Kerala feel like home</p>
          <h2>Write it today.<br />Let it open on Thiruvonam morning.</h2>
          <CampaignCta compact />
          <small>Private digital delivery · Not physical post · Opens 26 August 2026 at 7:00 AM IST</small>
        </div>
      </section>
    </main>
  );
}
