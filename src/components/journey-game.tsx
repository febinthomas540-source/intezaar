"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { JourneyStage, MemoryArtifactType, JourneySoundKind, demoJourney } from "@/lib/journey";
import { JourneyStageCard } from "@/components/journey-stage";
import { LetterOpening } from "@/components/letter-opening";
import styles from "./journey-game.module.css";
import nostalgia from "./nostalgia.module.css";

let activeAmbientContext: AudioContext | null = null;

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  utterance.voice =
    voices.find((voice) => voice.lang === "en-IN") ??
    voices.find((voice) => voice.lang.startsWith("en-GB")) ??
    voices.find((voice) => voice.lang.startsWith("en")) ??
    null;
  utterance.rate = 0.88;
  utterance.pitch = 0.94;
  window.speechSynthesis.speak(utterance);
}

function playAmbientMemory(kind: JourneySoundKind, onEnd: () => void) {
  if (typeof window === "undefined" || !window.AudioContext) {
    onEnd();
    return;
  }

  void activeAmbientContext?.close();
  const context = new AudioContext();
  activeAmbientContext = context;
  const duration = 8;
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, context.currentTime);
  master.gain.exponentialRampToValueAtTime(0.055, context.currentTime + 0.7);
  master.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
  master.connect(context.destination);

  const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate);
  const data = buffer.getChannelData(0);
  let previous = 0;
  for (let index = 0; index < data.length; index += 1) {
    const white = Math.random() * 2 - 1;
    previous = previous * 0.985 + white * 0.015;
    data[index] = previous * 2.4;
  }

  const noise = context.createBufferSource();
  noise.buffer = buffer;
  const filter = context.createBiquadFilter();
  filter.type = kind === "rain" ? "highpass" : "lowpass";
  filter.frequency.value =
    kind === "rain" ? 950 : kind === "sea" ? 520 : kind === "station" ? 780 : kind === "rail" ? 340 : 260;
  const noiseGain = context.createGain();
  noiseGain.gain.value = kind === "night" ? 0.24 : 0.5;
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(master);

  const hum = context.createOscillator();
  hum.type = "sine";
  hum.frequency.value = kind === "rail" ? 72 : kind === "station" ? 110 : kind === "sea" ? 96 : 180;
  const humGain = context.createGain();
  humGain.gain.value = kind === "rain" ? 0.015 : 0.045;
  hum.connect(humGain);
  humGain.connect(master);

  const lfo = context.createOscillator();
  lfo.frequency.value = kind === "rail" ? 2.2 : kind === "sea" ? 0.18 : 0.42;
  const lfoGain = context.createGain();
  lfoGain.gain.value = kind === "rail" ? 0.025 : 0.018;
  lfo.connect(lfoGain);
  lfoGain.connect(master.gain);

  noise.start();
  hum.start();
  lfo.start();
  noise.stop(context.currentTime + duration);
  hum.stop(context.currentTime + duration);
  lfo.stop(context.currentTime + duration);

  window.setTimeout(() => {
    if (activeAmbientContext === context) activeAmbientContext = null;
    void context.close();
    onEnd();
  }, duration * 1000 + 150);
}

function parseStoredSet(key: string) {
  try {
    const value = window.localStorage.getItem(key);
    return new Set<string>(value ? JSON.parse(value) : []);
  } catch {
    return new Set<string>();
  }
}

function artifactClass(type: MemoryArtifactType) {
  const classes: Record<MemoryArtifactType, string> = {
    "old-sms": nostalgia.oldSms,
    diary: nostalgia.diary,
    "cinema-ticket": nostalgia.cinemaTicket,
    "bus-ticket": nostalgia.busTicket,
    "voice-note": nostalgia.voiceNote,
    polaroid: nostalgia.polaroid,
    cassette: nostalgia.cassette,
    email: nostalgia.email,
    postcard: nostalgia.postcardArtifact,
    "inland-letter": nostalgia.inlandLetter,
  };
  return classes[type];
}

function artifactSymbol(type: MemoryArtifactType) {
  const symbols: Record<MemoryArtifactType, string> = {
    "old-sms": "▦",
    diary: "✎",
    "cinema-ticket": "◫",
    "bus-ticket": "↟",
    "voice-note": "▥",
    polaroid: "□",
    cassette: "◉",
    email: "@",
    postcard: "✦",
    "inland-letter": "✉",
  };
  return symbols[type];
}

