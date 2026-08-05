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

  return {
    title: route.name,
    description: `${route.strapline}. A slow nostalgic setting for photographs, voices, keepsakes and a final sealed letter.`,
    alternates: { canonical: `/routes/${route.id}` },
  };
}

export default async function RouteDetailPage({ params }: PageProps) {
  const { routeId } = await params;
  const route = routeCorridors.find((item) => item.id === routeId);
  if (!route) notFound();

  const routeIndex = routeCorridors.findIndex((item) => item.id === route.id);
  const relatedRoutes = routeCorridors.filter((candidate) => candidate.id !== route.id).slice(0, 3);

  return (
    <main className="nostalgia-path-detail">
      <Navigation />

      <header className={`nostalgia-route-hero path-photo-${routeIndex % 4}`}>
        <div className="nostalgia-route-hero-inner">
          <p className="nostalgia-eyebrow">{route.accent} · A memory atmosphere</p>
          <h1>{route.name}</h1>
          <p>{route.strapline}</p>
          <div className="nostalgia-route-ticket">
            <span>{route.origin} → {route.destination}</span>
            <span>{route.duration}</span>
            <span>{route.transport}</span>
          </div>
        </div>
      </header>

      <section className="nostalgia-route-body">
        <div className="nostalgia-route-intro">
          <h2>The landscape should deepen the feeling, not distract from it.</h2>
          <p>
            Each place in this journey contributes a different light, texture, sound and memory prompt. The visual world changes slowly while the recipient keeps everything that has already opened.
          </p>
        </div>

        <div>
          {route.stops.map((stop, index) => {
            const profile = getCityProfile(stop);
            return (
              <article className="nostalgia-route-stop" key={stop}>
                <span className="nostalgia-route-stop-number">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{stop}</h3>
                  <p>{profile.scene}</p>
                  <dl className="nostalgia-route-details">
                    <div><dt>Light and weather</dt><dd>{profile.weather}</dd></div>
                    <div><dt>What remains in the air</dt><dd>{profile.sound}</dd></div>
                    <div><dt>Memory prompt</dt><dd>{profile.memoryPrompt}</dd></div>
                  </dl>
                </div>
              </article>
            );
          })}
        </div>

        <div className="nostalgia-route-cta">
          <div>
            <p className="nostalgia-eyebrow">{route.duration} · one final sealed letter</p>
            <h2>Use this atmosphere for your own journey.</h2>
          </div>
          <Link href={`/create?path=${route.id}`} className="nostalgia-button nostalgia-button-primary">Choose this journey</Link>
        </div>

        <section className="nostalgia-related">
          <p className="nostalgia-eyebrow">Other settings</p>
          <h2>Another memory may need a different kind of silence.</h2>
          <div className="nostalgia-related-grid">
            {relatedRoutes.map((related) => (
              <Link className="nostalgia-related-card" href={`/routes/${related.id}`} key={related.id}>
                <small>{related.origin} to {related.destination}</small>
                <strong>{related.name}</strong>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
