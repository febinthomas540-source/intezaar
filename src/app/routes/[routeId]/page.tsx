import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { getCityProfile } from "@/lib/city-profiles";
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
  const description = `${route.strapline}. Explore this ${route.duration} nostalgic postal journey carried by ${route.transport.toLowerCase()}, with distinctive station scenes and memory chapters at every stop.`;

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
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${route.name} journey chapters`,
      itemListElement: route.stops.map((stop, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: `${stop} memory chapter`,
          description: getCityProfile(stop).postalMoment,
        },
      })),
    },
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
          <h2>Every city should change the feeling of the letter.</h2>
          <p>
            This corridor is no longer a repeated list of station updates. Each stop has its own
            weather, sound, postal ritual and memory prompt, so the recipient feels the landscape
            changing while the final letter remains protected and unopened.
          </p>
        </div>

        <div className={styles.timeline} aria-label={`${route.name} stops`}>
          {route.stops.map((stop, index) => {
            const profile = getCityProfile(stop);
            const isArrival = index === route.stops.length - 1;

            return (
              <article className={styles.stop} key={stop}>
                <span className={styles.stopNumber}>{String(index + 1).padStart(2, "0")}</span>
                <div className={styles.stopStory}>
                  <div className={styles.stopHeading}>
                    <div className={styles.stopName}>{stop}</div>
                    <span className={styles.weather}>{profile.weather}</span>
                  </div>
                  <p className={styles.scene}>{profile.scene}</p>
                  <dl className={styles.chapterDetails}>
                    <div>
                      <dt>What is heard</dt>
                      <dd>{profile.sound}</dd>
                    </div>
                    <div>
                      <dt>Postal moment</dt>
                      <dd>{profile.postalMoment}</dd>
                    </div>
                    <div>
                      <dt>Memory revealed</dt>
                      <dd>{profile.memoryPrompt}</dd>
                    </div>
                  </dl>
                </div>
                <span className={styles.postmark}>{isArrival ? "Arrival postmark" : "Railway mail exchange"}</span>
              </article>
            );
          })}
        </div>

        <div className={styles.cta}>
          <div>
            <p className={styles.ctaEyebrow}>{route.stops.length} distinct chapters · one sealed letter</p>
            <h2>Send a letter along this route.</h2>
          </div>
          <Link href={`/create?route=${route.id}`}>Choose this corridor</Link>
        </div>
        <Link className={styles.back} href="/routes">← Explore all routes</Link>
      </section>
    </main>
  );
}
