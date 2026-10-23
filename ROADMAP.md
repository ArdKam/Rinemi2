# Rinemi 2 — Product Redesign & Rebuild Roadmap

**Status (2026-10-23):** the latest merged application-code snapshot is [`008edbe`](https://github.com/ArdKam/Rinemi2/commit/008edbe7659f47ed36831fcc9ed35d3e645b7316). [PR #55](https://github.com/ArdKam/Rinemi2/pull/55) adds the mascot design system and the initial empty-session integration. The exact pre-merge head [`40975ea`](https://github.com/ArdKam/Rinemi2/commit/40975ea62ba9f3375833dd4cc5fffecc87e15d34) passed [CI](https://github.com/ArdKam/Rinemi2/actions/runs/39874654456), covering unit/data tests, typecheck, build, contrast, Playwright, offline tests, and the Pages build. The resulting 390×844 Persian RTL light/dark and English LTR dark screenshots were inspected after fixing an SVG transparency artifact. These are branch-build results; post-merge Pages/live-browser verification for `008edbe` was not independently confirmed here. Prior checks on [`1929c77`](https://github.com/ArdKam/Rinemi2/commit/1929c774b67c8ec3990f1ccb2f43aef7c463e7f1) remain historical for that SHA. Rinemi remains **pre-release**: human accessibility/usability, the 44-record teaching-content review, owner/legal source and license approval, and manual data/PWA failure acceptance remain open; see [issue #7](https://github.com/ArdKam/Rinemi2/issues/7), [#24](https://github.com/ArdKam/Rinemi2/issues/24) and [#25](https://github.com/ArdKam/Rinemi2/issues/25).
**Planning date:** 2026-10-19  
**Target repository:** `ArdKam/Rinemi2`  
**Reference-only repository:** `ArdKam/kanji5` — do not modify it.  
**Canonical roadmap:** this file owns phase order, status, release gates, and scope decisions.

> **North star:** Build Rinemi as a Persian-first kanji learning studio: a calm, editorial-quality experience that helps learners understand kanji, remember them reliably, recognize them in useful vocabulary, and transfer that knowledge into reading Japanese.

This is a new, separate product implementation. It may selectively reuse verified data, content, assets, and learning behavior from `kanji5`, but must not blindly copy its accumulated presentation or create a competing learning engine. User-facing product/design improvements are the focus; technical decisions must protect content integrity, learning validity, privacy, accessibility, and future changeability.

---

## 0. Project rules and control plane

### 0.1 Repository boundary — non-negotiable

- [ ] `Rinemi2` is the only target repository for this project’s writes, branches, issues, documentation, and application implementation.
- [ ] `kanji5` is reference-only. Do not create, update, delete, or merge files there; do not open PRs that modify it; do not alter its branches, workflows, Pages deployment, secrets, issues, or project settings.
- [ ] Never claim that Rinemi2 changes are deployed because a commit, build, or PR exists. Report the exact verified repository, branch, commit SHA, workflow, and deployment URL where applicable.
- [ ] No automatic production deployment or coupling to the `kanji5` GitHub Pages path. Establish a separate preview/deployment target only after repository and hosting configuration are verified.
- [ ] Do not copy secrets, learner data, auth credentials, private exports, or deployment tokens from the reference repository.
- [ ] Keep attribution, original source, version, license, and transformation notes for reused datasets, fonts, images, and other assets.
- [ ] Use feature branches for implementation. Keep PRs focused and reviewable. Never force-push shared branches, bypass failed gates, or merge a broad batch of unrelated work.
- [ ] If a tool cannot perform an operation (e.g. repository settings or branch protection), record the limitation; do not imply that it has been completed.

### 0.2 Source-of-truth documents

- **This file — [ROADMAP.md](../ROADMAP.md):** phase order, status, dependencies, release gates, scope.
- **[Product & UX specification](PRODUCT-AND-UX-SPEC.md):** target users, navigation, screen inventory, user journeys, interaction rules.
- **[Art direction & design system](ART-DIRECTION.md):** visual principles, type/color roles, component and illustration rules, mascot.
- **[Learning design](LEARNING-DESIGN.md):** teaching sequence, card pedagogy, practice modes, content quality and evidence requirements.
- **[Reference & migration plan](REFERENCE-AND-MIGRATION.md):** what can be reused from `kanji5`, verification procedure, boundaries, licensing, data migration.
- **[Kanji5 reuse inventory](docs/KANJI5-REUSE-INVENTORY.md):** prioritized candidates, reuse/exclusion decisions, source revisions, status and acceptance evidence; update it during every reference audit.
- **[Quality & release plan](QUALITY-AND-RELEASE.md):** test matrix, accessibility, content QA, security, release and evidence.
- **[Decision log](DECISIONS.md):** consequential decisions, alternatives, reasons, open questions.
- **[UI/UX review register](docs/UI-UX-REVIEW-REGISTER.md):** durable finding IDs, priorities, evidence, dispositions, and acceptance checks; re-read it before every later inspection.
- **[README.md](../README.md):** concise entry point and current status.

If documents conflict, this roadmap governs execution order; the specialist specification governs the details in its own domain. Update the decision log when a scope or architecture decision changes.

### 0.3 Status vocabulary

Use these terms consistently:

- **NOT STARTED** — no implementation evidence.
- **IN PROGRESS** — work has begun; acceptance criteria remain open.
- **BLOCKED** — a dependency or decision prevents safe progress.
- **IN REVIEW** — a focused PR exists and is undergoing review.
- **DONE** — all listed acceptance criteria passed and evidence is recorded against the exact commit.
- **DEFERRED** — deliberately outside current scope; must not be represented as implemented.
- **REOPENED** — previously done work has a reproducible defect on the current target branch.

Passing unit tests is not enough to mark visual, educational, content, or deployment work as DONE.

### 0.4 Operating principles

1. **Use the approved written art direction and the mascot design contract.** Treat `docs/ART-DIRECTION.md` and `docs/MASCOT-DESIGN-SYSTEM.md` as the source of truth, implement a small real vertical slice, then inspect rendered browser results and refine before expanding. Visual references support design decisions but do not replace browser acceptance.
2. **Show rendered evidence.** Important design decisions must be checked in a running browser at target sizes, not inferred from source code or a tool’s completion message.
3. **Depth before breadth.** The core kanji-to-reading journey outranks new domains and feature count.
4. **One obvious next action.** Minimize competing primary buttons, dashboards, chips, and panels.
5. **Progress is not mastery.** Streaks and totals must never be presented as proof of durable learning.
6. **Explain only what is useful.** Keep the review flow fast; progressively disclose reference details and optional memory aids.
7. **Persian-native, not merely translated.** Persian UI and Persian educational explanations require separate QA.
8. **Content before decoration.** Do not ship incorrect readings, unnatural examples, fabricated component meanings, or misleading mnemonics for the sake of visual completeness.
9. **Accessible by design.** RTL/LTR, readable text, keyboard navigation, contrast, reduced motion, focus behavior, and mobile use are acceptance criteria, not polish.
10. **Do not duplicate authoritative learning logic.** If using an existing engine or scheduler from `kanji5`, preserve its stated authority boundaries and prove behavioral parity rather than implementing a competing system.
11. **No speculative success claims.** Do not claim superior retention, better learning, market fit, or production readiness without suitable evidence.
12. **Every phase ends with reviewable evidence.** Record tests, screenshots, findings, exceptions, and the exact commit.
13. **Reuse by demonstrated gap, not feature parity.** Treat Kanji5 as a read-only source of candidate data, learning contracts and test ideas; keep Rinemi 2's design direction and one authoritative owner per learning/data responsibility. Read and update the reuse inventory before adopting anything.

---

## 1. Product definition

### 1.1 Target learner

Primary target: independent Persian-speaking learners who know or are learning kana and want to build usable kanji knowledge for reading Japanese.

Important user needs to validate:

- Explain a kanji in natural Persian without requiring English as an intermediary.
- Connect meanings and readings to useful vocabulary instead of asking learners to memorize long isolated lists.
- Resolve recurring visual and reading confusions.
- Keep daily study manageable after a missed day.
- Find, save, revisit, and practice personally relevant kanji.
- Understand why a particular exercise is being shown when that explanation is helpful.
- Use the core study loop with low friction and reasonable offline resilience.
- Progress from isolated characters into short, appropriately leveled Japanese reading.

Do not assume all beginner, intermediate, and advanced learners share the same needs. Use usability sessions and learner interviews to distinguish them.

### 1.2 Product promise

Rinemi helps Persian-speaking learners build durable kanji knowledge through Persian-first explanations, focused recall, relevant vocabulary, and a gradual path into reading.

This is a positioning hypothesis, not a proven learning-outcome or market claim.

### 1.3 Core learning loop

**Understand → Retrieve → Use → Recognize in context → Review when due → Repair recurring confusion.**

The learner does not need to pass through every step for every character in every session. Exercise selection must respond to the learner’s current need and preserve the existing scheduler/learner-model authority if the proven engine is reused.

### 1.4 Primary navigation

The three primary destinations are:

1. **Today** — what needs attention and one clear start/continue action.
2. **Learn** — focused learning, active recall, feedback, review, and recovery.
3. **Explore** — search, kanji reference, vocabulary, topics, saved collections, and reading entry points.

Account, settings, help, and detailed progress are secondary destinations. Navigation labels and order must be validated in Persian RTL and English LTR.

### 1.5 Product boundaries for the first coherent release

**In scope for the first coherent release:**
- A polished daily study entry point and focused learning/review journey.
- High-quality kanji detail and dictionary discovery.
- Useful vocabulary and contextual examples tied to kanji.
- Bookmarking, saved collections, and practical bulk operations.
- Import workflow for common Anki exports, subject to a separately verified support matrix.
- Persian and English interfaces, with first-class RTL/LTR behavior.
- Light and dark themes with semantically consistent color roles.
- Personal mnemonic support, visual-structure explanation when valid, and stroke-order reference.
- Guest-first onboarding and understandable progress.
- Responsive web/PWA behavior, accessibility and dependable local learning where feasible.
- Transparent data/source/license handling and clear failure states.

**Explicitly not a first-release requirement:**
- A full Japanese course, broad grammar curriculum, social network, public deck marketplace, or AI conversation tutor.
- An exhaustive clone of Anki customization.
- XP/coins/leaderboards or coercive streak mechanics.
- Animations that slow routine review.
- Automatically generated etymologies or unverified radical/component explanations.
- Claims of improved retention without evaluated evidence.
- Multi-device synchronization or account features copied without a defined data and deletion model.

New scope requires a documented learner problem, expected benefit, content/source plan, quality criteria, implementation cost, and maintenance owner.

---

## 2. Phase map and gates

| Phase | Name | Outcome | Dependency | Status |
|---|---|---|---|---|
| P0 | Repository and evidence baseline | Separate, safe working boundary and verified reference baseline | None | IN PROGRESS — source corpus and topic taxonomy provenance recorded; [Kanji5 reuse inventory](docs/KANJI5-REUSE-INVENTORY.md) created and candidate audits remain open |
| P1 | Product/UX blueprint | Journeys, scope, screen inventory, and success criteria drafted in specs | P0 | IN PROGRESS — written blueprint exists; end-to-end flow acceptance, onboarding validation, and learner/usability evidence remain open |
| P2 | Visual direction baseline | Written Sumi Play direction accepted; generated visual concepts optional | P1 | DONE — image generation explicitly skipped by owner |
| P3 | Art direction and design system | Translate written direction into tokens/components, then browser-verify | P2 | IN PROGRESS — first semantic tokens/responsive styles implemented; browser visual QA pending |
| P4 | Content/data audit and source adapters | Trusted content foundation with provenance and failure handling | P0, parallel to P1–P3 | IN PROGRESS — corpus/topic integrity checks and attribution added; human content QA pending |
| P5 | Shell, navigation, onboarding, Today | First usable product skeleton with real content density | P3, P4 | IN PROGRESS — code slice exists; rendered-browser verification and onboarding remain open |
| P6 | Learning card and practice journey | End-to-end learning, recall, feedback, ratings and recovery | P5, P4 | IN PROGRESS — reveal/rating/local FSRS slice exists; full recovery/adaptive semantics and browser QA remain open |
| P7 | Explore, Dictionary, detail, bookmarks | Find and save kanji without search/filter overload | P5, P4 | IN PROGRESS — search/filter/detail/bookmarks and named collections exist; rename, confirmed clear-all and deletion are implemented; mobile detail return/navigation, result readings and continuation beyond 240 are merged with E2E coverage; rendered acceptance and a decision on broader bulk management remain open |
| P8 | Anki import and imported material | Safely import supported deck exports with preview and error reporting | P7, data identity design | IN PROGRESS — text parser/support matrix and read-only preview/field mapping/warnings are merged (PR #36); PR [#50](https://github.com/ArdKam/Rinemi2/pull/50) rejects out-of-range metadata columns and metadata-only files with no mappable content fields, with regression tests. This remains preview-only: no imported notes are persisted or scheduled. Duplicate disposition, stable imported-note identity, explicit FSRS/scheduler boundary, transaction/rollback/recovery, real-export import E2E and packaged `.apkg`/`.colpkg`/media support remain open |
| P9 | Vocabulary-to-reading continuity | Connect mastered/known kanji to words and short reading | P6, P7, content QA | NOT STARTED |
| P10 | Progress, settings, account/data controls | Meaningful progress and understandable user control | P6 plus data contract | IN PROGRESS — local JSON backup export, validated restore preview, and browser-data erasure controls are implemented; manual acceptance/storage-failure review, full privacy/legal review, offline/PWA and account/sync conflict rules remain open |
| P11 | Accessibility, responsive and localization acceptance | Verified Persian/English, mobile/desktop, themes, and keyboard behavior | P5–P10 in increments | IN PROGRESS — visual finishing, mobile Explore return-state tests, result continuation, focus corrections, attribution, PWA manifest/icons and warm-cache offline E2E are merged. PRs [#51](https://github.com/ArdKam/Rinemi2/pull/51) and [#53](https://github.com/ArdKam/Rinemi2/pull/53) add forced-colors system-token mapping, a Canvas hover pairing for secondary actions, and Playwright assertions for tokens, keyboard focus and the hovered bookmark; [PR #53 CI](https://github.com/ArdKam/Rinemi2/actions/runs/39859285047) passed. This is automated browser emulation, not OS-level acceptance: human RTL/LTR/theme/viewport, keyboard/screen-reader/zoom/reduced-motion/high-contrast checks and real-device install/update/cache recovery remain release gates. |
| P12 | Beta hardening and release evidence | Frozen, repeatable candidate and truthful deployment evidence | All release gates | NOT STARTED |

A phase may overlap only where its dependency is explicit. A phase must not be marked DONE simply because work started in a later phase.

### Gate A — Before implementation
Required: P0/P1 planning baseline, written Sumi Play direction, repo isolation, and a small implementation/test plan. Image mockups are optional. Start with a narrow vertical slice; review its browser rendering before broadening scope.

### Gate B — Before learning-card integration
Required: approved visual system, a verified content contract, card information hierarchy, and an agreed exercise/review state model. All ratings and learner-state transitions must have a clear, tested authoritative owner.

### Gate C — Before import release
Required: supported-format matrix, fixture corpus, import preview, duplicate behavior, partial-failure behavior, source provenance, and no-loss acceptance tests.

### Gate D — Before public beta
Required: all P0 acceptance checks from [Quality & Release](QUALITY-AND-RELEASE.md), manual Persian content QA, accessibility and responsive evidence, privacy/security review, working backup/restore and deletion story, clear limitation copy, and one frozen candidate SHA verified end to end.

---

## 3. Detailed phase plans

## P0 — Repository and evidence baseline

**Goal:** understand the empty/new target repo and the current `kanji5` source of truth before creating the new application.

- [ ] Confirm repository identity, default branch, permissions, commit history and existing content.
- [ ] Record the first planning commit and keep it separate from `kanji5`.
- [ ] Establish a branch/PR workflow; configure branch protection if available and verify it, otherwise record the manual equivalent and limitation.
- [ ] Verify current `kanji5` default branch and recent relevant PR/deployment state before selecting anything to reuse. Historical SHAs in documents are not proof of current state.
- [ ] Inventory only relevant references: brand guide, product strategy, learning-effectiveness roadmap, educational content audit, architecture/project structure, data files, licenses, and the relevant runtime boundary.
- [ ] Classify every candidate as: reuse as-is, adapt through an adapter, re-author, or exclude.
- [ ] Record current deployment and actual rendered screenshots only where accessible; code alone is not evidence of current visual behavior.
- [ ] Create a reuse inventory with file/path, purpose, source SHA/date inspected, owner/authority, license, tests, dependencies, target decision, and risks.
- [ ] Never transplant secret configuration, local learner data, credentials, or production database state.
- [ ] Record unanswered questions as explicit decisions rather than silently assuming.

**Acceptance:** target repo identity and boundary are recorded; the reference repository remains unchanged; all proposed reuse has an auditable source and a decision owner.

## P1 — Product and UX blueprint

**Goal:** decide exactly what we are building before implementation.

- [ ] Approve the learner problem, target segment, value proposition, product promise, and explicit non-goals.
- [ ] Define the three-destination navigation model: Today, Learn, Explore.
- [ ] Map first visit → guest onboarding → first meaningful session → returning user.
- [ ] Map Today → due work/new learning → exercise → feedback/recovery → rating/next task → session summary.
- [ ] Map Explore → search/filter → kanji detail → bookmark/collection → optional start practice.
- [ ] Map bookmarks/collections → inspect, remove, bulk organize, start a focused session.
- [ ] Map Anki file selection → parse/validate → preview → field mapping → duplicate resolution → confirmation → import report → review imported material.
- [ ] Define empty, loading, offline, partial, stale, failure, and success states for every primary flow.
- [ ] Establish a screen inventory and acceptance criteria for mobile and desktop.
- [ ] Define user-facing language for scheduler ratings and learner progress.
- [ ] Define a minimal set of useful product metrics: first session completion, time to first useful exercise, review completion, return after a missed day, search success, import success/error rates, and content correction reports.
- [ ] Document any analytics as privacy-preserving, optional where appropriate, and never a prerequisite for core learning.

**Acceptance:** every primary destination and flow has an explicit purpose, entry/exit states, failure behavior, and measurable usability acceptance. Image mockups are optional; actual rendered UI verification is mandatory.

## P2 — Visual direction baseline (DONE — image generation skipped)

**Goal:** use the user's established written Sumi Play direction as the starting point without depending on generated mockups.

- [x] Adopt the written direction: warm paper, sumi charcoal, restrained vermilion action accent, muted indigo and sakura as secondary accents, editorial Japanese typography, native Persian RTL, generous whitespace, restrained surfaces, and a calm nonchalant cat companion used selectively.
- [x] Do not generate mockups or block implementation on image generation; the owner explicitly asked to skip it.

**Acceptance:** the written Sumi Play direction is accepted as the visual baseline. Actual browser rendering, content-density review, contrast, and refinement are P3/P11 acceptance work. A generated picture is optional, not acceptance evidence.

## P3 — Art direction and design system

**Goal:** establish one tokenized visual language before polishing individual features.

- [ ] Finalize brand signature, logo/mark placement and wordmark behavior in RTL.
- [ ] Define palette roles, including primary action, secondary accent, focus, success, warning, error, informational, borders, surfaces, overlays, and disabled states.
- [ ] Verify text and control contrast in light/dark themes; do not rely on color alone for semantic status.
- [ ] Define typography and line-height for Persian, English, kana, kanji, readings, dense dictionary entries, and large character displays.
- [ ] Define spacing, radius, border, shadow/elevation, layout widths, breakpoints, layering, motion, focus and disabled tokens.
- [ ] Set a default rule against unnecessary nested cards, decorative gradients, arbitrary badges, and component-level style patches.
- [ ] Specify buttons, icon buttons, chips, segmented controls, search/filter fields, menus, dialogs, toasts, progress indicators, skeletons, error panels, lists, dictionary entries, review ratings, tabs and navigation.
- [ ] Define interaction states: idle, hover, focus, active, selected, disabled, loading, success, warning, destructive, and failure.
- [ ] Define reduced-motion alternatives and ensure motion communicates state or teaches a skill.
- [x] Establish written mascot identity and usage standards; the initial set is intentionally narrow. [ ] Verify the owner-supplied canonical artwork in both active placements before creating more variants. See [MASCOT-DESIGN-SYSTEM.md](docs/MASCOT-DESIGN-SYSTEM.md).
- [ ] Build a small rendered component gallery to verify tokens on actual devices and themes.
- [ ] Validate the approved direction on actual rendered screens in-browser, including Persian RTL/English LTR, light/dark themes, mobile and desktop.
- [ ] Refine palette and components based on contrast/accessibility checks and real content density.
- [ ] Add design QA screenshots to PRs when visual behavior changes.

**Acceptance:** one coherent token/component baseline; no parallel token set; core components render consistently in Persian RTL, English LTR, light and dark mode.

## P4 — Content/data audit and source adapters

**Goal:** establish correct, source-aware educational data so UI cannot accidentally conceal data uncertainty.

- [ ] Inventory kanji records, meanings, readings, stroke counts, grade/JLPT metadata, frequency/order, components, mnemonics, vocabulary, sentence context, stroke-order assets, and topic mappings.
- [ ] Record completeness, provenance, license, freshness/update strategy, and known limitations by field.
- [ ] Distinguish source glosses from reviewed learner-facing Persian explanations.
- [ ] Distinguish verified component facts from pedagogical memory suggestions.
- [ ] Define canonical IDs and aliases for kanji, vocabulary, source notes, imported notes, and user collections.
- [ ] Define validation and deduplication rules; do not deduplicate distinct vocabulary or readings solely because display strings look similar.
- [ ] Create offline/local fixtures for all critical learning and import flows.
- [ ] Define safe empty versus unavailable versus network-failure states; never show a transport failure as a truthful “no examples exist”.
- [ ] Use external content providers as optional sources, not authorities for the learner's state.
- [ ] Avoid loading external data for the initial screen when a local verified fallback is sufficient.
- [ ] Add human-review sampling by difficulty, reading type, JLPT level, and source.
- [ ] Keep source attribution visible wherever legally or educationally appropriate.

**Acceptance:** the UI can distinguish verified, user-authored, imported, optional, unavailable, and not-yet-reviewed content; no invented fact is displayed as authoritative.

## P5 — Shell, navigation, onboarding, Today

**Goal:** make first contact calm, comprehensible, and immediately useful.

- [ ] Design and implement app shell, header, navigation, content width, and responsive layout.
- [ ] Implement Persian-first defaults where justified, with accessible language switching and persistent preference.
- [ ] Ensure brand identity and wordmark behave correctly in RTL/LTR.
- [ ] Provide guest-first onboarding with a short explanation of what the learner will do and one small first action.
- [ ] Avoid forcing account creation before meaningful learning; define sync/account prompts only when they serve a specific user need.
- [ ] Build Today with due reviews, new-learning target, a single primary start/continue action, estimated workload and a small number of useful indicators.
- [ ] Add an understandable “return after a missed day” path without shame, punishment, or excessive warning.
- [ ] Handle startup failures and slow loading without flashing legacy layout or blank white screens.
- [ ] Design no-progress, all-caught-up, offline, partially cached, and failure states.
- [ ] Verify navigation, safe areas, keyboard focus, scroll behavior and fixed/sticky controls on small phones and compact landscape.

**Acceptance:** a new learner can reach a meaningful first exercise without a mandatory account; a returning learner can identify their next step immediately; no primary action is obscured or visually duplicated.

## P6 — Learning card and practice journey

**Goal:** create Rinemi’s most distinctive and dependable experience.

- [ ] Define card state transitions: introduction/unseen, prompt, reveal, feedback, grading, recovery, next task, completion, interruption/resume.
- [ ] Design the unrevealed face around one retrieval question and one clear reveal action.
- [ ] Design the revealed face with hierarchy: core meaning → useful reading/word evidence → relevant structure/memory support → optional detail → review action.
- [ ] Show reference information only when needed; expose complete readings, longer glosses and stroke-order details in predictable progressive disclosure.
- [ ] Teach reading through useful words and clearly distinguish common readings from less common/reference readings.
- [ ] Ensure example vocabulary has accurate Japanese, kana reading, meaning, and provenance.
- [ ] Make visual-structure diagrams accurate and readable. Never invent etymology or semantic/phonetic explanations.
- [ ] Keep the learner’s personal mnemonic separate from curated mnemonic and guided scaffolds.
- [ ] If a prepared memory cue is weak, mismatched, or unavailable, do not present it as fact; prefer no cue over a misleading cue.
- [ ] Preserve the intended semantics of Again / Hard / Good / Easy. Explain ratings on first use or in help, not via repeated intrusive tooltips.
- [ ] Keep the existing scheduling authority if reused; the UI must not independently calculate intervals or write learner mastery state.
- [ ] Use adaptive exercise types only through a single authoritative selection/evaluation boundary.
- [ ] Make “I don’t know”, near-miss, wrong answer, retry, skip, unavailable exercise and recovery outcomes explicit.
- [ ] Do not treat a hint-assisted retry as independent recall unless the learning contract says so.
- [ ] Make repeated reviews fast: minimal scrolling, predictable controls, no needless animation, stable focus and correct layout when revealing the answer.
- [ ] Support session interruption and safe resume if the chosen engine supports it; do not silently duplicate or lose reviews.
- [ ] Add scenario tests for rapid input, duplicate rating, stale async content, switching cards during fetch, reload/offline and failure recovery.
- [ ] Define reduced-motion and keyboard interactions for reveal, answer, grading and next task.

**Acceptance:** end-to-end learning flow is correct, focused and visually verified; rating changes have one authoritative path; all prompt, response and failure states meet the educational and accessibility contracts.

## P7 — Explore, Dictionary, kanji detail, bookmarks

**Goal:** make it easy to find a kanji and turn discovery into useful learning.

- [ ] Make search the most obvious entry point; define supported searches (character, reading, meaning, topic and supported aliases) by evidence.
- [ ] Design quick filters for relevant learner goals; keep less-used and advanced filters progressive.
- [ ] Show active filters clearly, with easy removal and a clear-all control.
- [x] Preserve query/filter state and restore the selected result's focus/scroll context when opening and returning from mobile detail; Back/Escape behavior is covered by Playwright.
- [x] Provide result-level available reading/gloss cues and incremental continuation beyond the former 240-row ceiling; filtered browsing remains keyboard/screen-reader acceptance work.
- [ ] Provide a clear detail hierarchy: character and essential meaning, common readings in use, vocabulary, structure, stroke-order reference, lookalikes, and source/reference notes.
- [ ] Distinguish what is useful to learn now from what is useful to consult.
- [ ] Make search empty/no-match/offline/failure states actionable.
- [x] Add a bookmark action in both detail and relevant learning contexts.
- [x] Create/delete named collections, add/remove a kanji, filter Explore by a chosen collection, and start a focused session of up to 20 items.
- [x] Treat bookmarks and collections as organization only; the collection contract tests verify they do not mutate scheduler records or bookmarks.
- [x] Implement collection rename, confirmed clear-all and deletion without changing bookmarks or review history.
- [ ] Decide whether multi-item selection/bulk add-remove is needed; if approved, implement only after browser review of the basic workflow.
- [ ] Avoid adding a tag, badge, chip or icon where the same information is already visually obvious.
- [ ] Verify large collections, zero results, duplicate saves, keyboard navigation and mobile reachability in the rendered browser.
- [ ] Establish persistence/export semantics and conflict behavior before syncing saved state across devices.

**Acceptance:** learners can locate a character, understand its essential information, save it, find it later, and start study from saved items without losing search context.

## P8 — Anki import

**Goal:** lower switching costs without making Rinemi a fragile clone of Anki.

- [ ] Begin with a narrow, documented support matrix. Identify supported input formats and version assumptions before implementing parsing.
- [ ] Confirm what can legally and safely be processed locally. Prefer on-device parsing; do not upload a learner’s deck silently.
- [ ] Support a clear file picker, file-size handling, parse validation, and preview before import.
- [ ] Show card/note counts, mapped fields, recognized kanji, unsupported note types/media, duplicates and skipped rows before confirmation.
- [ ] Offer field mapping and explain the difference between note, card, and review data where relevant.
- [ ] Preserve source text and original fields when supported. Clearly disclose unsupported scheduling/history/format data rather than implying full parity.
- [ ] Store import provenance (source file/deck name, import time, mapping version) where appropriate without retaining the entire original file unnecessarily.
- [ ] Define deduplication using stable, documented keys and user-selectable behavior for ambiguous matches.
- [ ] Build a dry-run plan, transactional import where feasible, rollback/recovery for failure, and resumable/error report for large imports.
- [ ] Never silently overwrite existing Rinemi educational content or learner state.
- [ ] Ensure imported cards do not bypass educational grading/scheduling authorities.
- [ ] Add fixtures for valid, malformed, oversized, duplicate-heavy, partial, unsupported, media-heavy and privacy-sensitive input.
- [ ] Test repeated import, interruption, local storage exhaustion, invalid encoding, and user cancellation.
- [ ] Add export/undo/removal semantics before describing the importer as reversible.
- [ ] Defer full Anki review history/scheduling conversion until feasibility and educational semantics have been verified.

**Acceptance:** the user sees a faithful preview, understands limitations and duplication choices, confirms the operation, and receives a clear import report; parse or storage failure cannot leave an undisclosed half-import.

## P9 — Vocabulary and reading continuity

**Goal:** prove that kanji learning connects to useful written Japanese.

- [ ] Connect kanji detail to a small number of high-value, verified words with accurate readings and Persian meanings.
- [ ] Prioritize natural vocabulary and leveled contexts over quantity.
- [ ] Link known words back to kanji and allow the learner to save/revisit words if supported.
- [ ] Add short context exercises only when the content contract has enough valid distractors, correct answers and evidence.
- [ ] Make hint progression optional and transparent.
- [ ] Integrate a small Reading Lab entry point using curated, reviewed passages before investing in a huge content surface.
- [ ] Support text selection/lookup only where the Japanese segmentation and meaning behavior are reliable.
- [ ] Make unknown words, unavailable examples and network errors distinct.
- [ ] Measure successful lookup, completion and later recall rather than raw click volume.
- [ ] Defer independent grammar curriculum until observed user demand and content maintenance can justify it.

**Acceptance:** the learner can move from kanji to an accurate word or short context and back to relevant study without feeling sent to a separate product.

## P10 — Progress, settings, accounts and data controls

**Goal:** make progress understandable and the learner in control.

- [ ] Distinguish exposure, short-term performance, retained knowledge and review workload.
- [ ] Avoid claiming mastery from one correct answer or raw completed count.
- [ ] Show a small number of actionable insights: due work, recent trend, recurring confusions and skills needing practice, with limitations explained.
- [ ] Keep detailed analytics secondary to the learning flow.
- [ ] Make language, theme, daily workload, audio, motion preferences and advanced study controls findable.
- [ ] Define local persistence, backup, restore, sync and conflict rules before adding account-based features.
- [ ] Define explicit account deletion and local-data erasure paths where accounts/storage exist; a database cascade alone is not a user-facing deletion workflow.
- [ ] Make data export and destructive resets understandable and confirmable.
- [ ] Never send raw learner answers or deck content to external analytics without an explicit product and privacy basis.
- [ ] Document any limitations honestly.

**Acceptance:** learners can interpret progress without misleading claims, change their preferences, recover their data, and understand how to erase it.

## P11 — Cross-cutting quality: accessibility, responsive, localization, content

This work starts in P3/P5 and is repeated for every feature; P11 is final integrated acceptance, not the first time it is considered.

**Automated increment merged:** [PR #51](https://github.com/ArdKam/Rinemi2/pull/51) maps semantic surfaces, text, actions, selection, boundaries and focus to system colors under `forced-colors: active`; [PR #53](https://github.com/ArdKam/Rinemi2/pull/53) pairs secondary-action hover foreground `LinkText` with `Canvas` and tests the hovered bookmark without transition artifacts. PR #53's [full CI](https://github.com/ArdKam/Rinemi2/actions/runs/39859285047) and [token-contrast run](https://github.com/ArdKam/Rinemi2/actions/runs/39859285118) passed; exact merged-SHA [main CI](https://github.com/ArdKam/Rinemi2/actions/runs/39859508305), [contrast](https://github.com/ArdKam/Rinemi2/actions/runs/39859508249), and [Pages/live Chromium verification](https://github.com/ArdKam/Rinemi2/actions/runs/39859508390) passed on `1929c774b67c8ec3990f1ccb2f43aef7c463e7f1`. These checks validate browser-emulated behavior only; manual OS high-contrast, screen-reader, zoom and full locale/theme acceptance remain NOT RUN / NOT ACCEPTED.


**Automated increment merged:** [PR #51](https://github.com/ArdKam/Rinemi2/pull/51) maps semantic surfaces, text, actions, selection, boundaries and focus to system colors in `forced-colors: active` mode. The PR-head [Playwright CI](https://github.com/ArdKam/Rinemi2/actions/runs/39857702439) and [token-contrast run](https://github.com/ArdKam/Rinemi2/actions/runs/39857702424) passed, as did exact merged-SHA [main CI](https://github.com/ArdKam/Rinemi2/actions/runs/39857935134) and [Pages/live Chromium verification](https://github.com/ArdKam/Rinemi2/actions/runs/39857935220). These checks validate browser-emulated behavior only; manual OS high-contrast, screen-reader, zoom, and full locale/theme acceptance remain NOT RUN / NOT ACCEPTED.

- [ ] Persian RTL: reading order, punctuation, mixed Persian/Latin/Japanese strings, digits, alignment, inline icons, menus, dialogs, charts and focus movement.
- [ ] English LTR parity without hardcoded direction assumptions.
- [ ] Japanese text: font fallback, baseline/alignment, furigana/reading display if applicable, wrapping and character display.
- [ ] Light/dark theme contrast across states, overlays, disabled controls, focus, success and error.
- [ ] Keyboard-only operation, predictable tab order, Escape behavior, dialog focus entry/return, visible focus and no keyboard traps.
- [ ] Screen-reader name/role/value and live feedback for reveal, grading, loading/error and import results.
- [ ] Touch targets and controls usable on 320px-wide layouts and compact landscape.
- [ ] Reduced-motion behavior and no essential information conveyed only by animation.
- [ ] Zoom/text enlargement and long Persian/English/Japanese content.
- [ ] Automated axe-like checks where available plus manual assistive-technology review.
- [ ] Human review of Persian meanings and explanations, Japanese readings, vocabulary and naturalness, source licenses, component facts, mnemonics and answer distractors.
- [ ] Distinguish failures of interface, network, content provider, content completeness and educational grading.
- [ ] Publish known limitations and correction paths.

**Acceptance:** no known blocker-level accessibility failure in core journeys; cross-language/core screen matrix passes; educational content meets the published acceptance sampling plan.

## P12 — Beta hardening and release evidence

- [ ] Freeze a single candidate commit SHA and identify its exact build artifact.
- [ ] Run full automated suites from a clean checkout and preserve results.
- [ ] Run critical end-to-end tests in a real browser across target viewport/language/theme combinations.
- [ ] Verify live/preview asset hashes and behavior against the exact candidate where deployment is configured.
- [ ] Verify manifest/icons, exact service-worker scope, warm-cache offline study, update behavior, missing-resource/cache failure, and mobile install behavior on the exact candidate SHA. Do not claim cold-start offline-first guarantees.
- [ ] Test stale cache recovery, missing assets, network loss, failed imports, interrupted study and storage failures.
- [ ] Complete security/privacy checks appropriate to the chosen architecture.
- [ ] Complete manual content QA and the accessibility acceptance checklist.
- [ ] Confirm no accidental writes, imports, deployment effects, or configuration changes occurred in `kanji5`.
- [ ] Record known issues, severity, workaround, owner and decision to block/defer.
- [ ] Make the public release description match exact verified behavior.
- [ ] Do not invite public beta users while a P0 blocker remains unresolved.
- [ ] Publish a short handoff recording candidate SHA, checks, deployment status, and remaining acceptance-only work.

**Acceptance:** a different person can reproduce the release decision from evidence; no claim depends on an open PR, an old SHA, a code review alone, or an unverified production site.

---

## 4. Work breakdown and implementation order

Implementation should proceed as vertical slices, not a months-long design-system rewrite followed by a large integration.

1. **Slice A — Real learner journey:** design system minimum → Today → one verified kanji prompt → reveal → feedback/rating → next item.
2. **Slice B — Detail and discovery:** search → detail → verified vocabulary → bookmark → retrieve the bookmark.
3. **Slice C — Return and resilience:** interruption/resume if supported → empty/offline/errors → theme/language/RTL checks.
4. **Slice D — Collections:** create collection → add/remove items → study collection → preserve ordinary scheduler authority.
5. **Slice E — Import:** validated file → preview/map → dry run → confirmed import → import report and rollback/recovery.
6. **Slice F — Context transfer:** kanji → vocabulary → short reading passage → lookup → return to relevant learning.
7. **Slice G — Progress/data control:** useful summary → preferences → backup/restore → deletion and privacy checks.
8. **Slice H — Beta hardening:** integrated accessibility, content, privacy, security and release gates.

Every slice must have:
- a short problem statement and defined user outcome;
- narrow scope and a decision owner;
- acceptance criteria before coding;
- one or more representative fixtures;
- focused component/unit/contract/E2E tests where appropriate;
- rendered screenshots before/after for visible changes;
- a manual RTL/LTR, light/dark, mobile/desktop check appropriate to the slice;
- failure/empty/loading state coverage;
- a reviewable PR and exact verification report.

Do not mix broad file reorganization, data migrations, branding replacement, content overhaul and new features into one PR.

---

## 5. Required working artifacts

The repo should maintain these artifacts as work advances:

- [x] Product and UX specification exists; P1 acceptance and learner validation remain open.
- [x] Art direction and design-system specification exists; rendered-browser acceptance remains open.
- [x] Learning design and content-quality specification exists; learner-facing content QA remains open.
- [x] Initial source/provenance matrix and source SHAs recorded in `docs/DATA-SOURCES.md`; independent license/ownership confirmation remains an open release gate.
- [x] Decision log with date, status, alternatives and rationale; unresolved decisions remain recorded as open.
- [x] Manual release acceptance checklist exists in `docs/MANUAL-RELEASE-ACCEPTANCE.md`; the checks themselves remain NOT RUN until a human records evidence.
- [ ] Component gallery and approved visual references.
- [x] Starter content QA register created in `docs/CONTENT-QA-REGISTER.md` for all 44 seed kanji; all language-review statuses remain `NOT REVIEWED` until a human records evidence.
- [x] Anki text-import support matrix and parser test inventory in `docs/ANKI-IMPORT-SUPPORT.md` and `scripts/anki-import.test.ts`; end-to-end UI/persistence acceptance remains open.
- [ ] Automated test matrix and browser screenshot baseline.
- [ ] Accessibility issue log.
- [x] Local data/backup/erasure contract drafted in `docs/LOCAL-DATA-AND-PRIVACY.md`; manual failure testing and privacy/legal review remain open.
- [x] PWA manifest/icons, base-path-scoped service worker and warm-cache offline E2E merged; main CI includes Pages-base validation. Manual install/update/cache-recovery and real-device acceptance remain open.
- [ ] Known limitations and public support/correction instructions.

Avoid duplicating the same backlog across several docs. This roadmap owns phase status; specialist documents own their acceptance details.

---

## 6. Definition of done

A feature is DONE only when all relevant items are true:

- [ ] It solves the documented user problem with no hidden scope expansion.
- [ ] The content and interaction have been reviewed, not just the implementation.
- [ ] The authoritative learning/data owner is explicit; no duplicate scheduler or learner state exists.
- [ ] All primary and failure states are implemented and tested.
- [ ] Persian RTL and English LTR are verified with realistic strings.
- [ ] Light/dark and mobile/desktop are verified for the changed surface.
- [ ] Keyboard, focus, contrast, touch target and reduced-motion requirements pass.
- [ ] The rendered application has been checked in a browser.
- [ ] Tests pass on the actual PR head and the result is recorded.
- [ ] Source/license/provenance are captured where relevant.
- [ ] Documentation and Decision Log reflect any consequential change.
- [ ] No unverified claim of merge, release, deployment, completeness or educational efficacy is made.

---

## 7. Risks and mitigations

| Risk | Prevention / response |
|---|---|
| Recreating `kanji5`’s accumulated UI without deciding what matters | New information hierarchy; strict screen inventory; three-concept visual gate; feature exclusion list. |
| Building a beautiful but educationally weak product | Real prompts and content in prototypes; content QA; outcome-based acceptance; preserve authoritative learning logic where useful. |
| Incorrect Persian translations and readings | Human-reviewed Persian overlay; source provenance; conservative fallback; report/correction process. |
| Inaccurate component diagrams or mnemonics | Separate fact from memory aid; confidence/source labels; omit weak content; review visually similar cases. |
| Feature sprawl | Three primary destinations; depth-before-breadth; scope-change decision log. |
| Broken local data or review history | Do not migrate data casually; versioned import/export; fixture-based contract tests; explicit rollback/recovery. |
| Anki import creates duplicates or false parity | Narrow support matrix; preview, dry run, no silent overwrite; explicit history/media limitations. |
| RTL and Japanese typography regressions | Cross-language visual fixtures and browser screenshots on each relevant PR. |
| Dark-mode contrast drift | Semantic tokens and contrast tests, not ad hoc per-component colors. |
| “Works offline” claim exceeds reality | Explicit offline contract, network-failure tests, only claim verified flows. |
| Reference repo accidentally modified | All writes scoped to `ArdKam/Rinemi2`; periodic repository/PR target verification; no shared automation/deploy coupling. |
| False deployment or completion claims | Record exact branch/SHA/workflow/URL; distinguish code, CI, preview, live deployment, and manual acceptance. |
| AI-generated content becomes authoritative without review | Treat it as a draft, label provenance, and require human/structured validation before publication. |

---

## 8. Scope-change procedure

For each proposed addition, record:

1. User problem and evidence.
2. Expected benefit and success measure.
3. Impact on navigation, learning model, design language, content and maintenance.
4. Data/privacy/licensing/safety implications.
5. Implementation and test effort.
6. What is removed, delayed or simplified to make room.
7. Decision: accept, test as an experiment, defer, or reject.

Do not accept new scope just because a competing app has the feature or a prototype is easy to generate.

---

## 9. Current execution status (2026-10-23)

The latest merged application-code snapshot is [`008edbe`](https://github.com/ArdKam/Rinemi2/commit/008edbe7659f47ed36831fcc9ed35d3e645b7316). The exact pre-merge head [`40975ea`](https://github.com/ArdKam/Rinemi2/commit/40975ea62ba9f3375833dd4cc5fffecc87e15d34) passed [CI](https://github.com/ArdKam/Rinemi2/actions/runs/39874654456), including unit/data tests, typecheck, build, design-token contrast, Playwright E2E, offline checks and `build:pages`. The branch-build screenshots were manually inspected in Persian RTL light/dark and English LTR dark at 390×844 after a transparency-filter defect was corrected. Post-merge Pages/live Chromium verification for `008edbe` was not independently confirmed in this pass; the earlier [Pages/live verification](https://github.com/ArdKam/Rinemi2/actions/runs/39859508390) is historical for its own SHA. Automated checks and inspected screenshot artifacts do not replace human accessibility, teaching-quality or legal acceptance.

### Implemented in the current slice

- Today, Learn, and Explore navigation; Persian RTL default and English LTR; light/dark/system theme preference; responsive first-session guidance, refined learning surfaces, and focus handoff into revealed answer content.
- Learning-card reveal and Again/Hard/Good/Easy ratings, local FSRS scheduling, and a due-review queue.
- 2,136-entry Jōyō corpus, search/JLPT/topic filters, result readings and gloss cues, detail, bookmarks, named collections, collection rename, confirmed bulk-clear and deletion. Mobile detail return/navigation and complete incremental result browsing are merged.
- Versioned local-storage migration, semantic design tokens, token contrast validation, full OFL notices with automated regression check, KANJIDIC2/EDRDG attribution links, safe Anki text preview (no import writes), installable PWA warm-cache shell, unit/data tests and browser E2E coverage.

### Remaining work in execution order

1. **Finish manual accessibility/usability acceptance before any public-beta claim.** Current code SHA `1929c774b67c8ec3990f1ccb2f43aef7c463e7f1` passed [main CI](https://github.com/ArdKam/Rinemi2/actions/runs/39859508305) and [Pages deployment/live verification](https://github.com/ArdKam/Rinemi2/actions/runs/39859508390). Issue #7 and the [UI/UX review register](docs/UI-UX-REVIEW-REGISTER.md) remain open for manual keyboard/focus, zoom, reduced-motion/forced-colors, screen-reader, and less-common Explore/collection/empty/error states. Automated deployment checks do not approve public beta or production readiness.
2. **Finish manual browser/UX/accessibility acceptance (P3/P5/P11).** Follow [the UI/UX review register](docs/UI-UX-REVIEW-REGISTER.md), then inspect current screenshots at small/typical phone, compact landscape and desktop; Persian RTL and English LTR; light and dark; learning card before/after reveal; Explore selection/detail, filters, result limits, empty states and collections. Perform keyboard/focus, zoom, forced-colors, screen-reader and reduced-motion checks. CI coverage is useful but does not replace these reviews.
3. **Complete data and licensing readiness (P0/P4).** Finish the selective reuse inventory and confirm attribution/share-alike obligations for the Jōyō corpus, topic taxonomy, font files and adapted identity assets. Keep the overall project license decision open until explicitly approved.
4. **Human-review the learner-facing content (P4/P6).** Review Persian glosses, Japanese readings and vocabulary examples; track stable content IDs, source, reviewer, review date, defects and corrections. Source gloss presence is not evidence of correct Persian teaching content.
5. **Strengthen study-flow behavior (P6).** Validate interruption/recovery and session completion, unavailable/invalid content, safe repeated rating, stale-content prevention, and exact scheduler-write boundaries. Adaptive learner-model planning and broader recovery semantics are not implemented in this slice.
6. **Finish saved-item management and Explore acceptance (P7).** PR #47 moved the selected mobile kanji detail before collections and optional Anki tools. Its exact PR-head [CI/screenshot run](https://github.com/ArdKam/Rinemi2/actions/runs/39841371594) passed; the 320px Persian RTL and 390px English LTR selected-detail screenshots were inspected, and Playwright asserts detail order, Back/Escape, focus and scroll-context restoration. At that earlier integration checkpoint, main CI and deployed Chromium verification passed on `65e92fc8c539a92d4cc13841e653a563e96d2e8b`; current deployment evidence is linked at the top of this roadmap. Keep UIUX-001/004/005 open for remaining manual keyboard/screen-reader, long-gloss, large-result and zero-result acceptance rather than treating implementation as full UX sign-off. See [UI/UX review register](docs/UI-UX-REVIEW-REGISTER.md).
7. **Reproducible dependency installation and bundled font notices — implemented.** A committed npm lockfile pins dependencies; CI and Pages use `npm ci`; `npm test` also checks the full OFL notices and required copyright notices for all three bundled font families.
8. **Complete end-to-end Anki import (P8).** The text parser, support matrix and safe preview/field-mapping UI are available. Next define explicit duplicate disposition and unsupported content handling, then design persistent imported-note identity and a distinct scheduling contract before enabling any import writes. Add preview-only/cancel/no-write tests; then implement recoverable storage failure and rollback. Keep .apkg/.colpkg and media out of scope until their own parser/fixture/recovery gates pass.
9. **Build the kanji-to-reading path (P9).** Select a licensed, level-appropriate, reviewable reading corpus; add vocabulary-to-reading links only after the Japanese and Persian content is checked.
10. **Validate data controls and finish P10.** Local JSON backup, restore preview, and data erasure are implemented on main. Record manual acceptance of replacement confirmation, storage failure/rollback, and erase; finish privacy/legal review, offline/PWA behavior, and account/sync/conflict policy before adding server-backed account features.
11. **Complete beta hardening (P12).** Freeze one candidate SHA, rerun automated and browser checks from a clean checkout, attach exact screenshots/results, resolve all blocking issues, verify the chosen deployment artifact and actual runtime, and publish known limitations.

### Current execution checklist

- [x] Written product/design/learning/quality specifications are present.
- [x] First functional application slice is merged to `main`.
- [x] Automated post-merge CI passed on application-code SHA `1929c774b67c8ec3990f1ccb2f43aef7c463e7f1` ([run](https://github.com/ArdKam/Rinemi2/actions/runs/39859508305)).
- [x] Pages deployment, smoke test and live Chromium verification passed on the same application-code SHA ([deployment run](https://github.com/ArdKam/Rinemi2/actions/runs/39859508390)).
- [ ] Manual rendered-browser, usability and accessibility acceptance.
- [ ] Human review of learner-facing Persian/Japanese starter content.
- [ ] Selective source/license review complete (upstream KANJIDIC2/EDRDG declaration and UI attribution are in place; exact corpus/share-alike, topic taxonomy, identity asset, font-binary and project-license approval remain open).
- [x] Committed npm lockfile; CI and Pages deployment use `npm ci` and validate clean installs.
- [ ] Adaptive/recovery semantics, remaining collection bulk operations, end-to-end Anki import, and reading-transfer work; collection rename/clear/delete are implemented but still need rendered UX acceptance.
- [ ] Manual acceptance of local backup/restore/erasure and PWA install/update/cache behavior; full privacy/legal review and owner approval of exact source/font/application terms; storage-failure/rollback behavior.
- [x] Hosting configuration and public URL verified on the actual Vite build; latest Pages deployment/live Chromium checks passed on application-code SHA `1929c774b67c8ec3990f1ccb2f43aef7c463e7f1` ([run](https://github.com/ArdKam/Rinemi2/actions/runs/39859508390)). Earlier `de3b9ef` verification remains historical evidence.
- [x] Automated live preview runtime check covers React mount, the core review flow, locale/theme changes, brand assets, mobile width and runtime/network errors.
- [ ] Manual accessibility/usability acceptance: keyboard-only/focus, zoom, reduced-motion/forced-colors, screen-reader, Explore/collections and non-happy-path review.
- [ ] Candidate release evidence assembled and beta gate approved.
- [ ] Verify the owner-supplied raster mascot asset and both placements (Today-page heading and empty-session recovery) in Persian RTL / English LTR, light / dark, narrow mobile / desktop; confirm public Pages serves the base-prefixed WebP and capture rendered screenshots before marking visual acceptance complete. See [Mascot Design System](docs/MASCOT-DESIGN-SYSTEM.md).

**Repository boundary:** `ArdKam/kanji5` remains reference-only. All implementation and documentation changes must remain in `ArdKam/Rinemi2`.

**Release policy:** a merge, green CI run, successful Pages workflow, or source artifact alone is not proof of a working hosted application. Completion must be recorded against the exact candidate commit and the evidence required by the relevant release gate.
