import type { Metadata } from "next";
import { RecipientDemo } from "@/components/recipient-demo";

export const metadata: Metadata = {
  title: "Recipient experience",
  description: "Preview what someone sees when an Intezaar letter begins travelling to them.",
  robots: { index: false, follow: false },
};

type RecipientDemoPageProps = {
  searchParams: Promise<{ name?: string }>;
};

export default async function RecipientDemoPage({ searchParams }: RecipientDemoPageProps) {
  const params = await searchParams;
  const recipient = params.name?.trim().slice(0, 40) || "Ananya";

  return <RecipientDemo recipient={recipient} />;
}
