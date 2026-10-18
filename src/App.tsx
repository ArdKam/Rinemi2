import { useEffect, useMemo, useState } from "react";

type Locale = "fa" | "en";
type Theme = "light" | "dark";
type View = "today" | "learn" | "explore";

const copy = {
  fa: {
    brandDescriptor: "استودیوی یادگیری کانجی",
    skip: "رفتن به محتوای اصلی",
    themeToDark: "فعال‌کردن حالت تیره",
    themeToLight: "فعال‌کردن حالت روشن",
    languageToEnglish: "تغییر زبان به انگلیسی",
    languageToPersian: "تغییر زبان به فارسی",
    primaryNav: "ناوبری اصلی",
    today: "امروز",
    learn: "یادگیری",
    explore: "جست‌وجو",
    todayEyebrow: "مسیر امروز",
    todayTitle: "با یک قدم کوچک شروع کن.",
    todayDescription: "تمرین کوتاه، روشن و بدون عجله؛ ادامه‌دادن مهم‌تر از کامل‌بودن است.",
    nextSession: "پیشنهاد امروز",
    nextSessionTitle: "یک کانجی را بهتر بشناس.",
    nextSessionDescription: "معنی را بازیابی کن، خوانش را در واژه ببین و بعد سراغ شخصیت بعدی برو.",
    startStudy: "شروع مطالعه",
    progressTitle: "نمای کلی",
    dueLabel: "مرورهای آماده",
    newLabel: "کانجی تازه",
    timeLabel: "زمان پیشنهادی",
    dueValue: "۸",
    newValue: "۳",
    timeValue: "۱۰ دقیقه",
    progressNote: "این اعداد نمونه‌اند و هنوز به دادهٔ واقعی یادگیری متصل نیستند.",
    backToToday: "بازگشت به امروز",
    sessionEyebrow: "تمرین کوتاه",
    learningTitle: "معنی را بازیابی کن",
    cardIndex: "نمونهٔ رابط · ۱ از ۵",
    promptLabel: "معنی این کانجی چیست؟",
    promptHint: "ابتدا از حافظه پاسخ بده؛ سپس پاسخ را بررسی کن.",
    revealAnswer: "نمایش پاسخ",
    answerShown: "پاسخ نمایش داده شد.",
    meaningLabel: "معنی",
    forest: "جنگل",
    onyomiLabel: "خوانش اون",
    kunyomiLabel: "خوانش کون",
    vocabularyLabel: "واژه در بافت",
    word: "森林",
    wordReading: "しんりん",
    wordMeaning: "جنگل انبوه",
    memoryLabel: "یادآوری",
    memoryText: "森 از سه درخت 木 ساخته شده است؛ این ترکیب را به تصویر جنگلی از درخت‌ها پیوند بده.",
    referenceLabel: "جزئیات مرجع",
    ratingsLabel: "ارزیابی پاسخ",
    again: "دوباره",
    hard: "سخت",
    good: "خوب",
    easy: "آسان",
    previewOnly: "این build نمایشی است؛ دکمه‌های ارزیابی هنوز به زمان‌بندی مرور وصل نشده‌اند.",
    ratingPreview: "تعامل ثبت شد؛ زمان‌بندی مرور در این نمونه غیرفعال است.",
    exploreTitle: "کانجی را پیدا کن",
    exploreDescription: "این فهرست کوچک فقط برای بررسی جست‌وجو و چیدمان رابط است.",
    searchLabel: "جست‌وجوی کانجی",
    searchPlaceholder: "کانجی یا معنی را وارد کن",
    searchHelp: "می‌توانی با خود کانجی یا معنی فارسی جست‌وجو کنی.",
    noResults: "موردی با این عبارت پیدا نشد.",
    results: [
      { kanji: "森", meaning: "جنگل", reading: "もり" },
      { kanji: "語", meaning: "زبان؛ واژه", reading: "ご" },
      { kanji: "学", meaning: "یادگیری؛ مطالعه", reading: "がく" }
    ]
  },
  en: {
    brandDescriptor: "A studio for learning kanji",
    skip: "Skip to main content",
    themeToDark: "Switch to dark theme",
    themeToLight: "Switch to light theme",
    languageToEnglish: "Switch language to English",
    languageToPersian: "Switch language to Persian",
    primaryNav: "Primary navigation",
    today: "Today",
    learn: "Learn",
    explore: "Explore",
    todayEyebrow: "Today's path",
    todayTitle: "Start with one small step.",
    todayDescription: "A calm, focused practice. Continuing matters more than being perfect.",
    nextSession: "Today's suggestion",
    nextSessionTitle: "Get to know one kanji better.",
    nextSessionDescription: "Recall its meaning, see a reading in a word, then move to the next character.",
    startStudy: "Start studying",
    progressTitle: "At a glance",
    dueLabel: "Reviews ready",
    newLabel: "New kanji",
    timeLabel: "Suggested time",
    dueValue: "8",
    newValue: "3",
    timeValue: "10 min",
    progressNote: "These figures are illustrative and are not connected to real learning data.",
    backToToday: "Back to Today",
    sessionEyebrow: "Focused practice",
    learningTitle: "Recall the meaning",
    cardIndex: "UI preview · 1 of 5",
    promptLabel: "What does this kanji mean?",
    promptHint: "Try to recall the answer before revealing it.",
    revealAnswer: "Reveal answer",
    answerShown: "Answer revealed.",
    meaningLabel: "Meaning",
    forest: "Forest",
    onyomiLabel: "On'yomi",
    kunyomiLabel: "Kun'yomi",
    vocabularyLabel: "Word in context",
    word: "森林",
    wordReading: "しんりん",
    wordMeaning: "forest; woodland",
    memoryLabel: "Remember",
    memoryText: "森 contains three 木 (tree) components. Link the shape to a small forest of trees.",
    referenceLabel: "Reference details",
    ratingsLabel: "Rate your answer",
    again: "Again",
    hard: "Hard",
    good: "Good",
    easy: "Easy",
    previewOnly: "This is a UI preview; rating controls are not connected to a review scheduler yet.",
    ratingPreview: "Interaction received; review scheduling is disabled in this preview.",
    exploreTitle: "Find a kanji",
    exploreDescription: "This small list exists to test search and layout behavior.",
    searchLabel: "Search kanji",
    searchPlaceholder: "Enter a kanji or meaning",
    searchHelp: "Search with a character or its English meaning.",
    noResults: "No matches found.",
    results: [
      { kanji: "森", meaning: "Forest", reading: "もり" },
      { kanji: "語", meaning: "Language; word", reading: "ご" },
      { kanji: "学", meaning: "Learning; study", reading: "がく" }
    ]
  }
} as const;

