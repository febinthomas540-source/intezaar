import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/secure-letter-delivery.module.css";

export const metadata: Metadata = {
  title: "Opened Letter Demo",
  description: "A fictional preview of the Intezaar opened-letter experience.",
  robots: { index: false, follow: false },
};

export default function OpenedLetterDemoPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>Intezaar</Link>
        <span>Demo · opened private letter</span>
      </header>

      <section className={styles.reader}>
        <div className={styles.readerToolbar}>
          <div>
            <small>Delivered by Intezaar Mail</small>
            <strong>Classic letter · demo</strong>
          </div>
          <Link href="/create">Write your own</Link>
        </div>

        <article className={`${styles.letter} ${styles.format_classic || ""}`}>
          <header>
            <div><small>From</small><strong>Aarav</strong></div>
            <div><small>To</small><strong>Maya</strong></div>
            <span>Just because</span>
          </header>

          <div className={styles.letterCopy}>
            <small>Just because</small>
            <h1>Dear Maya,</h1>
            <p>
              This is a fictional Intezaar demo letter. It shows what the recipient sees after the chosen arrival moment has passed and the seal has been broken.
            </p>
            <p>
              The real experience keeps the message sealed until its opening time. Registered letters can also require recipient verification before the private letter is released.
            </p>
            <p>
              Some words feel different when they are allowed to wait.
            </p>
            <p className={styles.closing}>With care,{"\n"}Aarav</p>
          </div>

          <footer>
            <span>New Delhi → Kochi</span>
            <span>Posted with patience · Demo</span>
          </footer>
        </article>

        <div className={styles.keepsakeActions}>
          <Link href="/create">Write a letter</Link>
          <Link href="/">Back to Intezaar</Link>
        </div>
      </section>
    </main>
  );
}
