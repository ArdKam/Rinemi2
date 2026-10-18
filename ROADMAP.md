# Rinemi 2 — Product Redesign & Rebuild Roadmap

**Status:** Planning baseline approved for direct implementation from the written Sumi Play direction; image generation is optional and not a blocker. Application implementation starts in focused vertical slices.  
**Planning date:** 2026-10-18  
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
- **[Art direction & design system](ART-DIRECTION.md):** creative intent, visual principles, components, illustration rules and mascot.
- **[Design token contract](DESIGN-TOKENS.md):** semantic token policy, theme contract, typography/spacing/geometry rules and validation requirements; runtime values live in `../src/styles/design-tokens.css`.
- **[Learning design](LEARNING-DESIGN.md):** teaching sequence, card pedagogy, practice modes, content quality and evidence requirements.
- **[Reference & migration plan](REFERENCE-AND-MIGRATION.md):** what can be reused from `kanji5`, verification procedure, boundaries, licensing, data migration.
- **[Quality & release plan](QUALITY-AND-RELEASE.md):** test matrix, accessibility, content QA, security, release and evidence.
- **[Decision log](DECISIONS.md):** consequential decisions, alternatives, reasons, open questions.
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

1. **Use the approved written art direction.** The owner explicitly asked to skip image generation; do not block implementation on mockups. Treat the Sumi Play written direction in `docs/ART-DIRECTION.md` as the approved baseline, implement a small real vertical slice, then inspect rendered browser results and refine before expanding.
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
| P0 | Repository and evidence baseline | Separate, safe working boundary and verified reference baseline | None | IN PROGRESS |
| P1 | Product/UX blueprint | Journeys, scope, screen inventory, and success criteria drafted in specs | P0 | IN PROGRESS — planning docs drafted |
| P2 | Visual direction baseline | Written Sumi Play direction accepted; generated visual concepts optional | P1 | DONE — image generation explicitly skipped by owner |
| P3 | Art direction and design system | Translate written direction into tokens/components, then browser-verify | P2 | IN PROGRESS |
| P4 | Content/data audit and source adapters | Trusted content foundation with provenance and failure handling | P0, parallel to P1–P3 | IN PROGRESS |
| P5 | Shell, navigation, onboarding, Today | First usable product skeleton with real content density | P3, P4 | NOT STARTED |
| P6 | Learning card and practice journey | End-to-end learning, recall, feedback, ratings and recovery | P5, P4 | NOT STARTED |
| P7 | Explore, Dictionary, detail, bookmarks | Find and save kanji without search/filter overload | P5, P4 | NOT STARTED |
| P8 | Anki import and imported material | Safely import supported deck exports with preview and error reporting | P7, data identity design | NOT STARTED |
| P9 | Vocabulary-to-reading continuity | Connect mastered/known kanji to words and short reading | P6, P7, content QA | NOT STARTED |
| P10 | Progress, settings, account/data controls | Meaningful progress and understandable user control | P6 plus data contract | NOT STARTED |
| P11 | Accessibility, responsive and localization acceptance | Verified Persian/English, mobile/desktop, themes, and keyboard behavior | P5–P10 in increments | NOT STARTED |
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
- [ ] Validate the direction on actual rendered screens in-browser, including Persian RTL/English LTR, light/dark themes, mobile and desktop.
- [ ] Refine palette and components based on contrast/accessibility checks and real content density.

**Acceptance:** written art direction is the baseline; the real browser-rendered slice becomes the visual target for refinement. A generated picture is optional, not acceptance evidence.

## P3 — Art direction and design system

**Goal:** establish one tokenized visual language before polishing individual features.