type Copy = (typeof copy)[Locale];
type Result = { kanji: string; meaning: string; reading: string };

function TodayView({ t, onStart }: { t: Copy; onStart: () => void }) {
  return (
    <section className="page-section" aria-labelledby="today-heading">
      <header className="page-heading">
        <p className="eyebrow">{t.todayEyebrow}</p>
        <h1 id="today-heading">{t.todayTitle}</h1>
        <p className="page-description">{t.todayDescription}</p>
      </header>

      <section className="next-session" aria-labelledby="next-session-heading">
        <div className="next-session__copy">
          <p className="eyebrow">{t.nextSession}</p>
          <h2 id="next-session-heading">{t.nextSessionTitle}</h2>
          <p>{t.nextSessionDescription}</p>
        </div>
        <div className="next-session__action">
          <span className="next-session__kanji" lang="ja" dir="ltr" aria-label="kanji 森">森</span>
          <button className="button button--primary" type="button" onClick={onStart}>
            {t.startStudy}
          </button>
        </div>
      </section>

      <section className="overview" aria-labelledby="overview-heading">
        <div className="section-heading">
          <h2 id="overview-heading">{t.progressTitle}</h2>
        </div>
        <div className="stats-grid">
          <article className="stat-item">
            <p className="stat-item__label">{t.dueLabel}</p>
            <p className="stat-item__value" dir="ltr">{t.dueValue}</p>
          </article>
          <article className="stat-item">
            <p className="stat-item__label">{t.newLabel}</p>
            <p className="stat-item__value" dir="ltr">{t.newValue}</p>
          </article>
          <article className="stat-item">
            <p className="stat-item__label">{t.timeLabel}</p>
            <p className="stat-item__value stat-item__value--text">{t.timeValue}</p>
          </article>
        </div>
        <p className="small-note">{t.progressNote}</p>
      </section>
    </section>
  );
}

