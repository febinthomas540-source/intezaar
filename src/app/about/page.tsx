import type { Metadata } from "next";
import Link from "next/link";
import { PolicyShell } from "@/components/policy-shell";
import styles from "@/components/policy-shell.module.css";

export const metadata: Metadata = {
  title: "About — Private Letters That Wait",
  description: "What Intezaar is, why it exists, what the public beta does today, and the limits we want users to understand clearly.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <PolicyShell
      eyebrow="About Intezaar"
      title="A letter should feel different from another notification."
      intro="Intezaar is an independent digital-letter project built around one idea: write something now, seal it, and let the chosen moment matter."
      lastUpdated="11 August 2026"
    >
      <section>
        <h2>Why Intezaar exists</h2>
        <p>Messaging apps are excellent at making words arrive instantly. Intezaar is deliberately built for the opposite feeling: anticipation. The letter stays at the centre, while the envelope, seal, waiting time and arrival moment create a small digital ritual around it.</p>
        <p>The product is inspired by the emotional language of letters, Indian postal atmosphere and railway journeys, but Intezaar is a digital experience. It is not India Post, Indian Railways, a government service or physical postage.</p>
      </section>

      <section>
        <h2>What the public beta does today</h2>
        <ul>
          <li>lets an adult sender write a private digital letter without creating an account;</li>
          <li>lets the sender choose an opening date and time within the current beta window;</li>
          <li>supports optional photos, voice notes and video;</li>
          <li>uses end-to-end encryption for the content and private media of new letters;</li>
          <li>creates a complete private recipient link that must be kept safe; and</li>
          <li>can add optional email verification through Registered Intezaar Mail.</li>
        </ul>
      </section>

      <section>
        <h2>What Intezaar is not</h2>
        <p>Intezaar is not permanent archival storage, legal proof of service, an emergency communications system, therapy, a clinical mental-health service or a replacement for secure professional record systems.</p>
        <p>Reflective pages such as Future Self and Open When are writing experiences. They do not diagnose, treat or promise mental-health outcomes.</p>
      </section>

      <section>
        <h2>Privacy is part of the product</h2>
        <p>For new letters, the written message and private media are encrypted in the sender&apos;s browser. Intezaar stores the encrypted payload but does not store the decryption key. The complete private link carries the key in a browser-only URL fragment.</p>
        <p>Delivery metadata is different. Information such as names, optional email addresses, opening time, format, route labels, file type and size, and operational events may still be available to Intezaar so the service can work.</p>
        <p><Link href="/how-encryption-works">Read how encryption works</Link> or see the full <Link href="/privacy">Privacy Policy</Link>.</p>
      </section>

      <section>
        <h2>About trust during beta</h2>
        <div className={styles.note}>
          <p>Intezaar is still an early-stage public beta. We would rather state a limitation plainly than turn it into marketing copy. Availability can fail, software can contain defects, and the service does not promise permanent storage. Keep your own copy of anything irreplaceable.</p>
        </div>
      </section>

      <section>
        <h2>How the project should grow</h2>
        <p>The aim is to grow around real reasons people write letters: birthdays, milestones, future-self reflection, Open When letters, apologies, farewells and words that deserve some distance before they arrive.</p>
        <p>We will not publish invented reviews or pretend illustrative stories are customer testimonials. When genuine users choose to share feedback publicly, that can be added with permission.</p>
      </section>
    </PolicyShell>
  );
}
