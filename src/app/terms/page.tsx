import type { Metadata } from "next";
import Link from "next/link";
import { PolicyShell } from "@/components/policy-shell";
import styles from "@/components/policy-shell.module.css";

export const metadata: Metadata = {
  title: "User Agreement — Intezaar",
  description: "Public beta terms for using Intezaar to create, seal, post, store and receive private digital letters.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <PolicyShell
      eyebrow="Public beta agreement"
      title="User Agreement"
      intro="These terms explain the rules for using the Intezaar public beta. By creating, posting, opening or sharing a letter through the service, you agree to them."
      lastUpdated="7 August 2026"
    >
      <section className={styles.warning}>
        <h2>Important beta notice</h2>
        <p>Intezaar is an early-stage digital service. It is not physical post, a guaranteed delivery service, an emergency communication channel or a legally recognised notice-delivery service.</p>
      </section>

      <section>
        <h2>1. About Intezaar</h2>
        <p>Intezaar lets a sender create a private digital letter, choose an opening moment, personalise it with optional media, seal it through a digital ceremony, post it through an Intezaar post box animation and share a private recipient link.</p>
        <p>Intezaar is independent and is not affiliated with India Post, the Government of India, any railway operator or any physical postal service.</p>
      </section>

      <section>
        <h2>2. Who may use the beta</h2>
        <p>You must be at least 18 years old and legally capable of agreeing to these terms. You may not use the service where doing so would violate a law, court order, employment duty or contractual obligation that applies to you.</p>
      </section>

      <section>
        <h2>3. Your responsibility as sender</h2>
        <p>You are responsible for every word, file, name, email address, date, location and recipient you provide. You must:</p>
        <ul>
          <li>have the right to send the content and use every uploaded photograph, recording or video;</li>
          <li>respect the recipient&apos;s dignity, privacy and boundaries;</li>
          <li>stop contacting a person when they ask you to stop;</li>
          <li>check the recipient, message and opening time before posting;</li>
          <li>share the private link only with the intended recipient through a trusted channel; and</li>
          <li>keep your own copy of anything important.</li>
        </ul>
      </section>

      <section>
        <h2>4. Prohibited use</h2>
        <p>You must not use Intezaar for unlawful, fraudulent, threatening, harassing, exploitative or deceptive activity. This includes stalking, coercion, blackmail, impersonation, scams, hate, non-consensual intimate content, sexual content involving minors, doxxing, malware, spam, encouragement of serious harm or attempts to bypass security controls.</p>
        <p>The full conduct standard is set out in the <Link href="/community-guidelines">Community Guidelines</Link>, which forms part of this agreement.</p>
      </section>

      <section>
        <h2>5. Private links</h2>
        <p>The recipient link is a secret bearer link. Anyone who obtains it may be able to receive or open the letter at the permitted time. A recipient may copy, forward, photograph or otherwise expose the link, and Intezaar cannot guarantee that another person will keep it private.</p>
        <p>Do not publish a recipient link on social media, public websites, searchable pages or large group chats.</p>
      </section>

      <section>
        <h2>6. Encryption and storage</h2>
        <p>Written letter content is encrypted before database storage. Selected media is encrypted in the sender&apos;s browser before upload to private storage. At the opening time, the server validates the private token and releases only the information required to deliver the letter.</p>
        <p>Encryption lowers risk but does not make the service anonymous, breach-proof or suitable for passwords, bank credentials, identity documents, medical records, privileged legal material or confidential business secrets.</p>
        <p>More detail is provided in the <Link href="/privacy">Privacy Policy</Link>.</p>
      </section>

      <section>
        <h2>7. Opening time and delivery</h2>
        <p>The selected date and time are checked by the Intezaar server. Before that moment, the private message and media are not delivered to the recipient&apos;s browser.</p>
        <p>Intezaar does not guarantee that an invitation email will arrive, that a recipient will open the link, that every device will remain compatible, or that the service will be continuously available. The sender should preserve and share the private link directly.</p>
      </section>

      <section>
        <h2>8. Media limits</h2>
        <p>The beta allows no more than three media items per letter, with a total limit of 30 MB. Current individual limits are 5 MB per photo, 10 MB for a voice note and 25 MB for one video. Intezaar may change these limits to protect reliability, security or storage capacity.</p>
      </section>

      <section>
        <h2>9. Retention and expiry</h2>
        <p>A posted letter is scheduled to become unavailable 90 days after its opening time. The cleanup process deletes encrypted media and marks the letter expired. Some encrypted database records, delivery events, security logs and backup copies may remain for a reasonable period for reliability, abuse prevention, debugging or legal compliance.</p>
      </section>

      <section>
        <h2>10. Your content and intellectual property</h2>
        <p>You retain ownership of the original content you create. You give Intezaar a limited permission to receive, encrypt, store, process, transmit, display and delete that content only as reasonably necessary to operate, secure, test and improve the service.</p>
        <p>You must not upload content owned by another person unless you have permission or another lawful right to use it. The Intezaar name, visual identity, software, animations, post-box design and site content remain protected by their respective owners.</p>
      </section>

      <section>
        <h2>11. Moderation and access</h2>
        <p>Intezaar may restrict access, disable a private link, remove content, preserve relevant records or block future use when reasonably necessary to protect people, investigate misuse, comply with law, maintain security or enforce this agreement.</p>
        <p>Private letters are not routinely reviewed. Where a safety report, legal request or security incident requires investigation, authorised personnel may access information reasonably necessary to respond.</p>
      </section>

      <section>
        <h2>12. Free beta and future pricing</h2>
        <p>The current public beta is provided without charge. Intezaar may later introduce limits, subscriptions, one-time payments or premium features. No charge will apply unless the price and transaction terms are shown before payment.</p>
      </section>

      <section>
        <h2>13. Availability and changes</h2>
        <p>The beta may change, pause or end without notice. Features may be added, removed or redesigned. Intezaar does not promise uninterrupted access, permanent storage, successful email delivery, compatibility with every device or preservation of browser-local drafts.</p>
      </section>

      <section>
        <h2>14. No professional or emergency service</h2>
        <p>Intezaar does not provide medical, mental-health, legal, financial, safeguarding or emergency advice. It must not be used as the only way to communicate an urgent risk, threat, crisis, notice or instruction.</p>
      </section>

      <section>
        <h2>15. Liability</h2>
        <p>To the maximum extent permitted by applicable law, Intezaar is not responsible for indirect or consequential loss, emotional reactions to user-created content, forwarding or exposure of a private link, missed emails, service downtime, device incompatibility or misuse by another user.</p>
        <p>Nothing in this agreement excludes rights or liabilities that cannot lawfully be excluded, including applicable consumer rights or liability for fraud.</p>
      </section>

      <section>
        <h2>16. Ending use</h2>
        <p>You may stop using the beta at any time. A complete sender dashboard, withdrawal control and self-service deletion tool are not yet available. Do not share a link you no longer want used, and create a corrected letter when details change.</p>
      </section>

      <section>
        <h2>17. Changes to this agreement</h2>
        <p>This agreement may be updated as the beta develops. The last-updated date will change when a material revision is published. Continued use after an update means you accept the revised agreement.</p>
      </section>

      <section>
        <h2>18. Operator and governing terms</h2>
        <div className={styles.note}>
          <p>Intezaar is currently an early-stage public-beta project. The formal operating entity, business address, dedicated support contact, governing-law clause and commercial terms will be published before paid public launch. This agreement is an operational beta standard and should receive professional legal review before monetisation or wider release.</p>
        </div>
      </section>
    </PolicyShell>
  );
}
