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
    question: "Is Registered Intezaar Mail the same as Registered Post?",
    answer: <p>No. Registered Intezaar Mail is an Intezaar recipient-verification feature that can require a one-time code before the private delivery experience is released. It is not India Post Registered Post, does not create a postal receipt and should not be treated as statutory or legal proof of service.</p>,
  },
  {
    question: "How does the recipient receive a new end-to-end encrypted letter?",
    answer: <p>After posting, the sender receives a complete private link containing the browser-side decryption key. The sender must share that complete link with the intended recipient. If an email address was added, Intezaar can send invitation and arrival notices, but those automated emails deliberately do not contain the decryption key.</p>,
  },
  {
    question: "Can the recipient open the letter early?",
    answer: <p>No. The opening time is checked by the Intezaar server. Before that moment, the recipient sees the sealed-letter experience and the encrypted message payload and private-media download URLs are not sent to their browser.</p>,
  },
  {
    question: "Is the written letter end-to-end encrypted?",
    answer: <p>For new letters created through the current creator, yes. The heading, written message, closing and private-media details are encrypted in the sender&apos;s browser. Intezaar stores the encrypted payload but not the decryption key. After the selected opening time, the recipient&apos;s browser uses the key from the complete private link to decrypt the letter locally. Older letters created before this upgrade may still use the previous server-side encrypted format until they expire.</p>,
  },
  {
    question: "What happens to photographs, voice notes and videos?",
    answer: <p>For new letters, selected media is encrypted in the sender&apos;s browser before upload using the same end-to-end key model. After the opening time, short-lived private download links are released and the recipient&apos;s browser decrypts the files locally.</p>,
  },
  {
    question: "Does end-to-end encryption hide everything from Intezaar?",
    answer: <p>No. It protects the letter content and private media. Delivery metadata such as names, optional email addresses, opening time, format, route labels, file type and size, letter status and operational security events may remain readable so the service can work. Read <Link href="/how-encryption-works">How encryption works</Link> for the plain-language model.</p>,
  },
  {
    question: "Can I be notified when my letter is opened?",
    answer: <p>Yes, optionally. After posting a normal letter, the sender can enter an email address and ask for one opened-letter notification. Intezaar records only that the recipient broke the seal after the arrival time. The notification contains no letter text, private media or decryption key. The email address is stored as delivery metadata for that letter.</p>,
  },
  {
    question: "Does Intezaar tell the sender what the recipient did inside the letter?",
    answer: <p>No. The opened-letter notification only reports that the seal was opened. It does not report what the recipient read, played, downloaded, printed or shared inside the private letter.</p>,
  },
  {
    question: "What happens after I open a letter?",
    answer: <p>The private letter remains the main experience. At the end, the recipient can save or print a keepsake, write a new letter of their own, write to their future self, or optionally share the public Intezaar idea. Public sharing does not include the private letter URL, contents, recipient name or opening date.</p>,
  },
  {
    question: "What are the media limits?",
    answer: <p>A letter may contain up to three media items in total. Photos may be up to 5 MB each, a voice note up to 10 MB, and one video up to 25 MB. The total media allowance per letter is 30 MB.</p>,
  },
  {
    question: "How far ahead can I schedule a letter?",
    answer: <p>The current public beta supports opening times from at least 12 hours ahead and up to 30 days ahead. The dedicated Future Me experience currently uses the same beta delivery window. Longer future-self scheduling is a future product direction, not a current promise.</p>,
  },
  {
    question: "Can I write to my future self?",
    answer: <p>Yes. Intezaar has a dedicated <Link href="/future-self">Future Me</Link> experience with its own writing flow and visual theme. During the current beta, it is still limited to the same maximum scheduling window supported by the secure delivery system.</p>,
  },
  {
    question: "Can I edit or withdraw a letter after posting?",
    answer: <p>Not through a public dashboard yet. Check the recipient, content and opening time carefully before posting. Do not share the complete private link if you notice a mistake; create a corrected letter instead.</p>,
  },
  {
    question: "How long is a letter stored?",
    answer: <p>A letter is scheduled to become unavailable 90 days after its opening time. The daily cleanup process deletes encrypted media and marks the letter expired. During beta, some encrypted database records and operational event logs may remain for security, debugging, reliability or legal reasons.</p>,
  },
  {
    question: "Can I export or keep the letter?",
    answer: <p>After opening, the recipient can currently use the save-or-print keepsake option. Intezaar does not yet provide a guaranteed bulk export or permanent archive, so keep your own copy of anything irreplaceable.</p>,
  },
  {
    question: "What happens if Intezaar ever closes?",
    answer: <p>The public beta does not guarantee permanent storage or a shutdown export. If a material planned closure or migration is expected, Intezaar intends to give advance notice where reasonably possible, but this cannot be guaranteed in every technical or operational circumstance.</p>,
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
    question: "What happens if the complete private link is forwarded?",
    answer: <p>For a new end-to-end encrypted letter, the complete URL contains the decryption key. Anyone who gets that complete link may be able to decrypt the letter once the opening time arrives. Share it only through a trusted private channel. Registered Intezaar Mail adds recipient email verification before the encrypted payload is released.</p>,
  },
  {
    question: "Can I use Intezaar for urgent or legally important messages?",
    answer: <p>No. Do not use Intezaar for emergencies, safety warnings, legal notices, financial instructions, medical records or anything that must be received immediately or with guaranteed delivery.</p>,
  },
  {
    question: "Does Intezaar guarantee delivery or permanent storage?",
    answer: <p>No. The public beta may experience downtime, email failure, browser incompatibility or future product changes. Keep your own copy of anything important.</p>,
  },
  {
    question: "Where can I read the privacy and user rules?",
    answer: <p>Start with <Link href="/about">About Intezaar</Link> and <Link href="/how-encryption-works">How encryption works</Link>, then read the <Link href="/privacy">Privacy Policy</Link>, <Link href="/terms">User Agreement</Link> and <Link href="/community-guidelines">Community Guidelines</Link>.</p>,
  },
];

export default function FaqPage() {
  return (
    <PolicyShell
      eyebrow="Help desk"
      title="Frequently asked questions"
      intro="The clear version of how Intezaar works today—including end-to-end encryption, time-locking, Future Me, optional opened-letter notifications and the limits of the public beta."
      lastUpdated="11 August 2026"
    >
      <section className={styles.warning}>
        <h2>Public-beta notice</h2>
        <p>New letter content and private media use end-to-end encryption, but Intezaar is still a beta service and does not guarantee delivery, uninterrupted availability or permanent preservation.</p>
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
