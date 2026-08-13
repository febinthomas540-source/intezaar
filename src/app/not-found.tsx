import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "This Intezaar page could not be found.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        padding: "32px 18px",
        background: "#f3ead8",
        color: "#3e291f",
      }}
    >
      <section
        style={{
          width: "min(100%, 620px)",
          padding: "40px 28px",
          border: "1px solid rgba(92, 57, 38, .18)",
          borderRadius: 20,
          background: "#fffaf2",
          boxShadow: "0 18px 50px rgba(70, 42, 27, .10)",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: ".14em", color: "#8f281f" }}>
          INTEZAAR MAIL
        </p>
        <h1 style={{ margin: "12px 0 0", fontFamily: "Georgia, serif", fontSize: "clamp(34px, 8vw, 54px)", fontWeight: 500 }}>
          This page has gone missing.
        </h1>
        <p style={{ margin: "18px auto 0", maxWidth: 470, lineHeight: 1.65, color: "#6d5143" }}>
          The link may be incomplete, expired, or no longer available. If you were trying to open a private letter, use the complete link that was shared with you.
        </p>
        <nav
          aria-label="Page recovery"
          style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}
        >
          <Link href="/" style={{ padding: "13px 18px", borderRadius: 9, background: "#8f281f", color: "#fff8ef", textDecoration: "none", fontWeight: 700 }}>
            Go home
          </Link>
          <Link href="/create" style={{ padding: "13px 18px", borderRadius: 9, border: "1px solid #cdb9a0", color: "#4a3126", textDecoration: "none", fontWeight: 700 }}>
            Write a letter
          </Link>
          <Link href="/guides" style={{ padding: "13px 18px", borderRadius: 9, border: "1px solid #cdb9a0", color: "#4a3126", textDecoration: "none", fontWeight: 700 }}>
            Read the guides
          </Link>
        </nav>
      </section>
    </main>
  );
}
