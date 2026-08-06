import type { ReactNode } from "react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import styles from "./policy-shell.module.css";

type PolicyShellProps = {
  eyebrow: string;
  title: string;
  intro: string;
  lastUpdated?: string;
  children: ReactNode;
};

const policyLinks = [
  { href: "/faq", label: "FAQ" },
  { href: "/community-guidelines", label: "Community Guidelines" },
  { href: "/terms", label: "Terms of Use" },
];

export function PolicyShell({
  eyebrow,
  title,
  intro,
  lastUpdated = "6 August 2026",
  children,
}: PolicyShellProps) {
  return (
    <main className={styles.page}>
      <Navigation />

      <header className={styles.hero}>
        <div className={styles.heroMark} aria-hidden="true">
          <span>I</span>
          <i />
        </div>
        <div>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>{title}</h1>
          <p className={styles.intro}>{intro}</p>
          <small>Last updated {lastUpdated}</small>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sideNav} aria-label="Help and policy pages">
          <strong>Intezaar help</strong>
          {policyLinks.map((link) => (
            <Link href={link.href} key={link.href}>{link.label}</Link>
          ))}
          <Link href="/create" className={styles.postLink}>Write a letter</Link>
        </aside>

        <article className={styles.content}>{children}</article>
      </div>

      <footer className={styles.footer}>
        <div><span>I</span><strong>Intezaar</strong></div>
        <nav aria-label="Footer policies">
          {policyLinks.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
        </nav>
        <p>A private digital letter you write, seal, post and open later.</p>
      </footer>
    </main>
  );
}
