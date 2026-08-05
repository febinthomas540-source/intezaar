import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { getCityProfile } from "@/lib/city-profiles";
import { routeCorridors } from "@/lib/routes";
import enhancements from "../route-enhancements.module.css";
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

  const relatedRoutes = routeCorridors
    .filter((candidate) => candidate.id !== route.id)
    .map((candidate) => ({
      ...candidate,
      affinity: candidate.stops.filter((stop) => route.stops.includes(stop)).length,
    }))
    .sort((a, b) => b.affinity - a.affinity)
    .slice(0, 3);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: route.name,
      description: route.strapline,
      provider: { "@type": "Organization", name: "Intezaar", url: "https://intezaar.vercel.app" },
      areaServed: route.stops.map((stop) => ({ "@type": "Place", name: stop })),
      itinerary: {
        "@type": "ItemList",
        name: `${route.name} postal journey`,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: route.stops.map((stop, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: stop,
          description: getCityProfile(stop).postalMoment,
        })),
      },
      url: `https://intezaar.vercel.app/routes/${route.id}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://intezaar.vercel.app" },
        { "@type": "ListItem", position: 2, name: "Postal routes", item: "https://intezaar.vercel.app/routes" },
        { "@type": "ListItem", position: 3, name: route.name, item: `https://intezaar.vercel.app/routes/${route.id}` },
      ],
    },
  ];

  return (
    <main className={styles.storyPage}>
      <Navigation />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className={styles.storyHero}>
        <div className={styles.storyInner}>
          <nav className={enhancements.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/">Intezaar</Link><span aria-hidden="true">/</span>
            <Link href="/routes">Postal routes</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{route.name}</span>
          </nav>
          <p className={styles.eyebrow}>{route.accent} · Curated postal corridor</p>
          <h1>{route.name}</h1>
          <p className={styles.strapline}>{route.strapline}</p>
          <div className={styles.ticket}>
            <span>{route.origin} → {route.destination}</span>
            <span>{route.duration}</span>
            <span>{route.transport}</span>
          </div>
          <div className={enhancements.routeRail} aria-label={`${route.origin} to ${route.destination} route overview`}>
            {route.stops.map((stop, index) => (
              <div className={enhancements.railStop} key={stop}>
                <span className={enhancements.railDot} aria-hidden="true" />
                <small>{stop}</small>
                {index < route.stops.length - 1 ? <span className={enhancements.railLine} aria-hidden="true" /> : null}
              </div>
            ))}
          </div>
        </div>
      </header>

      <section className={styles.storyBody}>
        <div className={styles.intro}>
          <h2>Every city should change the feeling of the letter.</h2>
          <p>This corridor is no longer a repeated list of station updates. Each stop has its own weather, sound, postal ritual and memory prompt, so the recipient feels the landscape changing while the final letter remains protected and unopened.</p>
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
                    <h2 className={styles.stopName}>{stop}</h2>
                    <span className={styles.weather}>{profile.weather}</span>
                  </div>
                  <p className={styles.scene}>{profile.scene}</p>
                  <dl className={styles.chapterDetails}>
                    <div><dt>What is heard</dt><dd>{profile.sound}</dd></div>
                    <div><dt>Postal moment</dt><dd>{profile.postalMoment}</dd></div>
                    <div><dt>Memory revealed</dt><dd>{profile.memoryPrompt}</dd></div>
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

        <section className={enhancements.related} aria-labelledby="related-routes-heading">
          <div className={enhancements.relatedHeading}>
            <div>
              <p className={styles.eyebrow}>Continue exploring</p>
              <h2 id="related-routes-heading">Other ways a memory can travel.</h2>
            </div>
            <Link href="/routes">View every postal route →</Link>
          </div>
          <div className={enhancements.relatedGrid}>
            {relatedRoutes.map((related) => (
              <Link className={enhancements.relatedCard} href={`/routes/${related.id}`} key={related.id}>
                <span className={enhancements.relatedStamp}>{related.accent}</span>
                <div>
                  <small>{related.origin} → {related.destination}</small>
                  <h3>{related.name}</h3>
                  <p>{related.strapline}</p>
                </div>
                <span className={enhancements.relatedMeta}>{related.duration}</span>
              </Link>
            ))}
          </div>
        </section>

        <Link className={styles.back} href="/routes">← Explore all routes</Link>
      </section>
    </main>
  );
}
