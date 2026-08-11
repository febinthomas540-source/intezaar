import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { ReflectionUseCases } from "@/components/reflection-use-cases";
import styles from "./postbox-home-refresh.module.css";
import refined from "./postbox-home-refinement.module.css";

const steps = [
  {
    number: "01",
    title: "Write",
    copy: "Write the message first. Photos, voice notes and video are optional, not the point of the letter.",
  },
  {
    number: "02",
    title: "Set the opening time",
    copy: "Choose the date and time. Before then, the recipient sees the envelope and the countdown, not the message inside.",
  },
  {
    number: "03",
    title: "Seal and share",
    copy: "Post the letter into Intezaar and send the private recipient link to the person it is meant for.",
  },
];

const occasions = ["Birthday", "Anniversary", "Apology", "Farewell", "Just because"];

const footerLinks = [
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
          <p className={styles.eyebrow}>Private letters with a chosen opening time</p>
          <h1>Write it now. Let it arrive later.</h1>
          <p className={`${styles.heroText} ${refined.heroText}`}>
            Intezaar lets you write a private digital letter, seal it, and choose when it can be opened — for someone else or for your future self.
          </p>
          <div className={styles.heroActions}>
            <Link href="/create" className={`${styles.primaryButton} ${refined.primaryButton}`}>Write a letter</Link>
            <Link href="/future-self" className={`${styles.secondaryButton} ${refined.secondaryButton}`}>Write to future me</Link>
          </div>
          <div className={`${styles.heroTrust} ${refined.heroTrust}`} aria-label="Intezaar privacy and access highlights">
            <span>No account</span>
            <span>No phone number</span>
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
        <div><strong>No account</strong><span>Start writing without creating a profile.</span></div>
        <div><strong>No phone number</strong><span>Ordinary letters only need a private recipient link.</span></div>
        <div><strong>Not public</strong><span>Your letter is not listed or published as public content.</span></div>
        <div><strong>Your timing</strong><span>You choose the opening date and time.</span></div>
      </section>

      <ReflectionUseCases />

      <section id="how-it-works" className={`${styles.howSection} ${refined.howSection}`}>
        <header className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>How it works</p>
            <h2>One letter. One opening time.</h2>
          </div>
          <div>
            <p>
              The recipient gets a private link. The message stays hidden until the time you chose, then the seal can be opened.
            </p>
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

      <section className={`${styles.recipientSection} ${refined.recipientSection}`}>
        <div className={styles.recipientCopy}>
          <p className={styles.eyebrow}>What the recipient sees</p>
          <h2>Before the date, they see the envelope — not the message.</h2>
          <p>
            The private link shows that a letter is waiting and when it opens. The words inside stay out of view until that moment.
          </p>
          <ol>
            <li><span>1</span><div><strong>A sealed letter is waiting</strong><p>The opening date and time are visible.</p></div></li>
            <li><span>2</span><div><strong>The message remains hidden</strong><p>The recipient cannot read the letter early.</p></div></li>
            <li><span>3</span><div><strong>The seal becomes available</strong><p>At the chosen time, the letter can be opened and read.</p></div></li>
          </ol>
        </div>

        <div className={`${styles.recipientPreview} ${refined.recipientPreview}`}>
          <div className={styles.previewTop}>
            <span>INTEZAAR</span>
            <small>PRIVATE DIGITAL MAIL</small>
          </div>
          <div className={`${styles.previewMessage} ${refined.previewMessage}`}>
            <small>PRIVATE MAIL FOR ANANYA</small>
            <h3>A letter is waiting for you.</h3>
            <p>It can be opened on 14 August at 8:00 PM.</p>
          </div>
          <div className={styles.previewEnvelope}>
            <strong>For Ananya</strong>
            <i>I</i>
            <em>SEALED</em>
          </div>
          <div className={styles.previewDate}>
            <div><small>OPENS</small><strong>14 August</strong></div>
            <div><small>TIME</small><strong>8:00 PM</strong></div>
          </div>
        </div>
      </section>

      <section className={`${styles.occasionsSection} ${refined.occasionsSection}`}>
        <div>
          <p className={styles.eyebrow}>When timing matters</p>
          <h2>Use the wait when the moment matters as much as the words.</h2>
        </div>
        <div className={styles.occasionList}>
          {occasions.map((occasion) => <span key={occasion}>{occasion}</span>)}
        </div>
      </section>

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
