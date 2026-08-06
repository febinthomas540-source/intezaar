import type { Metadata } from "next";
import { RecipientLetterClient } from "@/components/recipient-letter-client";
import type { RecipientLetterFormat } from "@/components/postal-letter-prototype";

export const metadata: Metadata = {
  title: "Your Private Letter Is Travelling",
  description: "Receive a sealed private letter, follow its cinematic Indian mail journey and open it when it arrives.",
  robots: { index: false, follow: false },
};

type RecipientPageProps = {
  searchParams: Promise<{
    name?: string;
    sender?: string;
    occasion?: string;
    format?: string;
    time?: string;
    day?: string;
    duration?: string;
    from?: string;
    to?: string;
  }>;
};

const formats = new Set<RecipientLetterFormat>([
  "classic",
  "postcard",
  "folded",
  "airmail",
  "inland",
  "telegram",
  "photo",
  "festival",
  "typewriter",
  "minimal",
]);

function safeText(value: string | undefined, fallback: string, maxLength = 40) {
  return value?.trim().slice(0, maxLength) || fallback;
}

export default async function RecipientPage({ searchParams }: RecipientPageProps) {
  const params = await searchParams;
  const recipient = safeText(params.name, "Ananya");
  const sender = safeText(params.sender, "Someone special");
  const occasion = safeText(params.occasion, "Just because", 60);
  const parsedDay = Number(params.day);
  const previewDay = Number.isFinite(parsedDay) ? parsedDay : undefined;
  const parsedDuration = Number(params.duration);
  const duration = parsedDuration === 3 || parsedDuration === 7 ? parsedDuration : 5;
  const fromCity = safeText(params.from, "Delhi");
  const toCity = safeText(params.to, "Kochi");
  const format = formats.has(params.format as RecipientLetterFormat)
    ? params.format as RecipientLetterFormat
    : "classic";
  const openingTime = /^([01]\d|2[0-3]):[0-5]\d$/.test(params.time || "") ? params.time! : "20:00";

  return (
    <RecipientLetterClient
      recipient={recipient}
      sender={sender}
      occasion={occasion}
      format={format}
      openingTime={openingTime}
      previewDay={previewDay}
      duration={duration}
      fromCity={fromCity}
      toCity={toCity}
    />
  );
}