- [ ] Finalize brand signature, logo/mark placement and wordmark behavior in RTL.
- [x] Establish the canonical runtime token sheet at `src/styles/design-tokens.css` for semantic colors, surfaces, actions, selection, focus, statuses, typography, spacing, radii, borders, elevation, layering and motion.
- [x] Record the primary-action decision: vermilion/coral in both themes, indigo secondary, and separate destructive/error roles (D-012).
- [ ] Verify text and control contrast in light/dark themes; do not rely on color alone for semantic status.
- [x] Define typography and line-height roles for Persian, English, kana, kanji, readings, dense dictionary entries, and large character displays.
- [x] Define spacing, radius, border, shadow/elevation, content width, layering, motion, focus and disabled tokens.
- [ ] Set a default rule against unnecessary nested cards, decorative gradients, arbitrary badges, and component-level style patches.
- [ ] Specify buttons, icon buttons, chips, segmented controls, search/filter fields, menus, dialogs, toasts, progress indicators, skeletons, error panels, lists, dictionary entries, review ratings, tabs and navigation.
- [ ] Define interaction states: idle, hover, focus, active, selected, disabled, loading, success, warning, destructive, and failure.
- [ ] Define reduced-motion alternatives and ensure motion communicates state or teaches a skill.
- [ ] Create illustration and mascot standards; establish which screens merit custom artwork and which must remain typographic.
- [ ] Add a pre-React theme bootstrap that resolves `rinemi.theme` and sets root `data-theme` before first paint.
- [ ] Ensure React, onboarding and the pre-React/loading shell consume the same root theme and canonical token sheet; no independent palette or theme logic.
- [ ] Remove duplicate palettes and local copies as components are introduced; allow standard UI color literals only in the token sheet.
- [ ] Build a small rendered component gallery to verify tokens on actual devices and themes.
- [ ] Add automated contrast checks and design QA screenshots to PRs when visual behavior changes.

**Acceptance:** one coherent token/component baseline; no parallel token set; theme is resolved before first paint and shared across the app shell, React and onboarding; core components render consistently in Persian RTL, English LTR, light and dark mode. P3 remains IN PROGRESS until rendered-browser and contrast evidence is recorded.

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
- [ ] Preserve query and relevant navigation context when opening and closing details.
- [ ] Provide a clear detail hierarchy: character and essential meaning, common readings in use, vocabulary, structure, stroke-order reference, lookalikes, and source/reference notes.
- [ ] Distinguish what is useful to learn now from what is useful to consult.
- [ ] Make search empty/no-match/offline/failure states actionable.
- [ ] Add a bookmark action in both detail and relevant learning contexts.
- [ ] Build saved-items view with search, filters, creation/rename/delete for collections, add/remove and bulk selection, confirmation for destructive bulk actions, and focused practice from a collection.
- [ ] Treat bookmarks and collections as organization only; they must not silently alter due dates, mastery or scheduler state.
- [ ] Avoid adding a tag, badge, chip or icon where the same information is already visually obvious.
- [ ] Verify large collections, zero results, duplicate saves, keyboard navigation and mobile reachability.
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
- [ ] Check installation/update/offline behavior only for features actually claimed to work.
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

- [ ] Product and UX specification.
- [ ] Art direction and design-system specification.
- [ ] Learning design and content-quality specification.
- [ ] Reference/reuse inventory, source/license matrix, and selected source SHAs.
- [ ] Decision log with date, status, alternatives and rationale.
- [ ] Screen/flow acceptance checklist.
- [ ] Component gallery and approved visual references.
- [ ] Content QA sampling register and correction queue.
- [ ] Anki import format/support matrix and test-fixture inventory.
- [ ] Automated test matrix and browser screenshot baseline.
- [ ] Accessibility issue log.
- [ ] Privacy/security/data lifecycle model.
- [ ] Release checklist and exact-SHA evidence.
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

## 9. Initial execution status

Planning baseline only; no UI, application code, engine integration, import parser, sync, or production deployment has been declared complete.

**Current execution order:**

1. [ ] Review this roadmap and specialist plan documents for internal consistency.
2. [ ] Complete P0 reference/reuse inventory using current evidence.
3. [ ] Complete P1 journeys and acceptance criteria.
4. [x] Use the user's existing written Sumi Play direction as the P2 baseline; image generation is skipped and is not a blocker.
5. [ ] Continue P3/P4 in small reviewable increments.
6. [ ] Build vertical Slice A only after Gate A.
7. [ ] Keep `kanji5` untouched throughout.

**First implementation task after planning approval:** deliver a browser-verifiable prototype of Today + the two learning-card states using real Japanese characters and realistic Persian/English content. Start with a minimal vertical slice, not the full application; refine from actual browser renders. Do not wait for generated mockups.

**Release policy:** only the verified state of the target repository and exact candidate commit determines completion. This roadmap is a plan, not evidence that work is implemented or deployed.
