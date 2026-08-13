"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.5 10.7 12 3.8l8.5 6.9v9a1 1 0 0 1-1 1h-5.2v-6.2H9.7v6.2H4.5a1 1 0 0 1-1-1z" />
    </svg>
  );
}

function LetterIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.5 6.2h17v11.6h-17z" />
      <path d="m4.2 7 7.8 6 7.8-6" />
    </svg>
  );
}

function GuideIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.7 9.6a2.5 2.5 0 0 1 4.8.9c0 2-2.5 2.2-2.5 4" />
      <path d="M12 17.5h.01" />
    </svg>
  );
}

export function InstalledAppShell() {
  const pathname = usePathname();
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    const iosStandalone = "standalone" in window.navigator && Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
    const displayStandalone = window.matchMedia("(display-mode: standalone)").matches;
    const isStandalone = iosStandalone || displayStandalone;

    setStandalone(isStandalone);
    if (isStandalone) document.documentElement.dataset.intezaarApp = "installed";

    return () => {
      delete document.documentElement.dataset.intezaarApp;
    };
  }, []);

  if (!standalone || pathname.startsWith("/receive/")) return null;

  const onHome = pathname === "/";
  const onCreate = pathname === "/create";

  return (
    <>
      <header className="installed-app-topbar">
        <Link href="/" className="installed-app-brand" aria-label="Intezaar home">
          <span className="installed-app-seal">I</span>
          <span>
            <strong>{onCreate ? "Write a letter" : "Intezaar"}</strong>
            <small>Private digital letters</small>
          </span>
        </Link>
      </header>

      {!onCreate ? (
        <nav className="installed-app-tabbar" aria-label="App navigation">
          <Link href="/" className={onHome ? "active" : ""} aria-current={onHome ? "page" : undefined}>
            <HomeIcon />
            <span>Home</span>
          </Link>
          <Link href="/create" className="installed-app-compose">
            <span className="compose-icon"><LetterIcon /></span>
            <span>Write</span>
          </Link>
          <Link href="/#how-it-works">
            <GuideIcon />
            <span>How it works</span>
          </Link>
        </nav>
      ) : null}
    </>
  );
}
