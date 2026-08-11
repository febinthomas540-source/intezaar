import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { RecipientPostageStamp } from "@/components/recipient-postage-stamp";
import { RegisteredDeliveryGate } from "@/components/registered-delivery-gate";
import { SecureLetterDelivery } from "@/components/secure-letter-delivery";
import {
  decryptLetterPayload,
  e2eeTransportMedia,
  findLetterByAccessToken,
  letterUsesE2EE,
} from "@/lib/letter-security";
import {
  registeredCookieName,
  registeredDeliveryEnabled,
  registeredSessionIsValid,
} from "@/lib/registered-delivery";
import { createMediaDownloadUrls } from "@/lib/supabase-storage";
import "../../secure-recipient-media.css";
import "../../recipient-positioned-photo.css";

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

  const expiryTime = letter.expires_at ? new Date(letter.expires_at).getTime() : Number.NaN;
  const expiredByTime = Number.isFinite(expiryTime) && Date.now() >= expiryTime;
  const unavailable = letter.status === "cancelled" || letter.status === "expired" || expiredByTime;
  const effectiveStatus = expiredByTime && letter.status !== "cancelled" ? "expired" : letter.status;

  // An unavailable registered letter cannot be opened, so do not ask the
  // recipient to verify or trigger an unnecessary OTP flow first.
  if (!unavailable && registeredDeliveryEnabled(letter.metadata)) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(registeredCookieName(letter.id))?.value;
    if (!registeredSessionIsValid(token, letter.id, sessionCookie)) {
      return <RegisteredDeliveryGate recipient={letter.recipient_name} token={token} />;
    }
  }

  const hasArrived = Date.now() >= new Date(letter.opens_at).getTime();
  const isE2EE = letterUsesE2EE(letter);
  const payload = hasArrived && !unavailable && !isE2EE
    ? decryptLetterPayload(letter)
    : null;
  const e2eePayload = hasArrived && !unavailable && isE2EE
    ? {
        version: 3 as const,
        ciphertext: letter.payload_ciphertext,
        iv: letter.payload_iv,
        authTag: letter.payload_auth_tag,
      }
    : null;

  const mediaReady = letter.metadata?.media_ready === true;
  const manifest = hasArrived && !unavailable && mediaReady
    ? isE2EE
      ? e2eeTransportMedia(letter)
      : payload?.mediaKey
        ? payload.media || []
        : []
    : [];
  const signedUrls = manifest.length
    ? await createMediaDownloadUrls(manifest.map((item) => item.path))
    : new Map<string, string>();
  const media = manifest
    .map((item) => ({ ...item, signedUrl: signedUrls.get(item.path) || "" }))
    .filter((item) => Boolean(item.signedUrl));

  return (
    <>
      <SecureLetterDelivery
        recipient={letter.recipient_name}
        sender={letter.sender_name}
        occasion={letter.occasion}
        format={letter.letter_format}
        fromCity={letter.from_city || ""}
        toCity={letter.to_city || ""}
        opensAt={letter.opens_at}
        status={effectiveStatus}
        content={payload ? {
          heading: payload.heading,
          message: payload.message,
          closing: payload.closing,
        } : null}
        e2eePayload={e2eePayload}
        mediaKey={payload?.mediaKey || ""}
        media={media}
      />
      <RecipientPostageStamp />
    </>
  );
}
