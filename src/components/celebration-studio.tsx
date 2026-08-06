"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import styles from "./celebration-studio.module.css";

const occasions = [
  "Birthday", "Anniversary", "Wedding", "Engagement", "Baby celebration", "Housewarming",
  "Graduation", "Farewell", "Onam", "Diwali", "Eid", "Christmas", "Vishu", "Pongal",
  "Raksha Bandhan", "Holi", "Mother's Day", "Father's Day",
] as const;

const languages = ["English", "Hindi", "Malayalam", "Tamil", "Hinglish"] as const;
const tones = ["Warm", "Playful", "Romantic", "Deeply emotional", "Elegant", "Simple"] as const;

type DraftInput = {
  recipient: string;
  relationship: string;
  occasion: string;
  language: string;
  tone: string;
  detail: string;
  memory: string;
  future: string;
};

function buildDraft(input: DraftInput) {
  const name = input.recipient.trim() || "you";
  const relationship = input.relationship.trim() || "someone very special";
  const detail = input.detail.trim() || "the way you make ordinary moments feel important";
  const memory = input.memory.trim() || "the small moments we never needed to photograph to remember";
  const future = input.future.trim() || "many more days that feel unmistakably ours";

  const opening = input.tone === "Playful"
    ? `${name}, today gives me a perfectly good excuse to say what I usually hide inside jokes.`
    : input.tone === "Romantic"
      ? `${name}, some people enter our lives quietly and slowly become part of how every good memory feels.`
      : input.tone === "Deeply emotional"
        ? `${name}, there are things gratitude cannot fully carry, but today I want to try.`
        : `${name}, this is not a copied wish. It is for you, and only you.`;

  const body = `For your ${input.occasion.toLowerCase()}, I keep thinking about ${memory}. What stays with me most is ${detail}. That is why being your ${relationship} has never felt ordinary.`;
  const closing = `I hope the year ahead brings you ${future}. May this celebration feel less like one special day and more like the beginning of everything you deserve.`;

  if (input.language === "Malayalam") {
    return `${name}, ഇത് ഒരു സാധാരണ ആശംസയല്ല. നിനക്കായി മാത്രം എഴുതിയതാണ്.\n\nനിന്റെ ${input.occasion} ദിനത്തിൽ എനിക്ക് വീണ്ടും ഓർമ്മ വരുന്നത് ${memory} ആണ്. അതിലും കൂടുതൽ മനസ്സിൽ നിൽക്കുന്നത് ${detail} എന്ന ചെറിയ കാര്യമാണ്. നിന്റെ ${relationship} ആയി ജീവിതത്തിൽ ഉണ്ടാകുന്നത് എനിക്ക് ഒരിക്കലും സാധാരണ കാര്യമല്ല.\n\nമുന്നിലുള്ള ദിവസങ്ങൾ ${future} കൊണ്ട് നിറയട്ടെ. ഇന്നത്തെ ആഘോഷം നീ അർഹിക്കുന്ന എല്ലാ നല്ല കാര്യങ്ങളുടെയും തുടക്കമാകട്ടെ.`;
  }

  if (input.language === "Hindi") {
    return `${name}, यह कोई कॉपी किया हुआ संदेश नहीं है। यह सिर्फ़ तुम्हारे लिए है।\n\nतुम्हारे ${input.occasion} पर मुझे बार-बार ${memory} याद आता है। लेकिन सबसे ज़्यादा जो बात दिल में रहती है, वह है ${detail}। तुम्हारा ${relationship} होना मेरे लिए कभी साधारण बात नहीं रही।\n\nआने वाला समय ${future} से भरा हो। आज का दिन सिर्फ़ एक उत्सव नहीं, बल्कि उन सभी खूबसूरत चीज़ों की शुरुआत बने जिनके तुम हक़दार हो।`;
  }

  if (input.language === "Tamil") {
    return `${name}, இது சாதாரணமாக எங்கிருந்தோ எடுத்த வாழ்த்து அல்ல. இது உனக்காக மட்டும் எழுதப்பட்டது.\n\nஉன் ${input.occasion} நாளில் எனக்கு மீண்டும் நினைவிற்கு வருவது ${memory}. அதைவிட மனதில் நிற்பது ${detail}. உன் ${relationship} ஆக இருப்பது எனக்கு ஒருபோதும் சாதாரணமாக தோன்றவில்லை.\n\nவரும் நாட்கள் ${future} கொண்டு நிரம்பட்டும். இன்று ஒரு கொண்டாட்ட நாளாக மட்டும் இல்லாமல், நீ உண்மையில் பெற தகுதியான எல்லா நல்ல விஷயங்களின் தொடக்கமாக இருக்கட்டும்.`;
  }

  if (input.language === "Hinglish") {
    return `${name}, yeh koi copied wish nahi hai. Yeh sirf tumhare liye hai.\n\nTumhare ${input.occasion} par mujhe baar-baar ${memory} yaad aata hai. Lekin sabse zyada dil mein rehta hai ${detail}. Tumhara ${relationship} hona mere liye kabhi ordinary nahi raha.\n\nAane wala waqt ${future} se bhara ho. Aaj ka celebration sirf ek special day na ho, balki un sab khoobsurat cheezon ki shuruaat ho jinke tum sach mein haqdar ho.`;
  }

  return `${opening}\n\n${body}\n\n${closing}`;
}

