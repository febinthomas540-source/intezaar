import type { Metadata } from "next";
import Link from "next/link";
import { PolicyShell } from "@/components/policy-shell";
import styles from "@/components/policy-shell.module.css";

export const metadata: Metadata = {
  title: "FAQ — Intezaar",
  description: "Answers about writing, sealing, posting, storing and receiving a private digital letter through Intezaar.",
  alternates: { canonical: "/faq" },
};

const questions = [
  {
    question: "What is Intezaar?",
    answer: <p>Intezaar is a private digital letter experience. You write a letter, choose when it should open, seal it, post it through the Intezaar post box, and share a private recipient link.</p>,
  },
  {
    question: "Is this physical post or India Post?",
    answer: <p>No. Intezaar does not send a physical envelope and is not affiliated with India Post, the Government of India or any postal operator. The post office, envelope and post box are part of a nostalgic digital experience.</p>,
  },
  {
    question: "How does the recipient receive the letter?",
    answer: <p>After secure posting, the sender receives a private link. When email delivery is available and a recipient email was entered, Intezaar also attempts to email that link. The link remains visible to the sender even if email delivery fails.</p>,
  },
  {
    question: "Can the recipient open the letter early?",
    answer: <p>No. The opening time is checked by the Intezaar server. Before that moment, the recipient sees only the sealed-letter experience and the letter content is not sent to their browser.</p>,
  },
  {
    question: "Is the written letter encrypted?",
    answer: <p>Yes. The written payload is encrypted before being stored in the database. It is decrypted by the server only after the private token is validated and the selected opening time has arrived. Encryption reduces risk, but no online service can promise absolute security.</p>,
  },
  {
    question: "What happens to photographs, voice notes and videos?",
    answer: <p>Selected media is encrypted in the sender&apos;s browser before upload to a private storage bucket. After the opening time, Intezaar issues short-lived private download links and the recipient&apos;s browser decrypts the files locally. Photos preserve the sender&apos;s saved position, crop, size and zoom.</p>,
  },
  {
    question: "What are the media limits?",
    answer: <p>A letter may contain up to three media items in total. Photos may be up to 5 MB each, a voice note up to 10 MB, and one video up to 25 MB. The total media allowance per letter is 30 MB.</p>,
  },
  {
    question: "How far ahead can I schedule a letter?",
    answer: <p>The current public beta supports opening times in the future and up to 30 days ahead. A longer Future Me experience is planned separately and is not yet available.</p>,
  },
  {
    question: "Can I edit or withdraw a letter after posting?",
    answer: <p>Not through a public dashboard yet. Check the recipient, content and opening time carefully before posting. Do not share the private link if you notice a mistake; create a corrected letter instead.</p>,
  },
  {
    question: "How long is a letter stored?",
    answer: <p>A letter is scheduled to become unavailable 90 days after its opening time. The daily cleanup process deletes encrypted media and marks the letter expired. During beta, some encrypted database records and operational event logs may remain for security, debugging or legal reasons.</p>,
  },
  {
    question: "Is Intezaar free?",
    answer: <p>Yes. The current public beta is free. Limits, paid features or pricing may be introduced later, but any charge will be shown clearly before payment is taken.</p>,
  },
  {
    question: "Who can use the beta?",
    answer: <p>The public beta is intended for adults aged 18 or over. Do not use Intezaar to contact someone who has asked you to stop, blocked you or ended contact.</p>,
  },
  {
    question: "What content is not allowed?",
    answer: <p>Threats, harassment, stalking, coercion, scams, impersonation, hate, non-consensual intimate content, sexual content involving minors, illegal content, malware, doxxing and automated spam are prohibited. Read the <Link href="/community-guidelines">Community Guidelines</Link> for the full standard.</p>,
  },
  {
    question: "What happens if the private link is forwarded?",
    answer: <p>The recipient URL works like a bearer key: anyone who obtains it may be able to access the delivery experience. Share it only through a trusted private channel and do not publish it on social media, public pages or group chats.</p>,
  },
  {
    question: "Can I use Intezaar for urgent or legally important messages?",
    answer: <p>No. Do not use Intezaar for emergencies, safety warnings, legal notices, financial instructions, medical information or anything that must be received immediately or with guaranteed delivery.</p>,
  },
  {
    question: "Does Intezaar guarantee delivery or permanent storage?",
    answer: <p>No. The public beta may experience downtime, email failure, browser incompatibility or future product changes. Keep your own copy of anything important.</p>,
  },
  {
    question: "Where can I read the privacy and user rules?",
    answer: <p>Read the <Link href="/privacy">Privacy Policy</Link>, <Link href="/terms">User Agreement</Link> and <Link href="/community-guidelines">Community Guidelines</Link> before sending private or personal content.</p>,
  },
];

export default function FaqPage() {
  return (
    <PolicyShell
      eyebrow="Help desk"
      title="Frequently asked questions"
      intro="The clear version of how Intezaar works today—including privacy, encryption, time-locking and the limits of the public beta."
      lastUpdated="7 August 2026"
    >
      <section className={styles.warning}>
        <h2>Public-beta notice</h2>
        <p>Intezaar now uses private token links, encrypted letter storage, browser-encrypted media and server-controlled opening times. It is still a beta service and does not guarantee delivery, uninterrupted availability or permanent preservation.</p>
      </section>

      <section className={styles.faq}>
        {questions.map((item, index) => (
          <details key={item.question} open={index === 0}>
            <summary>{item.question}</summary>
            <div>{item.answer}</div>
          </details>
        ))}
      </section>
    </PolicyShell>
  );
}
