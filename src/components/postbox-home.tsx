import Link from "next/link";
import { Navigation } from "@/components/navigation";
import styles from "./postbox-home-refresh.module.css";
import refined from "./postbox-home-refinement.module.css";
import trust from "./trust-transparency.module.css";

const steps = [
  {
    number: "01",
    title: "Write your letter",
    copy: "Write what you want to say. You do not need an account to begin.",
  },
  {
    number: "02",
    title: "Choose when it arrives",
    copy: "Pick how long it should wait, or choose your own opening date and time.",
  },
  {
    number: "03",
    title: "Share the private link",
    copy: "They see a sealed letter until the opening time. Then they can read what you wrote.",
  },
];

const trustLinks = [
  { href: "/how-encryption-works", label: "How privacy works" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "User Agreement" },
  { href: "/about", label: "About Intezaar" },
];

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/how-encryption-works", label: "How privacy works" },
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
          <p className={styles.eyebrow}>A private letter that waits</p>
          <h1>Write a letter. Let it arrive later.</h1>
          <p className={`${styles.heroText} ${refined.heroText}`}>
            Write something today, choose when it can be opened, then share the private link. Until that moment, the letter stays sealed.
          </p>
          <div className={styles.heroActions}>
            <Link href="/create" className={`${styles.primaryButton} ${refined.primaryButton}`}>Write a letter</Link>
            <Link href="/#how-it-works" className={`${styles.secondaryButton} ${refined.secondaryButton}`}>See how it works</Link>
          </div>
          <div className={`${styles.heroTrust} ${refined.heroTrust}`} aria-label="Intezaar highlights">
            <span>Private</span>
            <span>No account</span>
            <span>Opens when you choose</span>
          </div>
        </div>

        <div className={styles.heroVisual} aria-label="A private Intezaar letter waiting to be opened">
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
        <div><strong>Private</strong><span>Your letter is protected before it is stored.</span></div>
        <div><strong>No account</strong><span>Start writing without creating a profile.</span></div>
        <div><strong>Stays sealed</strong><span>The letter cannot be read before the opening time you choose.</span></div>
        <div><strong>You share it</strong><span>After posting, you get one private link to send to the recipient.</span></div>
      </section>

      <section id="how-it-works" className={`${styles.howSection} ${refined.howSection}`}>
        <header className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>How it works</p>
            <h2>Write. Choose a time. Share.</h2>
          </div>
          <div>
            <p>
              That is the whole experience. Intezaar keeps the technical privacy details out of your way while you write.
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

      <section className={`${styles.finalCta} ${refined.finalCta}`}>
        <span className={`${styles.finalStamp} ${refined.finalStamp}`}>POSTED WITH PATIENCE</span>
        <p className={styles.eyebrow}>Start with the words</p>
        <h2>Write it today. Let the moment come later.</h2>
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
