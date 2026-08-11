import { getPublicLetterStats } from "@/lib/letter-security";
import styles from "./public-letter-counter.module.css";

function number(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export async function PublicLetterCounter() {
  try {
    const stats = await getPublicLetterStats();
    if (stats.posted < 1) return null;

    return (
      <section className={styles.section} aria-labelledby="live-letter-count-heading">
        <div className={styles.copy}>
          <p>Live beta activity</p>
          <h2 id="live-letter-count-heading">Letters are already moving through Intezaar.</h2>
          <small>
            Aggregate delivery counts from the live service. No names, letter contents, opening dates or private links are published.
          </small>
        </div>

        <div className={styles.stats} aria-label="Current aggregate Intezaar letter counts">
          <div>
            <strong>{number(stats.posted)}</strong>
            <span>letters posted</span>
          </div>
          <div>
            <strong>{number(stats.waiting)}</strong>
            <span>currently waiting</span>
          </div>
          <div>
            <strong>{number(stats.opened)}</strong>
            <span>recorded opens</span>
          </div>
        </div>

        <p className={styles.note}>
          The opened count starts with the current open-tracking system; older opens are not invented or back-filled.
        </p>
      </section>
    );
  } catch (error) {
    console.error("Public letter counter unavailable:", error);
    return null;
  }
}
