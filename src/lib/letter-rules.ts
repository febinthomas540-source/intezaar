export const MAX_LETTER_CHARS = 4000;
export const MAX_MEDIA_ITEMS = 3;
export const MAX_TOTAL_MEDIA_BYTES = 30 * 1024 * 1024;
export const MIN_DELIVERY_MS = 12 * 60 * 60 * 1000;
export const MAX_DELIVERY_MS = 30 * 24 * 60 * 60 * 1000;

export const MEDIA_LIMIT_BYTES = {
  photo: 5 * 1024 * 1024,
  voice: 10 * 1024 * 1024,
  video: 25 * 1024 * 1024,
} as const;

export type LetterMediaRuleKind = keyof typeof MEDIA_LIMIT_BYTES;

export function mediaLimitLabel(kind: LetterMediaRuleKind) {
  return `${Math.round(MEDIA_LIMIT_BYTES[kind] / (1024 * 1024))} MB`;
}