function LearningView({
  t,
  locale,
  onBack
}: {
  t: Copy;
  locale: Locale;
  onBack: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [status, setStatus] = useState("");

  const handleRating = () => {
    setStatus(t.ratingPreview);
  };

  return (
    <section className="learning-layout" aria-labelledby="learning-heading">
      <div className="learning-heading">
        <button className="text-button back-button" type="button" onClick={onBack}>
          <span aria-hidden="true">←</span>
          {t.backToToday}
        </button>
        <div>
          <p className="eyebrow">{t.sessionEyebrow}</p>
          <h1 id="learning-heading">{t.learningTitle}</h1>
        </div>
      </div>

      <article className="study-card" aria-labelledby="card-title">
        <div className="study-card__topline">
          <span className="content-label">{t.sessionEyebrow}</span>
          <span className="card-index">{t.cardIndex}</span>
        </div>

        <div
          className="study-card__body"
          role="region"
          aria-label={revealed ? t.referenceLabel : t.promptLabel}
          tabIndex={0}
          aria-live="polite"
        >
          {!revealed ? (
            <div className="prompt-content">
              <p className="prompt-label">{t.promptLabel}</p>
              <h2 id="card-title" className="prompt-kanji" lang="ja" dir="ltr">森</h2>
              <p className="prompt-hint">{t.promptHint}</p>
            </div>
          ) : (
            <div className="answer-content">
              <section className="answer-core" aria-labelledby="card-title">
                <p className="eyebrow">{t.meaningLabel}</p>
                <div className="answer-core__row">
                  <h2 id="card-title" className="answer-title">{t.forest}</h2>
                  <span className="answer-kanji" lang="ja" dir="ltr" aria-label="森">森</span>
                </div>
              </section>

              <dl className="readings-list">
                <div className="reading-item">
                  <dt>{t.onyomiLabel}</dt>
                  <dd lang="ja" dir="ltr">シン</dd>
                </div>
                <div className="reading-item">
                  <dt>{t.kunyomiLabel}</dt>
                  <dd lang="ja" dir="ltr">もり</dd>
                </div>
              </dl>

              <section className="example-block" aria-labelledby="example-heading">
                <p className="eyebrow" id="example-heading">{t.vocabularyLabel}</p>
                <p className="example-word" lang="ja" dir="ltr">{t.word}</p>
                <p className="example-reading" lang="ja" dir="ltr">{t.wordReading}</p>
                <p className="example-meaning">{t.wordMeaning}</p>
              </section>

              <details className="reference-details">
                <summary>{t.memoryLabel}</summary>
                <p>{t.memoryText}</p>
              </details>

              <p className="small-note answer-footnote">{locale === "fa" ? "نمونهٔ آموزشی برای بررسی رابط؛ محتوا باید پیش از انتشار بازبینی شود." : "Illustrative learning content; review content before release."}</p>
            </div>
          )}
        </div>

        <div className="study-card__footer">
          {!revealed ? (
            <button
              className="button button--primary button--wide"
              type="button"
              onClick={() => {
                setRevealed(true);
                setStatus(t.answerShown);
              }}
            >
              {t.revealAnswer}
            </button>
          ) : (
            <div className="rating-area">
              <p className="rating-label">{t.ratingsLabel}</p>
              <div className="rating-grid">
                <button className="rating-button rating-button--again" type="button" onClick={handleRating}>{t.again}</button>
                <button className="rating-button rating-button--hard" type="button" onClick={handleRating}>{t.hard}</button>
                <button className="rating-button rating-button--good" type="button" onClick={handleRating}>{t.good}</button>
                <button className="rating-button rating-button--easy" type="button" onClick={handleRating}>{t.easy}</button>
              </div>
            </div>
          )}
        </div>
      </article>

      <p className="small-note preview-note">{t.previewOnly}</p>
      <p className="status-message" role="status" aria-live="polite">{status}</p>
    </section>
  );
}

function ExploreView({ t, locale }: { t: Copy; locale: Locale }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase(locale === "fa" ? "fa" : "en");
    return (t.results as readonly Result[]).filter((result) =>
      [result.kanji, result.meaning, result.reading]
        .some((value) => value.toLocaleLowerCase(locale === "fa" ? "fa" : "en").includes(normalized))
    );
  }, [locale, query, t.results]);

  return (
    <section className="page-section" aria-labelledby="explore-heading">
      <header className="page-heading">
        <p className="eyebrow">{t.explore}</p>
        <h1 id="explore-heading">{t.exploreTitle}</h1>
        <p className="page-description">{t.exploreDescription}</p>
      </header>

      <div className="search-region">
        <label htmlFor="kanji-search">{t.searchLabel}</label>
        <input
          id="kanji-search"
          className="search-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.searchPlaceholder}
          autoComplete="off"
        />
        <p className="field-help" id="kanji-search-help">{t.searchHelp}</p>
      </div>

      <div className="result-list" aria-live="polite" aria-relevant="additions removals">
        {results.length > 0 ? results.map((result) => (
          <article className="result-row" key={result.kanji}>
            <span className="result-row__kanji" lang="ja" dir="ltr">{result.kanji}</span>
            <div className="result-row__details">
              <p className="result-row__meaning">{result.meaning}</p>
              <p className="result-row__reading" lang="ja" dir="ltr">{result.reading}</p>
            </div>
            <span className="result-row__arrow" aria-hidden="true">↗</span>
          </article>
        )) : <p className="empty-state">{t.noResults}</p>}
      </div>
    </section>
  );
}

