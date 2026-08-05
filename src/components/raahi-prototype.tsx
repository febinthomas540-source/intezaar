"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { RainGlass } from "./rain-glass";
import styles from "./raahi-prototype.module.css";

type Props = {
  recipient: string;
  previewDay?: number;
};

type Countdown = {
  hours: number;
  minutes: number;
  seconds: number;
};

type JournalPage = {
  eyebrow: string;
  title: string;
  date: string;
  body: string;
  note: string;
  image?: string;
  imageAlt?: string;
  type: "photo" | "note" | "voice" | "keepsake" | "letter";
};

const DAY_MS = 24 * 60 * 60 * 1000;
const PAGE_COUNT = 5;

const journalPages: JournalPage[] = [
  {
    eyebrow: "Memory one · Photograph",
    title: "The room after everyone left",
    date: "20 July 2019 · Monsoon season",
    body: "We did not take many photographs that day. Somehow this is the one I kept.",
    note: "I still remember how quiet the room became after everyone left. We stayed a little longer, simply because neither of us wanted the day to end.",
    image: "https://images.pexels.com/photos/15814837/pexels-photo-15814837.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageAlt: "An old room with photographs and warm window light",
    type: "photo",
  },
  {
    eyebrow: "Memory two · Written fragment",
    title: "The sentence at the back of the notebook",
    date: "Undated · blue ink",
    body: "Copied from a page whose corners had already started to soften.",
    note: "Every journey felt shorter when someone waited at the end.",
    type: "note",
  },
  {
    eyebrow: "Memory three · Voice",
    title: "Seven seconds of rain and laughter",
    date: "11 August 2020 · 00:28",
    body: "A short recording from an ordinary evening that became difficult to forget.",
    note: "You can hear the rain first. Then the cup touches the table. Then you laugh.",
    type: "voice",
  },
  {
    eyebrow: "Memory four · Keepsake",
    title: "The ticket that stayed in my wallet",
    date: "Platform 3 · 18:45",
    body: "There was no sensible reason to keep it. That may be why it mattered.",
    note: "The train was late. The tea was terrible. We still wished the platform would last longer.",
    type: "keepsake",
  },
  {
    eyebrow: "Final page · Sealed letter",
    title: "For the person who waited",
    date: "Opened after every memory arrived",
    body: "By the time you read this, the smaller memories will already have explained why these words took so long to reach you.",
    note: "Some things are easier to say after the photographs, the familiar sounds and the little objects have returned first. I hope this journey felt less like receiving a message and more like finding a part of us again.",
    type: "letter",
  },
];

function toCountdown(ms: number): Countdown {
  const safe = Math.max(0, ms);
  return {
    hours: Math.floor(safe / 3_600_000),
    minutes: Math.floor((safe % 3_600_000) / 60_000),
    seconds: Math.floor((safe % 60_000) / 1000),
  };
}

function CountdownDisplay({ value, compact = false }: { value: Countdown; compact?: boolean }) {
  if (compact) {
    return <span>{String(value.hours).padStart(2, "0")}h {String(value.minutes).padStart(2, "0")}m</span>;
  }

  return (
    <div className={styles.countdown} aria-live="polite">
      <span><b>{String(value.hours).padStart(2, "0")}</b><small>hours</small></span>
      <span><b>{String(value.minutes).padStart(2, "0")}</b><small>minutes</small></span>
      <span><b>{String(value.seconds).padStart(2, "0")}</b><small>seconds</small></span>
    </div>
  );
}

function LockMark({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={open ? "M7 11V8a5 5 0 0 1 9.3-2.5" : "M7 11V8a5 5 0 0 1 10 0v3"} />
      <rect x="5" y="11" width="14" height="10" rx="2" />
    </svg>
  );
}

