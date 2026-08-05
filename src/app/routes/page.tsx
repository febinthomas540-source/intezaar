import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { routeCorridors } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Memory Journeys",
  description: "Explore quiet nostalgic settings for a private sequence of memories and a final sealed letter.",
  alternates: { canonical: "/routes" },
};

export default function RoutesPage() {
  return (
    <main className="nostalgia-paths">
      <Navigation />
      <section className="nostalgia-paths-hero">
        <div className="nostalgia-paths-hero-inner">
          <p className="nostalgia-eyebrow">Choose the atmosphere</p>
          <h1>A memory changes depending on the world around it.</h1>
          <p>
            These are not transport routes. They are emotional settings—old rooms, monsoon windows, rooftops, coastlines and distant cities through which the journey slowly unfolds.
          </p>
        </div>
      </section>

      <section className="nostalgia-path-list" aria-label="Available memory journeys">
        {routeCorridors.map((route) => (
          <Link className="nostalgia-path-row" href={`/routes/${route.id}`} key={route.id}>
            <div className="nostalgia-path-row-content">
              <small>{route.accent} · {route.origin} to {route.destination}</small>
              <h2>{route.name}</h2>
              <p>{route.strapline}</p>
              <div className="nostalgia-path-meta">
                <span>{route.duration}</span>
                <span>{route.tone}</span>
                <span>{route.transport}</span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
