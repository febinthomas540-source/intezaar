import { createClient } from "@supabase/supabase-js";
import {
  decryptLetterPayload,
  insertLetterEvent,
  type StoredLetter,
} from "@/lib/letter-security";

const MEDIA_BUCKET = "letter-media";
const CLEANUP_BATCH_SIZE = 100;

type CleanupLetter = StoredLetter & {
  expires_at: string;
};

export type CleanupResult = {
  examined: number;
  expired: number;
  deletedObjects: number;
  failed: number;
};

function requiredEnvironment(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function secretHeaders(extra?: HeadersInit) {
  const secret = requiredEnvironment("SUPABASE_SECRET_KEY");
  return {
    apikey: secret,
    Authorization: `Bearer ${secret}`,
    "Content-Type": "application/json",
    ...extra,
  } satisfies HeadersInit;
}

function restUrl(path: string) {
  return `${requiredEnvironment("NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "")}/rest/v1/${path}`;
}

function storageClient() {
  return createClient(
    requiredEnvironment("NEXT_PUBLIC_SUPABASE_URL"),
    requiredEnvironment("SUPABASE_SECRET_KEY"),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}

async function responseError(response: Response) {
  return (await response.text()) || `${response.status} ${response.statusText}`;
}

async function findExpiredLetters(): Promise<CleanupLetter[]> {
  const query = new URLSearchParams({
    expires_at: `lte.${new Date().toISOString()}`,
    status: "neq.expired",
    select: "id,sender_name,recipient_name,occasion,letter_format,from_city,to_city,opens_at,expires_at,status,payload_ciphertext,payload_iv,payload_auth_tag,metadata",
    order: "expires_at.asc",
    limit: String(CLEANUP_BATCH_SIZE),
  });

  const response = await fetch(restUrl(`letters?${query.toString()}`), {
    headers: secretHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not find expired letters: ${await responseError(response)}`);
  }

  return response.json() as Promise<CleanupLetter[]>;
}

async function removeEncryptedObjects(paths: string[]) {
  if (!paths.length) return;
  const { error } = await storageClient().storage.from(MEDIA_BUCKET).remove(paths);
  if (error) throw new Error(`Could not delete expired media: ${error.message}`);
}

async function markExpired(letter: CleanupLetter, deletedObjects: number) {
  const cleanedAt = new Date().toISOString();
  const metadata = {
    ...(letter.metadata || {}),
    media_ready: false,
    media_transferred: false,
    media_cleanup_completed: true,
    media_deleted_count: deletedObjects,
    media_deleted_at: cleanedAt,
  };
  const query = new URLSearchParams({ id: `eq.${letter.id}` });
  const response = await fetch(restUrl(`letters?${query.toString()}`), {
    method: "PATCH",
    headers: secretHeaders({ Prefer: "return=minimal" }),
    body: JSON.stringify({
      status: "expired",
      metadata,
      updated_at: cleanedAt,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not mark letter expired: ${await responseError(response)}`);
  }

  await insertLetterEvent(letter.id, "expired_cleanup", {
    deleted_objects: deletedObjects,
    cleaned_at: cleanedAt,
  });
}

export async function cleanupExpiredLetterMedia(): Promise<CleanupResult> {
  const letters = await findExpiredLetters();
  const result: CleanupResult = {
    examined: letters.length,
    expired: 0,
    deletedObjects: 0,
    failed: 0,
  };

  for (const letter of letters) {
    try {
      const payload = decryptLetterPayload(letter);
      const paths = [...new Set((payload.media || []).map((item) => item.path).filter(Boolean))];
      await removeEncryptedObjects(paths);
      await markExpired(letter, paths.length);
      result.expired += 1;
      result.deletedObjects += paths.length;
    } catch (error) {
      result.failed += 1;
      console.error(`Expired media cleanup failed for letter ${letter.id}:`, error);
      await insertLetterEvent(letter.id, "expired_cleanup_failed", {
        failed_at: new Date().toISOString(),
        reason: error instanceof Error ? error.message.slice(0, 500) : "Unknown cleanup error",
      });
    }
  }

  return result;
}
