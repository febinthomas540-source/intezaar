import Link from "next/link";

export function Navigation() {
  return (
    <header className="nostalgia-nav">
      <Link href="/" className="nostalgia-brand" aria-label="Intezaar home">
        <span>Intezaar</span>
      </Link>
      <nav className="nostalgia-nav-links" aria-label="Main navigation">
        <Link href="/#how-it-works">How it works</Link>
        <Link href="/celebrations">Celebration wishes</Link>
        <Link href="/journey/demo">Experience</Link>
        <Link href="/create" className="nostalgia-nav-cta">Create a journey</Link>
      </nav>
    </header>
  );
}
