import type { Metadata } from "next";
import { RecipientMagazine } from "@/components/recipient-magazine-v2";

export const metadata: Metadata = {
  title: "Recipient memory journey",
  description: "An illustrated railway journey that reveals one memory at each station.",
  robots: { index: false, follow: false },
};

type RecipientPageProps = {
  searchParams: Promise<{ name?: string; day?: string }>;
};

export default async function RecipientPage({ searchParams }: RecipientPageProps) {
  const params = await searchParams;
  const recipient = params.name?.trim().slice(0, 40) || "Ananya";
  const parsedDay = Number(params.day);
  const initialPreviewDay = Number.isFinite(parsedDay) ? parsedDay : undefined;

  return <RecipientMagazine recipient={recipient} initialPreviewDay={initialPreviewDay} />;
}
