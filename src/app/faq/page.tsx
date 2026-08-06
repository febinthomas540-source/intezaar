import type { Metadata } from "next";
import Link from "next/link";
import { PolicyShell } from "@/components/policy-shell";
import styles from "@/components/policy-shell.module.css";

export const metadata: Metadata = {
  title: "FAQ — Intezaar",
  description: "Answers about writing, sealing, posting and receiving a private digital letter through Intezaar.",
  alternates: { canonical: "/faq" },
};

const questions = [
  {
    question: "What is Intezaar?",
    answer: <p>Intezaar is a digital letter experience. You write a private letter, choose when it should open, seal it, post it through the Intezaar post box, and share a private recipient link.</p>,
  },
  {
    question: "Is this physical post?",
    answer: <p>No. Intezaar does not send a physical envelope and is not connected to India Post. The post office, envelope and letter box are part of a nostalgic digital experience.</p>,
  },
  {
    question: "How does the recipient get the letter?",
    answer: <p>After posting, the sender receives a private link to share directly with the recipient. The recipient opens that link, sees the sealed envelope and, when the letter is available, breaks the seal to read it.</p>,
  },
  {
    question: "Can the recipient open it early?",
    answer: <p>The intended experience keeps the letter sealed until the selected moment. During the current public-beta prototype, time-locking is not yet enforced by a secure server clock, so Intezaar should not be relied on for strict or legally important timed delivery.</p>,
  },
  {
    question: "Is my letter encrypted?",
    answer: <p>Not yet. In the current prototype, the written letter can be encoded inside the private link so the recipient can reconstruct it on their device. Encoding is not encryption. Do not use the beta for highly sensitive, confidential, financial, medical or legally important information.</p>,
  },
  {
    question: "What happens to photographs, voice notes and videos?",
    answer: <p>In the current beta, uploaded media remains in the sender&apos;s browser session and is not transferred through the final recipient link. Secure media storage will be introduced before this becomes a full delivery feature.</p>,
  },
  {
    question: "How far ahead can I choose an opening date?",
    answer: <p>The current creator supports dates between one and thirty days ahead. A separate Future Me experience and longer scheduling are being considered, but are not currently available.</p>,
  },
  {
    question: "Can I edit the letter after posting it?",
    answer: <p>You can edit while creating the letter and before completing the posting ritual. In the current beta there is no account dashboard or stored letter record, so after posting you should create and share a new letter if something needs to change.</p>,
  },
  {
    question: "Is Intezaar free?",
    answer: <p>Yes, the current public beta is free. Limits, paid features or pricing may be introduced later, but they will be shown clearly before any payment is taken.</p>,
  },
  {
    question: "Who can use the beta?",
    answer: <p>The public beta is intended for adults aged 18 or over. Do not use Intezaar to contact someone who has asked you not to contact them.</p>,
  },
  {
    question: "What content is not allowed?",
    answer: <p>Threats, harassment, stalking, scams, impersonation, hate, non-consensual intimate content, sexual content involving minors, illegal content, malware and attempts to expose another person&apos;s private information are prohibited. Read the <Link href="/community-guidelines">Community Guidelines</Link> for the full standard.</p>,
  },
  {
    question: "What happens if the private link is forwarded?",
    answer: <p>Anyone who receives the current beta link may be able to access the experience. Send it only through a trusted private channel and ask the recipient not to forward it. Tokenised access controls are planned for the secure version.</p>,
  },
  {
    question: "Can I use Intezaar for urgent or emergency messages?",
    answer: <p>No. Do not use Intezaar for emergencies, safety warnings, medical information, legal notices, financial instructions or anything that must be received immediately or with guaranteed delivery.</p>,
  },
  {
    question: "Does Intezaar guarantee delivery or permanent storage?",
    answer: <p>No. The public beta may change, experience downtime or lose browser-local drafts. Keep your own copy of anything important.</p>,
  },
];

export default function FaqPage() {
  return (
    <PolicyShell
      eyebrow="Help desk"
      title="Frequently asked questions"
      intro="The clear version of how Intezaar works today—including what the public beta can and cannot safely do."
    >
      <section className={styles.warning}>
        <h2>Public-beta notice</h2>
        <p>Intezaar is still being built. The current experience demonstrates writing, sealing, posting and opening a digital letter, but it does not yet provide encrypted storage, guaranteed delivery or secure long-term media transfer.</p>
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
