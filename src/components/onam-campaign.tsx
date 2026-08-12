"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./onam-campaign.module.css";

const ATHAM_START_UTC = Date.parse("2026-08-15T18:30:00.000Z"); // 16 Aug 2026, 00:00 IST
const THIRUVONAM_OPEN_UTC = "2026-08-26T01:30:00.000Z"; // 26 Aug 2026, 07:00 IST
const PENDING_LEAD_KEY = "intezaar:meta-pending-lead:v1";

type TemplateLanguage = "en" | "ml";

type OnamTemplate = {
  id: string;
  label: string;
  note: string;
  heading: string;
  starter: string;
  motif: "lamp" | "leaf" | "flower" | "seal" | "boat";
};

const englishTemplates: OnamTemplate[] = [
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
];

const malayalamTemplates: OnamTemplate[] = [
  {
    id: "parents-ml",
    label: "അമ്മയ്ക്കും അച്ചനും",
    note: "ഫോൺ കോളിൽ പറഞ്ഞുതീരാതെ പോകുന്ന കാര്യങ്ങൾക്കായി.",
    heading: "പ്രിയ അമ്മയ്ക്കും അച്ചനും,",
    starter: "ഈ ഓണത്തിന് ഞാൻ വീട്ടിൽ ഇല്ലെങ്കിലും, ഇന്നത്തെ രാവിലെ എന്റെ മനസ്സ് മുഴുവൻ നിങ്ങളോടൊപ്പമാണ്. വീട്ടിലെ പൂക്കളവും, സദ്യയുടെ മണവും, എല്ലാവരും ഒരുമിച്ചിരിക്കുന്ന ആ തിരക്കുമെല്ലാം വളരെ ഓർമ്മ വരുന്നു.\n\nഈ വർഷം എനിക്ക് ഏറ്റവും അധികം നഷ്ടമായി തോന്നുന്നത്…",
    motif: "lamp",
  },
  {
    id: "family-ml",
    label: "വീട്ടിലുള്ള എല്ലാവർക്കും",
    note: "ഒരുമിച്ച് ഇരിക്കാൻ ആഗ്രഹിക്കുന്ന ആ വീട്ടുമേശയ്ക്കായി.",
    heading: "വീട്ടിലുള്ള എല്ലാവർക്കും,",
    starter: "ദൂരെയിരുന്ന് എല്ലാവർക്കും ഹൃദയം നിറഞ്ഞ ഓണാശംസകൾ. ഇന്ന് വീട്ടിലേക്ക് നടന്ന് കയറാനും, ആ ശബ്ദത്തിലും തിരക്കിലും സദ്യയിലും ഒത്തു ചേരാനും എത്ര ആഗ്രഹമുണ്ടെന്ന് പറയാൻ വയ്യ.\n\nഇന്ന് ഞാൻ വീട്ടിലുണ്ടായിരുന്നെങ്കിൽ ആദ്യം ചെയ്യുമായിരുന്നത്…",
    motif: "leaf",
  },
  {
    id: "grandparents-ml",
    label: "അമ്മച്ചിക്കും അപ്പച്ചനും",
    note: "ഓർമ്മകളും നന്ദിയും നിറഞ്ഞ ഒരു ശാന്തമായ കത്തിനായി.",
    heading: "പ്രിയ അമ്മച്ചിക്കും അപ്പച്ചനും,",
    starter: "ഓണം വന്നാൽ വീട്ടിലെ പഴയ ഓർമ്മകൾ സ്വയം മനസ്സിലേക്ക് വരും. ആ ഓർമ്മകളിൽ നിങ്ങളും, വീട്ടുമുറ്റവും, രാവിലെ തുടങ്ങുന്ന ആ പരിചിതമായ തിരക്കുകളും എല്ലാം ഉണ്ട്.\n\nഇന്നും ഞാൻ മനസ്സിൽ സൂക്ഷിക്കുന്ന ഒരു ഓണ ഓർമ്മ…",
    motif: "flower",
  },
  {
    id: "partner-ml",
    label: "പ്രിയപ്പെട്ട ഒരാൾക്ക്",
    note: "ഈ ഓണം വേറിട്ട ഇടങ്ങളിൽ കഴിയുന്ന രണ്ടുപേർക്കായി.",
    heading: "എന്റെ പ്രിയപ്പെട്ടവളേ / പ്രിയപ്പെട്ടവനേ,",
    starter: "ഈ ഓണം അല്പം വ്യത്യസ്തമാണ്, കാരണം നീ എന്റെ അടുത്തില്ല. ഒരു സാധാരണ മെസേജിനേക്കാൾ മന്ദഗതിയിൽ, ഇന്നത്തെ രാവിലെയെത്തി തുറക്കാവുന്ന എന്തെങ്കിലും നിനക്കായി വിടണമെന്ന് തോന്നി.\n\nഇന്ന് നമ്മൾ ഒരുമിച്ചിരുന്നെങ്കിൽ…",
    motif: "seal",
  },
  {
    id: "from-abroad-ml",
    label: "പ്രവാസത്തിൽ നിന്ന് വീട്ടിലേക്ക്",
    note: "എവിടെയായാലും കേരളം മനസ്സിൽ കൊണ്ടുനടക്കുന്നവർക്കായി.",
    heading: "ദൂരെയிருந்து, വീട്ടിലേക്ക്,",
    starter: "ചില ദിവസങ്ങളിൽ ദൂരം പതിവുപോലെ തോന്നും. പക്ഷേ ഓണം പോലുള്ള ദിവസങ്ങളിൽ ഓരോ കിലോമീറ്ററും കൂടുതൽ വ്യക്തമായി അനുഭവപ്പെടുന്നു. ഇന്ന് പതിവിലും കൂടുതൽ വീട്ടിനെ ഓർക്കുന്നു.\n\nഎവിടെ പോയാലും ഞാൻ മനസ്സിൽ കൊണ്ടുനടക്കുന്ന കേരളത്തിന്റെ ഒരു ചെറിയ ഭാഗം…",
    motif: "boat",
  },
];

