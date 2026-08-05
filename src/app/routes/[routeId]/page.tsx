import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { routeCorridors } from "@/lib/routes";
import styles from "../routes.module.css";

type PageProps = { params: Promise<{ routeId: string }> };

export function generateStaticParams() {
  return routeCorridors.map((route) => ({ routeId: route.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { routeId } = await params;
  const route = routeCorridors.find((item) => item.id === routeId);
  if (!route) return {};

  const title = `${route.name}: ${route.origin} to ${route.destination}`;
  const description = `${route.strapline}. Explore this ${route.duration} nostalgic postal journey carried by ${route.transport.toLowerCase()}.`;

  return {
    title,
    description,
    alternates: { canonical: `/routes/${route.id}` },
    openGraph: {
      title: `${title} | Intezaar`,
      description,
      url: `/routes/${route.id}`,
      type: "article",
    },
  };
}

function memoryForStop(stop: string, index: number, total: number) {
  if (index === 0) return "The letter is weighed, stamped and placed into the first canvas mail bag.";
  if (index === total - 1) return "The final postmark lands softly. A familiar street is now only a few steps away.";
  const moments = [
    "A platform announcement fades beneath the sound of a tea seller and a departing train.",
    "The mail bag changes hands while the envelope gathers another circular postmark.",
    "Rain touches the carriage window; inside, the letter remains dry and carefully tied.",
    "Night passes outside the railway coach as another private memory becomes available.",
    "The route slows here, allowing one photograph, voice fragment or handwritten clue to appear.",
  ];
  return moments[(index - 1) % moments.length];
}

export default async function RouteDetailPage({ params }: PageProps) {
  const { routeId } = await params;
  const route = routeCorridors.find((item) => item.id === routeId);
  if (!route) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: route.name,
    description: route.strapline,
    provider: { "@type": "Organization", name: "Intezaar", url: "https://intezaar.vercel.app" },
    areaServed: route.stops.map((stop) => ({ "@type": "Place", name: stop })),
    url: `https://intezaar.vercel.app/routes/${route.id}`,
  };

  return (
    <main className={styles.storyPage}>
      <Navigation />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className={styles.storyHero}>
        <div className={styles.storyInner}>
          <p className={styles.eyebrow}>{route.accent} · Curated postal corridor</p>
          <h1>{route.name}</h1>
          <p className={styles.strapline}>{route.strapline}</p>
          <div className={styles.ticket}>
            <span>{route.origin} → {route.destination}</span>
            <span>{route.duration}</span>
            <span>{route.transport}</span>
          </div>
        </div>
      </header>

      <section className={styles.storyBody}>
        <div className={styles.intro}>
          <h2>A journey paced like an old letter, not a notification.</h2>
          <p>
            This corridor turns distance into a sequence of meaningful arrivals. Each stop can reveal
            one carefully chosen object—a photograph edge, a voice note, a remembered sentence or a
            private nickname—while the railway and postal world continues around it.
          </p>
        </div>

        <div className={styles.timeline} aria-label={`${route.name} stops`}>
          {route.stops.map((stop, index) => (
            <article className={styles.stop} key={stop}>
              <span className={styles.stopNumber}>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <div className={styles.stopName}>{stop}</div>
                <p>{memoryForStop(stop, index, route.stops.length)}</p>
              </div>
              <span className={styles.postmark}>{index === route.stops.length - 1 ? "Arrival postmark" : "Railway mail exchange"}</span>
            </article>
          ))}
        </div>

        <div className={styles.cta}>
          <h2>Send a letter along this route.</h2>
          <Link href={`/create?route=${route.id}`}>Choose this corridor</Link>
        </div>
        <Link className={styles.back} href="/routes">← Explore all routes</Link>
      </section>
    </main>
  );
}
