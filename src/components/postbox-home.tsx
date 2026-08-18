import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { ReflectionUseCases } from "@/components/reflection-use-cases";
import styles from "./postbox-home-refresh.module.css";
import refined from "./postbox-home-refinement.module.css";
import trust from "./trust-transparency.module.css";

const steps = [
  {
    number: "01",
    title: "Write & seal",
    copy: "Write the letter, then post it. The message and any private media are encrypted in your browser before Intezaar stores them — the key never leaves the private link.",
  },
  {
    number: "02",
    title: "Choose the opening time",
    copy: "Pick the date and time. Before then, the recipient sees a sealed envelope and a countdown, not the message inside.",
  },
  {
    number: "03",
    title: "Delivered & decrypted",
    copy: "At the chosen time, the encrypted letter unlocks on the recipient's own device. Intezaar never holds the decryption key.",
  },
];

const trustLinks = [
  { href: "/how-encryption-works", label: "How encryption works" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "User Agreement" },
  { href: "/about", label: "About Intezaar" },
];

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/how-encryption-works", label: "How encryption works" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/community-guidelines", label: "Community Guidelines" },
  { href: "/terms", label: "User Agreement" },
];

export function PostboxHome() {
  return (
    <main className={styles.page}>
      <Navigation />

      <section className={`${styles.hero} ${refined.hero}`}>
        <div className={`${styles.heroCopy} ${refined.heroCopy}`}>
          <p className={styles.eyebrow}>End-to-end encrypted letters with a chosen opening time</p>
          <h1>Write it now. Let it arrive later.</h1>
          <p className={`${styles.heroText} ${refined.heroText}`}>
            Intezaar lets you write a private digital letter, seal it, and choose when it can be opened — for someone else or for your future self. Your letter content and private media are end-to-end encrypted before they leave your browser.
          </p>
          <div className={styles.heroActions}>
            <Link href="/create" className={`${styles.primaryButton} ${refined.primaryButton}`}>Write a letter</Link>
            <Link href="/future-self" className={`${styles.secondaryButton} ${refined.secondaryButton}`}>Write to future me</Link>
          </div>
          <div className={`${styles.heroTrust} ${refined.heroTrust}`} aria-label="Intezaar privacy and access highlights">
            <span>End-to-end encrypted</span>
            <span>No account</span>
            <span>Private link</span>
            <span>Opens when chosen</span>
          </div>
        </div>

        <div className={styles.heroVisual} aria-label="A private Intezaar letter waiting to be sealed">
          <div className={`${styles.letterDesk} ${refined.letterDesk}`}>
            <div className={styles.deskLabel}><span>INTEZAAR · PRIVATE DIGITAL MAIL</span><span>SEALED UNTIL OPENING</span></div>
            <article className={styles.paper}>
              <small>PRIVATE LETTER</small>
              <h2>For Ananya — 14 August.</h2>
              <p>Written on 11 August. Sealed until 8:00 PM.</p>
            </article>
            <div className={styles.envelope}>
              <strong>For Ananya</strong>
              <i className={styles.seal}>I</i>
            </div>
            <div className={styles.arrivalTicket}>
              <small>OPENS</small>
              <strong>14 August</strong>
              <span>8:00 PM · SEALED</span>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.trustBand} ${refined.trustBand}`} aria-label="Simple and private">
        <div><strong>End-to-end encrypted</strong><span>Letter content and private media are encrypted in the sender&apos;s browser. Intezaar does not store the decryption key.</span></div>
        <div><strong>No account</strong><span>Start writing without creating a profile or adding a phone number.</span></div>
        <div><strong>Not public</strong><span>Your letter is not listed or published as public content.</span></div>
        <div><strong>Your timing</strong><span>You choose the opening date and time.</span></div>
      </section>

      <section id="how-it-works" className={`${styles.howSection} ${refined.howSection}`}>
        <header className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>How it works</p>
            <h2>One letter. One opening time.</h2>
          </div>
          <div>
            <p>
              The recipient gets a complete private link containing the decryption key. The key stays in the browser, while Intezaar holds the encrypted letter until the chosen time.
            </p>
            <nav className={trust.trustLinks} aria-label="Trust information">
              {trustLinks.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
            </nav>
          </div>
        </header>

        <div className={`${styles.stepGrid} ${refined.stepGrid}`}>
          {steps.map((step) => (
            <article key={step.number} className={`${styles.stepCard} ${refined.stepCard}`}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <ReflectionUseCases />

      <section className={`${styles.finalCta} ${refined.finalCta}`}>
        <span className={`${styles.finalStamp} ${refined.finalStamp}`}>POSTED WITH PATIENCE</span>
        <p className={styles.eyebrow}>Start with the letter</p>
        <h2>Write it today. Choose when it opens.</h2>
        <Link href="/create" className={`${styles.primaryButton} ${refined.primaryButton}`}>Write a letter</Link>
      </section>

      <footer className={styles.footer}>
        <div><span>I</span><strong>Intezaar</strong></div>
        <p>
          {footerLinks.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
        </p>
        <small>India · Public beta · 2026</small>
      </footer>
    </main>
  );
}