export function CelebrationStudio() {
  const [draft, setDraft] = useState("");
  const [form, setForm] = useState<DraftInput>({
    recipient: "",
    relationship: "",
    occasion: "Birthday",
    language: "English",
    tone: "Warm",
    detail: "",
    memory: "",
    future: "",
  });

  const completion = useMemo(() => {
    const fields = [form.recipient, form.relationship, form.detail, form.memory, form.future];
    return Math.round((fields.filter((value) => value.trim()).length / fields.length) * 100);
  }, [form]);

  function update<K extends keyof DraftInput>(key: K, value: DraftInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setDraft(buildDraft(form));
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>Intezaar</Link>
        <nav aria-label="Celebration navigation">
          <Link href="/">Home</Link>
          <Link href="/create">Write a letter</Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p>Celebration letters across India</p>
          <h1>Do not send another wish that could belong to anyone.</h1>
          <span>Tell us who they are, what you remember and what you genuinely want for them. Intezaar shapes those details into a letter that still sounds like you.</span>
        </div>
        <div className={styles.note} aria-hidden="true">
          <small>For Meera · Onam</small>
          <strong>The flowers were never perfectly arranged. That was always the best part.</strong>
          <em>Written from one real detail</em>
        </div>
      </section>

      <section className={styles.studio}>
        <form className={styles.form} onSubmit={submit}>
          <div className={styles.formHeading}>
            <div>
              <p>Personalisation interview</p>
              <h2>Give the letter a real person to belong to.</h2>
            </div>
            <span>{completion}% personal detail added</span>
          </div>

          <div className={styles.grid}>
            <label>Recipient name<input value={form.recipient} onChange={(e) => update("recipient", e.target.value)} placeholder="Anjali" /></label>
            <label>Your relationship<input value={form.relationship} onChange={(e) => update("relationship", e.target.value)} placeholder="younger brother, closest friend…" /></label>
            <label>Celebration<select value={form.occasion} onChange={(e) => update("occasion", e.target.value)}>{occasions.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Language<select value={form.language} onChange={(e) => update("language", e.target.value)}>{languages.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Tone<select value={form.tone} onChange={(e) => update("tone", e.target.value)}>{tones.map((item) => <option key={item}>{item}</option>)}</select></label>
          </div>

          <label>What tiny thing makes them unmistakably themselves?<textarea value={form.detail} onChange={(e) => update("detail", e.target.value)} placeholder="She calls everyone after reaching home, even when it is late…" /></label>
          <label>Share one memory only the two of you would understand.<textarea value={form.memory} onChange={(e) => update("memory", e.target.value)} placeholder="The Onam when the pookalam collapsed and we rebuilt it before Amma came back…" /></label>
          <label>What do you truly want for their next chapter?<textarea value={form.future} onChange={(e) => update("future", e.target.value)} placeholder="the courage to choose herself without feeling guilty…" /></label>

          <button type="submit">Create my personalised letter</button>
          <p className={styles.privacy}>Your answers stay in this browser in this prototype. Nothing is published or sent automatically. Review every word before sharing.</p>
        </form>

        <aside className={styles.preview} aria-live="polite">
          <p>Editable letter draft</p>
          {draft ? (
            <>
              <div className={styles.draft}>{draft.split("\n").map((line, index) => <span key={`${line}-${index}`}>{line || <br />}</span>)}</div>
              <div className={styles.actions}>
                <button type="button" onClick={() => navigator.clipboard?.writeText(draft)}>Copy letter</button>
                <Link href="/create">Send as a travelling letter</Link>
              </div>
            </>
          ) : (
            <div className={styles.empty}>
              <strong>Your words will appear here.</strong>
              <span>The more specific your answers, the less the result will sound like a generic greeting card.</span>
            </div>
          )}
        </aside>
      </section>

      <section className={styles.occasions}>
        <p>Designed for Indian celebrations</p>
        <div>{occasions.map((occasion) => <span key={occasion}>{occasion}</span>)}</div>
      </section>
    </main>
  );
}
