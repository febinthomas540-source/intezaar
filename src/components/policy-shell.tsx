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
  { href: "/about", label: "About Intezaar" },
  { href: "/how-encryption-works", label: "How encryption works" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/community-guidelines", label: "Community Guidelines" },
  { href: "/terms", label: "User Agreement" },
  { href: "mailto:support@intezaar.in", label: "Support" },
  { href: "mailto:safety@intezaar.in", label: "Safety" },
];

export function PolicyShell({
  eyebrow,
  title,
  intro,
  lastUpdated = "11 August 2026",
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
        <aside className={styles.sideNav} aria-label="Help and trust pages">
          <strong>About & trust</strong>
          {policyLinks.map((link) => (
            <Link href={link.href} key={link.href}>{link.label}</Link>
          ))}
          <Link href="/create" className={styles.postLink}>Write a letter</Link>
        </aside>

        <article className={styles.content}>{children}</article>
      </div>

      <footer className={styles.footer}>
        <div><span>I</span><strong>Intezaar</strong></div>
        <nav aria-label="Footer trust and policy links">
          {policyLinks.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
        </nav>
        <p>A private digital letter you write, seal, post and open later.</p>
      </footer>
    </main>
  );
}
