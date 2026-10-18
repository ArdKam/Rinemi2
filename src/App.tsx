import { useEffect, useMemo, useRef, useState } from "react";
import sourceDataset from "./data/kanji.json";
import topicDataset from "./data/kanji-topics.json";
import { EXAMPLES, PERSIAN_GLOSSES, STARTER_CHARACTERS } from "./content";
import { addCharacterToCollection, buildSessionQueue, clearCollectionCharacters, countDueReviews, createCollection, createFreshStore, deleteCollection, eraseLocalData, loadStore, persistStore, recordRating, removeCharacterFromCollection, renameCollection, resolveEffectiveTheme, type AppStore, type ReviewRating } from "./study";
import { applyThemePreference } from "./theme";
import { createBackupFile, MAX_BACKUP_BYTES, parseBackupFile, type BackupPreview } from "./data-transfer";

type Kanji = { id: string; character: string; meaning: string[]; on: string[]; kun: string[]; strokes: number; grade: number; jlpt: string | null; frequency: number; order: number };
type Topic = { id: string; label: { fa: string; en: string }; characters: string };
type Language = "fa" | "en";
type Page = "today" | "learn" | "explore";
const KANJI = (sourceDataset as unknown as { kanji: Kanji[] }).kanji;
const TOPICS = (topicDataset as unknown as { topics: Topic[] }).topics;
const BY_CHARACTER = new Map(KANJI.map(item => [item.character, item]));
const TOPIC_MEMBERS = new Map(TOPICS.map(topic => [topic.id, new Set(topic.characters.trim().split(/\s+/))]));
const BRAND_MARK_LIGHT = `${import.meta.env.BASE_URL}brand/rinemi-mark.svg`;
const BRAND_MARK_DARK = `${import.meta.env.BASE_URL}brand/rinemi-mark-dark.svg`;

