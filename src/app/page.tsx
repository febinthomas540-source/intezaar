import type { Metadata } from "next";
import { PostboxHome } from "@/components/postbox-home";

export const metadata: Metadata = {
  title: "Intezaar — End-to-end encrypted letters for later",
  description: "Write an end-to-end encrypted digital letter, choose when it can be opened, or leave a private letter for your future self with Intezaar.",
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: "Intezaar — Write it now. Let it arrive later.",
    description: "Private digital letters with end-to-end encrypted content and a chosen opening time — for someone else or your future self.",
  },
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": ["SoftwareApplication", "WebApplication"],
  name: "Intezaar",
  url: "https://www.intezaar.in",
  applicationCategory: "CommunicationApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript and a modern web browser.",
  description: "A web application for writing private end-to-end encrypted digital letters with a chosen opening time.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "GBP",
    description: "Free during the current public beta.",
  },
  featureList: [
    "End-to-end encrypted letter content and private media",
    "Chosen opening date and time",
    "Private recipient link",
    "Optional photos, voice notes and video",
    "No account required to start writing",
  ],
};

export default function Home() {
  return (
    <>
      <PostboxHome />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
    </>
  );
}
