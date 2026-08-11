import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import styles from "../viral-share.module.css";

export const metadata: Metadata = {
  title: "I Sent a Letter That Has to Wait — Intezaar",
  description: "Someone used Intezaar to send a private digital letter with a chosen opening time. Write one of your own.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/sent-a-letter" },
  openGraph: {
    url: "/sent-a-letter",
    title: "I sent a letter that has to wait.",
    description: "Intezaar turns a private message into a letter with a chosen opening time.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "I sent a letter that has to wait.",
    description: "A private Intezaar letter with a chosen opening time.",
  },
};

export default function SentALetterPage() {
  return (
    <main className={styles.page}>
      <Navigation />
      <section className={styles.hero}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Shared without sharing the letter</p>
          <h1>I sent a letter that has to wait.</h1>
          <p>
            The private letter itself stays private. Intezaar lets someone write now, choose when the letter can be opened, and make the waiting part of the message.
          </p>
          <div className={styles.actions}>
            <Link href="/create" className={styles.primary}>Write your own letter</Link>
            <Link href="/future-self" className={styles.secondary}>Write to future me</Link>
          </div>
        </div>

        <div className={styles.card} aria-label="A sealed Intezaar envelope">
          <div className={styles.envelope}>
            <strong>A private letter is on its way.</strong>
            <span className={styles.seal}>I</span>
          </div>
          <p className={styles.note}>This public page contains no recipient name, private letter link, opening date or letter contents.</p>
        </div>
      </section>
    </main>
  );
}
