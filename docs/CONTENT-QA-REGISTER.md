# Rinemi 2 — Starter Content QA Register

**Purpose:** track human review of every learner-facing Persian gloss and Japanese vocabulary example in the initial 44-kanji starter set.

**Current overall status:** `NOT REVIEWED`. Structural checks pass, but no row should be interpreted as linguistically approved until a reviewer and review date are recorded. Presence in the UI, a successful build, and the automated contract test are not evidence of teaching accuracy.

## Review workflow

For each stable kanji ID:
1. Verify the Persian gloss is accurate, natural, and appropriately scoped for a learner; note important ambiguity where needed.
2. Verify the Japanese word is real/common enough for the intended stage, its kana reading is correct for that word, and the word contains the target kanji.
3. Verify the Persian and English example translations preserve the intended sense.
4. Record trustworthy source references for the Japanese lexical item and reviewer-facing Persian decision. Do not invent a citation if none has been checked.
5. Set each field to `PASS`, `NEEDS CHANGE`, or `BLOCKED`; enter the reviewer, review date, severity and correction reference. A row is publish-ready only when both language checks pass and provenance is acceptable.

**Severity:** `S0` wrong target/reading or meaning; `S1` materially misleading translation or unsuitable example; `S2` minor clarity/naturalness/typography issue. Keep content unpublished or visibly marked as unreviewed while any S0/S1 issue is open.

## AI-assisted draft refinements (2026-10-23)

The two additions below were cross-checked against Japanese-English/Japanese dictionary entries to improve alignment between the starter gloss and its vocabulary examples:

- **本:** add 本屋（ほんや, bookstore） before 日本（にほん, Japan), so the card includes a word that demonstrates the “book” sense. Reference: [TKG Japanese-English Learner’s Dictionary — 本屋](https://www.tkgje.jp/entries/03000/03034_honya.html).
- **生:** add 生きる（いきる, to live） before 学生（がくせい, student), so the card includes a word tied to “life/live.” Reference: [Kotobank / 精選版 日本国語大辞典 — 生きる](https://kotobank.jp/word/%E7%94%9F%E3%81%8D%E3%82%8B-431376).

These are **AI-assisted draft refinements, not human approval**. The example readings and Japanese lexical senses were checked against the linked references; the Persian and English translations, level/frequency suitability, and overall teaching quality still require human review. All corresponding status cells below remain NOT REVIEWED; [issue #24](https://github.com/ArdKam/Rinemi2/issues/24) remains open.
## Record inventory

- Kanji corpus: 2,136 entries in `src/data/kanji.json`.
- Starter scope: 44 unique kanji, each with a gloss and at least one example.
- Content source: `src/content.ts`.
- Automated structural contract: `scripts/content.test.ts`, executed by `npm test`.
- License/provenance conditions are tracked separately in `docs/DATA-SOURCES.md`.

| Stable ID | Persian gloss record | Japanese example(s) and displayed reading | Japanese word/reading review | Persian gloss/translation review | Provenance/source status | Reviewer | Review date / severity / correction |
|---|---|---|---|---|---|---|---|
| 日 | Present | 日本（にほん）; 毎日（まいにち） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 一 | Present | 一つ（ひとつ） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 国 | Present | 外国（がいこく） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 会 | Present | 会社（かいしゃ） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 人 | Present | 日本人（にほんじん） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 年 | Present | 今年（ことし） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 大 | Present | 大きい（おおきい） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 十 | Present | 十月（じゅうがつ） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 二 | Present | 二つ（ふたつ） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 本 | Present | 本屋（ほんや）; 日本（にほん） | NOT REVIEWED | NOT REVIEWED | AI draft addition cross-checked against [TKG — 本屋](https://www.tkgje.jp/entries/03000/03034_honya.html); Persian translation, suitability and final review still open | — | — |
| 中 | Present | 中（なか） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 長 | Present | 長い（ながい） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 出 | Present | 出口（でぐち） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 三 | Present | 三つ（みっつ） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 同 | Present | 同じ（おなじ） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 時 | Present | 時間（じかん） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 事 | Present | 仕事（しごと） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 自 | Present | 自分（じぶん） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 行 | Present | 行く（いく） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 社 | Present | 会社（かいしゃ） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 見 | Present | 見る（みる） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 月 | Present | 月（つき） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 金 | Present | お金（おかね） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 学 | Present | 学校（がっこう） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 生 | Present | 生きる（いきる）; 学生（がくせい） | NOT REVIEWED | NOT REVIEWED | AI draft addition cross-checked against [Kotobank — 生きる](https://kotobank.jp/word/%E7%94%9F%E3%81%8D%E3%82%8B-431376); Persian translation, suitability and final review still open | — | — |
| 前 | Present | 午前（ごぜん） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 後 | Present | 午後（ごご） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 東 | Present | 東京（とうきょう） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 水 | Present | 水（みず） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 山 | Present | 山（やま） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 川 | Present | 川（かわ） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 木 | Present | 木（き） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 火 | Present | 火（ひ） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 雨 | Present | 雨（あめ） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 花 | Present | 花（はな） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 食 | Present | 食べる（たべる） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 読 | Present | 読む（よむ） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 書 | Present | 書く（かく） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 語 | Present | 日本語（にほんご） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 電 | Present | 電車（でんしゃ） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 車 | Present | 車（くるま） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 道 | Present | 道（みち） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 今 | Present | 今（いま） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |
| 家 | Present | 家族（かぞく） | NOT REVIEWED | NOT REVIEWED | Editorial seed in `src/content.ts`; per-record source trace not yet recorded | — | — |

## Current blockers

- No independent human language review has been recorded for these records.
- Per-record source traces for vocabulary and translation decisions need to be added as review is performed.
- Structural CI checks detect malformed records, but do not establish naturalness, frequency appropriateness, semantic nuance, or license compliance.
