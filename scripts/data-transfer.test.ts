import assert from "node:assert/strict";
import test from "node:test";
import { createBackupFile, MAX_BACKUP_BYTES, parseBackupFile, RINEMI_BACKUP_FORMAT } from "../src/data-transfer.ts";
import { addCharacterToCollection, createCollection, createFreshStore, recordRating } from "../src/study.ts";

test("backup round-trip preserves local preferences, bookmarks, collections, and FSRS review records", () => {
  const now = new Date("2026-10-18T12:00:00.000Z");
  let store = createFreshStore();
  store = { ...store, language: "en", theme: "dark", bookmarks: ["日", "一"] };
  store = recordRating(store, "日", "Good", now);
  store = createCollection(store, "Travel", now, "travel");
  store = addCharacterToCollection(store, "travel", "日", now);

  const text = createBackupFile(store, new Date("2026-10-19T00:00:00.000Z"));
  const preview = parseBackupFile(text);

  assert.equal(preview.exportedAt, "2026-10-19T00:00:00.000Z");
  assert.deepEqual(preview.counts, {
    bookmarks: 2,
    collections: 1,
    collectionItems: 1,
    reviewRecords: 1
  });
  assert.equal(preview.store.language, "en");
  assert.equal(preview.store.theme, "dark");
  assert.deepEqual(preview.store.bookmarks, ["日", "一"]);
  assert.equal(preview.store.collections[0].name, "Travel");
  assert.deepEqual(preview.store.collections[0].characters, ["日"]);
  assert.equal(preview.store.reviews["日"].reviews, 1);
  assert.equal(preview.store.reviews["日"].lastReviewedAt, now.toISOString());
  assert.ok(Number.isFinite(new Date(preview.store.reviews["日"].card.due).getTime()));
});

test("backup parser rejects malformed JSON, unsupported envelopes, and malformed store data", () => {
  assert.throws(() => parseBackupFile("{oops"), /BACKUP_INVALID_JSON/);
  assert.throws(() => parseBackupFile(JSON.stringify({ format: RINEMI_BACKUP_FORMAT, schemaVersion: 99 })), /BACKUP_UNSUPPORTED_FORMAT/);
  assert.throws(() => parseBackupFile(JSON.stringify({
    format: RINEMI_BACKUP_FORMAT,
    schemaVersion: 1,
    exportedAt: "2026-10-19T00:00:00.000Z",
    data: { version: 2, bookmarks: "not-an-array", reviews: {} }
  })), /BACKUP_UNSUPPORTED_FORMAT/);
});

test("backup parser rejects oversized files before parsing", () => {
  assert.throws(() => parseBackupFile(" ".repeat(MAX_BACKUP_BYTES + 1)), /BACKUP_TOO_LARGE/);
});

test("backup creator rejects invalid export timestamps", () => {
  assert.throws(() => createBackupFile(createFreshStore(), new Date(Number.NaN)), /INVALID_EXPORT_DATE/);
});