function createHref(template?: OnamTemplate) {
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
  const [templateLanguage, setTemplateLanguage] = useState<TemplateLanguage>("en");
  const templates = templateLanguage === "ml" ? malayalamTemplates : englishTemplates;

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
          <p>Choose English or Malayalam. These are starting points, not finished greetings — make the letter sound like you.</p>

          <div
            role="group"
            aria-label="Onam template language"
            style={{
              display: "inline-flex",
              gap: 4,
              marginTop: 18,
              padding: 4,
              border: "1px solid rgba(111, 55, 35, .18)",
              borderRadius: 999,
              background: "rgba(255, 249, 237, .7)",
            }}
          >
            <button
              type="button"
              aria-pressed={templateLanguage === "en"}
              onClick={() => setTemplateLanguage("en")}
              style={{
                minHeight: 40,
                padding: "0 17px",
                border: 0,
                borderRadius: 999,
                cursor: "pointer",
                color: templateLanguage === "en" ? "#fff8ec" : "#69483a",
                background: templateLanguage === "en" ? "#8f3028" : "transparent",
                fontWeight: 800,
                fontSize: 13,
              }}
            >
              English
            </button>
            <button
              type="button"
              aria-pressed={templateLanguage === "ml"}
              onClick={() => setTemplateLanguage("ml")}
              lang="ml"
              style={{
                minHeight: 40,
                padding: "0 17px",
                border: 0,
                borderRadius: 999,
                cursor: "pointer",
                color: templateLanguage === "ml" ? "#fff8ec" : "#69483a",
                background: templateLanguage === "ml" ? "#8f3028" : "transparent",
                fontWeight: 800,
                fontSize: 14,
                fontFamily: '"Noto Sans Malayalam", "Nirmala UI", Kartika, sans-serif',
              }}
            >
              മലയാളം
            </button>
          </div>
        </div>

        <div className={styles.templateGrid} key={templateLanguage}>
          {templates.map((template) => (
            <Link
              key={template.id}
              href={createHref(template)}
              className={styles.templateCard}
              lang={templateLanguage === "ml" ? "ml" : "en"}
              onClick={() => queueOrFireLead(`Onam template · ${template.id}`)}
            >
              <div className={`${styles.templateArt} ${styles[`motif_${template.motif}`]}`} aria-hidden="true">
                <span /><i /><b />
              </div>
              <div
                className={styles.templateCopy}
                style={templateLanguage === "ml" ? { fontFamily: '"Noto Sans Malayalam", "Nirmala UI", Kartika, sans-serif' } : undefined}
              >
                <small>{templateLanguage === "ml" ? "ഓണ കത്തിനുള്ള തുടക്കം" : "ONAM LETTER STARTER"}</small>
                <strong>{template.label}</strong>
                <p>{template.note}</p>
              </div>
              <span className={styles.templateArrow} aria-hidden="true">→</span>
            </Link>
          ))}
        </div>

        {templateLanguage === "ml" ? (
          <p
            lang="ml"
            style={{
              maxWidth: 680,
              margin: "20px auto 0",
              color: "#7a5c4d",
              fontSize: 12,
              lineHeight: 1.7,
              textAlign: "center",
              fontFamily: '"Noto Sans Malayalam", "Nirmala UI", Kartika, sans-serif',
            }}
          >
            ഇത് ഒരു തുടക്കം മാത്രം. നിങ്ങളുടെ സ്വന്തം ഭാഷയും ഓർമ്മകളും ചേർത്ത് കത്ത് മാറ്റിയെഴുതാം.
          </p>
        ) : null}
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
