import { createEmptyCard, fsrs, Rating } from "ts-fsrs";

export type ReviewRating = "Again" | "Hard" | "Good" | "Easy";
export type ThemePreference = "light" | "dark" | "system";
type SavedCard = { due: string | Date; last_review?: string | Date; state: number; [key: string]: unknown };
type ReviewRecord = { card: SavedCard; reviews: number; lapses: number; lastReviewedAt: string };
export type SavedCollection = { id: string; name: string; characters: string[]; createdAt: string; updatedAt: string };
export type AppStore = {
  version: 2;
  language: "fa" | "en";
  theme: ThemePreference;
  bookmarks: string[];
  collections: SavedCollection[];
  reviews: Record<string, ReviewRecord>;
};
type KanjiLike = { character: string; order: number };

const STORAGE_KEY = "rinemi2:local:v2";
const LEGACY_STORAGE_KEY = "rinemi2:local:v1";
export const THEME_PREFERENCE_KEY = "rinemi.theme";
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
  return { version: 2, language: "fa", theme: "system", bookmarks: [], collections: [], reviews: {} };
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function normalizeBookmarks(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === "string" && item.length > 0))].slice(0, 2136);
}
function normalizeReviews(value: unknown): Record<string, ReviewRecord> {
  if (!isRecord(value)) return {};
  const reviews: Record<string, ReviewRecord> = {};
  for (const [character, candidate] of Object.entries(value)) {
    if (!character || !isRecord(candidate) || !isRecord(candidate.card)) continue;
    const card = candidate.card as unknown as SavedCard;
    if (!card.due || !Number.isFinite(new Date(card.due).getTime())) continue;
    reviews[character] = {
      card,
      reviews: Math.max(0, Number(candidate.reviews) || 0),
      lapses: Math.max(0, Number(candidate.lapses) || 0),
      lastReviewedAt: String(candidate.lastReviewedAt ?? "")
    };
  }
  return reviews;
}
function normalizeCollections(value: unknown): SavedCollection[] {
  if (!Array.isArray(value)) return [];
  const seenIds = new Set<string>();
  const normalized: SavedCollection[] = [];
  for (const candidate of value) {
    if (!isRecord(candidate)) continue;
    const id = typeof candidate.id === "string" ? candidate.id.trim() : "";
    const name = typeof candidate.name === "string" ? candidate.name.trim().slice(0, 60) : "";
    if (!id || !name || seenIds.has(id)) continue;
    const characters = normalizeBookmarks(candidate.characters);
    const createdAt = typeof candidate.createdAt === "string" && Number.isFinite(Date.parse(candidate.createdAt))
      ? candidate.createdAt : new Date(0).toISOString();
    const updatedAt = typeof candidate.updatedAt === "string" && Number.isFinite(Date.parse(candidate.updatedAt))
      ? candidate.updatedAt : createdAt;
    seenIds.add(id);
    normalized.push({ id, name, characters, createdAt, updatedAt });
  }
  return normalized.slice(0, 200);
}
function parseStore(raw: string): AppStore | null {
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { return null; }
  if (!isRecord(parsed) || (parsed.version !== 1 && parsed.version !== 2) || !isRecord(parsed.reviews) || !Array.isArray(parsed.bookmarks)) return null;
  const language = parsed.language === "en" ? "en" : "fa";
  const theme: ThemePreference = parsed.theme === "dark" || parsed.theme === "system" ? parsed.theme : "light";
  return {
    version: 2,
    language,
    theme,
    bookmarks: normalizeBookmarks(parsed.bookmarks),
    collections: parsed.version === 2 ? normalizeCollections(parsed.collections) : [],
    reviews: normalizeReviews(parsed.reviews)
  };
}
export function normalizeStoreSnapshot(value: unknown): AppStore | null {
  try {
    const raw = JSON.stringify(value);
    return typeof raw === "string" ? parseStore(raw) : null;
  } catch {
    return null;
  }
}

function isThemePreference(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

export function resolveEffectiveTheme(
  preference: ThemePreference,
  systemPrefersDark = typeof window !== "undefined" && typeof window.matchMedia === "function"
    && window.matchMedia("(prefers-color-scheme: dark)").matches
): "light" | "dark" {
  return preference === "system" ? (systemPrefersDark ? "dark" : "light") : preference;
}

export function loadStore(): { store: AppStore; warning: boolean } {
  if (typeof window === "undefined") return { store: createFreshStore(), warning: false };
  try {
    const rawPreference = window.localStorage.getItem(THEME_PREFERENCE_KEY);
    const themePreference = isThemePreference(rawPreference) ? rawPreference : null;
    const currentRaw = window.localStorage.getItem(STORAGE_KEY);
    if (currentRaw !== null) {
      const current = parseStore(currentRaw);
      return current
        ? { store: { ...current, theme: themePreference ?? current.theme }, warning: false }
        : { store: { ...createFreshStore(), theme: themePreference ?? "system" }, warning: true };
    }
    const legacyRaw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw === null) {
      const fresh = createFreshStore();
      return { store: { ...fresh, theme: themePreference ?? fresh.theme }, warning: false };
    }
    const legacy = parseStore(legacyRaw);
    return legacy
      ? { store: { ...legacy, theme: themePreference ?? legacy.theme }, warning: false }
      : { store: createFreshStore(), warning: true };
  } catch {
    return { store: createFreshStore(), warning: true };
  }
}
export function persistStore(store: AppStore): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_PREFERENCE_KEY, store.theme);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...store, version: 2 }));
}

