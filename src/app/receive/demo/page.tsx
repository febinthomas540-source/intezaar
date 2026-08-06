import type { Metadata } from "next";
import { PostalLetterPrototype } from "@/components/postal-letter-prototype";

export const metadata: Metadata = {
  title: "Your Private Letter Is Travelling",
  description: "Follow a sealed private letter through a cinematic Indian mail journey and open it when it arrives.",
  robots: { index: false, follow: false },
};

type RecipientPageProps = {
  searchParams: Promise<{ name?: string; day?: string; duration?: string; from?: string; to?: string }>;
};

export default async function RecipientPage({ searchParams }: RecipientPageProps) {
  const params = await searchParams;
  const recipient = params.name?.trim().slice(0, 40) || "Ananya";
  const parsedDay = Number(params.day);
  const previewDay = Number.isFinite(parsedDay) ? parsedDay : undefined;
  const parsedDuration = Number(params.duration);
  const duration = parsedDuration === 3 || parsedDuration === 7 ? parsedDuration : 5;
  const fromCity = params.from?.trim().slice(0, 40) || "Delhi";
  const toCity = params.to?.trim().slice(0, 40) || "Kochi";

  return (
    <PostalLetterPrototype
      recipient={recipient}
      previewDay={previewDay}
      duration={duration}
      fromCity={fromCity}
      toCity={toCity}
    />
  );
}
