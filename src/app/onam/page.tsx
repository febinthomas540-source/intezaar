import type { Metadata } from "next";
import { OnamCampaign } from "@/components/onam-campaign";
import { OnamMalayalamTemplates } from "@/components/onam-malayalam-templates";

export const metadata: Metadata = {
  title: "Onam 2026 Letter — Write Home",
  description: "Write a private end-to-end encrypted Onam letter now and let it open on Thiruvonam morning in Kerala, 26 August 2026 at 7:00 AM IST.",
  alternates: { canonical: "/onam" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "This Onam, write home. | Intezaar",
    description: "Seal a private letter today. It opens with Thiruvonam morning in Kerala, wherever you are.",
    url: "/onam",
  },
  twitter: {
    card: "summary_large_image",
    title: "This Onam, write home. | Intezaar",
    description: "Seal a private letter today. It opens with Thiruvonam morning in Kerala.",
  },
};

export default function OnamPage() {
  return (
    <>
      <OnamCampaign />
      <OnamMalayalamTemplates />
    </>
  );
}
