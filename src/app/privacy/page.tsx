import type { Metadata } from "next";
import Link from "next/link";
import { PolicyShell } from "@/components/policy-shell";
import styles from "@/components/policy-shell.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy — Intezaar",
  description: "How the Intezaar public beta handles private letters, media, email addresses, security data, analytics and browser storage.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <PolicyShell
      eyebrow="Private digital mail"
      title="Privacy Policy"
      intro="This policy explains what Intezaar handles when you write, post, receive or open a private digital letter during the public beta."
      lastUpdated="11 August 2026"
    >
      <section className={styles.warning}>
        <h2>Important beta notice</h2>
        <p>New letters posted through the current creator use end-to-end encryption for the written message and private media, but no online service can promise absolute confidentiality or uninterrupted availability. Do not use the beta for passwords, bank credentials, identity documents, medical records, privileged legal material or confidential business secrets.</p>
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
        <p>For a new end-to-end encrypted letter, the sender&apos;s browser generates the private decryption key. The complete recipient link contains that key in the URL fragment after the <code>#</code> character. The fragment is used by the recipient&apos;s browser for local decryption and is not sent to Intezaar&apos;s server as part of the page request.</p>
        <p>Selected media initially exists as a browser-local file and preview. It is encrypted in the browser and uploaded only when the sender completes secure posting.</p>
      </section>

      <section>
        <h2>5. How private letters are protected</h2>
        <p>For new letters posted through the current creator, the heading, written message, closing, attachment names, captions and photo-layout choices are encrypted in the sender&apos;s browser using authenticated encryption before the encrypted payload is sent to Intezaar. Private media files are encrypted in the sender&apos;s browser before upload to the private storage bucket.</p>
        <p>Intezaar stores the encrypted message payload but does not store the decryption key for these new letters. The key remains in the complete private recipient link. After the opening time, the encrypted payload is delivered to the recipient&apos;s browser and is decrypted there.</p>
        <p>Before the selected opening time, the recipient&apos;s browser does not receive the encrypted message payload, private-media download URLs or the encrypted media files. The server continues to enforce the opening time before releasing them.</p>
        <p>Some delivery information must remain available to Intezaar in readable form so the service can operate. This can include sender and recipient names, email addresses when provided, occasion, format, opening time, expiry time, route labels, file type and size, delivery status and security events. End-to-end encryption therefore applies to the letter message and private media, not every item of delivery metadata.</p>
        <p>Letters created before the end-to-end encryption upgrade may continue to use the earlier server-side encrypted format until they expire. Those legacy letters can be decrypted by the Intezaar server after their opening time so that existing deliveries continue to work.</p>
      </section>

      <section>
        <h2>6. Private links, email and recipient verification</h2>
        <p>Anyone who obtains the complete private recipient link, including its decryption-key fragment, may be able to decrypt a new letter after the selected opening time. Keep the complete link private and share it only with the intended recipient.</p>
        <p>For end-to-end encrypted letters, an automated Intezaar email notice does not contain the decryption key. The sender must still share the complete private link with the recipient. This separation prevents Intezaar&apos;s email system from receiving or storing the key.</p>
        <p>If Registered Intezaar Mail is enabled, the recipient must also complete the email one-time-code check before the encrypted payload and private-media download URLs are released. Registered Intezaar Mail is an Intezaar verification feature, not a postal service or proof of legal delivery.</p>
      </section>

      <section>
        <h2>7. Why information is used</h2>
        <p>Intezaar uses information to:</p>
        <ul>
          <li>create, secure, schedule and deliver a private letter;</li>
          <li>send an invitation or arrival-notice email when requested;</li>
          <li>preserve the selected recipient experience;</li>
          <li>prevent bots, abuse, fraud and unauthorised access;</li>
          <li>diagnose errors and improve reliability;</li>
          <li>measure general product usage and creation steps where permitted;</li>
          <li>enforce the <Link href="/terms">User Agreement</Link> and <Link href="/community-guidelines">Community Guidelines</Link>; and</li>
          <li>respond to valid safety, legal or regulatory requirements.</li>
        </ul>
        <p>Intezaar does not sell private letter content or personal information and does not use the contents of letters for behavioural advertising.</p>
      </section>

      <section>
        <h2>8. Service providers and measurement</h2>
        <p>Intezaar currently relies on specialist providers to operate the beta:</p>
        <ul>
          <li><strong>Vercel</strong> for website hosting, server functions, deployment, operational logs and first-party web analytics;</li>
          <li><strong>Supabase</strong> for the database and private encrypted-media storage;</li>
          <li><strong>Resend</strong> for optional invitation and arrival-notice email delivery;</li>
          <li><strong>Cloudflare Turnstile</strong> for automated-abuse and bot protection; and</li>
          <li><strong>Meta</strong> for optional advertising measurement only after the visitor chooses to allow it.</li>
        </ul>
        <p>The Meta measurement prompt is delayed so it does not need to interrupt a visitor&apos;s first view of the product. If declined, the Meta Pixel is not loaded. Our configured Meta events are intended to measure page visits and creation steps, not the contents typed into a private letter.</p>
        <p>Advertising measurement and web-analytics components are not rendered on private <code>/receive/</code> delivery pages, where an end-to-end decryption key may be present in the browser URL fragment.</p>
        <p>These providers process limited information according to their own infrastructure, security and privacy terms. Data may be processed in countries outside the sender&apos;s or recipient&apos;s location.</p>
      </section>

      <section>
        <h2>9. When information may be disclosed</h2>
        <p>Information available to Intezaar may be disclosed when reasonably necessary to:</p>
        <ul>
          <li>operate the service through the providers listed above;</li>
          <li>investigate credible abuse, threats, exploitation, fraud or security incidents;</li>
          <li>protect users, Intezaar or the public from serious harm;</li>
          <li>comply with a valid legal request or applicable law; or</li>
          <li>support a future restructuring, transfer or formal launch, subject to appropriate notice and safeguards.</li>
        </ul>
        <p>For current end-to-end encrypted letters, Intezaar does not hold the key required to decrypt the message content or private media. Private letters are not routinely read or manually reviewed.</p>
      </section>

      <section>
        <h2>10. Retention and deletion</h2>
        <p>A posted letter is assigned an expiry time 90 days after its selected opening time. A protected daily cleanup process deletes encrypted media from storage and marks the letter expired.</p>
        <p>The current beta cleanup does not immediately erase every encrypted database field or operational event. Encrypted records, email-delivery data, security logs and backups may remain for a reasonable period for reliability, abuse prevention, debugging or legal compliance.</p>
        <p>Browser-local drafts and session data remain under the user&apos;s browser controls. Clearing site data removes them from that device.</p>
      </section>

      <section>
        <h2>11. Service continuity and export</h2>
        <p>Intezaar is an early-stage beta and does not promise permanent archival storage. The recipient can currently save or print an opened letter as a keepsake, but there is no guaranteed bulk export or shutdown-export system.</p>
        <p>If Intezaar plans a material service closure or migration, we intend to give advance notice where reasonably possible so users can preserve important content. This is an operational intention, not a guarantee of uninterrupted access, notice in every circumstance or recoverability after a technical failure.</p>
      </section>

      <section>
        <h2>12. Your choices</h2>
        <ul>
          <li>Recipient and sender email addresses are optional.</li>
          <li>Media attachments are optional.</li>
          <li>You may copy and share the complete private link manually.</li>
          <li>You may allow or decline optional Meta advertising measurement.</li>
          <li>You can clear local browser data to remove saved drafts and local session information.</li>
          <li>Do not share a private link you no longer want used.</li>
        </ul>
        <p>A complete account dashboard, withdrawal tool, privacy-request portal and self-service deletion control are not yet available.</p>
      </section>

      <section>
        <h2>13. Children</h2>
        <p>The public beta is intended for adults aged 18 or over. Intezaar is not designed for children, and users must not send sexual, exploitative or otherwise inappropriate content involving anyone under 18.</p>
      </section>

      <section>
        <h2>14. Security limits</h2>
        <p>Intezaar uses end-to-end encryption for new message content and private media, private token links, short-lived media URLs, server-side time checks, restricted storage and Cloudflare bot protection. However, a recipient can forward a complete private link, a device can be compromised, software can contain defects and third-party infrastructure can fail.</p>
        <p>End-to-end encryption does not prevent an intended recipient from copying, photographing, saving or forwarding content after they decrypt it. Keep the recipient link private and retain your own copy of anything important.</p>
      </section>

      <section>
        <h2>15. Changes to this policy</h2>
        <p>This policy will change as the beta adds accounts, reporting, longer scheduling, payment or new storage controls. The last-updated date will identify the latest published version.</p>
      </section>

      <section>
        <h2>16. Privacy requests and formal contact</h2>
        <div className={styles.note}>
          <p>A verified privacy and safety contact address will be published before wider public or paid launch. During the limited beta, do not upload information that requires a formal confidentiality arrangement, guaranteed deletion deadline or regulated record-retention service.</p>
        </div>
      </section>
    </PolicyShell>
  );
}
