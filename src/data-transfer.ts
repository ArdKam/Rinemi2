import type { AppStore } from "./study";

export const RINEMI_BACKUP_FORMAT = "rinemi2-local-backup";
export const RINEMI_BACKUP_SCHEMA_VERSION = 1;
export const MAX_BACKUP_BYTES = 5 * 1024 * 1024;

export type BackupPreview = {
  store: AppStore;
  exportedAt: string;
  counts: {
    bookmarks: number;
    collections: number;
    collectionItems: number;
    reviewRecords: number;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function byteLength(value: string): number {
  return new TextEncoder().encode(value).byteLength;
}
function normalizeBookmarks(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === "string" && item.length > 0))].slice(0, 2136);
}

function normalizeBackupStore(value: unknown): AppStore | null {
  if (!isRecord(value) || value.version !== 2 || !Array.isArray(value.bookmarks) || !isRecord(value.reviews)) {
    return null;
  }

  const collections: AppStore["collections"] = [];
  const seenIds = new Set<string>();
  if (Array.isArray(value.collections)) {
    for (const item of value.collections) {
      if (!isRecord(item)) continue;
      const id = typeof item.id === "string" ? item.id.trim() : "";
      const name = typeof item.name === "string" ? item.name.trim().slice(0, 60) : "";
      if (!id || !name || seenIds.has(id)) continue;
      const createdAt = typeof item.createdAt === "string" && Number.isFinite(Date.parse(item.createdAt))
        ? item.createdAt : new Date(0).toISOString();
      const updatedAt = typeof item.updatedAt === "string" && Number.isFinite(Date.parse(item.updatedAt))
        ? item.updatedAt : createdAt;
      seenIds.add(id);
      collections.push({
        id,
        name,
        characters: normalizeBookmarks(item.characters),
        createdAt,
        updatedAt
      });
      if (collections.length >= 200) break;
    }
  }

  const reviews: AppStore["reviews"] = {};
  for (const [character, item] of Object.entries(value.reviews)) {
    if (!character || !isRecord(item) || !isRecord(item.card)) continue;
    const due = item.card.due;
    if (!due || !Number.isFinite(new Date(due as string | number).getTime())) continue;
    reviews[character] = {
      card: item.card as unknown as AppStore["reviews"][string]["card"],
      reviews: Math.max(0, Number(item.reviews) || 0),
      lapses: Math.max(0, Number(item.lapses) || 0),
      lastReviewedAt: String(item.lastReviewedAt ?? "")
    };
  }

  return {
    version: 2,
    language: value.language === "en" ? "en" : "fa",
    theme: value.theme === "dark" || value.theme === "system" ? value.theme : "light",
    bookmarks: normalizeBookmarks(value.bookmarks),
    collections,
    reviews
  };
}


/**
 * Produces a portable JSON backup containing only Rinemi's local learner data.
 * JSON serialization converts scheduler Date values to ISO strings; restore
 * normalizes those values through the same store parser used at startup.
 */
export function createBackupFile(store: AppStore, exportedAt = new Date()): string {
  if (!Number.isFinite(exportedAt.getTime())) throw new Error("INVALID_EXPORT_DATE");
  const text = JSON.stringify({
    format: RINEMI_BACKUP_FORMAT,
    schemaVersion: RINEMI_BACKUP_SCHEMA_VERSION,
    exportedAt: exportedAt.toISOString(),
    data: { ...store, version: 2 }
  }, null, 2);
  if (byteLength(text) > MAX_BACKUP_BYTES) throw new Error("BACKUP_TOO_LARGE");
  return text + "\n";
}

/**
 * Validates an uploaded backup without mutating storage.
 * Throws stable error codes so callers can provide localized, actionable errors.
 */
export function parseBackupFile(text: string): BackupPreview {
  if (typeof text !== "string" || byteLength(text) > MAX_BACKUP_BYTES) {
    throw new Error("BACKUP_TOO_LARGE");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("BACKUP_INVALID_JSON");
  }

  if (!isRecord(parsed)
    || parsed.format !== RINEMI_BACKUP_FORMAT
    || parsed.schemaVersion !== RINEMI_BACKUP_SCHEMA_VERSION
    || typeof parsed.exportedAt !== "string"
    || !Number.isFinite(Date.parse(parsed.exportedAt))
    || !isRecord(parsed.data)
    || parsed.data.version !== 2) {
    throw new Error("BACKUP_UNSUPPORTED_FORMAT");
  }

  const store = normalizeBackupStore(parsed.data);
  if (!store) throw new Error("BACKUP_INVALID_DATA");

  return {
    store,
    exportedAt: new Date(parsed.exportedAt).toISOString(),
    counts: {
      bookmarks: store.bookmarks.length,
      collections: store.collections.length,
      collectionItems: store.collections.reduce((sum, collection) => sum + collection.characters.length, 0),
      reviewRecords: Object.keys(store.reviews).length
    }
  };
}
