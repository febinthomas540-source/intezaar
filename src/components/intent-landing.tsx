import Link from "next/link";
import { Navigation } from "@/components/navigation";
import styles from "./intent-landing.module.css";

type Item = { title: string; copy: string };
type Related = { href: string; title: string; copy: string };

type IntentLandingProps = {
  eyebrow: string;
  title: string;
  intro: string;
  primaryLabel: string;
  examplesTitle: string;
  examples: string[];
  steps: Item[];
  reflectionTitle: string;
  reflectionCopy: string;
  related: Related[];
};

export function IntentLanding({
  eyebrow,
  title,
  intro,
  primaryLabel,
  examplesTitle,
  examples,
  steps,
  reflectionTitle,
  reflectionCopy,
  related,
}: IntentLandingProps) {
  return (
    <main className={styles.page}>
      <Navigation />

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>{title}</h1>
          <p className={styles.intro}>{intro}</p>
          <div className={styles.actions}>
            <Link href="/create" className={styles.primary}>{primaryLabel}</Link>
            <Link href="/#how-it-works" className={styles.secondary}>How Intezaar works</Link>
          </div>
          <p className={styles.trust}>Private by design · No account required · Nothing is posted until you choose to seal and post it</p>
        </div>

        <div className={styles.envelopeScene} aria-hidden="true">
          <div className={styles.paper}>
            <small>INTEZAAR · PRIVATE LETTER</small>
            <span>Words for later.</span>
          </div>
          <div className={styles.envelope}>
            <i>I</i>
            <strong>SEALED</strong>
          </div>
        </div>
      </section>

      <section className={styles.examples}>
        <p className={styles.eyebrow}>A place to begin</p>
        <h2>{examplesTitle}</h2>
        <div className={styles.promptGrid}>
          {examples.map((example) => <div key={example}>{example}</div>)}
        </div>
      </section>

      <section className={styles.steps}>
        <header>
          <p className={styles.eyebrow}>Keep it simple</p>
          <h2>One letter. A little distance. Your choice.</h2>
        </header>
        <div className={styles.stepGrid}>
          {steps.map((step, index) => (
            <article key={step.title}>
              <span>0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.note}>
        <div className={styles.seal}>I</div>
        <div>
          <p className={styles.eyebrow}>A reflective writing space</p>
          <h2>{reflectionTitle}</h2>
          <p>{reflectionCopy}</p>
          <p className={styles.disclaimer}>Intezaar is a private letter and reflective-writing experience. It is not therapy, diagnosis, medical advice or a clinical mental-health service.</p>
        </div>
      </section>

      <section className={styles.related}>
        <p className={styles.eyebrow}>More letters for later</p>
        <h2>Choose the reason that feels closest.</h2>
        <div>
          {related.map((item) => (
            <Link href={item.href} key={item.href}>
              <strong>{item.title}</strong>
              <span>{item.copy}</span>
              <em aria-hidden="true">→</em>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <p className={styles.eyebrow}>When the words are ready</p>
        <h2>Write them now. Let the moment come later.</h2>
        <Link href="/create" className={styles.primary}>{primaryLabel}</Link>
      </section>
    </main>
  );
}
