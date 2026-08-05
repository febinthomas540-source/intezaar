import type { RecipientJourneyDay } from "@/lib/recipient-journey";
import shellStyles from "./recipient-magazine-shell.module.css";
import routeStyles from "./recipient-magazine-route.module.css";

const styles = { ...shellStyles, ...routeStyles };

export type Countdown = { hours:number; minutes:number; seconds:number };

export function MemoryObject({ day, index }: { day: RecipientJourneyDay; index: number }) {
  if (index === 0) {
    return (
      <figure className={`${styles.memoryObject} ${styles.photoObject}`}>
        <img src="/demo-memory-photo.svg" alt="A sample sender photograph at a rainy bus stop" />
        <figcaption>“That rainy evening when neither of us wanted the bus to come.”</figcaption>
      </figure>
    );
  }
  if (index === 1) {
    return (
      <div className={`${styles.memoryObject} ${styles.postcardObject}`}>
        <small>POSTCARD FROM JAIPUR</small>
        <p>Every journey felt shorter when someone waited at the end.</p>
        <b>— copied from an old notebook</b>
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className={`${styles.memoryObject} ${styles.voiceObject}`}>
        <small>VOICE TRACE · 00:07</small>
        <div className={styles.waveform} aria-hidden="true">
          {[18, 35, 23, 51, 31, 63, 26, 46, 20, 55, 29, 60].map((height, item) => <i key={item} style={{ height }} />)}
        </div>
        <button type="button">▶ Play the rain and laughter</button>
      </div>
    );
  }
  if (index === 3) {
    return (
      <div className={`${styles.memoryObject} ${styles.ticketObject}`}>
        <small>OLD BUS TICKET</small>
        <strong>KOTTAYAM → HOME</strong>
        <span>2 teas · 1 missed bus · no hurry</span>
        <b>₹ 6.00</b>
      </div>
    );
  }
  return (
    <div className={`${styles.memoryObject} ${styles.envelopeObject}`}>
      <div className={styles.envelopeFlap} />
      <span>I</span>
      <small>FOR THE FINAL STATION</small>
    </div>
  );
}

export function CountdownDisplay({ countdown }: { countdown: Countdown }) {
  return (
    <div className={styles.countdown} aria-live="polite">
      <span><b>{String(countdown.hours).padStart(2, "0")}</b><small>hours</small></span>
      <i>:</i>
      <span><b>{String(countdown.minutes).padStart(2, "0")}</b><small>minutes</small></span>
      <i>:</i>
      <span><b>{String(countdown.seconds).padStart(2, "0")}</b><small>seconds</small></span>
    </div>
  );
}