function Postman({ stage }: { stage: JourneyStage }) {
  return (
    <section className={styles.postmanCard}>
      <div className={styles.postmanScene} aria-hidden="true">
        <motion.div
          className={styles.postman}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className={styles.cap} />
          <span className={styles.face}><i /><b /></span>
          <span className={styles.body} />
          <span className={styles.bag}>✉</span>
          <span className={styles.arm} />
        </motion.div>
        <div className={styles.postmanShadow} />
      </div>
      <div className={styles.postmanCopy}>
        <span className={styles.kicker}>Arin · carrying this quietly</span>
        <AnimatePresence mode="wait">
          <motion.p
            key={stage.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            “{stage.postmanLine}”
          </motion.p>
        </AnimatePresence>
        <button type="button" onClick={() => speak(stage.postmanLine)}>
          <span>◉</span> Listen, if you want
        </button>
      </div>
    </section>
  );
}

function QuietRitual({ stage, completed, onComplete }: { stage: JourneyStage; completed: boolean; onComplete: () => void }) {
  const [holding, setHolding] = useState(false);
  if (!stage.ritual) return null;

  const completeUmbrella = () => {
    if (completed || holding) return;
    setHolding(true);
    window.setTimeout(() => {
      setHolding(false);
      onComplete();
    }, 1200);
  };

  return (
    <section className={styles.ritualCard}>
      <div>
        <span>One quiet ritual</span>
        <h3>{stage.ritual.title}</h3>
        <p>{completed ? stage.ritual.completion : stage.ritual.instruction}</p>
      </div>
      {stage.ritual.type === "stamp" && (
        <button type="button" className={`${styles.ritualStamp} ${completed ? styles.ritualComplete : ""}`} onClick={onComplete} disabled={completed}>
          <strong>{stage.stamp}</strong>
          <small>{completed ? "REMEMBERED" : "PLACE POSTMARK"}</small>
        </button>
      )}
      {stage.ritual.type === "umbrella" && (
        <button type="button" className={`${styles.umbrellaRitual} ${holding || completed ? styles.umbrellaActive : ""}`} onClick={completeUmbrella} disabled={completed}>
          <span>☂</span>
          <small>{completed ? "The words stayed dry" : holding ? "Stay for a moment…" : "Hold the umbrella"}</small>
        </button>
      )}
      {stage.ritual.type === "receive" && (
        <button type="button" className={`${styles.receiveRitual} ${completed ? styles.receiveComplete : ""}`} onClick={onComplete} disabled={completed}>
          <span>✉</span>
          <strong>{completed ? "Received with care" : "Receive the letter"}</strong>
        </button>
      )}
    </section>
  );
}

function DateAndDetail({ stage }: { stage: JourneyStage }) {
  return (
    <section className={nostalgia.detailGrid}>
      <article className={nostalgia.dateCard}>
        <span>A date that still means something</span>
        <strong>{stage.memoryDate}</strong>
        <p>{stage.memoryDateCaption}</p>
      </article>
      <article className={nostalgia.rememberedCard}>
        <span>I remembered this about you</span>
        <p>“{stage.rememberedDetail}”</p>
        <small>Not a grand memory. Just proof that somebody noticed.</small>
      </article>
    </section>
  );
}

function MemoryFragment({ stage, collected, onCollect }: { stage: JourneyStage; collected: boolean; onCollect: () => void }) {
  return (
    <section className={`${styles.fragmentCard} ${nostalgia.artifactCard}`}>
      <div className={`${styles.fragmentVisual} ${nostalgia.artifactVisual} ${artifactClass(stage.artifact.type)}`} aria-hidden="true">
        <span className={nostalgia.artifactSymbol}>{artifactSymbol(stage.artifact.type)}</span>
        <div className={nostalgia.artifactPaper}>
          <small>{stage.artifact.kicker}</small>
          <strong>{stage.artifact.title}</strong>
          <p>{stage.artifact.body}</p>
          <em>{stage.artifact.footer}</em>
        </div>
        <span className={nostalgia.artifactTape} />
      </div>
      <div className={styles.fragmentCopy}>
        <span>Something from the old days surfaced</span>
        <h3>{stage.keepsakeName}</h3>
        <p>{stage.keepsakeDetail}</p>
        <button type="button" onClick={onCollect} disabled={collected}>
          {collected ? "Kept in your memory box" : "Keep this fragment"}
        </button>
      </div>
    </section>
  );
}

function SensoryMemory({ stage }: { stage: JourneyStage }) {
  const [playing, setPlaying] = useState(false);

  const play = () => {
    if (playing) return;
    setPlaying(true);
    playAmbientMemory(stage.soundMemory.kind, () => setPlaying(false));
  };

  return (
    <section className={nostalgia.sensoryGrid}>
      <article className={nostalgia.culturalCard}>
        <span>The place remembers too</span>
        <p>{stage.culturalDetail}</p>
      </article>
      <article className={nostalgia.soundCard}>
        <div>
          <span>A sound from that time</span>
          <h3>{stage.soundMemory.title}</h3>
          <p>{stage.soundMemory.detail}</p>
        </div>
        <button type="button" onClick={play} disabled={playing}>
          <i className={playing ? nostalgia.soundPlaying : ""} />
          {playing ? "Listening…" : "Listen for eight seconds"}
        </button>
      </article>
    </section>
  );
}

function MemoryPrompt({ stage, value, saved, onChange, onSave }: { stage: JourneyStage; value: string; saved: boolean; onChange: (value: string) => void; onSave: () => void }) {
  return (
    <section className={styles.memoryPrompt}>
      <span>A question only for you</span>
      <h3>{stage.memoryPrompt}</h3>
      <p>You do not need to answer. Write one line only if something comes back.</p>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder="A memory, a sentence, or nothing at all…" rows={3} />
      <button type="button" onClick={onSave} disabled={!value.trim()}>{saved ? "Memory kept privately" : "Keep this memory"}</button>
    </section>
  );
}

function MemoryBox({ collectedIds, notes, savedMemoryIds, firstVisit }: { collectedIds: Set<string>; notes: Record<string, string>; savedMemoryIds: Set<string>; firstVisit: string }) {
  const keptStages = demoJourney.filter((stage) => collectedIds.has(stage.id));
  const writtenStages = demoJourney.filter((stage) => savedMemoryIds.has(stage.id) && notes[stage.id]);
  const firstVisitLabel = firstVisit
    ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(firstVisit))
    : "today";

  return (
    <section className={styles.memoryBox}>
      <div className={styles.memoryBoxHead}>
        <span>Your private memory box</span>
        <strong>{keptStages.length} fragments · {writtenStages.length} memories</strong>
      </div>
      <div className={nostalgia.archiveNote}>
        <span>First found you</span>
        <strong>{firstVisitLabel}</strong>
        <p>This browser will remember when the journey first arrived. The real product can bring the complete letter back on meaningful anniversaries.</p>
      </div>
      {keptStages.length === 0 && writtenStages.length === 0 ? (
        <div className={styles.emptyMemoryBox}><span>✦</span><p>Fragments you choose to keep will wait here. There are no points, streaks or missed days.</p></div>
      ) : (
        <div className={styles.memoryCollection}>
          {keptStages.map((stage) => (
            <article key={`fragment-${stage.id}`}>
              <span>{artifactSymbol(stage.artifact.type)}</span>
              <div><strong>{stage.artifact.title}</strong><small>{stage.memoryDate} · {stage.city}</small></div>
            </article>
          ))}
          {writtenStages.map((stage) => (
            <article key={`note-${stage.id}`} className={styles.writtenMemory}><span>“</span><div><strong>{notes[stage.id]}</strong><small>Your memory · {stage.city}</small></div></article>
          ))}
        </div>
      )}
    </section>
  );
}

