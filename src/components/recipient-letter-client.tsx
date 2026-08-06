"use client";

import { useEffect, useState } from "react";
import {
  PostalLetterPrototype,
  type RecipientLetterFormat,
} from "@/components/postal-letter-prototype";

type Props = {
  recipient: string;
  sender: string;
  occasion: string;
  format: RecipientLetterFormat;
  openingTime: string;
  previewDay?: number;
  duration: number;
  fromCity: string;
  toCity: string;
};

type LetterPayload = {
  version?: number;
  heading?: string;
  message?: string;
  closing?: string;
};

function decodePayload(value: string): LetterPayload | null {
  try {
    const normalised = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalised.padEnd(Math.ceil(normalised.length / 4) * 4, "=");
    const binary = window.atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as LetterPayload;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function RecipientLetterClient(props: Props) {
  const [payload, setPayload] = useState<LetterPayload | null>(null);

  useEffect(() => {
    const match = window.location.hash.match(/^#letter=([^&]+)/);
    if (!match) return;
    const decoded = decodePayload(match[1]);
    if (decoded?.version === 1 && typeof decoded.message === "string" && decoded.message.trim()) {
      setPayload(decoded);
    }
  }, []);

  const heading = payload?.heading?.trim() || `Dear ${props.recipient},`;
  const message = payload?.message?.trim();
  const closing = payload?.closing?.trim() || `With love,\n${props.sender}`;

  return (
    <PostalLetterPrototype
      {...props}
      heading={heading}
      message={message}
      closing={closing}
    />
  );
}
