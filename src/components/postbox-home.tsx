import Link from "next/link";
import { Navigation } from "@/components/navigation";
import styles from "./postbox-home-refresh.module.css";
import refined from "./postbox-home-refinement.module.css";

const steps = [
  {
    number: "01",
    title: "Write",
    copy: "Write the letter you want them to receive.",
  },
  {
    number: "02",
    title: "Choose the arrival",
    copy: "Pick when the letter should become openable.",
  },
  {
    number: "03",
    title: "Share",
    copy: "Send them the private link. Until the chosen time, the letter stays sealed.",
  },
];

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/how-encryption-works", label: "How privacy works" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "User Agreement" },
];

export function PostboxHome() {
  return (
    <main className={styles.page}>
      <Navigation />

      <section className={`${styles.hero} ${refined.hero}`}>
        <div className={`${styles.heroCopy} ${refined.heroCopy}`}>
          <p className={styles.eyebrow}>A letter that waits</p>
          <h1>Write a letter. Choose when it arrives.</h1>
          <p className={`${styles.heroText} ${refined.heroText}`}>
            Intezaar lets you write a private digital letter today and choose when it can be opened. Share one private link; until that moment, the letter stays sealed.
          </p>
          <div className={styles.heroActions}>
            <Link href="/create" className={`${styles.primaryButton} ${refined.primaryButton}`}>Write my letter</Link>
          </div>
          <div className={`${styles.heroTrust} ${refined.heroTrust}`} aria-label="Intezaar highlights">
            <span>No account needed</span>
            <span>Private</span>
            <span>Free during beta</span>
          </div>
        </div>

        <div className={styles.heroVisual} aria-label="Example of an Intezaar letter waiting to be opened">
          <div className={`${styles.letterDesk} ${refined.letterDesk}`}>
            <div className={styles.deskLabel}><span>INTEZAAR MAIL</span><span>SEALED</span></div>
            <article className={styles.paper}>
              <small>PRIVATE LETTER</small>
              <h2>For Ananya</h2>
              <p>Written today. Waiting for the right moment.</p>
            </article>
            <div className={styles.envelope}>
              <strong>For Ananya</strong>
              <i className={styles.seal}>I</i>
            </div>
            <div className={styles.arrivalTicket}>
              <small>OPENS</small>
              <strong>24 August</strong>
              <span>8:00 PM</span>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className={`${styles.howSection} ${refined.howSection}`}>
        <header className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>How it works</p>
            <h2>Three steps. That&apos;s it.</h2>
          </div>
          <div>
            <p>No complicated setup. Start with the letter and let Intezaar handle the waiting.</p>
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
        <span className={`${styles.finalStamp} ${refined.finalStamp}`}>INTEZAAR</span>
        <p className={styles.eyebrow}>One letter. One moment.</p>
        <h2>Who would you write to?</h2>
        <Link href="/create" className={`${styles.primaryButton} ${refined.primaryButton}`}>Write my letter</Link>
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