export function eraseLocalData(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  window.localStorage.removeItem(THEME_PREFERENCE_KEY);
}
function createId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  } catch { /* Use the local fallback in older browser contexts. */ }
  return "collection-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}
function ensureCollectionName(name: string, collections: SavedCollection[]): string {
  const normalized = name.trim().slice(0, 60);
  if (!normalized) throw new Error("COLLECTION_NAME_REQUIRED");
  if (collections.some(collection => collection.name.localeCompare(normalized, undefined, { sensitivity: "accent" }) === 0)) {
    throw new Error("COLLECTION_NAME_DUPLICATE");
  }
  if (collections.length >= 200) throw new Error("COLLECTION_LIMIT_REACHED");
  return normalized;
}
export function createCollection(store: AppStore, name: string, now = new Date(), id = createId()): AppStore {
  const normalizedName = ensureCollectionName(name, store.collections);
  const timestamp = now.toISOString();
  const collection: SavedCollection = { id, name: normalizedName, characters: [], createdAt: timestamp, updatedAt: timestamp };
  return { ...store, collections: [...store.collections, collection] };
}
export function addCharacterToCollection(store: AppStore, collectionId: string, character: string, now = new Date()): AppStore {
  if (!character) throw new Error("KANJI_CHARACTER_REQUIRED");
  const collection = store.collections.find(item => item.id === collectionId);
  if (!collection) throw new Error("COLLECTION_NOT_FOUND");
  if (collection.characters.includes(character)) return store;
  if (collection.characters.length >= 2136) throw new Error("COLLECTION_LIMIT_REACHED");
  const updatedAt = now.toISOString();
  return {
    ...store,
    collections: store.collections.map(item => item.id === collectionId
      ? { ...item, characters: [...item.characters, character], updatedAt }
      : item)
  };
}
export function removeCharacterFromCollection(store: AppStore, collectionId: string, character: string, now = new Date()): AppStore {
  const collection = store.collections.find(item => item.id === collectionId);
  if (!collection) throw new Error("COLLECTION_NOT_FOUND");
  if (!collection.characters.includes(character)) return store;
  const updatedAt = now.toISOString();
  return {
    ...store,
    collections: store.collections.map(item => item.id === collectionId
      ? { ...item, characters: item.characters.filter(itemCharacter => itemCharacter !== character), updatedAt }
      : item)
  };
}
export function deleteCollection(store: AppStore, collectionId: string): AppStore {
  if (!store.collections.some(item => item.id === collectionId)) return store;
  return { ...store, collections: store.collections.filter(item => item.id !== collectionId) };
}

export function renameCollection(store: AppStore, collectionId: string, name: string, now = new Date()): AppStore {
  const current = store.collections.find(item => item.id === collectionId);
  if (!current) throw new Error("COLLECTION_NOT_FOUND");
  const normalizedName = name.trim().slice(0, 60);
  if (!normalizedName) throw new Error("COLLECTION_NAME_REQUIRED");
  if (store.collections.some(item => item.id !== collectionId
    && item.name.localeCompare(normalizedName, undefined, { sensitivity: "accent" }) === 0)) {
    throw new Error("COLLECTION_NAME_DUPLICATE");
  }
  if (current.name === normalizedName) return store;
  const updatedAt = now.toISOString();
  return {
    ...store,
    collections: store.collections.map(item => item.id === collectionId
      ? { ...item, name: normalizedName, updatedAt }
      : item)
  };
}

export function clearCollectionCharacters(store: AppStore, collectionId: string, now = new Date()): AppStore {
  const current = store.collections.find(item => item.id === collectionId);
  if (!current) throw new Error("COLLECTION_NOT_FOUND");
  if (current.characters.length === 0) return store;
  const updatedAt = now.toISOString();
  return {
    ...store,
    collections: store.collections.map(item => item.id === collectionId
      ? { ...item, characters: [], updatedAt }
      : item)
  };
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
  return [...new Set([...due.slice(0, 15), ...newCharacters])];
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
