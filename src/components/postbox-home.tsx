import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { PublicLetterCounter } from "@/components/public-letter-counter";
import { ReflectionUseCases } from "@/components/reflection-use-cases";
import styles from "./postbox-home-refresh.module.css";
import refined from "./postbox-home-refinement.module.css";
import trust from "./trust-transparency.module.css";

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
    copy: "When you post, the letter content and private media are end-to-end encrypted in your browser. Share the complete private link with the recipient.",
  },
  {
    number: "04",
    title: "Let the letter continue",
    copy: "After opening, the recipient can write one back or start a Future Me letter. Senders can optionally ask for one email when the seal is opened.",
  },
];

const trustSteps = [
  {
    number: "01",
    title: "Encrypted before upload",
    copy: "For new letters, the written message and private media are encrypted in the sender’s browser before Intezaar stores them.",
  },
  {
    number: "02",
    title: "The key stays in the private link",
    copy: "Intezaar stores the encrypted payload, but not the decryption key. The complete private recipient link carries the key in its browser-only fragment.",
  },
  {
    number: "03",
    title: "Released only when the time arrives",
    copy: "The server enforces the selected opening time. After that moment, the encrypted payload can be delivered and decrypted on the recipient’s device.",
  },
];

const stories = [
  {
    label: "Birthday",
    title: "A letter written before the rush",
    copy: "Write the words while you have time, then let the letter become openable on the birthday itself.",
    href: "/create",
    action: "Write one",
  },
  {
    label: "Future self",
    title: "A note for the person you are becoming",
    copy: "Capture what life feels like today and leave it sealed for a later version of yourself.",
    href: "/future-self",
    action: "Explore future self",
  },
  {
    label: "Difficult conversation",
    title: "Words that should not be sent immediately",
    copy: "Write after an argument, create some distance, and decide what deserves to arrive after the emotion settles.",
    href: "/write-after-argument",
    action: "See the use case",
  },
  {
    label: "Open when",
    title: "Something to keep for a particular kind of day",
    copy: "Prepare a letter for a moment such as missing home, needing encouragement, or reaching a milestone.",
    href: "/open-when",
    action: "Explore open-when",
  },
];

const occasions = ["Birthday", "Anniversary", "Apology", "Farewell", "Just because"];

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

      <PublicLetterCounter />

      <section className={trust.trustSection} aria-labelledby="trust-heading">
        <div>
          <p className={trust.eyebrow}>Trust & transparency</p>
          <h2 id="trust-heading">Know what happens to the letter before you write it.</h2>
          <p className={trust.lead}>
            Privacy should not depend on vague promises. Here is the current public-beta model in plain language.
          </p>
          <nav className={trust.trustLinks} aria-label="Trust information">
            <Link href="/how-encryption-works">How encryption works</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">User Agreement</Link>
            <Link href="/about">About Intezaar</Link>
          </nav>
        </div>
        <div className={trust.trustSteps}>
          {trustSteps.map((item) => (
            <div className={trust.trustStep} key={item.number}>
              <span>{item.number}</span>
              <strong>{item.title}</strong>
              <p>{item.copy}</p>
            </div>
          ))}
        </div>
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
              The recipient gets a complete private link containing the decryption key. The key stays in the browser, while Intezaar holds the encrypted letter until the chosen time.
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
            The private link shows that a letter is waiting and when it opens. The encrypted words and private media stay sealed until that moment, then decrypt on the recipient&apos;s device.
          </p>
          <ol>
            <li><span>1</span><div><strong>A sealed letter is waiting</strong><p>The opening date and time are visible.</p></div></li>
            <li><span>2</span><div><strong>The message remains encrypted</strong><p>The recipient cannot read the letter early.</p></div></li>
            <li><span>3</span><div><strong>The seal becomes available</strong><p>At the chosen time, the recipient&apos;s browser can decrypt and open the letter.</p></div></li>
            <li><span>4</span><div><strong>The recipient can keep it moving</strong><p>After reading, they can write a new letter back or start one for their future self.</p></div></li>
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

      <section className={trust.storiesSection} aria-labelledby="stories-heading">
        <div className={trust.storiesHeader}>
          <div><p className={trust.eyebrow}>Built for real moments</p></div>
          <div>
            <h2 id="stories-heading">A delayed letter needs a reason to wait.</h2>
            <small>These are illustrative use cases, not invented customer testimonials. We will only publish testimonials when real users give us permission to do so.</small>
          </div>
        </div>
        <div className={trust.storyList}>
          {stories.map((story) => (
            <article className={trust.story} key={story.title}>
              <small>{story.label}</small>
              <strong>{story.title}</strong>
              <p>{story.copy}</p>
              <Link href={story.href}>{story.action} →</Link>
            </article>
          ))}
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

      <section className={trust.reliabilitySection} aria-labelledby="reliability-heading">
        <div>
          <p className={trust.eyebrow}>What happens to your letter</p>
          <h2 id="reliability-heading">Built for letters that wait, with clear retention.</h2>
          <p className={trust.lead}>
            Current beta letters remain available through their chosen opening period and for 90 days afterwards. For anything irreplaceable, keep your own copy too.
          </p>
        </div>
        <div className={trust.reliabilityFacts}>
          <div className={trust.reliabilityFact}>
            <strong>While it waits</strong>
            <p>The encrypted letter remains stored and sealed until its selected opening time.</p>
          </div>
          <div className={trust.reliabilityFact}>
            <strong>After opening</strong>
            <p>The letter remains available until its current beta expiry, 90 days after the selected opening time.</p>
          </div>
          <div className={trust.reliabilityFact}>
            <strong>Keep a copy</strong>
            <p>The opened-letter screen includes a save-or-print keepsake option so an important letter does not have to depend on the website forever.</p>
          </div>
          <div className={trust.reliabilityFact}>
            <strong>Full service limits</strong>
            <p>Detailed expiry, storage, migration and beta-availability limits remain available in the <Link href="/terms">User Agreement</Link> and <Link href="/privacy">Privacy Policy</Link>.</p>
          </div>
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
