import type { Metadata } from "next";
import { CelebrationStudio } from "@/components/celebration-studio";

export const metadata: Metadata = {
  title: "Personalised Celebration Letters for India",
  description: "Create a thoughtful celebration letter from real details, edit every word, and send it through an Intezaar postal journey.",
};

export default function CelebrationsPage() {
  return <CelebrationStudio />;
}
