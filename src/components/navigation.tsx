import Link from "next/link";

export function Navigation() {
  return (
    <header className="site-nav">
      <Link href="/" className="brand-mark" aria-label="Intezaar home">
        <span className="brand-seal">I</span>
        <span>Intezaar</span>
      </Link>
      <nav className="nav-links" aria-label="Main navigation">
        <Link href="/#experience">The experience</Link>
        <Link href="/journey/demo">Journey demo</Link>
        <Link href="/create" className="nav-cta">Write a letter</Link>
      </nav>
    </header>
  );
}
