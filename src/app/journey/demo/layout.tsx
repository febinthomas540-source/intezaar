import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience the Delhi to Kerala letter journey",
  description:
    "Follow a nostalgic Indian letter from Delhi to Kerala through railway mail, city postmarks, monsoon memories and a final hand-delivered arrival.",
  alternates: {
    canonical: "/journey/demo",
  },
  openGraph: {
    url: "/journey/demo",
    title: "Delhi to Kerala — an Intezaar letter journey",
    description:
      "Experience railway mail, Indian cities, postmarks and memory fragments before the final letter arrives.",
  },
};

export default function JourneyDemoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
