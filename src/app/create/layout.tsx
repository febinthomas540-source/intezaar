import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Write a Private Travelling Letter",
  description:
    "Write first, personalise the letter with optional media, choose 12-hour Intezaar Express, next-day delivery or a 3, 5 or 7-day journey, then create a private recipient link.",
  alternates: { canonical: "/create" },
  openGraph: {
    url: "/create",
    title: "Write a private letter that takes the long way",
    description:
      "Create an editable letter, add up to three optional photos, voice notes or a short video, then choose when it arrives.",
  },
};

export default function CreateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
