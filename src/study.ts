import { createEmptyCard, fsrs, Rating } from "ts-fsrs";

export type ReviewRating = "Again" | "Hard" | "Good" | "Easy";
type SavedCard = { due: string | Date; last_review?: string | Date; state: number; [key: string]: unknown };
type ReviewRecord = { card: SavedCard; reviews: number; lapses: number; lastReviewedAt: string };
export type AppStore = {
  version: 1;
  language: "fa" | "en";
  theme: "light" | "dark";
  bookmarks: string[];
  reviews: Record<string, ReviewRecord>;
};
type KanjiLike = { character: string; order: number };

const STORAGE_KEY = "rinemi2:local:v1";
const ratings = { Again: Rating.Again, Hard: Rating.Hard, Good: Rating.Good, Easy: Rating.Easy };
const scheduler = fsrs({
  request_retention: 0.9,
  maximum_interval: 36500,
  enable_fuzz: true,
  enable_short_term: true,
  learning_steps: ["1m", "10m"],
  relearning_steps: ["10m"]
});

export function createFreshStore(): AppStore {
  return { version: 1, language: "fa", theme: "light", bookmarks: [], reviews: {} };
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
export function loadStore(): { store: AppStore; warning: boolean } {
  if (typeof window === "undefined") return { store: createFreshStore(), warning: false };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { store: createFreshStore(), warning: false };
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== 1 || !isRecord(parsed.reviews) || !Array.isArray(parsed.bookmarks)) {
      return { store: createFreshStore(), warning: true };
    }
    const reviews: Record<string, ReviewRecord> = {};
    for (const [character, value] of Object.entries(parsed.reviews)) {
      if (!isRecord(value) || !isRecord(value.card)) continue;
      const card = value.card as unknown as SavedCard;
      if (!card.due || !Number.isFinite(new Date(card.due).getTime())) continue;
      reviews[character] = {
        card,
        reviews: Math.max(0, Number(value.reviews) || 0),
        lapses: Math.max(0, Number(value.lapses) || 0),
        lastReviewedAt: String(value.lastReviewedAt ?? "")
      };
    }
    const language = parsed.language === "en" ? "en" : "fa";
    const theme = parsed.theme === "dark" ? "dark" : "light";
    const bookmarks = [...new Set(parsed.bookmarks.filter((x): x is string => typeof x === "string").slice(0, 2136))];
    return { store: { version: 1, language, theme, bookmarks, reviews }, warning: false };
  } catch {
    return { store: createFreshStore(), warning: true };
  }
}
export function persistStore(store: AppStore): void {
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}
function reviveCard(card: SavedCard): SavedCard {
  return { ...card, due: new Date(card.due), last_review: card.last_review ? new Date(card.last_review) : undefined };
}
export function countDueReviews(store: AppStore, now = new Date()): number {
  return Object.values(store.reviews).filter(record => new Date(record.card.due).getTime() <= now.getTime()).length;
}
export function buildSessionQueue(store: AppStore, deck: KanjiLike[], starter: readonly string[], now = new Date()): string[] {
  const due = Object.entries(store.reviews)
    .filter(([, record]) => new Date(record.card.due).getTime() <= now.getTime())
    .sort((a, b) => new Date(a[1].card.due).getTime() - new Date(b[1].card.due).getTime())
    .map(([character]) => character)
    .filter(character => deck.some(item => item.character === character));
  const newCharacters = [...starter].filter(character => !store.reviews[character] && deck.some(item => item.character === character)).slice(0, 5);
  return [...due.slice(0, 15), ...newCharacters];
}
export function recordRating(store: AppStore, character: string, rating: ReviewRating, now = new Date()): AppStore {
  const current = store.reviews[character];
  const rawCard = current ? current.card : createEmptyCard(now) as unknown as SavedCard;
  const result = scheduler.next(reviveCard(rawCard) as never, now, ratings[rating] as 1 | 2 | 3 | 4);
  const nextCard = result.card as unknown as SavedCard;
  return {
    ...store,
    reviews: {
      ...store.reviews,
      [character]: {
        card: nextCard,
        reviews: (current?.reviews ?? 0) + 1,
        lapses: (current?.lapses ?? 0) + (rating === "Again" ? 1 : 0),
        lastReviewedAt: now.toISOString()
      }
    }
  };
}