export default function App() {
  const [locale, setLocale] = useState<Locale>("fa");
  const [theme, setTheme] = useState<Theme>("light");
  const [activeView, setActiveView] = useState<View>("today");
  const t = copy[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "fa" ? "rtl" : "ltr";
    document.documentElement.style.colorScheme = theme;
    document.title = locale === "fa" ? "Rinemi — یادگیری کانجی" : "Rinemi — Learn Kanji";
  }, [locale, theme]);

  const changeView = (view: View) => {
    setActiveView(view);
  };

  const navigation: { id: View; label: string }[] = [
    { id: "today", label: t.today },
    { id: "learn", label: t.learn },
    { id: "explore", label: t.explore }
  ];

  return (
    <div className={"app-shell theme-" + theme} dir={locale === "fa" ? "rtl" : "ltr"} lang={locale}>
      <a className="skip-link" href="#main-content">{t.skip}</a>

      <header className="topbar">
        <a href="#main-content" className="brand-lockup" onClick={(event) => { event.preventDefault(); changeView("today"); }}>
          <span className="brand-mark" aria-hidden="true">凛</span>
          <span className="brand-wording">
            <span className="brand-name">rinemi</span>
            <span className="brand-descriptor">{t.brandDescriptor}</span>
          </span>
        </a>
        <div className="header-actions">
          <button
            className="header-control"
            type="button"
            aria-label={theme === "light" ? t.themeToDark : t.themeToLight}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <span aria-hidden="true">{theme === "light" ? "◐" : "◑"}</span>
          </button>
          <button
            className="header-control language-control"
            type="button"
            aria-label={locale === "fa" ? "EN — تغییر زبان به انگلیسی" : "فا — Switch language to Persian"}
            onClick={() => setLocale(locale === "fa" ? "en" : "fa")}
          >
            {locale === "fa" ? "EN" : "فا"}
          </button>
        </div>
      </header>

      <main className="main-content" id="main-content" tabIndex={-1}>
        {activeView === "today" && <TodayView t={t} onStart={() => changeView("learn")} />}
        {activeView === "learn" && <LearningView key={locale} t={t} locale={locale} onBack={() => changeView("today")} />}
        {activeView === "explore" && <ExploreView key={locale} t={t} locale={locale} />}
      </main>

      <nav className="primary-nav" aria-label={t.primaryNav}>
        <div className="primary-nav__inner">
          {navigation.map((item, index) => (
            <button
              type="button"
              className="nav-item"
              key={item.id}
              aria-current={activeView === item.id ? "page" : undefined}
              onClick={() => changeView(item.id)}
            >
              <span className="nav-item__index" aria-hidden="true">0{index + 1}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}