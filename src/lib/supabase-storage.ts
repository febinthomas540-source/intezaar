import { createClient } from "@supabase/supabase-js";

const MEDIA_BUCKET = "letter-media";

function requiredEnvironment(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function serverStorageClient() {
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

export type MediaUploadTarget = {
  id: string;
  path: string;
  token: string;
};

export async function createMediaUploadTargets(
  items: Array<{ id: string; path: string }>,
): Promise<MediaUploadTarget[]> {
  const storage = serverStorageClient().storage.from(MEDIA_BUCKET);

  return Promise.all(
    items.map(async (item) => {
      const { data, error } = await storage.createSignedUploadUrl(item.path, {
        upsert: true,
      });

      if (error || !data?.token) {
        throw new Error(`Could not prepare private media upload: ${error?.message || "missing upload token"}`);
      }

      return {
        id: item.id,
        path: data.path || item.path,
        token: data.token,
      };
    }),
  );
}

export async function verifyMediaObjects(paths: string[]) {
  if (!paths.length) return true;
  const storage = serverStorageClient().storage.from(MEDIA_BUCKET);
  const groups = new Map<string, string[]>();

  paths.forEach((path) => {
    const parts = path.split("/");
    const fileName = parts.pop();
    const folder = parts.join("/");
    if (!fileName) return;
    groups.set(folder, [...(groups.get(folder) || []), fileName]);
  });

  for (const [folder, expectedNames] of groups) {
    const { data, error } = await storage.list(folder, {
      limit: 100,
      sortBy: { column: "name", order: "asc" },
    });
    if (error) throw new Error(`Could not verify private media: ${error.message}`);
    const available = new Set((data || []).map((item) => item.name));
    if (!expectedNames.every((name) => available.has(name))) return false;
  }

  return true;
}

export async function createMediaDownloadUrls(paths: string[], expiresIn = 900) {
  if (!paths.length) return new Map<string, string>();
  const storage = serverStorageClient().storage.from(MEDIA_BUCKET);
  const { data, error } = await storage.createSignedUrls(paths, expiresIn);

  if (error || !data) {
    throw new Error(`Could not prepare private media delivery: ${error?.message || "missing signed URLs"}`);
  }

  const result = new Map<string, string>();
  data.forEach((item) => {
    if (item.path && item.signedUrl && !item.error) result.set(item.path, item.signedUrl);
  });
  return result;
}