const COPY = {
  fa: {
    today: "امروز", learn: "یادگیری", explore: "کاوش", brand: "کانجی، با درک و کاربرد",
    kicker: "RINEMI · دفتر یادگیری ژاپنی", headline: "امروز، یک قدم به خواندن نزدیک‌تر.",
    intro: "مرورهای موعدرسیده را انجام بده و چند کانجی تازه را در واژه‌های واقعی ببین.",
    start: "شروع یادگیری", due: "مرور موعدرسیده", learned: "کانجی‌های مرورشده", saved: "ذخیره‌شده‌ها",
    shortSession: "تمرین کوتاه امروز", newAvailable: "کانجی تازه از مجموعهٔ آغازین در دسترس است.", firstSessionTitle: "شروع آرام، با چند کانجی", firstSessionText: "اول پاسخ را به یاد بیاور، بعد آن را آشکار کن و بر اساس میزان یادآوری امتیاز بده.",
    sun: "خورشید؛ روز", editorial: "از یک نشانه شروع کن", featuredNote: "日 در واژه‌هایی مثل 日本 و 毎日 دیده می‌شود؛ خواندن آن به واژه بستگی دارد.",
    missedDay: "جلسه‌ها کوتاه و پیوسته‌اند. روزی که برنگشتی، چیزی را از دست نداده‌ای.",
    starter: "مجموعهٔ آغازین فارسی", sourceOrder: "ترتیب فراوانی منبع",
    recall: "تمرین یادآوری", question: "معنای اصلی این کانجی چیست؟", reveal: "نمایش پاسخ",
    hint: "اول خودت پاسخ را به یاد بیاور؛ بعد آن را آشکار کن.", meaning: "معنای فارسی آغازین", glossNotice: "این توضیح و واژه‌های نمونه هنوز بازبینی انسانی نشده‌اند.", sourceMeaning: "معنای انگلیسی مرجع",
    on: "اون‌یومی", kun: "کون‌یومی", example: "در یک واژه", askRating: "چقدر راحت به یاد آوردی؟",
    Again: "دوباره", Hard: "سخت", Good: "خوب", Easy: "آسان",
    complete: "این بخش تمام شد.", completeText: "پاسخ‌ها ذخیره شدند و زمان مرور بعدی با FSRS محاسبه می‌شود.",
    empty: "فعلاً مرور موعدرسیده یا کانجی تازه‌ای از مجموعهٔ آغازین باقی نمانده است.",
    emptyHelp: "از کاوش می‌توانی کانجی‌ها را پیدا و ذخیره کنی. مجموعهٔ آغازین فارسی پس از بازبینی محتوا گسترش پیدا می‌کند.",
    browse: "کاوش کانجی‌ها", back: "بازگشت به امروز", progress: "کانجی",
    searchTitle: "کانجی را پیدا کن.", searchHelp: "با خود کانجی، خوانش، معنی انگلیسی یا توضیح فارسی جست‌وجو کن.",
    searchPlaceholder: "مثلاً 日، nichi، خورشید…", allLevels: "همهٔ سطوح JLPT",
    moreResults: "نمایش نتایج بیشتر", showingResults: "نمایش", ofResults: "از", backToResults: "بازگشت به نتایج",
    allTopics: "همهٔ موضوع‌ها", savedOnly: "فقط ذخیره‌شده‌ها", results: "نتیجه",
    noResults: "چیزی پیدا نشد.", clear: "پاک کردن فیلترها", bookmark: "ذخیره", savedLabel: "ذخیره شد",
    removeSaved: "حذف از ذخیره‌ها", detail: "جزئیات کانجی", close: "بستن جزئیات",
    strokes: "تعداد خط", grade: "پایهٔ آموزشی", jlpt: "سطح JLPT", frequency: "بسامد",
    notReviewed: "توضیح فارسیِ بازبینی‌شده برای این کانجی هنوز آماده نیست.",
    sourceDisclaimer: "این معنا از واژه‌نامهٔ مرجع آمده و ترجمهٔ فارسیِ تأییدشده محسوب نمی‌شود.",
    langSwitch: "English", dark: "حالت تیره", light: "حالت روشن", systemAppearance: "هماهنگی با سیستم‌عامل",
    storageWarning: "ذخیره‌سازی محلی در دسترس نیست یا دادهٔ ذخیره‌شده قابل‌خواندن نیست. تغییرها ممکن است ذخیره نشوند.",
    contentNote: "دادهٔ پایه از KANJIDIC2 آمده است. توضیح‌های فارسی فعلاً فقط برای مجموعهٔ آغازین نوشته شده‌اند و پیش از انتشار عمومی باید بازبینی شوند.",
    feedback: "بازخورد", feedbackCopy: "این نسخهٔ آغازین هنوز به بازبینی محتوایی نیاز دارد.",
    practice: "تمرین همین کانجی",
    collectionsLabel: "مجموعه‌های شخصی", showCollections: "نمایش مجموعه‌ها", collectionName: "نام مجموعه", collectionPlaceholder: "مثلاً کانجی‌های گیج‌کننده", createCollection: "ساخت مجموعه", createFirstCollection: "اولین مجموعه را بساز", collectionEmpty: "هنوز مجموعه‌ای نساخته‌ای.", collectionHelp: "کانجی‌ها را برای مرور و مطالعهٔ شخصی دسته‌بندی کن.", addToCollection: "افزودن به مجموعه", removeFromCollection: "حذف از این مجموعه", collectionAdded: "کانجی به مجموعه افزوده شد.", collectionRemoved: "کانجی از مجموعه حذف شد.", collectionCreated: "مجموعه ساخته شد.", collectionExists: "مجموعه‌ای با این نام وجود دارد.", collectionNameRequired: "یک نام برای مجموعه وارد کن.", collectionLimit: "به سقف تعداد مجموعه‌ها رسیده‌ای.", collectionDeleted: "مجموعه حذف شد.", deleteCollection: "حذف مجموعه", deleteConfirm: "این مجموعه حذف شود؟ کانجی‌ها و سابقهٔ مرور حذف نمی‌شوند.", renameCollection: "تغییر نام", saveCollectionName: "ذخیره نام", cancelCollectionRename: "لغو", collectionRenamed: "نام مجموعه تغییر کرد.", clearCollection: "حذف همهٔ موارد", clearCollectionConfirm: "همهٔ کانجی‌های این مجموعه حذف شوند؟ نشانک‌ها و سابقهٔ مرور تغییر نمی‌کنند.", collectionCleared: "همهٔ کانجی‌ها از مجموعه حذف شدند.", studyCollection: "مطالعهٔ ۲۰ مورد نخست", openCollection: "نمایش کانجی‌ها", allCharacters: "نمایش همهٔ کانجی‌ها", collectionFilterHint: "نتایج به مجموعهٔ انتخاب‌شده محدود شده‌اند.",
    dataControls: "مدیریت داده‌ها", dataControlsHeading: "پشتیبان‌گیری و داده‌های محلی", dataLocalOnly: "یادگیری، نشانک‌ها و سابقهٔ مرور فعلاً فقط در همین مرورگر ذخیره می‌شوند؛ حساب و همگام‌سازی ابری فعال نیست.", dataBackupGuidance: "بازگردانی، دادهٔ محلی فعلی را جایگزین می‌کند. ابتدا فایل را بررسی کن و در صورت نیاز از دادهٔ فعلی پشتیبان بگیر.", exportData: "دانلود پشتیبان", importBackup: "انتخاب فایل پشتیبان", restoreBackup: "جایگزینی با پشتیبان", eraseData: "پاک‌کردن داده‌های این مرورگر", closeDataControls: "بستن مدیریت داده‌ها", restoreBackupConfirm: "داده‌های محلی فعلی با داده‌های داخل این فایل جایگزین شوند؟", eraseDataConfirm: "همهٔ نشانک‌ها، مجموعه‌ها و سابقهٔ مرور این مرورگر پاک شوند؟ این کار قابل بازگشت نیست.", backupReady: "فایل بررسی شد؛ هنوز هیچ داده‌ای تغییر نکرده است.", backupDownloaded: "فایل پشتیبان آماده و دانلود شد.", backupRestored: "پشتیبان در ذخیره‌سازی محلی جایگزین شد.", dataErased: "داده‌های محلی پاک شد.", dataWriteFailed: "ذخیره‌سازی انجام نشد. فضای ذخیره‌سازی مرورگر یا دسترسی آن را بررسی کن.", dataEraseFailed: "پاک‌کردن داده‌ها کامل نشد؛ دسترسی ذخیره‌سازی مرورگر را بررسی کن.", backupInvalid: "فایل پشتیبان JSON معتبر نیست.", backupUnsupported: "ساختار یا نسخهٔ این فایل پشتیبانی نمی‌شود؛ داده‌ای تغییر نکرده است.", backupInvalidData: "داده‌های داخل فایل قابل‌استفاده نیستند؛ داده‌ای تغییر نکرده است.", backupTooLarge: "فایل پشتیبان از سقف ۵ مگابایت بزرگ‌تر است.", backupPreviewLabel: "پیش‌نمایش فایل", backupExportDate: "زمان پشتیبان", backupBookmarks: "نشانک", backupCollections: "مجموعه", backupCollectionItems: "عضویت در مجموعه", backupReviews: "سابقهٔ مرور", exportBlocked: "به‌دلیل خطای ذخیره‌سازی، پشتیبان قابل‌اعتمادی ساخته نشد. ابتدا یک فایل پشتیبان معتبر را بازیابی کن."
  },
  en: {
    today: "Today", learn: "Learn", explore: "Explore", brand: "Kanji through meaning and use",
    kicker: "RINEMI · JAPANESE STUDY JOURNAL", headline: "One step closer to reading Japanese.",
    intro: "Clear due reviews, then meet new kanji through useful vocabulary.",
    start: "Start studying", due: "Reviews due", learned: "Kanji reviewed", saved: "Saved",
    shortSession: "Today's short session", newAvailable: "new characters are available from the starter set.", firstSessionTitle: "Your first session starts here", firstSessionText: "Recall first, reveal the answer, then rate how easily you remembered it.",
    sun: "sun; day", editorial: "Start with one character", featuredNote: "日 appears in words such as 日本 and 毎日. Its reading depends on the word.",
    missedDay: "Study in short, steady sessions. Missing a day does not mean you have failed.",
    starter: "Persian starter set", sourceOrder: "Source frequency order",
    recall: "Active recall", question: "What is the central meaning of this kanji?", reveal: "Reveal answer",
    hint: "Try to retrieve the answer first, then reveal it.", meaning: "Starter Persian gloss", glossNotice: "This gloss and its example vocabulary have not yet been human-reviewed.", sourceMeaning: "English source gloss",
    on: "ON'YOMI", kun: "KUN'YOMI", example: "In a word", askRating: "How easily did you recall it?",
    Again: "Again", Hard: "Hard", Good: "Good", Easy: "Easy",
    complete: "This session is complete.", completeText: "Your ratings were saved and the next review is scheduled by FSRS.",
    empty: "No due reviews or new characters from the starter set are available right now.",
    emptyHelp: "Explore and bookmark kanji. The Persian-supported starter set will expand after content review.",
    browse: "Explore kanji", back: "Back to Today", progress: "kanji",
    searchTitle: "Find a kanji.", searchHelp: "Search by character, reading, English gloss, or reviewed Persian meaning.",
    searchPlaceholder: "Try 日, nichi, sun…", allLevels: "All JLPT levels",
    moreResults: "Show more results", showingResults: "Showing", ofResults: "of", backToResults: "Back to results",
    allTopics: "All topics", savedOnly: "Saved only", results: "results",
    noResults: "No matches found.", clear: "Clear filters", bookmark: "Save", savedLabel: "Saved",
    removeSaved: "Remove saved item", detail: "Kanji details", close: "Close details",
    strokes: "Strokes", grade: "School grade", jlpt: "JLPT level", frequency: "Frequency",
    notReviewed: "A reviewed Persian explanation is not available for this kanji yet.",
    sourceDisclaimer: "This is a source gloss, not a reviewed Persian learner explanation.",
    langSwitch: "فارسی", dark: "Dark mode", light: "Light mode", systemAppearance: "System appearance",
    storageWarning: "Local storage is unavailable or saved data could not be read. Changes may not persist.",
    contentNote: "The base dataset is derived from KANJIDIC2. Persian explanations currently cover only the starter set and require review before public release.",
    feedback: "Feedback", feedbackCopy: "This early build still needs content review.",
    practice: "Practice this kanji",
    collectionsLabel: "Personal collections", showCollections: "Show collections", collectionName: "Collection name", collectionPlaceholder: "e.g. Confusing kanji", createCollection: "Create collection", createFirstCollection: "Create your first collection", collectionEmpty: "You have not created a collection yet.", collectionHelp: "Group kanji for your own review and focused study.", addToCollection: "Add to collection", removeFromCollection: "Remove from collection", collectionAdded: "Kanji added to collection.", collectionRemoved: "Kanji removed from collection.", collectionCreated: "Collection created.", collectionExists: "A collection with this name already exists.", collectionNameRequired: "Enter a name for the collection.", collectionLimit: "You have reached the collection limit.", collectionDeleted: "Collection deleted.", deleteCollection: "Delete collection", deleteConfirm: "Delete this collection? Kanji and review history will remain.", renameCollection: "Rename", saveCollectionName: "Save name", cancelCollectionRename: "Cancel", collectionRenamed: "Collection renamed.", clearCollection: "Remove all items", clearCollectionConfirm: "Remove every kanji from this collection? Bookmarks and review history will remain unchanged.", collectionCleared: "All kanji removed from the collection.", studyCollection: "Study first 20 items", openCollection: "Show kanji", allCharacters: "Show all kanji", collectionFilterHint: "Results are filtered to the selected collection.",
    dataControls: "Data", dataControlsHeading: "Local data and backups", dataLocalOnly: "Study data, bookmarks, and review history are currently stored only in this browser. Accounts and cloud sync are not enabled.", dataBackupGuidance: "Restoring replaces the current local data. Inspect the file first and download a backup of current data beforehand if you may need it.", exportData: "Download backup", importBackup: "Choose backup file", restoreBackup: "Replace with backup", eraseData: "Erase this browser's data", closeDataControls: "Close data controls", restoreBackupConfirm: "Replace the current local data with the data in this file?", eraseDataConfirm: "Erase all bookmarks, collections, and review history stored in this browser? This cannot be undone.", backupReady: "Backup validated; no data has changed yet.", backupDownloaded: "Backup file prepared and downloaded.", backupRestored: "Backup replaced the local data.", dataErased: "Local learner data was erased.", dataWriteFailed: "The data could not be saved. Check browser storage availability and permissions.", dataEraseFailed: "Data erasure did not complete. Check browser storage access.", backupInvalid: "The backup file is not valid JSON.", backupUnsupported: "This backup structure or version is not supported. No data was changed.", backupInvalidData: "The data in this file is not usable. No data was changed.", backupTooLarge: "The backup exceeds the 5 MB limit.", backupPreviewLabel: "File preview", backupExportDate: "Backup date", backupBookmarks: "Bookmarks", backupCollections: "Collections", backupCollectionItems: "Collection memberships", backupReviews: "Review records", exportBlocked: "A reliable backup cannot be created while storage is reporting an error. Restore a valid backup first."
  }
} as const;
const RATING_HINTS = {
  fa: { Again: "هنوز بلد نبودم", Hard: "با دشواری به یاد آوردم", Good: "به یاد آوردم", Easy: "خیلی راحت به یاد آوردم" },
  en: { Again: "I could not recall it", Hard: "I recalled it with difficulty", Good: "I recalled it", Easy: "I recalled it easily" }
};
function normalize(value: string) { return value.trim().toLocaleLowerCase(); }
function fmt(value: number, language: Language) { return new Intl.NumberFormat(language === "fa" ? "fa-IR" : "en-US").format(value); }
function glossFor(character: string, language: Language) {
  const gloss = PERSIAN_GLOSSES[character];
  return gloss ? (language === "fa" ? gloss.fa : gloss.en) : null;
}
function localizedTopic(topic: Topic, language: Language) { return language === "fa" ? topic.label.fa : topic.label.en; }

