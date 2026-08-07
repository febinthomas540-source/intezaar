import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SecureLetterDelivery } from "@/components/secure-letter-delivery";
import {
  decryptLetterPayload,
  findLetterByAccessToken,
} from "@/lib/letter-security";
import { createMediaDownloadUrls } from "@/lib/supabase-storage";
import "../../secure-recipient-media.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "A Private Letter Has Been Posted for You",
  description: "Receive a sealed private Intezaar letter and open it at the chosen time.",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ token: string }>;
};

export default async function SecureRecipientPage({ params }: PageProps) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{40,60}$/.test(token)) notFound();

  const letter = await findLetterByAccessToken(token);
  if (!letter) notFound();

  const unavailable = letter.status === "cancelled" || letter.status === "expired";
  const hasArrived = Date.now() >= new Date(letter.opens_at).getTime();
  const payload = hasArrived && !unavailable
    ? decryptLetterPayload(letter)
    : null;

  const mediaReady = letter.metadata?.media_ready === true;
  const manifest = payload?.mediaKey && mediaReady ? payload.media || [] : [];
  const signedUrls = manifest.length
    ? await createMediaDownloadUrls(manifest.map((item) => item.path))
    : new Map<string, string>();
  const media = manifest
    .map((item) => ({ ...item, signedUrl: signedUrls.get(item.path) || "" }))
    .filter((item) => Boolean(item.signedUrl));

  return (
    <SecureLetterDelivery
      recipient={letter.recipient_name}
      sender={letter.sender_name}
      occasion={letter.occasion}
      format={letter.letter_format}
      fromCity={letter.from_city || ""}
      toCity={letter.to_city || ""}
      opensAt={letter.opens_at}
      status={letter.status}
      content={payload ? {
        heading: payload.heading,
        message: payload.message,
        closing: payload.closing,
      } : null}
      mediaKey={payload?.mediaKey || ""}
      media={media}
    />
  );
}
