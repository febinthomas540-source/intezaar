import type { Metadata } from "next";
import { RecipientStory } from "@/components/recipient-story";

export const metadata: Metadata = {
  title: "Recipient railway story",
  description: "A continuous railway journey carrying one memory at every station.",
  robots: { index: false, follow: false },
};

type RecipientStoryPageProps = {
  searchParams: Promise<{ name?: string }>;
};

export default async function RecipientStoryPage({ searchParams }: RecipientStoryPageProps) {
  const params = await searchParams;
  const recipient = params.name?.trim().slice(0, 40) || "Ananya";

  return <RecipientStory recipient={recipient} />;
}
