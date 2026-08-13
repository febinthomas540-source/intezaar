"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Intezaar route error:", error);
  }, [error]);

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
        role="alert"
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
        <h1 style={{ margin: "12px 0 0", fontFamily: "Georgia, serif", fontSize: "clamp(32px, 8vw, 50px)", fontWeight: 500 }}>
          Something interrupted this page.
        </h1>
        <p style={{ margin: "18px auto 0", maxWidth: 470, lineHeight: 1.65, color: "#6d5143" }}>
          Your browser may have hit a temporary problem. Try the page again. If you were writing a letter, Intezaar will use any draft that your browser was able to save.
        </p>
        <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          <button
            type="button"
            onClick={reset}
            style={{ padding: "13px 18px", border: 0, borderRadius: 9, background: "#8f281f", color: "#fff8ef", font: "inherit", fontWeight: 700, cursor: "pointer" }}
          >
            Try again
          </button>
          <Link href="/" style={{ padding: "13px 18px", borderRadius: 9, border: "1px solid #cdb9a0", color: "#4a3126", textDecoration: "none", fontWeight: 700 }}>
            Go home
          </Link>
        </div>
      </section>
    </main>
  );
}
