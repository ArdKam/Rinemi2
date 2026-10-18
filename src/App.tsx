import { useEffect, useMemo, useRef, useState } from "react";
import sourceDataset from "./data/kanji.json";
import topicDataset from "./data/kanji-topics.json";
import { EXAMPLES, PERSIAN_GLOSSES, STARTER_CHARACTERS } from "./content";
import { buildSessionQueue, countDueReviews, loadStore, persistStore, recordRating, type AppStore, type ReviewRating } from "./study";

type Kanji = { id: string; character: string; meaning: string[]; on: string[]; kun: string[]; strokes: number; grade: number; jlpt: string | null; frequency: number; order: number };
type Topic = { id: string; label: { fa: string; en: string }; characters: string };
type Language = "fa" | "en";
type Page = "today" | "learn" | "explore";
const KANJI = (sourceDataset as unknown as { kanji: Kanji[] }).kanji;
const TOPICS = (topicDataset as unknown as { topics: Topic[] }).topics;
const BY_CHARACTER = new Map(KANJI.map(item => [item.character, item]));
const TOPIC_MEMBERS = new Map(TOPICS.map(topic => [topic.id, new Set(topic.characters.trim().split(/\s+/))]));

const COPY = {
  fa: {
    today: "امروز", learn: "یادگیری", explore: "کاوش", brand: "کانجی، با درک و کاربرد",
    kicker: "RINEMI · دفتر یادگیری ژاپنی", headline: "امروز، یک قدم به خواندن نزدیک‌تر.",
    intro: "مرورهای موعدرسیده را انجام بده و چند کانجی تازه را در واژه‌های واقعی ببین.",
    start: "شروع یادگیری", due: "مرور موعدرسیده", learned: "کانجی‌های مرورشده", saved: "ذخیره‌شده‌ها",
    shortSession: "تمرین کوتاه امروز", newAvailable: "کانجی تازه از مجموعهٔ آغازین در دسترس است.",
    sun: "خورشید؛ روز", editorial: "از یک نشانه شروع کن", featuredNote: "日 در واژه‌هایی مثل 日本 و 毎日 دیده می‌شود؛ خواندن آن به واژه بستگی دارد.",
    missedDay: "جلسه‌ها کوتاه و پیوسته‌اند. روزی که برنگشتی، چیزی را از دست نداده‌ای.",
    starter: "مجموعهٔ آغازین فارسی", sourceOrder: "ترتیب فراوانی منبع",
    recall: "تمرین یادآوری", question: "معنای اصلی این کانجی چیست؟", reveal: "نمایش پاسخ",
    hint: "اول خودت پاسخ را به یاد بیاور؛ بعد آن را آشکار کن.", meaning: "معنای فارسی آغازین", glossNotice: "این توضیح اولیه هنوز بازبینی انسانی نشده است.", sourceMeaning: "معنای انگلیسی مرجع",
    on: "اون‌یومی", kun: "کون‌یومی", example: "در یک واژه", askRating: "چقدر راحت به یاد آوردی؟",
    Again: "دوباره", Hard: "سخت", Good: "خوب", Easy: "آسان",
    complete: "این بخش تمام شد.", completeText: "پاسخ‌ها ذخیره شدند و زمان مرور بعدی با FSRS محاسبه می‌شود.",
    empty: "فعلاً مرور موعدرسیده یا کانجی تازه‌ای از مجموعهٔ آغازین باقی نمانده است.",
    emptyHelp: "از کاوش می‌توانی کانجی‌ها را پیدا و ذخیره کنی. مجموعهٔ آغازین فارسی پس از بازبینی محتوا گسترش پیدا می‌کند.",
    browse: "کاوش کانجی‌ها", back: "بازگشت به امروز", progress: "کانجی",
    searchTitle: "کانجی را پیدا کن.", searchHelp: "با خود کانجی، خوانش، معنی انگلیسی یا توضیح فارسی جست‌وجو کن.",
    searchPlaceholder: "مثلاً 日، nichi، خورشید…", allLevels: "همهٔ سطوح JLPT",
    allTopics: "همهٔ موضوع‌ها", savedOnly: "فقط ذخیره‌شده‌ها", results: "نتیجه",
    noResults: "چیزی پیدا نشد.", clear: "پاک کردن فیلترها", bookmark: "ذخیره", savedLabel: "ذخیره شد",
    removeSaved: "حذف از ذخیره‌ها", detail: "جزئیات کانجی", close: "بستن جزئیات",
    strokes: "تعداد خط", grade: "پایهٔ آموزشی", jlpt: "سطح JLPT", frequency: "بسامد",
    notReviewed: "توضیح فارسیِ بازبینی‌شده برای این کانجی هنوز آماده نیست.",
    sourceDisclaimer: "این معنا از واژه‌نامهٔ مرجع آمده و ترجمهٔ فارسیِ تأییدشده محسوب نمی‌شود.",
    langSwitch: "English", dark: "حالت تیره", light: "حالت روشن",
    storageWarning: "ذخیره‌سازی محلی در دسترس نیست یا دادهٔ ذخیره‌شده قابل‌خواندن نیست. تغییرها ممکن است ذخیره نشوند.",
    contentNote: "دادهٔ پایه از KANJIDIC2 آمده است. توضیح‌های فارسی فعلاً فقط برای مجموعهٔ آغازین نوشته شده‌اند و پیش از انتشار عمومی باید بازبینی شوند.",
    feedback: "بازخورد", feedbackCopy: "این نسخهٔ آغازین هنوز به بازبینی محتوایی نیاز دارد.",
    practice: "تمرین همین کانجی"
  },
  en: {
    today: "Today", learn: "Learn", explore: "Explore", brand: "Kanji through meaning and use",
    kicker: "RINEMI · JAPANESE STUDY JOURNAL", headline: "One step closer to reading Japanese.",
    intro: "Clear due reviews, then meet new kanji through useful vocabulary.",
    start: "Start studying", due: "Reviews due", learned: "Kanji reviewed", saved: "Saved",
    shortSession: "Today's short session", newAvailable: "new characters are available from the starter set.",
    sun: "sun; day", editorial: "Start with one character", featuredNote: "日 appears in words such as 日本 and 毎日. Its reading depends on the word.",
    missedDay: "Study in short, steady sessions. Missing a day does not mean you have failed.",
    starter: "Persian starter set", sourceOrder: "Source frequency order",
    recall: "Active recall", question: "What is the central meaning of this kanji?", reveal: "Reveal answer",
    hint: "Try to retrieve the answer first, then reveal it.", meaning: "Starter Persian gloss", glossNotice: "This editorial seed has not yet been human-reviewed.", sourceMeaning: "English source gloss",
    on: "ON'YOMI", kun: "KUN'YOMI", example: "In a word", askRating: "How easily did you recall it?",
    Again: "Again", Hard: "Hard", Good: "Good", Easy: "Easy",
    complete: "This session is complete.", completeText: "Your ratings were saved and the next review is scheduled by FSRS.",
    empty: "No due reviews or new characters from the starter set are available right now.",
    emptyHelp: "Explore and bookmark kanji. The Persian-supported starter set will expand after content review.",
    browse: "Explore kanji", back: "Back to Today", progress: "kanji",
    searchTitle: "Find a kanji.", searchHelp: "Search by character, reading, English gloss, or reviewed Persian meaning.",
    searchPlaceholder: "Try 日, nichi, sun…", allLevels: "All JLPT levels",
    allTopics: "All topics", savedOnly: "Saved only", results: "results",
    noResults: "No matches found.", clear: "Clear filters", bookmark: "Save", savedLabel: "Saved",
    removeSaved: "Remove saved item", detail: "Kanji details", close: "Close details",
    strokes: "Strokes", grade: "School grade", jlpt: "JLPT level", frequency: "Frequency",
    notReviewed: "A reviewed Persian explanation is not available for this kanji yet.",
    sourceDisclaimer: "This is a source gloss, not a reviewed Persian learner explanation.",
    langSwitch: "فارسی", dark: "Dark mode", light: "Light mode",
    storageWarning: "Local storage is unavailable or saved data could not be read. Changes may not persist.",
    contentNote: "The base dataset is derived from KANJIDIC2. Persian explanations currently cover only the starter set and require review before public release.",
    feedback: "Feedback", feedbackCopy: "This early build still needs content review.",
    practice: "Practice this kanji"
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
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>("日");
  const [queue, setQueue] = useState<string[]>([]);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionRated, setSessionRated] = useState(0);
  const [rateBusy, setRateBusy] = useState(false);
  const ratingLockRef = useRef(false);
  const [now, setNow] = useState(() => new Date());
  const language = store.language;
  const isFa = language === "fa";
  const t = COPY[language];
  const currentCharacter = queue[sessionIndex] ?? null;
  const currentItem = currentCharacter ? BY_CHARACTER.get(currentCharacter) ?? null : null;
  const dueCount = countDueReviews(store, now);
  const learnedCount = Object.keys(store.reviews).length;

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isFa ? "rtl" : "ltr";
    document.documentElement.dataset.theme = store.theme;
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
      if (!needle) return true;
      const gloss = PERSIAN_GLOSSES[item.character];
      const haystack = [item.character, ...item.meaning, ...item.on, ...item.kun, item.jlpt ?? "", gloss?.fa ?? "", gloss?.en ?? ""].join(" ").toLocaleLowerCase();
      return haystack.includes(needle);
    }).sort((a, b) => a.order - b.order);
  }, [query, level, topicId, onlySaved, store.bookmarks]);

  function startSession() {
    const nextQueue = buildSessionQueue(store, KANJI, STARTER_CHARACTERS, new Date());
    setQueue(nextQueue); setSessionIndex(0); setRevealed(false); setSessionRated(0); setPage("learn");
  }
  function applyRating(rating: ReviewRating) {
    if (!currentCharacter || !revealed || rateBusy || ratingLockRef.current) return;
    ratingLockRef.current = true;
    setRateBusy(true);
    try {
      setStore(previous => recordRating(previous, currentCharacter, rating, new Date()));
      setSessionRated(value => value + 1);
      setSessionIndex(index => index + 1);
      setRevealed(false);
      setNow(new Date());
    } catch { setStorageWarning(true); }
    finally { ratingLockRef.current = false; setRateBusy(false); }
  }
  function toggleBookmark(character: string) {
    setStore(previous => {
      const exists = previous.bookmarks.includes(character);
      return { ...previous, bookmarks: exists ? previous.bookmarks.filter(item => item !== character) : [...previous.bookmarks, character] };
    });
  }
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (page !== "learn" || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      if (target instanceof HTMLElement && (target.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(target.tagName))) return;
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
        <span className="brand-mark-shell" aria-hidden="true"><img className="brand-mark-light" src="/brand/rinemi-mark.svg" alt="" /><img className="brand-mark-dark" src="/brand/rinemi-mark-dark.svg" alt="" /></span>
        <span className="brand-copy"><strong>Rinemi</strong><span>{t.brand}</span></span>
      </button>
      <nav className="primary-nav" aria-label={isFa ? "ناوبری اصلی" : "Primary navigation"}>
        <button type="button" className={"nav-link " + (page === "today" ? "is-active" : "")} aria-current={page === "today" ? "page" : undefined} onClick={() => setPage("today")}>{t.today}</button>
        <button type="button" className={"nav-link " + (page === "learn" ? "is-active" : "")} aria-current={page === "learn" ? "page" : undefined} onClick={() => setPage("learn")}>{t.learn}</button>
        <button type="button" className={"nav-link " + (page === "explore" ? "is-active" : "")} aria-current={page === "explore" ? "page" : undefined} onClick={() => setPage("explore")}>{t.explore}</button>
      </nav>
      <div className="header-tools">
        <button className="utility-button language-switch" type="button" onClick={() => setStore(previous => ({ ...previous, language: isFa ? "en" : "fa" }))} aria-label={isFa ? "Switch to English" : "تغییر به فارسی"}>{t.langSwitch}</button>
        <button className="utility-button theme-switch" type="button" onClick={() => setStore(previous => ({ ...previous, theme: previous.theme === "dark" ? "light" : "dark" }))} aria-label={store.theme === "dark" ? t.light : t.dark}>
          <span aria-hidden="true">{store.theme === "dark" ? "☼" : "◐"}</span><span className="utility-label">{store.theme === "dark" ? t.light : t.dark}</span>
        </button>
      </div>
    </header>

    {storageWarning && <div className="status-banner" role="status">{t.storageWarning}</div>}

    <main id="main-content" className="page-content">
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
          <div className="overview-metrics">
            <div><strong>{fmt(dueCount, language)}</strong><span>{t.due}</span></div>
            <div><strong>{fmt(learnedCount, language)}</strong><span>{t.learned}</span></div>
            <div><strong>{fmt(store.bookmarks.length, language)}</strong><span>{t.saved}</span></div>
          </div>
        </section>
        <section className="today-editorial" aria-label={isFa ? "یادگیری در کاربرد" : "Kanji in use"}>
          <div className="editorial-example"><div className="editorial-label"><span className="red-rule" />{t.editorial}</div><div className="editorial-word" lang="ja" dir="ltr">日本 <span>にほん</span></div><p>{isFa ? "ژاپن" : "Japan"}</p></div>
          <div className="editorial-note"><p>{t.featuredNote}</p><p className="quiet-note">{t.missedDay}</p></div>
        </section>
        <div className="today-footer"><span>{t.starter}: {fmt(STARTER_CHARACTERS.length, language)}</span><span>{t.sourceOrder}: {isFa ? "فراوانی روزنامه‌ای" : "newspaper frequency"}</span></div>
      </section>}

      {page === "learn" && <section className="learn-page" aria-labelledby="learn-title">
        <div className="learn-topline"><button className="text-link" type="button" onClick={() => setPage("today")}>← {t.back}</button><p className="eyebrow" id="learn-title">{t.recall}</p></div>
        {currentItem ? <>
          <div className="session-progress-line"><span>{fmt(Math.min(sessionIndex + 1, queue.length), language)} / {fmt(queue.length, language)} {t.progress}</span><div className="progress-track" role="progressbar" aria-label={t.progress} aria-valuemin={0} aria-valuemax={queue.length} aria-valuenow={Math.min(sessionIndex, queue.length)}><span style={{ width: (queue.length ? (sessionIndex / queue.length) * 100 : 0) + "%" }} /></div></div>
          <article className={"learning-sheet " + (revealed ? "is-revealed" : "")}>
            <div className="learning-sheet-top"><span>{STARTER_CHARACTERS.some(character => character === currentItem.character) ? t.starter : t.explore}</span><button className={"bookmark-button " + (savedSet.has(currentItem.character) ? "is-saved" : "")} type="button" onClick={() => toggleBookmark(currentItem.character)} aria-pressed={savedSet.has(currentItem.character)} aria-label={savedSet.has(currentItem.character) ? t.removeSaved : t.bookmark}><span aria-hidden="true">{savedSet.has(currentItem.character) ? "♥" : "♡"}</span><span>{savedSet.has(currentItem.character) ? t.savedLabel : t.bookmark}</span></button></div>
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
          <label className="search-field"><span className="visually-hidden">{t.searchTitle}</span><span className="search-icon" aria-hidden="true">⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder={t.searchPlaceholder} autoComplete="off" />{query && <button type="button" className="clear-search" aria-label={t.clear} onClick={() => setQuery("")}>×</button>}</label>
          <div className="filter-row">
            <label><span className="visually-hidden">{t.allLevels}</span><select value={level} onChange={event => setLevel(event.target.value)}><option value="all">{t.allLevels}</option>{(["N5", "N4", "N3", "N2", "N1"]).map(item => <option key={item} value={item}>{item}</option>)}</select></label>
            <label><span className="visually-hidden">{t.allTopics}</span><select value={topicId} onChange={event => setTopicId(event.target.value)}><option value="all">{t.allTopics}</option>{TOPICS.map(topic => <option key={topic.id} value={topic.id}>{localizedTopic(topic, language)}</option>)}</select></label>
            <label className="saved-filter"><input type="checkbox" checked={onlySaved} onChange={event => setOnlySaved(event.target.checked)} /><span>{t.savedOnly}</span></label>
          </div>
          <p className="result-count">{fmt(filteredKanji.length, language)} {t.results}</p>
        </div>
        <div className="explore-layout">
          <div className="kanji-results" role="list" aria-label={t.explore}>
            {filteredKanji.slice(0, 240).map(item => {
              const gloss = glossFor(item.character, language);
              return <button role="listitem" key={item.character} type="button" className={"kanji-result " + (selectedCharacter === item.character ? "is-selected" : "")} onClick={() => setSelectedCharacter(item.character)} aria-pressed={selectedCharacter === item.character}>
                <span className="result-glyph" lang="ja">{item.character}</span><span className="result-copy"><strong>{gloss ?? item.meaning.slice(0, 2).join(" · ")}</strong><small>{item.jlpt ?? "Jōyō"} · {fmt(item.strokes, language)} {t.strokes.toLocaleLowerCase()}</small></span>{savedSet.has(item.character) && <span className="saved-dot" aria-label={t.savedLabel}>♥</span>}
              </button>;
            })}
            {filteredKanji.length === 0 && <div className="no-results"><span aria-hidden="true">⌕</span><p>{t.noResults}</p><button className="text-link" type="button" onClick={() => { setQuery(""); setLevel("all"); setTopicId("all"); setOnlySaved(false); }}>{t.clear}</button></div>}
            {filteredKanji.length > 240 && <p className="list-limit">{isFa ? "برای سبک‌ماندن فهرست، ۲۴۰ نتیجهٔ نخست نمایش داده می‌شود؛ جست‌وجو را دقیق‌تر کن." : "The first 240 results are shown for responsiveness. Narrow your search."}</p>}
          </div>
          {selectedItem && <aside className="kanji-detail" aria-labelledby="detail-title">
            <div className="detail-topline"><span className="eyebrow">{t.detail}</span><button type="button" className="detail-close" onClick={() => setSelectedCharacter(null)} aria-label={t.close}>×</button></div>
            <div className="detail-character" lang="ja">{selectedItem.character}</div><h2 id="detail-title">{selectedGloss ?? selectedItem.meaning.slice(0, 2).join(" · ")}</h2><p className="content-caveat">{selectedGloss ? t.glossNotice : t.sourceDisclaimer}</p>
            <div className="detail-property"><span>{t.on}</span><strong lang="ja" dir="ltr">{selectedItem.on.slice(0, 5).join(" · ") || "—"}</strong></div><div className="detail-property"><span>{t.kun}</span><strong lang="ja" dir="ltr">{selectedItem.kun.slice(0, 5).join(" · ") || "—"}</strong></div>
            {(EXAMPLES[selectedItem.character] ?? []).length > 0 && <section className="detail-examples"><p className="section-kicker">{t.example}</p>{(EXAMPLES[selectedItem.character] ?? []).map(example => <div className="detail-example" key={example.word}><strong lang="ja" dir="ltr">{example.word}</strong><span lang="ja" dir="ltr">{example.reading}</span><small>{language === "fa" ? example.fa : example.en}</small></div>)}</section>}
            <div className="detail-facts"><div><span>{t.strokes}</span><strong>{fmt(selectedItem.strokes, language)}</strong></div><div><span>{t.grade}</span><strong>{selectedItem.grade ? fmt(selectedItem.grade, language) : "—"}</strong></div><div><span>{t.jlpt}</span><strong>{selectedItem.jlpt ?? "—"}</strong></div><div><span>{t.frequency}</span><strong>{fmt(selectedItem.frequency, language)}</strong></div></div>
            <button className={"button-secondary detail-bookmark " + (savedSet.has(selectedItem.character) ? "is-saved" : "")} type="button" onClick={() => toggleBookmark(selectedItem.character)} aria-pressed={savedSet.has(selectedItem.character)}>{savedSet.has(selectedItem.character) ? t.removeSaved : t.bookmark}</button>
            {STARTER_CHARACTERS.some(character => character === selectedItem.character) && <button className="text-link detail-study" type="button" onClick={() => { setQueue([selectedItem.character]); setSessionIndex(0); setSessionRated(0); setRevealed(false); setPage("learn"); }}>{t.practice} ←</button>}
          </aside>}
        </div>
        <div className="data-note"><strong>{isFa ? "دادهٔ مرجع" : "Source data"}:</strong> {t.contentNote}</div>
      </section>}
    </main>
    <footer className="app-footer"><span>Rinemi</span><span>{t.feedbackCopy}</span><a href="https://github.com/ArdKam/Rinemi2/issues" target="_blank" rel="noreferrer">{t.feedback}</a></footer>
  </div>;
}
