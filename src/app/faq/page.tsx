import type { Metadata } from "next";
import Link from "next/link";
import { PolicyShell } from "@/components/policy-shell";
import styles from "@/components/policy-shell.module.css";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about writing, encryption, sealing, posting, storing and receiving a private digital letter through Intezaar.",
  alternates: { canonical: "/faq" },
};

const questions = [
  {
    question: "What is Intezaar?",
    answer: <p>Intezaar is a private digital letter experience. You write a letter, choose when it should open, seal it, post it through the Intezaar post box, and share a complete private recipient link.</p>,
  },
  {
    question: "Do I need an account?",
    answer: <p>No. Ordinary letter creation still works without an account or phone number. After posting, a sender can optionally add an email address for a one-time notification when that specific letter is opened. That does not create an account.</p>,
  },
  {
    question: "Is this physical post or India Post?",
    answer: <p>No. Intezaar does not send a physical envelope and is not affiliated with India Post, the Government of India, Indian Railways or any postal operator. The post office, envelope, stamp-style artwork, post box and journey scenes are part of an independent nostalgic digital experience.</p>,
  },
  {
    question: "How private is the letter?",
    answer: <p>New letters use browser-side end-to-end encryption. Intezaar stores encrypted letter data, while the complete private recipient link carries the decryption key in a browser-only URL fragment. Anyone who receives that complete link may be able to open the letter after the chosen time, so treat it like a private key.</p>,
  },
  {
    question: "Can Intezaar recover a lost private link?",
    answer: <p>Not from the server. For end-to-end encrypted letters, Intezaar does not store the decryption key. If the recipient has already opened the complete private link on the same browser, that browser may remember the key locally for later email reminders; a different device or cleared browser storage still requires the original complete private link from the sender.</p>,
  },
  {
    question: "What happens if I add the recipient’s email?",
    answer: <p>Intezaar can send a delivery notice after posting and another notification when the opening time arrives. Those emails contain only a keyless delivery link, never the letter text, private media or end-to-end decryption key. Requiring a one-time email code is a separate optional Registered Intezaar Mail setting.</p>,
  },
  {
    question: "Can I add photos, voice notes or video?",
    answer: <p>Yes. The current creator supports up to three total media items, with one video maximum. New-letter media is encrypted in the browser before upload.</p>,
  },
  {
    question: "When can the letter open?",
    answer: <p>The current public beta supports opening times from at least 12 hours in the future up to 30 days ahead. The creator includes quick presets plus a custom date and time.</p>,
  },
  {
    question: "Can I use Intezaar for emergencies, legal notices or proof of service?",
    answer: <p>No. Intezaar is an emotional digital-letter experience, not emergency communications, legal service, certified delivery, physical postage or proof of receipt.</p>,
  },
  {
    question: "What happens when the letter expires?",
    answer: <p>Letters are not intended as permanent archival storage. A letter can become unavailable after its retention period or if it is withdrawn or removed under applicable safety and platform rules.</p>,
  },
];

export default function FaqPage() {
  return (
    <PolicyShell
      eyebrow="FAQ"
      title="Questions about sending a letter that has to wait."
      intro="The important parts: what the product does, what it does not do, and how private delivery works."
      lastUpdated="13 August 2026"
    >
      <div className={styles.faqGrid}>
        {questions.map((item) => (
          <section key={item.question}>
            <h2>{item.question}</h2>
            {item.answer}
          </section>
        ))}
      </div>

      <section>
        <h2>Still deciding whether to use it?</h2>
        <p>Read <Link href="/how-encryption-works">how encryption works</Link>, the <Link href="/privacy">privacy policy</Link>, or the <Link href="/community-guidelines">community guidelines</Link> before writing anything sensitive.</p>
      </section>
    </PolicyShell>
  );
}
