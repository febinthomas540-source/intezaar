import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { ReflectionUseCases } from "@/components/reflection-use-cases";
import styles from "./postbox-home-refresh.module.css";

const steps = [
  {
    number: "01",
    title: "Write the letter",
    copy: "Put the words first. Add a photograph, voice note or video only if it belongs inside the letter.",
  },
  {
    number: "02",
    title: "Choose its moment",
    copy: "Pick when it should arrive. Until then, the recipient sees a sealed envelope instead of your message.",
  },
  {
    number: "03",
    title: "Seal and post",
    copy: "Close the envelope, post it into Intezaar and share the private recipient link.",
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

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Private digital letters, posted for later</p>
          <h1>Some words shouldn&apos;t arrive instantly.</h1>
          <p className={styles.heroText}>
            Write to someone you love, or leave something for your future self. Choose when the letter arrives. Until that moment, it stays sealed.
          </p>
          <div className={styles.heroActions}>
            <Link href="/create" className={styles.primaryButton}>Write a letter</Link>
            <Link href="/future-self" className={styles.secondaryButton}>Write to future me</Link>
          </div>
          <div className={styles.heroTrust} aria-label="Intezaar privacy and access highlights">
            <span>No account required</span>
            <span>No phone number</span>
            <span>Private recipient link</span>
            <span>Opens when chosen</span>
          </div>
        </div>

        <div className={styles.heroVisual} aria-label="A private Intezaar letter waiting to be sealed">
          <div className={styles.letterDesk}>
            <div className={styles.deskLabel}><span>INTEZAAR · PRIVATE DIGITAL MAIL</span><span>BY RAIL · DIGITAL</span></div>
            <article className={styles.paper}>
              <small>FOR SOMEONE SPECIAL</small>
              <h2>A letter worth waiting for.</h2>
              <p>Not another notification. A few words, given a little time before they arrive.</p>
            </article>
            <div className={styles.envelope}>
              <strong>For Ananya</strong>
              <i className={styles.seal}>I</i>
            </div>
            <div className={styles.arrivalTicket}>
              <small>ARRIVES</small>
              <strong>14 August</strong>
              <span>8:00 PM · SEALED</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.trustBand} aria-label="Simple and private">
        <div><strong>No account</strong><span>Start writing without creating a profile.</span></div>
        <div><strong>No phone number</strong><span>Ordinary letters only need a private recipient link.</span></div>
        <div><strong>Not public</strong><span>Your letter is not listed or published as public content.</span></div>
        <div><strong>Your timing</strong><span>The sender chooses the opening date and time.</span></div>
      </section>

      <ReflectionUseCases />

      <section id="how-it-works" className={styles.howSection}>
        <header className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>How Intezaar works</p>
            <h2>Write. Choose. Seal. Post.</h2>
          </div>
          <div>
            <p>
              No complicated system to learn. Intezaar keeps the ritual simple: one letter, one chosen arrival and one private link.
            </p>
          </div>
        </header>

        <div className={styles.stepGrid}>
          {steps.map((step) => (
            <article key={step.number} className={styles.stepCard}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.recipientSection}>
        <div className={styles.recipientCopy}>
          <p className={styles.eyebrow}>What they receive</p>
          <h2>The anticipation is part of the letter.</h2>
          <p>
            The recipient opens a private link and finds a sealed envelope waiting for them. Your message stays hidden until the moment you chose.
          </p>
          <ol>
            <li><span>1</span><div><strong>They see a letter is waiting</strong><p>A simple sealed-letter screen shows the opening moment.</p></div></li>
            <li><span>2</span><div><strong>The message stays out of sight</strong><p>Before arrival, the words inside are not shown to the recipient.</p></div></li>
            <li><span>3</span><div><strong>They break the seal</strong><p>At the chosen time, the letter is ready to open and read.</p></div></li>
          </ol>
        </div>

        <div className={styles.recipientPreview}>
          <div className={styles.previewTop}>
            <span>INTEZAAR</span>
            <small>PRIVATE DIGITAL MAIL</small>
          </div>
          <div className={styles.previewMessage}>
            <small>PRIVATE MAIL FOR ANANYA</small>
            <h3>A letter has been posted for you.</h3>
            <p>Arjun chose a moment for these words to arrive.</p>
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

      <section className={styles.occasionsSection}>
        <div>
          <p className={styles.eyebrow}>For words that deserve more than a notification</p>
          <h2>Give the message a little distance before it arrives.</h2>
        </div>
        <div className={styles.occasionList}>
          {occasions.map((occasion) => <span key={occasion}>{occasion}</span>)}
        </div>
      </section>

      <section className={styles.finalCta}>
        <span className={styles.finalStamp}>POSTED WITH PATIENCE</span>
        <p className={styles.eyebrow}>Ready when you are</p>
        <h2>Write the letter now.<br />Let the moment arrive later.</h2>
        <Link href="/create" className={styles.primaryButton}>Write a letter</Link>
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
