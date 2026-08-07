import type { Metadata } from "next";
import Link from "next/link";
import { PolicyShell } from "@/components/policy-shell";
import styles from "@/components/policy-shell.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy — Intezaar",
  description: "How the Intezaar public beta handles private letters, media, email addresses, security data and browser storage.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <PolicyShell
      eyebrow="Private digital mail"
      title="Privacy Policy"
      intro="This policy explains what Intezaar handles when you write, post, receive or open a private digital letter during the public beta."
      lastUpdated="7 August 2026"
    >
      <section className={styles.warning}>
        <h2>Important beta notice</h2>
        <p>Intezaar uses encryption and private access tokens, but no online service can promise absolute confidentiality or uninterrupted availability. Do not use the beta for passwords, bank credentials, identity documents, medical records, privileged legal material or confidential business secrets.</p>
      </section>

      <section>
        <h2>1. Who this policy applies to</h2>
        <p>This policy applies to senders, recipients and visitors using the Intezaar website and public-beta letter service.</p>
        <p>Intezaar is currently an early-stage project. The formal operating entity, registered address and dedicated privacy contact will be published before commercial launch. Until then, the service is offered only as a limited public beta.</p>
      </section>

      <section>
        <h2>2. Information you provide</h2>
        <p>Depending on how you use Intezaar, you may provide:</p>
        <ul>
          <li>sender and recipient names;</li>
          <li>sender and recipient email addresses when entered;</li>
          <li>occasion, opening date and time, and optional origin or destination city;</li>
          <li>the written letter, heading and closing;</li>
          <li>photographs, voice notes, videos, captions and photo-layout choices; and</li>
          <li>information included in a safety, support or legal request.</li>
        </ul>
        <p>Only provide another person&apos;s email address or personal information when you have a legitimate reason to contact them and doing so respects their wishes and rights.</p>
      </section>

      <section>
        <h2>3. Information created automatically</h2>
        <p>The service may create or receive technical and operational information such as:</p>
        <ul>
          <li>random private access and management tokens, which are stored as one-way hashes;</li>
          <li>letter status, creation time, opening time, expiry time and delivery events;</li>
          <li>security-check results from Cloudflare Turnstile;</li>
          <li>basic request, error, device, browser, network and hosting logs;</li>
          <li>email-delivery status and provider message identifiers; and</li>
          <li>storage paths, file sizes, file types and encrypted-media upload status.</li>
        </ul>
      </section>

      <section>
        <h2>4. Browser-local information</h2>
        <p>Intezaar uses local storage and session storage to preserve a draft, optional email fields, the latest secure recipient link, posting state and parts of the recipient experience. This information remains on the device until it is removed by the browser, the user or site updates.</p>
        <p>Selected media initially exists as a browser-local file and preview. It is uploaded only when the sender completes secure posting.</p>
      </section>

      <section>
        <h2>5. How private letters are protected</h2>
        <p>The written letter payload is encrypted before database storage. The private recipient token itself is not stored in readable form; Intezaar stores a one-way hash used to validate the secret URL.</p>
        <p>Media is encrypted in the sender&apos;s browser before upload to a private Supabase Storage bucket. Before the opening time, the recipient&apos;s browser does not receive the letter content, media decryption key or signed media URLs.</p>
        <p>After the opening time, Intezaar validates the private token, decrypts the stored letter payload on the server and issues short-lived media URLs. The recipient&apos;s browser then decrypts media locally.</p>
      </section>

      <section>
        <h2>6. Why information is used</h2>
        <p>Intezaar uses information to:</p>
        <ul>
          <li>create, secure, schedule and deliver a private letter;</li>
          <li>send an invitation email when requested;</li>
          <li>preserve the selected photo layout and recipient experience;</li>
          <li>prevent bots, abuse, fraud and unauthorised access;</li>
          <li>diagnose errors and improve reliability;</li>
          <li>enforce the <Link href="/terms">User Agreement</Link> and <Link href="/community-guidelines">Community Guidelines</Link>; and</li>
          <li>respond to valid safety, legal or regulatory requirements.</li>
        </ul>
        <p>Intezaar does not sell private letter content or personal information and does not use the contents of letters for behavioural advertising.</p>
      </section>

      <section>
        <h2>7. Service providers</h2>
        <p>Intezaar currently relies on specialist providers to operate the beta:</p>
        <ul>
          <li><strong>Vercel</strong> for website hosting, server functions, deployment and operational logs;</li>
          <li><strong>Supabase</strong> for the database and private encrypted-media storage;</li>
          <li><strong>Resend</strong> for optional invitation-email delivery; and</li>
          <li><strong>Cloudflare Turnstile</strong> for automated-abuse and bot protection.</li>
        </ul>
        <p>These providers process limited information according to their own infrastructure, security and privacy terms. Data may be processed in countries outside the sender&apos;s or recipient&apos;s location.</p>
      </section>

      <section>
        <h2>8. When information may be disclosed</h2>
        <p>Information may be disclosed when reasonably necessary to:</p>
        <ul>
          <li>operate the service through the providers listed above;</li>
          <li>investigate credible abuse, threats, exploitation, fraud or security incidents;</li>
          <li>protect users, Intezaar or the public from serious harm;</li>
          <li>comply with a valid legal request or applicable law; or</li>
          <li>support a future restructuring, transfer or formal launch, subject to appropriate notice and safeguards.</li>
        </ul>
        <p>Private letters are not routinely read or manually reviewed.</p>
      </section>

      <section>
        <h2>9. Retention and deletion</h2>
        <p>A posted letter is assigned an expiry time 90 days after its selected opening time. A protected daily cleanup process deletes encrypted media from storage and marks the letter expired.</p>
        <p>The current beta cleanup does not immediately erase every encrypted database field or operational event. Encrypted records, email-delivery data, security logs and backups may remain for a reasonable period for reliability, abuse prevention, debugging or legal compliance.</p>
        <p>Browser-local drafts and session data remain under the user&apos;s browser controls. Clearing site data removes them from that device.</p>
      </section>

      <section>
        <h2>10. Your choices</h2>
        <ul>
          <li>Recipient and sender email addresses are optional.</li>
          <li>Media attachments are optional.</li>
          <li>You may choose to copy and share the private link manually instead of relying on email.</li>
          <li>You can clear local browser data to remove saved drafts and local session information.</li>
          <li>Do not share a private link you no longer want used.</li>
        </ul>
        <p>A complete account dashboard, withdrawal tool, privacy-request portal and self-service deletion control are not yet available.</p>
      </section>

      <section>
        <h2>11. Children</h2>
        <p>The public beta is intended for adults aged 18 or over. Intezaar is not designed for children, and users must not send sexual, exploitative or otherwise inappropriate content involving anyone under 18.</p>
      </section>

      <section>
        <h2>12. Security limits</h2>
        <p>Intezaar uses encryption, private token links, short-lived media URLs, server-side time checks, restricted storage and Cloudflare bot protection. However, a recipient can forward a private link, a device can be compromised, software can contain defects and third-party infrastructure can fail.</p>
        <p>Keep the recipient link private and retain your own copy of anything important.</p>
      </section>

      <section>
        <h2>13. Changes to this policy</h2>
        <p>This policy will change as the beta adds accounts, reporting, longer scheduling, payment or new storage controls. The last-updated date will identify the latest published version.</p>
      </section>

      <section>
        <h2>14. Privacy requests and formal contact</h2>
        <div className={styles.note}>
          <p>A verified privacy and safety contact address will be published before wider public or paid launch. During the limited beta, do not upload information that requires a formal confidentiality arrangement, guaranteed deletion deadline or regulated record-retention service.</p>
        </div>
      </section>
    </PolicyShell>
  );
}
