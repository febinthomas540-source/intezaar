import Link from "next/link";
import { RaahiMark } from "./raahi-bird";

export function Navigation() {
  return (
    <header className="raahi-nav">
      <Link href="/" className="raahi-brand" aria-label="Intezaar home">
        <RaahiMark className="raahi-brand-mark" />
        <span>Intezaar</span>
      </Link>
      <nav className="raahi-nav-links" aria-label="Main navigation">
        <Link href="/routes">Flight paths</Link>
        <Link href="/journey/demo">See Raahi fly</Link>
        <Link href="/create" className="raahi-nav-cta">Create a journey</Link>
      </nav>
    </header>
  );
}