export default function App() {
  const [initial] = useState(() => loadStore());
  const [store, setStore] = useState<AppStore>(initial.store);
  const [storageWarning, setStorageWarning] = useState(initial.warning);
  const [persistAllowed] = useState(!initial.warning);
  const [page, setPage] = useState<Page>("today");
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [topicId, setTopicId] = useState("all");
  const [onlySaved, setOnlySaved] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const [collectionTargetId, setCollectionTargetId] = useState("");
  const [collectionMessage, setCollectionMessage] = useState("");
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [editingCollectionName, setEditingCollectionName] = useState("");
  const [dataToolsOpen, setDataToolsOpen] = useState(false);
  const [backupPreview, setBackupPreview] = useState<BackupPreview | null>(null);
  const [backupError, setBackupError] = useState("");
  const [dataMessage, setDataMessage] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>("日");
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [visibleResultCount, setVisibleResultCount] = useState(60);
  const selectedResultRef = useRef<HTMLButtonElement | null>(null);
  const detailRef = useRef<HTMLElement | null>(null);
  const mobileDetailOpenRef = useRef(false);
  const mobileDetailScrollYRef = useRef<number | null>(null);
  const previousMobileDetailOpenRef = useRef(false);
  const [queue, setQueue] = useState<string[]>([]);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionRated, setSessionRated] = useState(0);
  const [rateBusy, setRateBusy] = useState(false);
  const ratingLockRef = useRef<string | null>(null);
  const [now, setNow] = useState(() => new Date());
  const language = store.language;
  const isFa = language === "fa";
  const t = COPY[language];
  const currentCharacter = queue[sessionIndex] ?? null;
  const currentItem = currentCharacter ? BY_CHARACTER.get(currentCharacter) ?? null : null;
  const dueCount = countDueReviews(store, now);
  const learnedCount = Object.keys(store.reviews).length;
  const isFirstSession = learnedCount === 0 && store.bookmarks.length === 0 && dueCount === 0;

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isFa ? "rtl" : "ltr";
    return applyThemePreference(store.theme);
  }, [language, isFa, store.theme]);
  useEffect(() => {
    if (!persistAllowed) return;
    try { persistStore(store); setStorageWarning(false); }
    catch { setStorageWarning(true); }
  }, [store, persistAllowed]);
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const filteredKanji = useMemo(() => {
    const needle = normalize(query);
    const saved = new Set(store.bookmarks);
    return KANJI.filter(item => {
      if (level !== "all" && item.jlpt !== level) return false;
      if (topicId !== "all" && !TOPIC_MEMBERS.get(topicId)?.has(item.character)) return false;
      if (onlySaved && !saved.has(item.character)) return false;
      if (activeCollectionId) {
        const collection = store.collections.find(candidate => candidate.id === activeCollectionId);
        if (!collection || !collection.characters.includes(item.character)) return false;
      }
      if (!needle) return true;
      const gloss = PERSIAN_GLOSSES[item.character];
      const haystack = [item.character, ...item.meaning, ...item.on, ...item.kun, item.jlpt ?? "", gloss?.fa ?? "", gloss?.en ?? ""].join(" ").toLocaleLowerCase();
      return haystack.includes(needle);
    }).sort((a, b) => a.order - b.order);
  }, [query, level, topicId, onlySaved, activeCollectionId, store.bookmarks, store.collections]);

  useEffect(() => {
    setVisibleResultCount(60);
  }, [query, level, topicId, onlySaved, activeCollectionId]);

  useEffect(() => {
    mobileDetailOpenRef.current = mobileDetailOpen;
  }, [mobileDetailOpen]);

  useEffect(() => {
    const handlePopState = () => {
      if (window.history.state?.rinemiMobileDetail) {
        mobileDetailOpenRef.current = true;
        setMobileDetailOpen(true);
      } else if (mobileDetailOpenRef.current) {
        mobileDetailOpenRef.current = false;
        setMobileDetailOpen(false);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!mobileDetailOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !window.matchMedia("(max-width: 680px)").matches) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("input, textarea, select, [contenteditable='true']")) return;
      event.preventDefault();
      closeMobileDetail();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileDetailOpen]);

  useEffect(() => {
    if (page === "explore" || !mobileDetailOpen) return;
    const currentState = window.history.state as Record<string, unknown> | null;
    if (currentState && typeof currentState === "object" && currentState.rinemiMobileDetail) {
      const nextState = { ...currentState };
      delete nextState.rinemiMobileDetail;
      window.history.replaceState(nextState, "");
    }
    mobileDetailOpenRef.current = false;
    setMobileDetailOpen(false);
  }, [mobileDetailOpen, page]);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 680px)").matches;
    if (page !== "explore" || !isMobile) {
      if (page !== "explore") previousMobileDetailOpenRef.current = false;
      return;
    }
    if (mobileDetailOpen && selectedCharacter) {
      const detail = detailRef.current;
      if (!detail) return;
      detail.scrollIntoView({ block: "start", behavior: "auto" });
      detail.focus({ preventScroll: true });
      previousMobileDetailOpenRef.current = true;
    } else if (previousMobileDetailOpenRef.current && selectedCharacter) {
      selectedResultRef.current?.focus({ preventScroll: true });
      const returnScrollY = mobileDetailScrollYRef.current;
      if (returnScrollY !== null) window.scrollTo({ top: returnScrollY, behavior: "auto" });
      mobileDetailScrollYRef.current = null;
      previousMobileDetailOpenRef.current = false;
    }
  }, [mobileDetailOpen, page, selectedCharacter]);

  function closeMobileDetail() {
    if (window.matchMedia("(max-width: 680px)").matches && window.history.state?.rinemiMobileDetail) {
      window.history.back();
      return;
    }
    mobileDetailOpenRef.current = false;
    setMobileDetailOpen(false);
  }

  function startSession() {
    const nextQueue = buildSessionQueue(store, KANJI, STARTER_CHARACTERS, new Date());
    ratingLockRef.current = null;
    setQueue(nextQueue); setSessionIndex(0); setRevealed(false); setSessionRated(0); setPage("learn");
  }
  function applyRating(rating: ReviewRating) {
    if (!currentCharacter || !revealed || rateBusy || ratingLockRef.current === currentCharacter) return;
    // Keep this character locked after a successful review so a repeated event cannot
    // submit a second rating before React commits the next prompt. New sessions reset it.
    ratingLockRef.current = currentCharacter;
    setRateBusy(true);
    try {
      const nextStore = recordRating(store, currentCharacter, rating, new Date());
      // Do not advance the learning session unless the review record can be persisted.
      persistStore(nextStore);
      setStorageWarning(false);
      setStore(nextStore);
      setSessionRated(value => value + 1);
      setSessionIndex(index => index + 1);
      setRevealed(false);
      setNow(new Date());
    } catch {
      ratingLockRef.current = null;
      setStorageWarning(true);
    } finally {
      setRateBusy(false);
    }
  }
  function toggleBookmark(character: string) {
    setStore(previous => {
      const exists = previous.bookmarks.includes(character);
      return { ...previous, bookmarks: exists ? previous.bookmarks.filter(item => item !== character) : [...previous.bookmarks, character] };
    });
  }

  function downloadBackup() {
    setDataMessage("");
    setBackupError("");
    if (storageWarning) {
      setDataMessage(t.exportBlocked);
      return;
    }
    try {
      const payload = createBackupFile(store);
      const url = URL.createObjectURL(new Blob([payload], { type: "application/json;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "rinemi-local-backup-" + new Date().toISOString().slice(0, 10) + ".json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
      setDataMessage(t.backupDownloaded);
    } catch {
      setDataMessage(t.dataWriteFailed);
    }
  }
  async function inspectBackupFile(file: File | undefined) {
    setBackupPreview(null);
    setBackupError("");
    setDataMessage("");
    if (!file) return;
    if (file.size > MAX_BACKUP_BYTES) {
      setBackupError(t.backupTooLarge);
      return;
    }
    try {
      const preview = parseBackupFile(await file.text());
      setBackupPreview(preview);
      setDataMessage(t.backupReady);
    } catch (error) {
      const code = error instanceof Error ? error.message : "";
      setBackupError(code === "BACKUP_TOO_LARGE" ? t.backupTooLarge
        : code === "BACKUP_INVALID_JSON" ? t.backupInvalid
        : code === "BACKUP_INVALID_DATA" ? t.backupInvalidData : t.backupUnsupported);
    }
  }
  function restoreBackup() {
    if (!backupPreview) return;
    if (!window.confirm(t.restoreBackupConfirm)) return;
    try {
      persistStore(backupPreview.store);
      setStore(backupPreview.store);
      setStorageWarning(false);
      setQueue([]);
      setSessionIndex(0);
      setSessionRated(0);
      setRevealed(false);
      setPage("today");
      setBackupPreview(null);
      setBackupError("");
      setDataMessage(backupPreview.store.language === "fa" ? "پشتیبان در ذخیره‌سازی محلی جایگزین شد." : "Backup replaced the local data.");
    } catch {
      setStorageWarning(true);
      setDataMessage(t.dataWriteFailed);
    }
  }
  function eraseBrowserData() {
    if (!window.confirm(t.eraseDataConfirm)) return;
    try {
      eraseLocalData();
    } catch {
      setStorageWarning(true);
      setDataMessage(t.dataEraseFailed);
      return;
    }

    const fresh = createFreshStore();
    setStore(fresh);
    setStorageWarning(false);
    setPage("today");
    setQueue([]);
    setSessionIndex(0);
    setSessionRated(0);
    setRevealed(false);
    setQuery("");
    setLevel("all");
    setTopicId("all");
    setOnlySaved(false);
    setActiveCollectionId(null);
    setSelectedCharacter("日");
    setBackupPreview(null);
    setBackupError("");
    try {
      // Reinitialize an empty versioned store after deleting every prior data key.
      persistStore(fresh);
      setDataMessage(t.dataErased);
    } catch {
      // Personal records have already been removed; the warning concerns reinitializing storage.
      setStorageWarning(true);
      setDataMessage(t.dataErased);
    }
  }
  function createNamedCollection() {
    try {
      const next = createCollection(store, newCollectionName);
      const created = next.collections[next.collections.length - 1];
      setStore(next);
      setNewCollectionName("");
      setCollectionTargetId(created.id);
      setActiveCollectionId(null);
      setCollectionsOpen(true);
      setCollectionMessage(t.collectionCreated);
    } catch (error) {
      const code = error instanceof Error ? error.message : "";
      setCollectionMessage(code === "COLLECTION_NAME_DUPLICATE" ? t.collectionExists
        : code === "COLLECTION_LIMIT_REACHED" ? t.collectionLimit : t.collectionNameRequired);
    }
  }
  function renameNamedCollection(collectionId: string) {
    try {
      const next = renameCollection(store, collectionId, editingCollectionName);
      setStore(next);
      setEditingCollectionId(null);
      setEditingCollectionName("");
      setCollectionMessage(t.collectionRenamed);
    } catch (error) {
      const code = error instanceof Error ? error.message : "";
      setCollectionMessage(code === "COLLECTION_NAME_DUPLICATE" ? t.collectionExists
        : code === "COLLECTION_NOT_FOUND" ? t.collectionEmpty : t.collectionNameRequired);
    }
  }
  function clearNamedCollection(collectionId: string) {
    const collection = store.collections.find(item => item.id === collectionId);
    if (!collection || collection.characters.length === 0) return;
    if (!window.confirm(t.clearCollectionConfirm)) return;
    try {
      setStore(clearCollectionCharacters(store, collectionId));
      setCollectionMessage(t.collectionCleared);
    } catch {
      setCollectionMessage(t.collectionEmpty);
    }
  }
  function toggleCollectionCharacter(collectionId: string, character: string) {
    try {
      const collection = store.collections.find(item => item.id === collectionId);
      if (!collection) return;
      if (collection.characters.includes(character)) {
        setStore(removeCharacterFromCollection(store, collectionId, character));
        setCollectionMessage(t.collectionRemoved);
      } else {
        setStore(addCharacterToCollection(store, collectionId, character));
        setCollectionMessage(t.collectionAdded);
      }
    } catch {
      setCollectionMessage(t.collectionLimit);
    }
  }
  function beginCollectionStudy(collectionId: string) {
    const collection = store.collections.find(item => item.id === collectionId);
    if (!collection) return;
    const characters = collection.characters.filter(character => BY_CHARACTER.has(character)).slice(0, 20);
    if (!characters.length) {
      setCollectionMessage(t.collectionEmpty);
      return;
    }
    ratingLockRef.current = null;
    setQueue(characters);
    setSessionIndex(0);
    setSessionRated(0);
    setRevealed(false);
    setPage("learn");
  }
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (page !== "learn" || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      if (target instanceof HTMLElement && (
        target.isContentEditable
        || target.closest("button, a, input, textarea, select, [role='button'], [role='link']") !== null
      )) return;
      if (event.code === "Space" && currentItem && !revealed) { event.preventDefault(); setRevealed(true); }
      if (revealed && !rateBusy && ["1", "2", "3", "4"].includes(event.key)) {
        event.preventDefault();
        applyRating((["Again", "Hard", "Good", "Easy"] as const)[Number(event.key) - 1]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const dueLabel = dueCount > 0
    ? (isFa ? fmt(dueCount, language) + " مرور در انتظار توست." : fmt(dueCount, language) + " reviews are waiting.")
    : t.start;
  const starterRemaining = STARTER_CHARACTERS.filter(character => !store.reviews[character]).length;
  const starterNew = Math.min(5, starterRemaining);
  const selectedItem = selectedCharacter ? BY_CHARACTER.get(selectedCharacter) ?? null : null;
  const selectedGloss = selectedItem ? glossFor(selectedItem.character, language) : null;
  const savedSet = new Set(store.bookmarks);

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">{isFa ? "رفتن به محتوای اصلی" : "Skip to main content"}</a>
    <header className="app-header">
      <button className="brand-lockup" type="button" onClick={() => setPage("today")} aria-label="Rinemi">
        <span className="brand-mark-shell" aria-hidden="true"><img className="brand-mark-light" src={BRAND_MARK_LIGHT} alt="" /><img className="brand-mark-dark" src={BRAND_MARK_DARK} alt="" /></span>
        <span className="brand-copy"><strong>Rinemi</strong><span>{t.brand}</span></span>
      </button>
      <nav className="primary-nav" aria-label={isFa ? "ناوبری اصلی" : "Primary navigation"}>
        <button type="button" className={"nav-link " + (page === "today" ? "is-active" : "")} aria-current={page === "today" ? "page" : undefined} onClick={() => setPage("today")}>{t.today}</button>
        <button type="button" className={"nav-link " + (page === "learn" ? "is-active" : "")} aria-current={page === "learn" ? "page" : undefined} onClick={() => setPage("learn")}>{t.learn}</button>
        <button type="button" className={"nav-link " + (page === "explore" ? "is-active" : "")} aria-current={page === "explore" ? "page" : undefined} onClick={() => setPage("explore")}>{t.explore}</button>
      </nav>
      <div className="header-tools">
        <button className="utility-button language-switch" type="button" onClick={() => setStore(previous => ({ ...previous, language: isFa ? "en" : "fa" }))} aria-label={isFa ? "Switch to English" : "تغییر به فارسی"}>{t.langSwitch}</button>
        <button className="utility-button theme-switch" type="button" onClick={() => setStore(previous => ({ ...previous, theme: previous.theme === "light" ? "dark" : previous.theme === "dark" ? "system" : "light" }))} aria-label={store.theme === "light" ? t.dark : store.theme === "dark" ? t.systemAppearance : t.light} title={store.theme === "system" ? t.systemAppearance : undefined}>
          <span className="theme-icon" aria-hidden="true">{resolveEffectiveTheme(store.theme) === "dark" ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.7 8.7 0 1 0 20.2 15.2Z" /></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2.1M12 19.9V22M4.93 4.93l1.48 1.48m11.18 11.18 1.48 1.48M2 12h2.1m15.8 0H22M4.93 19.07l1.48-1.48M17.59 6.41l1.48-1.48" /></svg>}</span><span className="utility-label">{store.theme === "light" ? t.dark : store.theme === "dark" ? t.systemAppearance : t.light}</span>
        </button>
        <button className="utility-button data-tools-toggle" type="button" aria-expanded={dataToolsOpen} aria-controls="data-management-panel" onClick={() => setDataToolsOpen(open => !open)}>{t.dataControls}</button>
      </div>
    </header>

    {dataToolsOpen && <section id="data-management-panel" className="data-management-panel" aria-labelledby="data-management-heading">
      <div className="data-management-heading">
        <div><p className="eyebrow">{t.dataControls}</p><h2 id="data-management-heading">{t.dataControlsHeading}</h2></div>
        <button className="detail-close" type="button" onClick={() => setDataToolsOpen(false)} aria-label={t.closeDataControls}>×</button>
      </div>
      <p className="data-management-note">{t.dataLocalOnly}</p>
      <p className="data-management-note">{t.dataBackupGuidance}</p>
      <div className="data-management-actions">
        <button className="button-secondary" type="button" onClick={downloadBackup} disabled={storageWarning}>{t.exportData}</button>
        <label className="data-upload-control">
          <span>{t.importBackup}</span>
          <input type="file" accept=".json,application/json" onChange={event => { const file = event.currentTarget.files?.[0]; void inspectBackupFile(file); event.currentTarget.value = ""; }} />
        </label>
        <button className="button-secondary" type="button" onClick={restoreBackup} disabled={!backupPreview}>{t.restoreBackup}</button>
        <button className="button-secondary data-erase-button" type="button" onClick={eraseBrowserData}>{t.eraseData}</button>
      </div>
      {backupPreview && <div className="data-backup-preview" role="status">
        <strong>{t.backupPreviewLabel}</strong>
        <span>{t.backupExportDate}: <time dateTime={backupPreview.exportedAt}>{backupPreview.exportedAt.slice(0, 10)}</time></span>
        <span>{fmt(backupPreview.counts.bookmarks, language)} {t.backupBookmarks}</span>
        <span>{fmt(backupPreview.counts.collections, language)} {t.backupCollections}</span>
        <span>{fmt(backupPreview.counts.collectionItems, language)} {t.backupCollectionItems}</span>
        <span>{fmt(backupPreview.counts.reviewRecords, language)} {t.backupReviews}</span>
        {backupPreview.store.collections.slice(0, 10).map(collection => <span key={collection.id}>{collection.name} · {fmt(collection.characters.length, language)}</span>)}
        {backupPreview.counts.collections > 10 && <span>{isFa ? fmt(backupPreview.counts.collections - 10, language) + " مجموعهٔ دیگر" : fmt(backupPreview.counts.collections - 10, language) + " more collections"}</span>}
      </div>}
      {backupError && <p className="data-management-error" role="alert">{backupError}</p>}
      {dataMessage && <p className="data-management-message" role="status">{dataMessage}</p>}
    </section>}

    <main id="main-content" className="page-content">
      {storageWarning && <div className="status-banner" role="status">{t.storageWarning}</div>}
      {page === "today" && <section className="today-page" aria-labelledby="today-title">
        <div className="today-heading"><p className="eyebrow">{t.kicker}</p><h1 id="today-title">{t.headline}</h1><p className="lede">{t.intro}</p></div>
        <section className="study-overview" aria-label={isFa ? "خلاصهٔ یادگیری" : "Study summary"}>
          <div className="overview-primary">
            <div className="overview-copy">
              <p className="section-kicker">{t.shortSession}</p><h2>{dueLabel}</h2>
              <p>{dueCount > 0 ? (isFa ? "اول مرورهای موعدرسیده را انجام بده؛ بعد سراغ کانجی تازه برو." : "Clear due reviews first, then meet new kanji.") : fmt(starterNew, language) + " " + t.newAvailable}</p>
              <button className="button-primary" type="button" onClick={startSession}>{t.start}<span aria-hidden="true">{isFa ? "←" : "→"}</span></button>
            </div>
            <div className="hero-kanji"><span className="hero-kanji-glyph" lang="ja">日</span><span className="hero-kanji-label">{t.sun}</span><span className="hero-kanji-note">{isFa ? "یک نشانه، چند کاربرد." : "One character, several uses."}</span></div>
          </div>
          {isFirstSession ? <div className="first-session-note"><span className="first-session-mark" aria-hidden="true">一</span><div><strong>{t.firstSessionTitle}</strong><span>{t.firstSessionText}</span></div></div> : <div className="overview-metrics">
            <div><strong>{fmt(dueCount, language)}</strong><span>{t.due}</span></div>
            <div><strong>{fmt(learnedCount, language)}</strong><span>{t.learned}</span></div>
            <div><strong>{fmt(store.bookmarks.length, language)}</strong><span>{t.saved}</span></div>
          </div>}
        </section>
        <section className="today-editorial" aria-label={isFa ? "یادگیری در کاربرد" : "Kanji in use"}>
          <div className="editorial-example"><div className="editorial-label"><span className="red-rule" />{t.editorial}</div><div className="editorial-word" lang="ja" dir="ltr">日本 <span>にほん</span></div><p>{isFa ? "ژاپن" : "Japan"}</p></div>
          <div className="editorial-note"><p>{t.featuredNote}</p><p className="quiet-note">{t.missedDay}</p></div>
        </section>
        <div className="today-footer"><span>{t.starter}: {fmt(STARTER_CHARACTERS.length, language)}</span><span>{t.sourceOrder}: {isFa ? "فراوانی روزنامه‌ای" : "newspaper frequency"}</span></div>
      </section>}

      {page === "learn" && <section className="learn-page" aria-labelledby="learn-title">
        <div className="learn-topline"><button className="text-link" type="button" onClick={() => setPage("today")}>{isFa ? "←" : "→"} {t.back}</button><h1 className="eyebrow" id="learn-title">{t.recall}</h1></div>
        {currentItem ? <>
          <div className="session-progress-line"><span className="session-counter" dir="ltr">{fmt(Math.min(sessionIndex + 1, queue.length), language)} / {fmt(queue.length, language)}</span><span>{t.progress}</span><div className="progress-track" role="progressbar" aria-label={t.progress} aria-valuemin={0} aria-valuemax={queue.length} aria-valuenow={Math.min(sessionIndex, queue.length)}><span style={{ width: (queue.length ? (sessionIndex / queue.length) * 100 : 0) + "%" }} /></div></div>
          <article className={"learning-sheet " + (revealed ? "is-revealed" : "")}>
            <div className="learning-sheet-top"><span>{STARTER_CHARACTERS.some(character => character === currentItem.character) ? t.starter : t.explore}</span><button className={"bookmark-button " + (savedSet.has(currentItem.character) ? "is-saved" : "")} type="button" onClick={() => toggleBookmark(currentItem.character)} aria-pressed={savedSet.has(currentItem.character)} aria-label={savedSet.has(currentItem.character) ? t.removeSaved : t.bookmark}><svg className="bookmark-icon" viewBox="0 0 24 24" aria-hidden="true" fill={savedSet.has(currentItem.character) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3.75h12v16.5L12 16.5l-6 3.75z" /></svg><span>{savedSet.has(currentItem.character) ? t.savedLabel : t.bookmark}</span></button></div>
            <div className="prompt-area"><div className="prompt-kanji" lang="ja">{currentItem.character}</div><p className="prompt-question">{t.question}</p>{!revealed && <p className="prompt-hint">{t.hint}</p>}</div>
            {revealed ? <div className="answer-area" aria-live="polite">
              <div className="answer-heading"><span className="section-kicker">{glossFor(currentItem.character, language) ? t.meaning : t.sourceMeaning}</span><h2>{glossFor(currentItem.character, language) ?? currentItem.meaning[0] ?? "—"}</h2><p className="content-caveat">{glossFor(currentItem.character, language) ? t.glossNotice : t.sourceDisclaimer}</p></div>
              <div className="answer-readings"><div><span>{t.on}</span><strong lang="ja" dir="ltr">{currentItem.on.slice(0, 3).join(" · ") || "—"}</strong></div><div><span>{t.kun}</span><strong lang="ja" dir="ltr">{currentItem.kun.slice(0, 3).join(" · ") || "—"}</strong></div></div>
              {(EXAMPLES[currentItem.character] ?? []).length > 0 && <div className="vocabulary-example"><p className="section-kicker">{t.example}</p>{(EXAMPLES[currentItem.character] ?? []).slice(0, 2).map(example => <div className="vocab-row" key={example.word}><strong lang="ja" dir="ltr">{example.word}</strong><span lang="ja" dir="ltr">{example.reading}</span><span>{language === "fa" ? example.fa : example.en}</span></div>)}</div>}
              <div className="rating-area"><p>{t.askRating}</p><div className="rating-grid" dir="ltr">{(["Again", "Hard", "Good", "Easy"] as const).map((rating, index) => <button key={rating} className={"rating-button rating-" + rating.toLowerCase()} type="button" disabled={rateBusy} onClick={() => applyRating(rating)} title={RATING_HINTS[language][rating]} aria-label={t[rating] + " — " + RATING_HINTS[language][rating]}><strong>{t[rating]}</strong><small>{index + 1}</small></button>)}</div></div>
            </div> : <div className="reveal-area"><button className="button-primary reveal-button" type="button" onClick={() => setRevealed(true)}>{t.reveal}<span aria-hidden="true">↵</span></button><span className="keyboard-hint">Space</span></div>}
          </article>
        </> : queue.length > 0 && sessionRated > 0 ? <section className="session-complete"><span className="completion-mark" aria-hidden="true">✓</span><p className="eyebrow">{t.recall}</p><h1>{t.complete}</h1><p>{t.completeText}</p><div className="completion-total"><strong>{fmt(sessionRated, language)}</strong><span>{t.progress}</span></div><button className="button-primary" type="button" onClick={() => { setPage("today"); setNow(new Date()); }}>{t.back}<span aria-hidden="true">←</span></button></section> : <section className="session-complete session-empty"><span className="completion-mark" aria-hidden="true">日</span><h1>{t.empty}</h1><p>{t.emptyHelp}</p><button className="button-primary" type="button" onClick={() => setPage("explore")}>{t.browse}<span aria-hidden="true">←</span></button></section>}
      </section>}

      {page === "explore" && <section className="explore-page" aria-labelledby="explore-title">
        <div className="explore-heading"><p className="eyebrow">{t.explore}</p><h1 id="explore-title">{t.searchTitle}</h1><p className="lede">{t.searchHelp}</p></div>
        <div className="explore-tools">
          <label className="search-field"><span className="visually-hidden">{t.searchTitle}</span><span className="search-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="10.8" cy="10.8" r="6.6" /><path d="m16 16 4.2 4.2" /></svg></span><input value={query} onChange={event => setQuery(event.target.value)} placeholder={t.searchPlaceholder} autoComplete="off" />{query && <button type="button" className="clear-search" aria-label={t.clear} onClick={() => setQuery("")}>×</button>}</label>
          <div className="filter-row">
            <label><span className="visually-hidden">{t.allLevels}</span><select value={level} onChange={event => setLevel(event.target.value)}><option value="all">{t.allLevels}</option>{(["N5", "N4", "N3", "N2", "N1"]).map(item => <option key={item} value={item}>{item}</option>)}</select></label>
            <label><span className="visually-hidden">{t.allTopics}</span><select value={topicId} onChange={event => setTopicId(event.target.value)}><option value="all">{t.allTopics}</option>{TOPICS.map(topic => <option key={topic.id} value={topic.id}>{localizedTopic(topic, language)}</option>)}</select></label>
            <label className="saved-filter"><input type="checkbox" checked={onlySaved} onChange={event => setOnlySaved(event.target.checked)} /><span>{t.savedOnly}</span></label>
          </div>
          <p className="result-count">{fmt(filteredKanji.length, language)} {t.results}</p>
        </div>
        <div className="collections-entry">
          <button className="collections-toggle" type="button" aria-expanded={collectionsOpen} onClick={() => setCollectionsOpen(open => !open)}>
            <span>{t.collectionsLabel}</span><span className="collections-count">{fmt(store.collections.length, language)}</span><span aria-hidden="true">{collectionsOpen ? "−" : "+"}</span>
          </button>
          {activeCollectionId && <p className="collection-filter-status">{t.collectionFilterHint} <button className="text-link" type="button" onClick={() => setActiveCollectionId(null)}>{t.allCharacters}</button></p>}
          {collectionsOpen && <section className="collections-panel" aria-labelledby="collections-heading">
            <div className="collections-panel-heading">
              <div><h2 id="collections-heading">{t.collectionsLabel}</h2><p>{t.collectionHelp}</p></div>
              <button className="text-link" type="button" onClick={() => setActiveCollectionId(null)}>{t.allCharacters}</button>
            </div>
            <form className="collection-create-form" onSubmit={event => { event.preventDefault(); createNamedCollection(); }}>
              <label className="collection-name-field">
                <span>{t.collectionName}</span>
                <input value={newCollectionName} onChange={event => setNewCollectionName(event.target.value)} maxLength={60} placeholder={t.collectionPlaceholder} />
              </label>
              <button className="button-secondary collection-create-button" type="submit">{t.createCollection}</button>
            </form>
            {collectionMessage && <p className="collection-message" role="status">{collectionMessage}</p>}
            {store.collections.length === 0
              ? <p className="collection-empty">{t.collectionEmpty}</p>
              : <div className="collection-list">
                {store.collections.map(collection => <article className={"collection-row " + (activeCollectionId === collection.id ? "is-active" : "")} key={collection.id}>
                  {editingCollectionId === collection.id
                    ? <form className="collection-rename-form" onSubmit={event => { event.preventDefault(); renameNamedCollection(collection.id); }}>
                        <label className="collection-name-field">
                          <span>{t.collectionName}</span>
                          <input autoFocus value={editingCollectionName} onChange={event => setEditingCollectionName(event.target.value)} maxLength={60} />
                        </label>
                        <button className="button-secondary" type="submit">{t.saveCollectionName}</button>
                        <button className="text-link" type="button" onClick={() => { setEditingCollectionId(null); setEditingCollectionName(""); }}>{t.cancelCollectionRename}</button>
                      </form>
                    : <button className="collection-open" type="button" aria-pressed={activeCollectionId === collection.id} onClick={() => setActiveCollectionId(current => current === collection.id ? null : collection.id)}>
                        <strong>{collection.name}</strong><span>{fmt(collection.characters.length, language)}</span>
                      </button>}
                  <div className="collection-actions">
                    <button className="text-link" type="button" disabled={collection.characters.length === 0} onClick={() => beginCollectionStudy(collection.id)}>{t.studyCollection}</button>
                    <button className="text-link" type="button" onClick={() => { setEditingCollectionId(collection.id); setEditingCollectionName(collection.name); }}>{t.renameCollection}</button>
                    <button className="text-link" type="button" disabled={collection.characters.length === 0} onClick={() => clearNamedCollection(collection.id)}>{t.clearCollection}</button>
                    <button className="text-link collection-delete" type="button" onClick={() => {
                      if (!window.confirm(t.deleteConfirm)) return;
                      setStore(previous => deleteCollection(previous, collection.id));
                      setActiveCollectionId(current => current === collection.id ? null : current);
                      setCollectionTargetId(current => current === collection.id ? "" : current);
                      setEditingCollectionId(current => current === collection.id ? null : current);
                      setCollectionMessage(t.collectionDeleted);
                    }}>{t.deleteCollection}</button>
                  </div>
                </article>)}
              </div>}
          </section>}
        </div>
        <div className={"explore-layout" + (mobileDetailOpen ? " is-mobile-detail" : "")}>
          <section className="kanji-results" aria-label={t.explore}>
            <p className="result-count" role="status">{t.showingResults} {fmt(Math.min(visibleResultCount, filteredKanji.length), language)} {t.ofResults} {fmt(filteredKanji.length, language)} {t.results}</p>
            {filteredKanji.slice(0, visibleResultCount).map(item => {
              const gloss = glossFor(item.character, language);
              const reading = item.on[0] ?? item.kun[0] ?? "";
              return <button ref={item.character === selectedCharacter ? selectedResultRef : undefined} key={item.character} type="button" className={"kanji-result " + (selectedCharacter === item.character ? "is-selected" : "")} onClick={() => {
                const isMobile = window.matchMedia("(max-width: 680px)").matches;
                setSelectedCharacter(item.character);
                if (isMobile) {
                  mobileDetailScrollYRef.current = window.scrollY;
                  const currentState = window.history.state;
                  const baseState = currentState && typeof currentState === "object" ? currentState as Record<string, unknown> : {};
                  window.history.pushState({ ...baseState, rinemiMobileDetail: true }, "");
                  mobileDetailOpenRef.current = true;
                }
                setMobileDetailOpen(isMobile);
              }} aria-pressed={selectedCharacter === item.character}>
                <span className="result-glyph" lang="ja">{item.character}</span><span className="result-copy"><strong lang={gloss ? language : "en"} dir="auto">{gloss ?? item.meaning.slice(0, 2).join(" · ")}</strong>{reading && <small className="result-reading" lang="ja" dir="ltr">{reading}</small>}<small className="result-metadata">{item.jlpt ?? "Jōyō"} · {fmt(item.strokes, language)} {t.strokes.toLocaleLowerCase()}</small></span>{savedSet.has(item.character) && <span className="saved-dot" aria-label={t.savedLabel}>♥</span>}
              </button>;
            })}
            {filteredKanji.length === 0 && <div className="no-results"><span aria-hidden="true">⌕</span><p>{t.noResults}</p><button className="text-link" type="button" onClick={() => { setQuery(""); setLevel("all"); setTopicId("all"); setOnlySaved(false); setActiveCollectionId(null); }}>{t.clear}</button></div>}
            {filteredKanji.length > visibleResultCount && <button className="button-secondary load-more-results" type="button" onClick={() => setVisibleResultCount(count => Math.min(count + 60, filteredKanji.length))}>{t.moreResults} · {fmt(Math.min(60, filteredKanji.length - visibleResultCount), language)}</button>}
          </section>
          {selectedItem && <aside ref={detailRef} tabIndex={-1} className="kanji-detail" aria-labelledby="detail-title">
            <div className="detail-topline"><span className="eyebrow">{t.detail}</span><button type="button" className={"detail-close" + (mobileDetailOpen ? " detail-back" : "")} onClick={() => {
              if (mobileDetailOpen && window.matchMedia("(max-width: 680px)").matches) closeMobileDetail();
              else { setSelectedCharacter(null); mobileDetailOpenRef.current = false; setMobileDetailOpen(false); }
            }} aria-label={mobileDetailOpen && window.matchMedia("(max-width: 680px)").matches ? t.backToResults : t.close}><span className="detail-close-glyph" aria-hidden="true">{mobileDetailOpen && window.matchMedia("(max-width: 680px)").matches ? "←" : "×"}</span><span className="detail-back-label">{t.backToResults}</span></button></div>
            <div className="detail-character" lang="ja">{selectedItem.character}</div><h2 id="detail-title">{selectedGloss ?? selectedItem.meaning.slice(0, 2).join(" · ")}</h2><p className="content-caveat">{selectedGloss ? t.glossNotice : t.sourceDisclaimer}</p>
            <div className="detail-property"><span>{t.on}</span><strong lang="ja" dir="ltr">{selectedItem.on.slice(0, 5).join(" · ") || "—"}</strong></div><div className="detail-property"><span>{t.kun}</span><strong lang="ja" dir="ltr">{selectedItem.kun.slice(0, 5).join(" · ") || "—"}</strong></div>
            {(EXAMPLES[selectedItem.character] ?? []).length > 0 && <section className="detail-examples"><p className="section-kicker">{t.example}</p>{(EXAMPLES[selectedItem.character] ?? []).map(example => <div className="detail-example" key={example.word}><strong lang="ja" dir="ltr">{example.word}</strong><span lang="ja" dir="ltr">{example.reading}</span><small>{language === "fa" ? example.fa : example.en}</small></div>)}</section>}
            <div className="detail-facts"><div><span>{t.strokes}</span><strong>{fmt(selectedItem.strokes, language)}</strong></div><div><span>{t.grade}</span><strong>{selectedItem.grade ? fmt(selectedItem.grade, language) : "—"}</strong></div><div><span>{t.jlpt}</span><strong>{selectedItem.jlpt ?? "—"}</strong></div><div><span>{t.frequency}</span><strong>{fmt(selectedItem.frequency, language)}</strong></div></div>
            <button className={"button-secondary detail-bookmark " + (savedSet.has(selectedItem.character) ? "is-saved" : "")} type="button" onClick={() => toggleBookmark(selectedItem.character)} aria-pressed={savedSet.has(selectedItem.character)}>{savedSet.has(selectedItem.character) ? t.removeSaved : t.bookmark}</button>
            {store.collections.length > 0 ? <div className="detail-collection-control">
              <label><span>{t.addToCollection}</span><select value={collectionTargetId} onChange={event => setCollectionTargetId(event.target.value)}>
                <option value="">—</option>
                {store.collections.map(collection => <option key={collection.id} value={collection.id}>{collection.name}</option>)}
              </select></label>
              {collectionTargetId && <button className="button-secondary" type="button" onClick={() => toggleCollectionCharacter(collectionTargetId, selectedItem.character)}>
                {store.collections.find(collection => collection.id === collectionTargetId)?.characters.includes(selectedItem.character) ? t.removeFromCollection : t.addToCollection}
              </button>}
            </div> : <button className="text-link detail-study" type="button" onClick={() => { setCollectionsOpen(true); setCollectionMessage(""); }}>{t.createFirstCollection}</button>}
            {STARTER_CHARACTERS.some(character => character === selectedItem.character) && <button className="text-link detail-study" type="button" onClick={() => { ratingLockRef.current = null; setQueue([selectedItem.character]); setSessionIndex(0); setSessionRated(0); setRevealed(false); setPage("learn"); }}>{t.practice} ←</button>}
          </aside>}
        </div>
        <div className="data-note"><strong>{isFa ? "دادهٔ مرجع" : "Source data"}:</strong> {t.contentNote}</div>
      </section>}
    </main>
    <footer className="app-footer"><span>Rinemi</span><a href="https://github.com/ArdKam/Rinemi2/issues" target="_blank" rel="noreferrer">{t.feedback}</a></footer>
  </div>;
}
