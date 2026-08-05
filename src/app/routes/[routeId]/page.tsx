import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { getCityProfile } from "@/lib/city-profiles";
import { routeCorridors } from "@/lib/routes";

type PageProps = { params: Promise<{ routeId: string }> };

export function generateStaticParams() {
  return routeCorridors.map((route) => ({ routeId: route.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { routeId } = await params;
  const route = routeCorridors.find((item) => item.id === routeId);
  if (!route) return {};

  const title = `${route.name}: ${route.origin} to ${route.destination}`;
  const description = `${route.strapline}. Explore an illustrated Raahi memory journey with ${route.duration.toLowerCase()} and a different emotional landing at every place.`;

  return {
    title,
    description,
    alternates: { canonical: `/routes/${route.id}` },
    openGraph: { title: `${title} | Intezaar`, description, url: `/routes/${route.id}`, type: "article" },
  };
}

export default async function RouteDetailPage({ params }: PageProps) {
  const { routeId } = await params;
  const route = routeCorridors.find((item) => item.id === routeId);
  if (!route) notFound();

  const relatedRoutes = routeCorridors
    .filter((candidate) => candidate.id !== route.id)
    .map((candidate) => ({ ...candidate, affinity: candidate.stops.filter((stop) => route.stops.includes(stop)).length }))
    .sort((a, b) => b.affinity - a.affinity)
    .slice(0, 3);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: route.name,
    description: route.strapline,
    creator: { "@type": "Organization", name: "Intezaar" },
    about: route.stops.map((stop) => ({ "@type": "Place", name: stop })),
    url: `https://intezaar.vercel.app/routes/${route.id}`,
  };

  return (
    <main className="raahi-path-detail">
      <Navigation />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="raahi-path-hero">
        <div className="raahi-path-hero-inner">
          <nav className="raahi-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Intezaar</Link><span>/</span>
            <Link href="/routes">Flight paths</Link><span>/</span>
            <span>{route.name}</span>
          </nav>
          <p className="raahi-kicker">{route.accent} · An illustrated Raahi flight path</p>
          <h1>{route.name}</h1>
          <p className="path-strapline">{route.strapline}</p>
          <div className="raahi-path-ticket">
            <span>{route.origin} → {route.destination}</span>
            <span>{route.duration}</span>
            <span>{route.transport}</span>
          </div>
        </div>
      </header>

      <section className="raahi-path-body">
        <div className="raahi-path-intro">
          <h2>The landscape changes around every memory.</h2>
          <p>
            This path gives Raahi a distinct world to cross. Each place contributes its own weather, sound and memory prompt, while the recipient sees only one landing become clear at a time.
          </p>
        </div>

        <div className="raahi-flight-timeline" aria-label={`${route.name} places`}>
          {route.stops.map((stop, index) => {
            const profile = getCityProfile(stop);
            return (
              <article className="raahi-flight-stop" key={stop}>
                <span className="stop-number">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2>{stop}</h2>
                  <p className="stop-scene">{profile.scene}</p>
                  <dl className="raahi-stop-details">
                    <div><dt>What Raahi sees</dt><dd>{profile.weather}</dd></div>
                    <div><dt>What is heard</dt><dd>{profile.sound}</dd></div>
                    <div><dt>Memory prompt</dt><dd>{profile.memoryPrompt}</dd></div>
                  </dl>
                </div>
              </article>
            );
          })}
        </div>

        <div className="raahi-path-cta">
          <div>
            <p className="raahi-kicker">{route.duration} · one protected final letter</p>
            <h2>Let Raahi carry a journey through this sky.</h2>
          </div>
          <Link href={`/create?path=${route.id}`}>Choose this flight path</Link>
        </div>

        <section className="raahi-related" aria-labelledby="related-flight-paths">
          <p className="raahi-kicker">Continue exploring</p>
          <h2 id="related-flight-paths">Other ways a memory can find home.</h2>
          <div className="raahi-related-grid">
            {relatedRoutes.map((related) => (
              <Link className="raahi-related-card" href={`/routes/${related.id}`} key={related.id}>
                <span>{related.accent} · {related.origin} to {related.destination}</span>
                <h3>{related.name}</h3>
                <p>{related.strapline}</p>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
