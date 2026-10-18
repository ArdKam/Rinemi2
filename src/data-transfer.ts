import type { AppStore } from "./study";
import { normalizeStoreSnapshot } from "./study";

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

  const store = normalizeStoreSnapshot(parsed.data);
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
