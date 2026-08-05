import type { Metadata } from "next";
import { RaahiPrototype } from "@/components/raahi-prototype";

export const metadata: Metadata = {
  title: "Raahi’s memory journey",
  description: "A messenger pigeon carrying one private memory at a time.",
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
