"use client";

import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { recipientJourneyDays, type RecipientJourneyDay } from "@/lib/recipient-journey";
import { RecipientScene } from "./recipient-scene";
import styles from "./recipient-story.module.css";

type Props = { recipient: string };

function Artifact({ day }: { day: RecipientJourneyDay }) {
  const dynamic = styles[`artifact${day.artifactType}`];

  return (
    <div className={`${styles.artifact} ${dynamic ?? ""}`}>
      <span>{day.artifactLabel}</span>
      {day.artifactType === "voice" ? (
        <div className={styles.waveform} aria-hidden="true">
          {[20, 38, 24, 54, 31, 66, 28, 47, 21, 51, 30, 60].map((height, index) => (
            <i key={index} style={{ height }} />
          ))}
        </div>
      ) : null}
      {day.artifactType === "letter" ? <div className={styles.smallEnvelope}><b>I</b></div> : null}
      <strong>{day.detail}</strong>
    </div>
  );
}

export function RecipientStory({ recipient }: Props) {
  const storyRef = useRef<HTMLElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });
  const trainBob = useTransform(progress, [0, 1], [0, reduceMotion ? 0 : 8]);

  return (
    <main className={styles.shell} ref={storyRef}>
      <header className={`${styles.header} ${styles.screenOnly}`}>
        <Link href="/" className={styles.brand} aria-label="Intezaar home">
          <span>I</span><strong>Intezaar</strong>
        </Link>
        <button type="button" className={styles.pdfButton} onClick={() => window.print()}>
          Save journey as PDF
        </button>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroCopy}>
          <p>Private railway letter for {recipient}</p>
          <h1>A letter travelled<br />all this way <em>to reach you.</em></h1>
          <span>Scroll slowly. Every station kept one part of the memory.</span>
        </div>
        <div className={styles.notificationCard}>
          <div><span>I</span><strong>Intezaar</strong><small>now</small></div>
          <p><b>{recipient},</b> your private mail train has departed Delhi.</p>
        </div>
        <div className={styles.heroTrain} aria-hidden="true">
          <div className={styles.heroEngine}><i /><i /></div>
          <div className={styles.heroCoach}><span>भारतीय रेल</span><small>POST &amp; MEMORIES</small><i /><i /></div>
        </div>
        <div className={styles.scrollCue}>Follow the railway line ↓</div>
      </section>

      <section className={styles.journey}>
        <aside className={`${styles.routeRail} ${styles.screenOnly}`} aria-hidden="true">
          <div className={styles.railBase} />
          <motion.div className={styles.railProgress} style={{ scaleY: progress }} />
          <div className={styles.stickyTrainWrap}>
            <motion.div className={styles.miniTrain} style={{ y: trainBob }}>
              <span className={styles.miniEngine} /><span className={styles.miniCoach} /><i /><i /><i />
            </motion.div>
          </div>
        </aside>

        <div className={styles.chapters}>
          {recipientJourneyDays.map((day, index) => (
            <div key={day.day} className={styles.chapterGroup}>
              <motion.article
                className={`${styles.stationChapter} ${index % 2 ? styles.chapterReverse : ""}`}
                initial={reduceMotion ? false : { opacity: 0, y: 42, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: .85, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={styles.stationScene}>
                  <RecipientScene day={day} phase="revealed" reduceMotion={reduceMotion} />
                  <div className={styles.stationStamp}>
                    <span>{day.routeLabel}</span>
                    <strong>{day.station}</strong>
                    <small>{day.time} · {day.weather}</small>
                  </div>
                </div>

                <div className={styles.memoryPanel}>
                  <div className={styles.dayNumber}>{String(day.day).padStart(2, "0")}</div>
                  <p>The postman says</p>
                  <h2>“{day.postmanLine}”</h2>
                  <span>{day.memory}</span>
                  <Artifact day={day} />
                </div>
              </motion.article>

              {!day.final ? (
                <motion.div
                  className={styles.travelInterlude}
                  initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: .5 }}
                  transition={{ duration: .7 }}
                >
                  <div className={styles.interludeTrack} />
                  <div className={styles.interludeTrain}><span /><b /><i /><i /></div>
                  <p>The train leaves {day.station} and carries the unopened letter onward.</p>
                </motion.div>
              ) : null}
            </div>
          ))}

          <motion.article
            className={styles.letterChapter}
            initial={reduceMotion ? false : { opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: .18 }}
            transition={{ duration: .9 }}
          >
            <div className={styles.letterHeader}>
              <span>DELHI · FIVE STATIONS · ALAPPUZHA</span><strong>Finally delivered</strong>
            </div>
            <div className={styles.letterPaper}>
              <div className={styles.letterSeal}>I</div>
              <p className={styles.salutation}>Dear {recipient},</p>
              <p>Do you remember the evening we missed the bus and laughed beneath that broken shop awning?</p>
              <p>I could have sent this in a second. Instead, I wanted every station to carry one piece of it before the full letter reached you.</p>
              <p>Some memories do not belong to speed. They belong to waiting.</p>
              <p className={styles.signoff}>Still remembering,<br />Arjun</p>
            </div>
          </motion.article>

          <section className={styles.keepsake}>
            <span>The journey is yours now</span>
            <h2>Keep every station,<br />memory and word together.</h2>
            <p>The PDF version removes controls and formats the complete journey as a printable keepsake.</p>
            <button type="button" className={`${styles.pdfButtonLarge} ${styles.screenOnly}`} onClick={() => window.print()}>
              Save the entire journey as PDF
            </button>
            <small className={styles.screenOnly}>Choose “Save as PDF” in the print window.</small>
          </section>
        </div>
      </section>

      <footer className={styles.footer}><span>Intezaar</span><p>A letter that travelled before it arrived.</p></footer>
    </main>
  );
}
