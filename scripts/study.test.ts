import assert from "node:assert/strict";
import test from "node:test";
import { buildSessionQueue, countDueReviews, createFreshStore, recordRating } from "../src/study.ts";

test("fresh learner gets Persian and light-theme defaults with no review history", () => {
  const store = createFreshStore();
  assert.equal(store.language, "fa");
  assert.equal(store.theme, "light");
  assert.equal(countDueReviews(store), 0);
  assert.deepEqual(store.bookmarks, []);
  assert.deepEqual(Object.keys(store.reviews), []);
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

test("session queue puts due cards before unseen starter kanji and avoids duplicate characters", () => {
  const now = new Date("2026-10-18T12:00:00.000Z");
  let store = createFreshStore();
  store = recordRating(store, "日", "Again", new Date(now.getTime() - 60 * 60 * 1000));
  const queue = buildSessionQueue(store, [{ character: "日", order: 1 }, { character: "一", order: 2 }, { character: "国", order: 3 }], ["日", "一", "国"], now);
  assert.equal(queue[0], "日");
  assert.ok(queue.includes("一"));
  assert.ok(queue.includes("国"));
  assert.equal(new Set(queue).size, queue.length);
});
