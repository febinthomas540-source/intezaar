import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { routeCorridors } from "@/lib/routes";
import styles from "./routes.module.css";

export const metadata: Metadata = {
  title: "Indian Postal & Railway Letter Routes",
  description:
    "Explore nostalgic Indian postal and railway letter journeys across the Grand Trunk route, Konkan coast, Coromandel coast, Himalayas, Kerala and overseas.",
  alternates: { canonical: "/routes" },
  openGraph: {
    title: "Indian Postal & Railway Letter Routes | Intezaar",
    description:
      "Choose a cinematic letter journey through Indian stations, post offices, monsoon roads and homecoming routes.",
    url: "/routes",
    type: "website",
  },
};

export default function RoutesPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Intezaar postal and railway routes",
    itemListElement: routeCorridors.map((route, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: route.name,
      url: `https://intezaar.vercel.app/routes/${route.id}`,
    })),
  };

  return (
    <main className={styles.page}>
      <Navigation />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <section className={styles.hero}>
        <p className={styles.eyebrow}>The Intezaar route library</p>
        <h1>Every letter deserves its own road home.</h1>
        <p>
          Explore curated Indian postal corridors shaped by railway platforms, coastal rain,
          mountain mist, night mail and the small details that make distance feel personal.
        </p>
      </section>
      <section className={styles.grid} aria-label="Available postal routes">
        {routeCorridors.map((route) => (
          <Link className={styles.card} href={`/routes/${route.id}`} key={route.id}>
            <div>
              <span className={styles.stamp}>{route.accent}</span>
              <h2>{route.name}</h2>
              <p>{route.strapline}</p>
              <div className={styles.meta}>
                <span>{route.duration}</span>
                <span>{route.tone}</span>
              </div>
            </div>
            <div className={styles.route}>{route.origin} → {route.destination}</div>
          </Link>
        ))}
      </section>
    </main>
  );
}
