import type { Metadata } from "next";
import Link from "next/link";
import { PolicyShell } from "@/components/policy-shell";
import styles from "@/components/policy-shell.module.css";

export const metadata: Metadata = {
  title: "Community Guidelines — Intezaar",
  description: "Safety and conduct rules for writing and sending private digital letters through Intezaar.",
  alternates: { canonical: "/community-guidelines" },
};

export default function CommunityGuidelinesPage() {
  return (
    <PolicyShell
      eyebrow="Post with care"
      title="Community Guidelines"
      intro="Intezaar is made for thoughtful letters—not pressure, fear, humiliation or unwanted contact. These rules apply to every letter, attachment, sender and recipient."
      lastUpdated="7 August 2026"
    >
      <section>
        <h2>The simple standard</h2>
        <p>Write something you are prepared to take responsibility for. Respect the recipient&apos;s dignity, privacy and boundaries. A delayed letter should create anticipation, not anxiety, coercion or danger.</p>
        <div className={styles.note}>
          <p><strong>Consent and boundaries matter.</strong> Do not use Intezaar to continue contacting someone who has blocked you, ended contact, asked you to stop or would reasonably feel threatened by receiving the letter.</p>
        </div>
      </section>

      <section>
        <h2>Not allowed on Intezaar</h2>

        <h3>Threats, harassment and coercion</h3>
        <p>Do not threaten, stalk, intimidate, blackmail, shame or repeatedly contact another person. Do not use an opening date, countdown, private link or emotional message to pressure someone into replying, meeting, paying money or continuing a relationship.</p>

        <h3>Sexual exploitation and intimate content</h3>
        <p>Never send sexual content involving anyone under 18. Do not share intimate images, recordings or private sexual information without the clear consent of every adult involved. Revenge pornography, sexual extortion, grooming and covert recordings are prohibited.</p>

        <h3>Hate and dehumanising abuse</h3>
        <p>Do not attack, degrade or threaten people because of protected or personal characteristics such as race, caste, ethnicity, nationality, religion, disability, sex, gender identity or sexual orientation.</p>

        <h3>Fraud, impersonation and deceptive media</h3>
        <p>Do not pretend to be another person or organisation, run a scam, request passwords or payment details, create a fake emergency, use manipulated media to deceive someone, or misrepresent Intezaar as an official postal, government or India Post service.</p>

        <h3>Privacy violations</h3>
        <p>Do not expose someone&apos;s address, phone number, workplace, financial details, identity documents, private conversations or other personal information without permission. Do not publish or forward a recipient&apos;s private letter link without their consent.</p>

        <h3>Illegal or dangerous activity</h3>
        <p>Do not use Intezaar to facilitate illegal goods, violence, exploitation, terrorism, malware, hacking, fraud or instructions intended to cause serious harm. Do not encourage suicide, self-harm or eating-disorder behaviour.</p>

        <h3>Spam and commercial misuse</h3>
        <p>Do not send bulk unsolicited letters, deceptive promotions, chain messages, phishing links or automated spam. Intezaar is designed for personal letters, not mass marketing.</p>
      </section>

      <section>
        <h2>Age and vulnerable users</h2>
        <p>The public beta is for adults aged 18 or over. Do not create a letter or recipient experience on behalf of a child, and do not use Intezaar to establish inappropriate contact with a minor or exploit a vulnerable person.</p>
      </section>

      <section>
        <h2>Use private links carefully</h2>
        <ul>
          <li>Share the recipient link only with the intended person through a trusted private channel.</li>
          <li>Do not publish private links on public social media, websites or group chats.</li>
          <li>Treat the link like a key: anyone who obtains it may be able to access the delivery experience.</li>
          <li>Do not place passwords, bank credentials, identity documents or other high-risk secrets inside a letter.</li>
        </ul>
      </section>

      <section>
        <h2>How Intezaar may respond</h2>
        <p>Where reasonably necessary and technically possible, Intezaar may restrict access, disable links, remove content, preserve relevant records or block future use when these guidelines or the <Link href="/terms">User Agreement</Link> are breached.</p>
        <p>Private letters are not routinely read or pre-screened. Authorised access may occur when needed to investigate a credible safety report, respond to a security incident, enforce these rules or comply with a valid legal requirement.</p>
      </section>

      <section>
        <h2>Reporting during the beta</h2>
        <p>A dedicated in-product reporting route and published safety contact are being prepared before wider public release. Until then, do not engage with threatening or exploitative content, preserve the private link and relevant evidence, and use the appropriate local authority or platform-reporting channel where immediate action is needed.</p>
      </section>

      <section>
        <h2>Immediate safety</h2>
        <div className={styles.warning}>
          <p>Intezaar is not an emergency or crisis service. If a letter contains a credible threat, exploitation, blackmail, imminent danger or illegal sexual content, preserve the evidence, avoid forwarding it unnecessarily and contact the appropriate local emergency service or law-enforcement authority.</p>
        </div>
      </section>

      <section>
        <h2>Help us protect the feeling</h2>
        <p>The purpose of Intezaar is simple: give meaningful words time, care and ceremony. Use the post box to send honesty, affection, reflection, apology or closure—not fear.</p>
      </section>
    </PolicyShell>
  );
}
