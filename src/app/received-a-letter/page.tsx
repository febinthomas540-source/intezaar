import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import styles from "../viral-share.module.css";

export const metadata: Metadata = {
  title: "Someone Sent Me a Letter I Had to Wait to Open",
  description: "Someone received a private Intezaar letter that stayed sealed until its chosen opening time. Write one of your own.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/received-a-letter" },
  openGraph: {
    url: "/received-a-letter",
    title: "Someone sent me a letter I had to wait to open.",
    description: "The letter stayed private. The waiting experience came from Intezaar.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Someone sent me a letter I had to wait to open.",
    description: "A private Intezaar letter with a chosen opening time.",
  },
};

export default function ReceivedALetterPage() {
  return (
    <main className={styles.page}>
      <Navigation />
      <section className={styles.hero}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>The letter stayed private</p>
          <h1>Someone sent me a letter I had to wait to open.</h1>
          <p>
            Intezaar keeps the message sealed until its chosen moment. After opening one, you can continue the ritual by writing a private letter of your own.
          </p>
          <div className={styles.actions}>
            <Link href="/create" className={styles.primary}>Write your own letter</Link>
            <Link href="/open-when" className={styles.secondary}>Explore Open When letters</Link>
          </div>
        </div>

        <div className={styles.card} aria-label="An opened Intezaar envelope">
          <div className={styles.envelope}>
            <strong>The waiting ended. The letter arrived.</strong>
            <span className={styles.seal}>I</span>
          </div>
          <p className={styles.note}>This public page never contains the private letter, recipient link, recipient name or opening details.</p>
        </div>
      </section>
    </main>
  );
}