export function JourneyGame() {
  const [index, setIndex] = useState(0);
  const [tab, setTab] = useState<"journey" | "memories">("journey");
  const [collectedIds, setCollectedIds] = useState<Set<string>>(new Set());
  const [ritualIds, setRitualIds] = useState<Set<string>>(new Set());
  const [savedMemoryIds, setSavedMemoryIds] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [firstVisit, setFirstVisit] = useState("");
  const stage = useMemo(() => demoJourney[index], [index]);
  const nextStage = demoJourney[index + 1];

  useEffect(() => {
    setCollectedIds(parseStoredSet("intezaar-collected-fragments"));
    setRitualIds(parseStoredSet("intezaar-completed-rituals"));
    setSavedMemoryIds(parseStoredSet("intezaar-saved-memories"));
    try {
      const savedNotes = window.localStorage.getItem("intezaar-memory-notes");
      if (savedNotes) setNotes(JSON.parse(savedNotes));
      const savedFirstVisit = window.localStorage.getItem("intezaar-first-visit");
      const visit = savedFirstVisit ?? new Date().toISOString();
      if (!savedFirstVisit) window.localStorage.setItem("intezaar-first-visit", visit);
      setFirstVisit(visit);
    } catch {
      setNotes({});
    }
  }, []);

  const storeSet = (key: string, value: Set<string>) => window.localStorage.setItem(key, JSON.stringify(Array.from(value)));

  const collectFragment = () => setCollectedIds((current) => {
    const next = new Set(current); next.add(stage.id); storeSet("intezaar-collected-fragments", next); return next;
  });

  const completeRitual = () => setRitualIds((current) => {
    const next = new Set(current); next.add(stage.id); storeSet("intezaar-completed-rituals", next); return next;
  });

  const updateNote = (value: string) => {
    setNotes((current) => ({ ...current, [stage.id]: value }));
    setSavedMemoryIds((current) => {
      if (!current.has(stage.id)) return current;
      const next = new Set(current); next.delete(stage.id); return next;
    });
  };

  const saveMemory = () => {
    if (!notes[stage.id]?.trim()) return;
    window.localStorage.setItem("intezaar-memory-notes", JSON.stringify(notes));
    setSavedMemoryIds((current) => {
      const next = new Set(current); next.add(stage.id); storeSet("intezaar-saved-memories", next); return next;
    });
  };

  return (
    <>
      <section className={styles.gameHeader}>
        <div><p>Private journey · For Ananya</p><h1>Something you once felt<br />is travelling back to you.</h1></div>
        <div className={styles.arrivalCard}><span>Arriving after</span><strong>3 more evenings</strong><small>17 August · 12:00 AM</small></div>
      </section>

      <section className={styles.gameShell}>
        <div className={styles.mainColumn}>
          <JourneyStageCard stage={stage} />
          <div className={styles.stageNavigation}>
            <button type="button" onClick={() => setIndex((current) => Math.max(0, current - 1))} disabled={index === 0}>← Earlier</button>
            <span>{index + 1} of {demoJourney.length}</span>
            <button type="button" onClick={() => setIndex((current) => Math.min(demoJourney.length - 1, current + 1))} disabled={index === demoJourney.length - 1}>Later →</button>
          </div>
          <DateAndDetail stage={stage} />
          <Postman stage={stage} />
          <MemoryFragment stage={stage} collected={collectedIds.has(stage.id)} onCollect={collectFragment} />
          <SensoryMemory stage={stage} />
          <section className={styles.postcard}><span>Postcard from the road</span><h3>{stage.postcardTitle}</h3><p>{stage.postcardBody}</p><small>— Arin</small></section>
          <QuietRitual stage={stage} completed={ritualIds.has(stage.id)} onComplete={completeRitual} />
          <MemoryPrompt stage={stage} value={notes[stage.id] ?? ""} saved={savedMemoryIds.has(stage.id)} onChange={updateNote} onSave={saveMemory} />
        </div>

        <aside className={styles.sideColumn}>
          <div className={styles.tabs}>
            <button type="button" className={tab === "journey" ? styles.tabActive : ""} onClick={() => setTab("journey")}>Journey</button>
            <button type="button" className={tab === "memories" ? styles.tabActive : ""} onClick={() => setTab("memories")}>Memory box</button>
          </div>
          {tab === "journey" ? (
            <div className={styles.timeline}>
              <div className={styles.timelineHead}><span>The road so far</span><strong>{stage.progress}%</strong></div>
              <div className={styles.progress}><i style={{ width: `${stage.progress}%` }} /></div>
              <div className={styles.chapterList}>
                {demoJourney.map((item, itemIndex) => (
                  <button type="button" key={item.id} onClick={() => setIndex(itemIndex)} className={itemIndex === index ? styles.chapterActive : ""}>
                    <span>{itemIndex < index ? "·" : itemIndex + 1}</span>
                    <div><strong>{item.city}</strong><small>{item.memoryDate}</small></div>
                    <i>{itemIndex <= index ? item.stamp : ""}</i>
                  </button>
                ))}
              </div>
              <div className={styles.traceCard}><span>Today’s memory trace</span><p>“{stage.trace}”</p></div>
              <div className={styles.returnCard}><span>{nextStage ? "When you return" : "The journey has arrived"}</span><p>{nextStage ? `Another object from the past will surface near ${nextStage.city}.` : "The postcards, sounds and memories will remain after the seal is opened."}</p><small>No streaks. Nothing is lost if you come back late.</small></div>
            </div>
          ) : (
            <MemoryBox collectedIds={collectedIds} notes={notes} savedMemoryIds={savedMemoryIds} firstVisit={firstVisit} />
          )}
        </aside>
      </section>

      <div className={styles.openingDivider}><span>When the promised moment arrives</span></div>
      <LetterOpening />
    </>
  );
}