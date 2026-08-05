import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { RaahiBird } from "@/components/raahi-bird";
import { routeCorridors } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Raahi Flight Paths",
  description:
    "Explore illustrated memory journeys across Indian rooftops, monsoon skies, mountain mist, coastal wind and overseas homecoming routes.",
  alternates: { canonical: "/routes" },
  openGraph: {
    title: "Raahi Flight Paths | Intezaar",
    description: "Choose the sky and atmosphere through which Raahi will carry a private memory journey.",
    url: "/routes",
    type: "website",
  },
};

export default function RoutesPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Intezaar Raahi flight paths",
    itemListElement: routeCorridors.map((route, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: route.name,
      url: `https://intezaar.vercel.app/routes/${route.id}`,
    })),
  };

  return (
    <main className="raahi-paths-page">
      <Navigation />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <section className="raahi-paths-hero">
        <p className="raahi-kicker">The illustrated sky library</p>
        <h1>Every memory can take a different way home.</h1>
        <p>
          Choose a feeling rather than a transport timetable: monsoon roofs, mountain branches, coastal wind, evening balconies or the long flight across seas.
        </p>
      </section>

      <section className="raahi-path-grid" aria-label="Available Raahi flight paths">
        {routeCorridors.map((route) => (
          <Link className="raahi-path-card" href={`/routes/${route.id}`} key={route.id}>
            <RaahiBird className="path-bird" carrying={false} />
            <span className="path-stamp">{route.accent}</span>
            <h2>{route.name}</h2>
            <p>{route.strapline}</p>
            <div className="path-meta">
              <span>{route.duration}</span>
              <span>{route.tone}</span>
              <span>{route.transport}</span>
            </div>
            <div className="path-route">{route.origin} → {route.destination}</div>
          </Link>
        ))}
      </section>
    </main>
  );
}
