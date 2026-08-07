import Link from "next/link";
import { Navigation } from "@/components/navigation";
import styles from "./postbox-home.module.css";

const steps = [
  {
    number: "01",
    title: "Write your letter",
    copy: "Write the words you want someone to receive. Add a photograph, voice note or video only when it belongs inside the letter.",
  },
  {
    number: "02",
    title: "Choose when it opens",
    copy: "Pick the date and time. Until then, the recipient sees a private sealed envelope—not the message inside.",
  },
  {
    number: "03",
    title: "Seal and post it",
    copy: "Close the envelope, press the seal and place it into the Intezaar post box. Then share the private delivery link.",
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
        <div className={styles.heroGrain} aria-hidden="true" />
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>A private digital letter, posted for later</p>
          <h1>Write it.<br />Seal it.<br />Post it.</h1>
          <p className={styles.heroText}>
            Create a private letter, choose when it can be opened, and post it through the Intezaar letter box.
          </p>
          <p className={styles.heroText}>
            Your letter is not public. The recipient view is reached through its private link, and no account or phone number is required.
          </p>
          <div className={styles.heroActions}>
            <Link href="/create" className={styles.primaryButton}>Write and post a letter</Link>
            <a href="#how-it-works" className={styles.secondaryButton}>See how it works</a>
          </div>
          <div className={styles.heroTrust}>
            <span>No account required</span>
            <span>No phone number</span>
            <span>Private recipient link</span>
          </div>
        </div>

        <div className={styles.postOfficeScene} aria-label="An envelope being posted into the Intezaar letter box">
          <div className={styles.officeSign}>
            <small>PRIVATE DIGITAL MAIL</small>
            <strong>INTEZAAR POST OFFICE</strong>
          </div>
          <div className={styles.wallClock}><span /><i /></div>
          <div className={styles.noticeBoard}>
            <span>WRITE</span><span>SEAL</span><span>POST</span>
          </div>
          <div className={styles.counter} />
          <div className={styles.envelope}>
            <span>For someone special</span>
            <i>I</i>
          </div>
          <div className={styles.postbox}>
            <div className={styles.postboxCrown}>
              <small>डाक</small>
              <strong>INTEZAAR MAIL</strong>
            </div>
            <span className={styles.postboxSlot}>LETTERS</span>
            <div className={styles.postboxDoor}>
              <span>PRIVATE DIGITAL POST</span>
              <strong>POSTED</strong>
            </div>
            <span className={styles.postboxFoot} />
          </div>
          <div className={styles.postedCard}>
            <small>POSTED FOR</small>
            <strong>14 AUGUST</strong>
            <span>Opens at 8:00 PM</span>
          </div>
        </div>
      </section>

      <section className={styles.promiseSection}>
        <div className={styles.promiseSeal}>I</div>
        <div>
          <p className={styles.eyebrow}>Simple and private</p>
          <h2>The envelope stays at the centre.</h2>
          <p>
            Intezaar is a digital experience, not physical postage. During beta, the recipient opens the letter through a private link at the selected moment.
          </p>
        </div>
        <div className={styles.promiseFacts}>
          <div><strong>No account required</strong><span>Write and post without creating a profile.</span></div>
          <div><strong>No phone number</strong><span>A private recipient link is enough for ordinary letters.</span></div>
          <div><strong>One chosen moment</strong><span>The sender decides when it opens.</span></div>
        </div>
      </section>

      <section id="how-it-works" className={styles.howSection}>
        <header className={styles.sectionHeading}>
          <p className={styles.eyebrow}>How Intezaar works</p>
          <h2>A real letter ritual,<br />made digital.</h2>
          <p>No complicated route to understand. Just write, choose the moment, seal the envelope and post it.</p>
        </header>

        <div className={styles.stepGrid}>
          {steps.map((step) => (
            <article key={step.number} className={styles.stepCard}>
              <span>{step.number}</span>
              <div className={styles.stepIcon} aria-hidden="true">
                {step.number === "01" ? <><i /><i /><i /></> : null}
                {step.number === "02" ? <><b>14</b><small>AUG</small></> : null}
                {step.number === "03" ? <><em>I</em></> : null}
              </div>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.recipientSection}>
        <div className={styles.recipientCopy}>
          <p className={styles.eyebrow}>What they receive</p>
          <h2>A sealed letter with a moment worth waiting for.</h2>
          <p>
            They open a private link and see that a letter has been posted for them. The message stays hidden until your chosen date and time.
          </p>
          <ol>
            <li><span>1</span><div><strong>A letter has been posted</strong><p>They see the sender, the seal and the opening moment.</p></div></li>
            <li><span>2</span><div><strong>The envelope stays closed</strong><p>No message preview and no pressure to return every day.</p></div></li>
            <li><span>3</span><div><strong>They break the seal</strong><p>At the chosen time, the private letter is ready to read.</p></div></li>
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
            <span className={styles.previewFlap} />
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
          <p className={styles.eyebrow}>For words that should not arrive instantly</p>
          <h2>Some moments deserve more than a message notification.</h2>
        </div>
        <div className={styles.occasionList}>
          {occasions.map((occasion) => <span key={occasion}>{occasion}</span>)}
        </div>
      </section>

      <section className={styles.finalCta}>
        <span className={styles.finalStamp}>POSTED WITH PATIENCE</span>
        <p className={styles.eyebrow}>Ready to post something meaningful?</p>
        <h2>Write the letter now.<br />Let the moment arrive later.</h2>
        <Link href="/create" className={styles.primaryButton}>Write and post a letter</Link>
      </section>

      <footer className={styles.footer}>
        <div><span>I</span><strong>Intezaar</strong></div>
        <p>
          {footerLinks.map((link, index) => (
            <Link
              href={link.href}
              key={link.href}
              style={{
                color: "#d8bea6",
                textDecoration: "none",
                marginRight: index === footerLinks.length - 1 ? 0 : 18,
              }}
            >
              {link.label}
            </Link>
          ))}
        </p>
        <small>India · Public beta · 2026</small>
      </footer>
    </main>
  );
}
