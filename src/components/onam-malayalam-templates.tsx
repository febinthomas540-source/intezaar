"use client";

import Link from "next/link";
import styles from "./onam-malayalam-templates.module.css";

const THIRUVONAM_OPEN_UTC = "2026-08-26T01:30:00.000Z";
const PENDING_LEAD_KEY = "intezaar:meta-pending-lead:v1";

const malayalamTemplates = [
  {
    id: "ml-parents",
    label: "അമ്മയ്ക്കും അച്ചനും",
    note: "വീട്ടിൽ കൂടെയിരിക്കാനാകാത്ത ഈ ഓണത്തിന്.",
    heading: "പ്രിയ അമ്മയ്ക്കും അച്ചനും,",
    starter:
      "ഈ ഓണത്തിന് വീട്ടിൽ നിങ്ങളോടൊപ്പം ഇരിക്കാൻ കഴിയാത്തതിന്റെ കുറവ് ഇന്ന് കൂടുതലായി തോന്നുന്നു. ദൂരെയായിരുന്നാലും എന്റെ മനസ്സ് മുഴുവൻ വീട്ടിലാണു. പൂക്കളം, സദ്യ, വീട്ടിലെ ശബ്ദങ്ങൾ — എല്ലാം ഓർമ്മ വരുന്നു.\n\nഈ വർഷം ഞാൻ ഏറ്റവും കൂടുതൽ മിസ് ചെയ്യുന്നത്…",
  },
  {
    id: "ml-family",
    label: "വീട്ടിലുള്ള എല്ലാവർക്കും",
    note: "കുടുംബത്തിനൊക്കെയും ഒരുമിച്ച് വായിക്കാൻ.",
    heading: "വീട്ടിലുള്ള എല്ലാവർക്കും,",
    starter:
      "ദൂരെയിരുന്ന് ഹൃദയം നിറഞ്ഞ ഓണാശംസകൾ. ഇന്ന് രാവിലെ വീട്ടിൽ ഒപ്പമുണ്ടായിരുന്നെങ്കിൽ എത്ര നന്നായിരുന്നേനെ എന്ന് തോന്നുന്നു. വീട്ടിലെ തിരക്കും ചിരിയും സദ്യയും എല്ലാം മനസ്സിൽ വരുന്നു.\n\nഇന്ന് ഞാൻ വീട്ടിലുണ്ടായിരുന്നെങ്കിൽ ആദ്യം ചെയ്യുമായിരുന്നത്…",
  },
  {
    id: "ml-grandparents",
    label: "അമ്മച്ചിക്കും അപ്പച്ചനും",
    note: "ഓർമ്മകളും നന്ദിയും ചേർന്ന ഒരു ശാന്തമായ കത്ത്.",
    heading: "പ്രിയ അമ്മച്ചിക്കും അപ്പച്ചനും,",
    starter:
      "ഓണം വരുമ്പോഴെല്ലാം പഴയ വീട്ടുവിശേഷങ്ങളും ബാല്യകാല ഓർമ്മകളും മനസ്സിൽ നിറയും. ആ ഓർമ്മകളിൽ നിങ്ങളും എപ്പോഴും ഉണ്ടാകും. ദൂരെയായിരുന്നാലും ഇന്ന് മനസ്സ് നിങ്ങളോടൊപ്പമാണ്.\n\nഎനിക്ക് ഇന്നും ഏറ്റവും വ്യക്തമായി ഓർമ്മയുള്ള ഒരു ഓണം…",
  },
  {
    id: "ml-partner",
    label: "പ്രിയപ്പെട്ട ഒരാൾക്ക്",
    note: "ഈ ഓണം വേറെ വേറെ സ്ഥലങ്ങളിലാണെങ്കിൽ.",
    heading: "എന്റെ പ്രിയമേ,",
    starter:
      "ഈ ഓണം നമുക്ക് വേറെ വേറെ സ്ഥലങ്ങളിലായിരിക്കുന്നു. ഒരു സാധാരണ മെസേജിന് പകരം, ഇന്ന് തുറക്കാൻ വേണ്ടി കാത്തിരിക്കുന്ന ഒരു കത്ത് നിനക്കായി വെക്കണമെന്ന് തോന്നി.\n\nഇന്ന് നമ്മൾ ഒരുമിച്ചിരുന്നെങ്കിൽ…",
  },
  {
    id: "ml-abroad",
    label: "വിദേശത്തുനിന്ന് വീട്ടിലേക്ക്",
    note: "കേരളത്തെ മനസ്സിൽ കൊണ്ടുനടക്കുന്നവർക്ക്.",
    heading: "ദൂരെയிருந்து വീട്ടിലേക്ക്,",
    starter:
      "ചില ദിവസങ്ങളിൽ ദൂരം സാധാരണ പോലെ തോന്നും. പക്ഷേ ഓണം പോലുള്ള ദിവസങ്ങളിൽ വീട്ടിൽ നിന്ന് എത്ര ദൂരെയാണെന്ന് കൂടുതൽ മനസ്സിലാകും. ഇന്ന് എന്റെ ചിന്തകൾ എല്ലാം കേരളത്തിലേക്കും വീട്ടിലേക്കുമാണ്.\n\nഎവിടെയായിരുന്നാലും ഞാൻ കൂടെ കൊണ്ടുപോകുന്ന വീട്ടിന്റെ ഒരു ഭാഗം…",
  },
] as const;

function templateHref(template: (typeof malayalamTemplates)[number]) {
  const params = new URLSearchParams({
    occasion: "Celebration",
    opensAt: THIRUVONAM_OPEN_UTC,
    campaign: "onam2026-malayalam",
    format: "festival",
    heading: template.heading,
    starter: template.starter,
    template: template.id,
  });
  return `/create?${params.toString()}`;
}

function queueOrFireLead(templateId: string) {
  const payload = {
    content_name: `Onam Malayalam template · ${templateId}`,
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
    // The template link should still work when storage is unavailable.
  }
}

export function OnamMalayalamTemplates() {
  return (
    <section className={styles.section} aria-labelledby="onam-malayalam-title">
      <div className={styles.flower} aria-hidden="true">✿</div>
      <div className={styles.heading}>
        <p>ONAM LETTERS · മലയാളം</p>
        <h2 id="onam-malayalam-title">മലയാളത്തിൽ എഴുതാം.</h2>
        <span>
          ഒരു തുടക്കം തിരഞ്ഞെടുക്കൂ. ശേഷം വാക്കുകൾ നിങ്ങളുടെതാക്കൂ. കത്ത് തിരുവോണദിവസം രാവിലെ തുറക്കും.
        </span>
      </div>

      <div className={styles.grid}>
        {malayalamTemplates.map((template, index) => (
          <Link
            key={template.id}
            href={templateHref(template)}
            className={styles.card}
            onClick={() => queueOrFireLead(template.id)}
          >
            <div className={styles.number} aria-hidden="true">0{index + 1}</div>
            <div>
              <small>ഓണ കത്തിന്റെ തുടക്കം</small>
              <strong>{template.label}</strong>
              <p>{template.note}</p>
            </div>
            <span className={styles.arrow} aria-hidden="true">→</span>
          </Link>
        ))}
      </div>

      <p className={styles.note}>
        ഈ വരികൾ ഒരു തുടക്കം മാത്രമാണ്. തുറന്ന ശേഷം നിങ്ങൾക്ക് മുഴുവൻ കത്തും തിരുത്തി നിങ്ങളുടെ സ്വന്തം ഭാഷയിൽ എഴുതാം.
      </p>
    </section>
  );
}
