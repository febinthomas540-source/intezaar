import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a nostalgic letter journey",
  description:
    "Write a private letter, choose its Indian postal route, schedule its arrival and turn shared memories into a journey worth waiting for.",
  alternates: {
    canonical: "/create",
  },
  openGraph: {
    url: "/create",
    title: "Create a nostalgic Indian letter journey",
    description:
      "Choose a route, seal your memories and schedule a private letter to travel before it arrives.",
  },
};

export default function CreateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
