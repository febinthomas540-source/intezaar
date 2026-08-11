import { getPublicLetterStats } from "@/lib/letter-security";
import styles from "./public-letter-counter.module.css";

function formattedDigits(value: number) {
  return new Intl.NumberFormat("en-IN").format(value).split("");
}

function CounterNumber({ value, label }: { value: number; label: string }) {
  const formatted = new Intl.NumberFormat("en-IN").format(value);

  return (
    <div className={styles.counterBay} aria-label={`${formatted} ${label}`}>
      <div className={styles.digits} aria-hidden="true">
        {formattedDigits(value).map((character, index) => (
          character === "," ? (
            <span className={styles.separator} key={`${character}-${index}`}>,</span>
          ) : (
            <span className={styles.digit} key={`${character}-${index}`}>
              <i>{character}</i>
            </span>
          )
        ))}
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export async function PublicLetterCounter() {
  try {
    const stats = await getPublicLetterStats();
    if (stats.posted < 1) return null;

    return (
      <section className={styles.section} aria-labelledby="live-letter-count-heading">
        <div className={styles.heading}>
          <div>
            <p className={styles.kicker}>Intezaar letter board</p>
            <h2 id="live-letter-count-heading">Letters in motion.</h2>
          </div>
          <div className={styles.live} aria-label="Live service totals">
            <span aria-hidden="true" />
            Live totals
          </div>
        </div>

        <div className={styles.board}>
          <div className={styles.boardTop} aria-hidden="true">
            <span>INTEZAAR · DIGITAL MAIL</span>
            <span>LIVE SERVICE TALLY</span>
          </div>

          <div className={styles.stats} aria-label="Current aggregate Intezaar letter counts">
            <CounterNumber value={stats.posted} label="Letters posted" />
            <CounterNumber value={stats.waiting} label="Still waiting" />
            <CounterNumber value={stats.opened} label="Seals opened" />
          </div>

          <div className={styles.boardFooter}>
            <span>Updated from live service records</span>
            <span>Private letter details never appear here</span>
          </div>
        </div>

        <p className={styles.note}>
          Opened totals start with the current open-tracking system. Older opens are not estimated or back-filled.
        </p>
      </section>
    );
  } catch (error) {
    console.error("Public letter counter unavailable:", error);
    return null;
  }
}
