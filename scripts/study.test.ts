import assert from "node:assert/strict";
import test from "node:test";
import {
  addCharacterToCollection,
  buildSessionQueue,
  countDueReviews,
  createCollection,
  createFreshStore,
  deleteCollection,
  loadStore,
  persistStore,
  recordRating,
  resolveEffectiveTheme,
  THEME_PREFERENCE_KEY,
  removeCharacterFromCollection
} from "../src/study.ts";

test("fresh learner gets versioned Persian/system defaults and empty personal data", () => {
  const store = createFreshStore();
  assert.equal(store.version, 2);
  assert.equal(store.language, "fa");
  assert.equal(store.theme, "system");
  assert.equal(countDueReviews(store), 0);
  assert.deepEqual(store.bookmarks, []);
  assert.deepEqual(store.collections, []);
  assert.deepEqual(Object.keys(store.reviews), []);
});

test("effective theme follows explicit preferences or the operating-system scheme", () => {
  assert.equal(resolveEffectiveTheme("light", true), "light");
  assert.equal(resolveEffectiveTheme("dark", false), "dark");
  assert.equal(resolveEffectiveTheme("system", true), "dark");
  assert.equal(resolveEffectiveTheme("system", false), "light");
});

test("review ratings create and update one FSRS-backed record", () => {
  const now = new Date("2026-10-18T12:00:00.000Z");
  const first = recordRating(createFreshStore(), "日", "Good", now);
  assert.equal(first.reviews["日"].reviews, 1);
  assert.equal(first.reviews["日"].lapses, 0);
  assert.equal(first.reviews["日"].lastReviewedAt, now.toISOString());
  assert.ok(Number.isFinite(new Date(first.reviews["日"].card.due).getTime()));

  const second = recordRating(first, "日", "Again", new Date(now.getTime() + 60_000));
  assert.equal(second.reviews["日"].reviews, 2);
  assert.equal(second.reviews["日"].lapses, 1);
  assert.ok(countDueReviews(second, new Date(now.getTime() + 48 * 60 * 60 * 1000)) >= 1);
});

test("session queue puts due cards before unseen starter kanji and avoids duplicates", () => {
  const now = new Date("2026-10-18T12:00:00.000Z");
  let store = createFreshStore();
  store = recordRating(store, "日", "Again", new Date(now.getTime() - 60 * 60 * 1000));
  const queue = buildSessionQueue(store, [{ character: "日", order: 1 }, { character: "一", order: 2 }, { character: "国", order: 3 }], ["日", "一", "国"], now);
  assert.equal(queue[0], "日");
  assert.ok(queue.includes("一"));
  assert.ok(queue.includes("国"));
  assert.equal(new Set(queue).size, queue.length);
});

test("collection operations do not change bookmarks or scheduler records", () => {
  const now = new Date("2026-10-18T12:00:00.000Z");
  let store = recordRating(createFreshStore(), "日", "Good", now);
  store = { ...store, bookmarks: ["日"] };
  const beforeReviews = structuredClone(store.reviews);
  const originalBookmarks = [...store.bookmarks];
  store = createCollection(store, "Trip notes", now, "collection-trip");
  store = addCharacterToCollection(store, "collection-trip", "日", now);
  store = addCharacterToCollection(store, "collection-trip", "日本", now);
  const duplicate = addCharacterToCollection(store, "collection-trip", "日本", now);
  assert.equal(duplicate.collections[0].characters.length, 2);
  assert.deepEqual(duplicate.bookmarks, originalBookmarks);
  assert.deepEqual(duplicate.reviews, beforeReviews);

  store = removeCharacterFromCollection(duplicate, "collection-trip", "日本", new Date(now.getTime() + 1000));
  assert.deepEqual(store.collections[0].characters, ["日"]);
  assert.deepEqual(store.bookmarks, originalBookmarks);
  assert.deepEqual(store.reviews, beforeReviews);

  store = deleteCollection(store, "collection-trip");
  assert.deepEqual(store.collections, []);
  assert.deepEqual(store.bookmarks, originalBookmarks);
  assert.deepEqual(store.reviews, beforeReviews);
});

test("collection names are trimmed, bounded, and unique without case-only duplicates", () => {
  let store = createFreshStore();
  store = createCollection(store, "  Confusing kanji  ", new Date("2026-10-18T12:00:00.000Z"), "one");
  assert.equal(store.collections[0].name, "Confusing kanji");
  assert.throws(() => createCollection(store, " confusing KANJI ", new Date(), "two"), /COLLECTION_NAME_DUPLICATE/);
  assert.throws(() => createCollection(store, "   ", new Date(), "three"), /COLLECTION_NAME_REQUIRED/);
  const long = createCollection(store, "x".repeat(100), new Date(), "long");
  assert.equal(long.collections[1].name.length, 60);
});

test("v1 local data migrates to v2 without losing review history or bookmarks", () => {
  const data = new Map<string, string>();
  data.set("rinemi2:local:v1", JSON.stringify({
    version: 1,
    language: "en",
    theme: "dark",
    bookmarks: ["日", "一"],
    reviews: {
      "日": {
        card: { due: "2026-10-19T12:00:00.000Z", state: 2 },
        reviews: 4,
        lapses: 1,
        lastReviewedAt: "2026-10-18T12:00:00.000Z"
      }
    }
  }));
  const previousWindow = (globalThis as unknown as { window?: unknown }).window;
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => { data.set(key, value); },
      removeItem: (key: string) => { data.delete(key); }
    } }
  });
  try {
    const loaded = loadStore();
    assert.equal(loaded.warning, false);
    assert.equal(loaded.store.version, 2);
    assert.equal(loaded.store.language, "en");
    assert.equal(loaded.store.theme, "dark");
    assert.deepEqual(loaded.store.bookmarks, ["日", "一"]);
    assert.equal(loaded.store.reviews["日"].reviews, 4);
    assert.equal(loaded.store.reviews["日"].lapses, 1);
    assert.deepEqual(loaded.store.collections, []);
    persistStore(loaded.store);
    const v2 = JSON.parse(data.get("rinemi2:local:v2")!);
    assert.equal(v2.version, 2);
    assert.deepEqual(v2.bookmarks, ["日", "一"]);
    assert.equal(v2.reviews["日"].reviews, 4);
    assert.ok(data.has("rinemi2:local:v1"), "legacy key should remain intact until a separate cleanup decision");
    assert.equal(data.get(THEME_PREFERENCE_KEY), "dark", "theme preference is migrated to its documented key");
  } finally {
    if (previousWindow === undefined) delete (globalThis as unknown as { window?: unknown }).window;
    else Object.defineProperty(globalThis, "window", { configurable: true, value: previousWindow });
  }
});

test("malformed current v2 data is not silently replaced by stale v1 data", () => {
  const data = new Map<string, string>([
    ["rinemi2:local:v1", JSON.stringify({ version: 1, language: "en", theme: "light", bookmarks: ["日"], reviews: {} })],
    ["rinemi2:local:v2", "{broken-json"]
  ]);
  const previousWindow = (globalThis as unknown as { window?: unknown }).window;
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); } } }
  });
  try {
    const loaded = loadStore();
    assert.equal(loaded.warning, true);
    assert.deepEqual(loaded.store.bookmarks, []);
    assert.equal(loaded.store.language, "fa");
  } finally {
    if (previousWindow === undefined) delete (globalThis as unknown as { window?: unknown }).window;
    else Object.defineProperty(globalThis, "window", { configurable: true, value: previousWindow });
  }
});
