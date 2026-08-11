import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import styles from "./guides.module.css";

export const metadata: Metadata = {
  title: "Letter Writing Guides — Intezaar",
  description: "Practical ideas for future-self letters, Open When letters, unsent letters and writing something that deserves to arrive later.",
  alternates: { canonical: "/guides" },
};

const guides = [
  {
    href: "/guides/letter-to-future-self-ideas",
    label: "Future self",
    title: "What to write in a letter to your future self",
    copy: "Prompts for recording where you are now, what you hope changes, and what you do not want to forget.",
  },
  {
    href: "/guides/open-when-letter-ideas",
    label: "Open when",
    title: "Meaningful Open When letter ideas",
    copy: "Ideas for letters meant for a specific feeling, milestone or difficult day.",
  },
  {
    href: "/unsent-letter",
    label: "Private reflection",
    title: "Write an unsent letter",
    copy: "Put the words somewhere private without deciding immediately whether another person should receive them.",
  },
  {
    href: "/write-after-argument",
    label: "After an argument",
    title: "Write now. Decide after the emotion settles.",
    copy: "Use time as part of the writing process instead of treating every feeling as an instant message.",
  },
  {
    href: "/future-self",
    label: "Future letter",
    title: "Write to the person you will become",
    copy: "A dedicated Intezaar experience for sealing a note to yourself for later.",
  },
  {
    href: "/open-when",
    label: "For someone else",
    title: "Create an Open When letter",
    copy: "Prepare words for a moment that has not happened yet.",
  },
];

export default function GuidesPage() {
  return (
    <main className={styles.page}>
      <Navigation />
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Intezaar guides</p>
        <h1>What do you write when the letter is meant for later?</h1>
        <p>These guides focus on the reason for the letter, not just the mechanics of delayed delivery.</p>
      </header>

      <section className={styles.list} aria-label="Letter writing guides">
        {guides.map((guide) => (
          <Link href={guide.href} key={guide.href} className={styles.card}>
            <small>{guide.label}</small>
            <h2>{guide.title}</h2>
            <p>{guide.copy}</p>
            <strong>Read or start →</strong>
          </Link>
        ))}
      </section>

      <section className={styles.cta}>
        <p className={styles.eyebrow}>Ready to write</p>
        <h2>The letter matters more than the template.</h2>
        <Link href="/create">Write a letter</Link>
      </section>
    </main>
  );
}
