import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import styles from "./guides.module.css";

export const metadata: Metadata = {
  title: "Letter Writing Guides",
  description: "Practical letter-writing ideas for future-self letters, Open When letters, long-distance birthdays, wedding mornings, Onam, parents, apologies and digital time capsules.",
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
    href: "/guides/open-when-you-miss-home-letter",
    label: "Missing home",
    title: "What to write in an ‘open when you miss home’ letter",
    copy: "Specific prompts for giving someone a small, recognisable piece of home when distance feels heavy.",
  },
  {
    href: "/guides/birthday-letter-long-distance-relationship",
    label: "Long-distance birthday",
    title: "Birthday letter ideas for a long-distance relationship",
    copy: "Write beyond a birthday greeting with memories, observations and something real to look forward to together.",
  },
  {
    href: "/guides/wedding-morning-letter-ideas",
    label: "Wedding morning",
    title: "What to write in a letter for the morning of your wedding",
    copy: "Ideas for a private wedding-day letter that sounds like you, not a generic ceremony speech.",
  },
  {
    href: "/guides/onam-letter-for-family-abroad",
    label: "Onam away from home",
    title: "What to write home when you cannot be there for Onam",
    copy: "A diaspora-focused guide to family details, festival memories and words meant for Thiruvonam morning.",
  },
  {
    href: "/guides/letter-to-parents-while-living-abroad",
    label: "Living abroad",
    title: "A letter to your parents when life has taken you far from home",
    copy: "Prompts for gratitude, ordinary memories and the things distance makes easier to notice.",
  },
  {
    href: "/guides/apology-letter-after-an-argument",
    label: "After an argument",
    title: "How to write an apology letter after an argument",
    copy: "Take responsibility clearly, avoid turning the apology into another argument, and give the other person room to respond.",
  },
  {
    href: "/guides/digital-time-capsule-letter-ideas",
    label: "Time capsule",
    title: "What to put in a digital time capsule letter",
    copy: "Preserve ordinary life, predictions, questions, photos and details that may become meaningful later.",
  },
  {
    href: "/guides/meaningful-letter-ideas-for-partner",
    label: "For your partner",
    title: "Meaningful letter ideas when ‘I love you’ is not enough",
    copy: "Turn affection into specific memories, observations and future plans instead of generic romantic phrases.",
  },
  {
    href: "/guides/how-to-write-an-unsent-letter",
    label: "Unsent letter",
    title: "How to write a letter you do not have to send",
    copy: "A practical way to put difficult words somewhere before deciding whether anyone else should receive them.",
  },
  {
    href: "/guides/letter-to-yourself-for-a-hard-day",
    label: "For yourself",
    title: "Write a letter to yourself for a hard day",
    copy: "Gentle prompts for preserving your own perspective and voice for a more difficult future moment.",
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
  {
    href: "/onam",
    label: "Onam 2026",
    title: "Write home for Thiruvonam morning",
    copy: "A single-purpose Onam letter experience for people away from Kerala writing to someone back home.",
  },
];

export default function GuidesPage() {
  return (
    <main className={styles.page}>
      <Navigation />
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Intezaar guides</p>
        <h1>What do you write when the letter is meant for later?</h1>
        <p>Practical prompts for the moments people already search for — birthdays, distance, apologies, weddings, festivals and future milestones.</p>
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
