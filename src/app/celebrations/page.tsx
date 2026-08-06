import type { Metadata } from "next";
import { CelebrationStudio } from "@/components/celebration-studio";

export const metadata: Metadata = {
  title: "Personalised Celebration Wishes for India",
  description: "Create a thoughtful, personalised celebration wish from real memories, relationship details and your own voice.",
};

export default function CelebrationsPage() {
  return <CelebrationStudio />;
}
