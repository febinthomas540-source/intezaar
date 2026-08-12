import Link from "next/link";
import { Navigation } from "@/components/navigation";
import styles from "./intent-guide.module.css";

type Section = { title: string; paragraphs: string[]; bullets?: string[] };
type RelatedLink = { href: string; label: string };

type IntentGuideProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Section[];
  ctaLabel: string;
  ctaHref?: string;
  relatedLinks?: RelatedLink[];
  showReflectionNote?: boolean;
};

export function IntentGuide({
  eyebrow,
  title,
  intro,
  sections,
  ctaLabel,
  ctaHref = "/create",
  relatedLinks = [],
  showReflectionNote = true,
}: IntentGuideProps) {
  return (
    <main className={styles.page}>
      <Navigation />
      <article>
        <header className={styles.hero}>
          <p>{eyebrow}</p>
          <h1>{title}</h1>
          <span>{intro}</span>
          <Link href={ctaHref}>{ctaLabel}</Link>
        </header>

        <div className={styles.body}>
          {sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets ? (
                <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
              ) : null}
            </section>
          ))}

          {relatedLinks.length ? (
            <nav className={styles.related} aria-label="Related letter writing guides">
              <strong>Keep reading</strong>
              <div>
                {relatedLinks.map((link) => <Link href={link.href} key={link.href}>{link.label} →</Link>)}
              </div>
            </nav>
          ) : null}

          {showReflectionNote ? (
            <aside>
              <strong>Keep it personal, not perfect.</strong>
              <p>Intezaar is a reflective writing and private-letter experience, not therapy, diagnosis, medical advice or a clinical mental-health service.</p>
            </aside>
          ) : null}

          <div className={styles.finalCta}>
            <p>Ready to turn one of these ideas into a letter?</p>
            <Link href={ctaHref}>{ctaLabel}</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
