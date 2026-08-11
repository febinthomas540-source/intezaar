import type { Metadata } from "next";
import Link from "next/link";
import { PolicyShell } from "@/components/policy-shell";
import styles from "@/components/policy-shell.module.css";

export const metadata: Metadata = {
  title: "How Intezaar Encryption Works",
  description: "A plain-language explanation of Intezaar end-to-end encryption, private links, timed release, media protection and delivery metadata.",
  alternates: { canonical: "/how-encryption-works" },
};

export default function EncryptionPage() {
  return (
    <PolicyShell
      eyebrow="Trust & encryption"
      title="How encryption works"
      intro="For new letters, the message and private media are encrypted in the sender’s browser and decrypted in the recipient’s browser. Intezaar does not store the decryption key."
      lastUpdated="11 August 2026"
    >
      <section className={styles.warning}>
        <h2>The short version</h2>
        <p>New letter content and private media use end-to-end encryption. Delivery metadata does not. Anyone who obtains the complete private recipient link may be able to decrypt the letter after its opening time, so the complete link must be treated as a secret.</p>
      </section>

      <section>
        <h2>1. When the sender posts</h2>
        <p>The sender&apos;s browser generates a random decryption key. The heading, message, closing and private-media details are encrypted locally before the encrypted payload is sent to Intezaar.</p>
        <p>Private photos, voice notes and videos are also encrypted in the browser before upload.</p>
      </section>

      <section>
        <h2>2. What Intezaar stores</h2>
        <p>Intezaar stores encrypted ciphertext and the delivery information needed to operate the service. It does not store the decryption key for new end-to-end encrypted letters.</p>
        <p>The key is carried in the complete recipient URL after the <code>#</code> character. That part of a URL is a browser fragment and is not sent to the Intezaar server as part of the normal page request.</p>
      </section>

      <section>
        <h2>3. Why the letter still cannot open early</h2>
        <p>End-to-end encryption and timed release are separate protections. Before the chosen opening time, Intezaar does not release the encrypted message payload or private-media download URLs to the recipient browser.</p>
        <p>At the chosen time, the server can release the ciphertext. The recipient&apos;s browser then uses the key from the complete private link to decrypt it locally.</p>
      </section>

      <section>
        <h2>4. What remains visible to Intezaar</h2>
        <p>Some information must remain readable for delivery to work. Depending on the letter, this can include sender and recipient names, optional email addresses, occasion, format, route labels, opening and expiry times, file type and size, letter status, security events and email-delivery status.</p>
        <p>So the accurate claim is: <strong>the letter content and private media are end-to-end encrypted</strong>. It would be inaccurate to say that every piece of delivery metadata is hidden from Intezaar.</p>
      </section>

      <section>
        <h2>5. The complete private link is the key</h2>
        <p>If the <code>#k=...</code> part is lost, Intezaar does not have a stored copy of that key to reconstruct it. If the complete link is forwarded to someone else, that person may be able to decrypt the letter once it becomes available.</p>
        <p>For that reason, treat the complete recipient link like a private key and send it only to the intended recipient.</p>
      </section>

      <section>
        <h2>6. Registered Intezaar Mail</h2>
        <p>Registered Intezaar Mail can add an email one-time-code check before the encrypted payload is released. The email notice itself does not contain the end-to-end decryption key, so the sender still needs to share the complete private link separately.</p>
        <p>This is an Intezaar verification feature, not postal registered mail and not proof of legal service.</p>
      </section>

      <section>
        <h2>7. Analytics on recipient pages</h2>
        <p>Advertising measurement and web-analytics components are disabled on private <code>/receive/</code> pages because the recipient&apos;s browser may hold the decryption key in the URL fragment.</p>
      </section>

      <section>
        <h2>8. Older letters</h2>
        <p>Letters created before the end-to-end encryption upgrade may continue to use the earlier server-side encrypted format until they expire. That compatibility path exists so previously posted letters are not broken.</p>
      </section>

      <section>
        <h2>9. Limits of end-to-end encryption</h2>
        <p>Encryption cannot protect a compromised device, stop an intended recipient from copying the letter after opening, prevent someone from forwarding the complete private link, or guarantee that software will never contain a security defect.</p>
        <p>For more detail about storage, retention and service providers, read the <Link href="/privacy">Privacy Policy</Link>.</p>
      </section>

      <section>
        <h2>10. Public-beta reliability</h2>
        <div className={styles.note}>
          <p>Intezaar is not permanent archival storage. Current letters are assigned an expiry 90 days after their opening time, and availability is not guaranteed indefinitely. Keep your own copy of anything irreplaceable.</p>
        </div>
      </section>
    </PolicyShell>
  );
}
