import type { Metadata } from "next";
import Link from "next/link";
import { PolicyShell } from "@/components/policy-shell";
import styles from "@/components/policy-shell.module.css";

export const metadata: Metadata = {
  title: "Terms of Use — Intezaar",
  description: "Public beta terms for using Intezaar to create, seal, post and receive private digital letters.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <PolicyShell
      eyebrow="Public beta agreement"
      title="Terms of Use"
      intro="These terms explain the rules for using the Intezaar public beta. By creating, posting, opening or sharing a letter through the service, you agree to them."
    >
      <section className={styles.warning}>
        <h2>Important beta notice</h2>
        <p>Intezaar is an early-stage digital prototype. It is not physical post, a guaranteed delivery service, encrypted storage, an emergency communication channel, or a legally recognised notice-delivery service.</p>
      </section>

      <section>
        <h2>1. About Intezaar</h2>
        <p>Intezaar lets a sender create a private digital letter, choose an intended opening moment, seal it through a digital ceremony, post it through an Intezaar letter box animation, and share a private recipient link.</p>
        <p>Intezaar is independent and is not affiliated with India Post, the Government of India, any railway operator or any physical postal service.</p>
      </section>

      <section>
        <h2>2. Who may use the beta</h2>
        <p>You must be at least 18 years old and legally capable of agreeing to these terms. You may not use the service if doing so would violate a law, court order, employment duty or contractual obligation that applies to you.</p>
      </section>

      <section>
        <h2>3. Your responsibility as sender</h2>
        <p>You are responsible for every word, file, name, date, link and recipient you provide. You must:</p>
        <ul>
          <li>have the right to send the content and use any uploaded media;</li>
          <li>respect the recipient&apos;s boundaries and stop contacting them when asked;</li>
          <li>check the recipient name, message and intended opening details before posting;</li>
          <li>share the private link only with the intended recipient through a trusted channel; and</li>
          <li>keep your own copy of anything important.</li>
        </ul>
      </section>

      <section>
        <h2>4. Prohibited use</h2>
        <p>You must not use Intezaar for unlawful, fraudulent, threatening, harassing, exploitative or deceptive activity. This includes stalking, blackmail, impersonation, scams, hate, non-consensual intimate content, sexual content involving minors, doxxing, malware, spam, encouragement of serious harm, or attempts to bypass access or safety controls.</p>
        <p>The full conduct standard is set out in the <Link href="/community-guidelines">Community Guidelines</Link>, which forms part of these terms.</p>
      </section>

      <section>
        <h2>5. Private links and confidentiality</h2>
        <p>A beta recipient link should be treated like a private letter handed to someone directly. However, a link can be copied, forwarded, photographed or opened by someone else. Intezaar cannot guarantee that a recipient will keep it private.</p>
        <p>Do not place passwords, bank details, identity documents, medical records, legal instructions, confidential business information or other highly sensitive material in a beta letter.</p>
      </section>

      <section>
        <h2>6. Current data and storage limits</h2>
        <p>The current prototype may encode written letter content in the URL fragment so that the recipient&apos;s browser can reconstruct the letter. Encoding is not encryption. Uploaded photographs, voice notes and videos may remain only in the sender&apos;s browser session and may not transfer to the recipient.</p>
        <p>Browser-local drafts, links and prototype content may be lost. Secure accounts, tokenised links, encrypted storage, server-controlled opening times and long-term delivery records are not yet part of the public beta unless the product clearly states otherwise at the time of use.</p>
      </section>

      <section>
        <h2>7. Intended opening time</h2>
        <p>The selected date and time are part of the experience. During the current prototype, they may not be enforced by a secure server clock. Do not rely on Intezaar for strict time-locking, legal deadlines, financial instructions, safety alerts or guaranteed delivery.</p>
      </section>

      <section>
        <h2>8. Your content and intellectual property</h2>
        <p>You retain ownership of the original content you create. You give Intezaar a limited permission to process and display that content only as reasonably necessary to provide, test, secure and improve the letter experience.</p>
        <p>You must not upload content owned by another person unless you have permission or another lawful right to use it. The Intezaar name, visual identity, software, animations, post-box design and site content remain protected by their respective owners.</p>
      </section>

      <section>
        <h2>9. Availability and changes</h2>
        <p>The beta is provided free of charge and may change, pause or end without notice. Features may be added, removed or redesigned. Intezaar does not promise uninterrupted access, permanent storage, successful delivery, compatibility with every device or preservation of a draft.</p>
      </section>

      <section>
        <h2>10. Moderation and access</h2>
        <p>Intezaar may restrict or disable access, remove content, preserve records, or suspend use when reasonably necessary to protect people, investigate misuse, comply with law, maintain security or enforce these terms. Where appropriate and technically possible, users may be given an explanation or opportunity to raise a complaint.</p>
      </section>

      <section>
        <h2>11. No professional or emergency service</h2>
        <p>Intezaar does not provide medical, mental-health, legal, financial, safeguarding or emergency advice. It must not be used as the only way to communicate an urgent risk, threat, crisis, notice or instruction.</p>
      </section>

      <section>
        <h2>12. Liability</h2>
        <p>To the maximum extent permitted by applicable law, Intezaar is not responsible for indirect or consequential loss, emotional reactions to user-created content, a recipient forwarding a link, loss of browser-local data, missed opening times, service downtime or misuse by another user.</p>
        <p>Nothing in these terms excludes rights or liabilities that cannot lawfully be excluded, including applicable consumer rights or liability for fraud.</p>
      </section>

      <section>
        <h2>13. Ending use</h2>
        <p>You may stop using the beta at any time. Because the current prototype does not provide a complete account dashboard or stored-letter management system, you should avoid sharing a link you no longer want used and create a replacement letter when details change.</p>
      </section>

      <section>
        <h2>14. Changes to these terms</h2>
        <p>These terms may be updated as the beta develops. The date at the top of this page will change when a material revision is published. Continued use after an update means you accept the revised terms.</p>
      </section>

      <section>
        <h2>15. Legal operator and final agreement</h2>
        <div className={styles.note}>
          <p>Intezaar is currently in pre-launch public beta. The formal operating entity, business contact details, governing-law clause, privacy notice and paid-service terms will be published before commercial launch. These beta terms should receive professional legal review before payments or long-term private storage are enabled.</p>
        </div>
      </section>
    </PolicyShell>
  );
}