function PageArtwork({ page }: { page: JournalPage }) {
  if (page.type === "photo" && page.image) {
    return (
      <figure className={styles.photoFrame}>
        <i className={styles.tapeOne} />
        <i className={styles.tapeTwo} />
        <img src={page.image} alt={page.imageAlt ?? "A private memory"} />
      </figure>
    );
  }

  if (page.type === "voice") {
    return (
      <div className={styles.voiceArtifact}>
        <button type="button" aria-label="Play the sample voice memory">▶</button>
        <div>
          <span className={styles.waveform}>▂ ▅ ▃ ▇ ▄ ▆ ▂ ▅ ▇ ▃ ▆ ▂ ▄</span>
          <small>00:28 · Rain outside the tea shop</small>
        </div>
      </div>
    );
  }

  if (page.type === "keepsake") {
    return (
      <div className={styles.ticketArtifact}>
        <span>KSRTC</span>
        <strong>Kottayam → Alappuzha</strong>
        <div><b>18:45</b><small>Seat 17 · Rain service</small></div>
      </div>
    );
  }

  if (page.type === "letter") {
    return (
      <div className={styles.letterArtifact}>
        <span>Intezaar</span>
        <strong>A letter kept sealed until the last page</strong>
        <i>For you</i>
      </div>
    );
  }

  return (
    <div className={styles.notebookFragment}>
      <span>Copied exactly as it was written</span>
      <p>“Every journey felt shorter<br />when someone waited<br />at the end.”</p>
    </div>
  );
}

