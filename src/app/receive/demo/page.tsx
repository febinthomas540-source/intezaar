import type { Metadata } from "next";
import { RaahiPrototype } from "@/components/raahi-prototype";

export const metadata: Metadata = {
  title: "Your Private Memory Journal",
  description: "A private notebook where one memory page opens at a time, the final letter opens last, and the completed journal becomes an A4 keepsake.",
  robots: { index: false, follow: false },
};

type RecipientPageProps = {
  searchParams: Promise<{ name?: string; day?: string }>;
};

export default async function RecipientPage({ searchParams }: RecipientPageProps) {
  const params = await searchParams;
  const recipient = params.name?.trim().slice(0, 40) || "Ananya";
  const parsedDay = Number(params.day);
  const previewDay = Number.isFinite(parsedDay) ? parsedDay : undefined;

  return <RaahiPrototype recipient={recipient} previewDay={previewDay} />;
}