export function RaahiPrototype({ recipient, previewDay }: Props) {
  const previewCount = Number(previewDay);
  const hasPreview = Number.isFinite(previewCount) && previewCount >= 1;
  const forcedCount = hasPreview ? Math.min(PAGE_COUNT, Math.floor(previewCount)) : 1;
  const [unlockedCount, setUnlockedCount] = useState(forcedCount);
  const [currentIndex, setCurrentIndex] = useState(Math.max(0, forcedCount - 1));
  const [countdown, setCountdown] = useState<Countdown>(() => toCountdown(DAY_MS));

  useEffect(() => {
    if (hasPreview) {
      setUnlockedCount(forcedCount);
      setCurrentIndex(Math.max(0, forcedCount - 1));
      setCountdown(toCountdown(DAY_MS));
      return;
    }

    const storageKey = `intezaar:notebook-first-open:${recipient.toLowerCase()}`;
    const existing = Number(window.localStorage.getItem(storageKey));
    const firstOpen = Number.isFinite(existing) && existing > 0 ? existing : Date.now();
    if (!existing) window.localStorage.setItem(storageKey, String(firstOpen));

    const update = () => {
      const elapsed = Math.max(0, Date.now() - firstOpen);
      const available = Math.min(PAGE_COUNT, Math.floor(elapsed / DAY_MS) + 1);
      const nextUnlockAt = firstOpen + available * DAY_MS;
      setUnlockedCount(available);
      setCountdown(toCountdown(available >= PAGE_COUNT ? 0 : nextUnlockAt - Date.now()));
      setCurrentIndex((current) => Math.min(current, available - 1));
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [forcedCount, hasPreview, recipient]);

  const activePage = journalPages[currentIndex];
  const allUnlocked = unlockedCount >= PAGE_COUNT;
  const nextPageIndex = Math.min(unlockedCount, PAGE_COUNT - 1);
  const nextPage = journalPages[nextPageIndex];

  const waitingCopy = useMemo(() => {
    if (allUnlocked) return "Every page has opened. The complete keepsake is ready.";
    if (unlockedCount === 1) return "The next page is already inside the journal. It opens tomorrow.";
    return `${PAGE_COUNT - unlockedCount} pages are still waiting inside the journal.`;
  }, [allUnlocked, unlockedCount]);

  function openPage(index: number) {
    if (index >= unlockedCount) return;
    setCurrentIndex(index);
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>Intezaar</Link>
        <span>A private memory journal for {recipient}</span>
      </header>

      <section className={styles.journalStage}>
        <RainGlass intensity="soft" className="recipient-rain" />
        <div className={styles.moon} aria-hidden="true" />
        <div className={styles.grain} />

        <aside className={styles.intro}>
          <p>A private journal · {unlockedCount} of {PAGE_COUNT} pages open</p>
          <h1>{recipient}, this journal opens one page at a time.</h1>
          <span>Every page keeps one photograph, voice, object or written memory. The final letter opens last.</span>
          {!allUnlocked ? <CountdownDisplay value={countdown} /> : null}
          <div className={styles.keepsakeTease}>
            <div className={styles.miniBook}><i /><b>Our journey</b><small>A4 keepsake</small></div>
            <p>After the final page, the entire journal can be saved as a designed A4 memory book.</p>
          </div>
        </aside>

        <div className={styles.bookScene}>
          <div className={styles.deskGlow} aria-hidden="true" />
          <div className={styles.book}>
            <article className={styles.leftPage} key={currentIndex}>
              <div className={styles.pageHeading}>
                <span>Page {currentIndex + 1} of {PAGE_COUNT}</span>
                <i />
              </div>

              <PageArtwork page={activePage} />

              <div className={styles.pageCopy}>
                <small>{activePage.eyebrow}</small>
                <h2>{activePage.title}</h2>
                <span className={styles.pageDate}>{activePage.date}</span>
                <p className={styles.handwritten}>{activePage.note}</p>
                <p>{activePage.body}</p>
              </div>

              {activePage.type === "letter" && allUnlocked ? (
                <button className={styles.pdfButton} type="button" onClick={() => window.print()}>
                  Save the complete journal as PDF
                </button>
              ) : null}

              <span className={styles.postmark}>Intezaar · kept for {recipient}</span>
            </article>

            <div className={styles.spine} aria-hidden="true"><i /></div>

            <aside className={styles.rightPage}>
              <div className={styles.pressedFlower} aria-hidden="true"><i /><i /><i /><i /></div>

              {!allUnlocked ? (
                <div className={styles.waitingPage}>
                  <span>Next page</span>
                  <h3>{nextPage.title}</h3>
                  <p>{waitingCopy}</p>
                  <CountdownDisplay value={countdown} />
                </div>
              ) : (
                <div className={styles.finishedPage}>
                  <span>The journal is complete</span>
                  <h3>Nothing is blurred anymore.</h3>
                  <p>Return to any page, reread the final letter, or save everything as one keepsake.</p>
                  <button type="button" onClick={() => window.print()}>
                    Create the A4 keepsake
                  </button>
                </div>
              )}

              <div className={styles.pageLayers} aria-hidden="true"><i /><i /><i /><i /></div>

              <nav className={styles.tabs} aria-label="Journal pages">
                {journalPages.map((page, index) => {
                  const unlocked = index < unlockedCount;
                  const active = index === currentIndex;
                  const daysAway = index - unlockedCount + 1;
                  const isNext = index === unlockedCount && !allUnlocked;
                  const tabStyle = { "--tab-index": index } as CSSProperties;

                  return (
                    <button
                      type="button"
                      key={page.title}
                      className={`${styles.tab} ${unlocked ? styles.tabUnlocked : styles.tabLocked} ${active ? styles.tabActive : ""}`}
                      style={tabStyle}
                      onClick={() => openPage(index)}
                      disabled={!unlocked}
                      aria-label={unlocked ? `Open page ${index + 1}: ${page.title}` : `Page ${index + 1} is locked`}
                    >
                      <span>
                        {index === PAGE_COUNT - 1 ? "Final letter" : `Page ${index + 1}`}
                        <small>
                          {active ? "Reading now" : unlocked ? "Open" : isNext ? <CountdownDisplay value={countdown} compact /> : `In ${Math.max(1, daysAway)} days`}
                        </small>
                      </span>
                      <LockMark open={unlocked} />
                    </button>
                  );
                })}
              </nav>
            </aside>
          </div>
        </div>
      </section>

      <section className={styles.howItWorks}>
        <p>How this journal works</p>
        <h2>One page today. Another when its time arrives.</h2>
        <div>
          <article><span>01</span><h3>The sender fills the pages</h3><p>Photographs, notes, recordings, keepsakes and one final letter.</p></article>
          <article><span>02</span><h3>The journal controls the wait</h3><p>Only unlocked tabs can be opened. Earlier pages always remain available.</p></article>
          <article><span>03</span><h3>The final page becomes a keepsake</h3><p>After the letter opens, the complete journal can be saved as an A4 PDF.</p></article>
        </div>
      </section>

      <section className={styles.printJournal} aria-label="Printable Intezaar memory journal">
        {journalPages.map((page, index) => (
          <article className={styles.printPage} key={`print-${page.title}`}>
            <header><span>Intezaar</span><small>Page {index + 1} of {PAGE_COUNT} · For {recipient}</small></header>
            {page.image ? <img src={page.image} alt="" /> : <div className={styles.printArtifact}>{page.type === "voice" ? "Voice memory · 00:28" : page.type === "keepsake" ? "Kept ticket · Platform 3" : page.type === "letter" ? "The final sealed letter" : "Written memory"}</div>}
            <p className={styles.printEyebrow}>{page.eyebrow}</p>
            <h2>{page.title}</h2>
            <span className={styles.printDate}>{page.date}</span>
            <blockquote>{page.note}</blockquote>
            <p>{page.body}</p>
            <footer>Memories that took time to arrive.</footer>
          </article>
        ))}
      </section>

      <footer className={styles.footer}>
        <strong>Intezaar</strong>
        <span>Some memories need time before they make sense.</span>
      </footer>
    </main>
  );
}
