# Rinemi 2 — Product and UX Specification

**Status:** Approved written Sumi Play baseline; image generation and visual-concept selection are optional and do not block implementation.  
**Authority:** This document owns product intent, navigation, screen behavior, and user journeys. `ROADMAP.md` owns phase status and execution order. `docs/UI-UX-REVIEW-REGISTER.md` preserves cross-cutting review findings and their verification status; consult it before later inspections.

## 1. Product intent

### North star
Help Persian-speaking learners build usable kanji knowledge through Persian-first explanation, focused retrieval, relevant vocabulary, and gradual transfer into reading.

### Primary user
A self-directed learner who can read or is learning kana and needs a dependable way to understand kanji and use that knowledge while reading Japanese.

### Core jobs
- Understand the central meaning of a kanji in natural Persian.
- Recall meaning and useful readings without relying on constant recognition cues.
- Understand readings through words, not uncontextualized lists alone.
- Diagnose recurring confusions between similar characters.
- Find a character, save it, and return to it later.
- Connect known kanji to vocabulary and short reading.
- Study for a realistic amount of time, then resume after interruptions or missed days.
- Bring an existing Anki collection when switching costs are a barrier.

### Product promises
- Persian-first educational support, not only translated chrome.
- One obvious next step in the core journey.
- Personalization that remains understandable and does not interrupt study.
- A calm, adult, editorial visual language.
- Local/guest-first study wherever the chosen architecture can reliably support it.
- Transparent content provenance, import limitations, data handling, and product limitations.


### Kanji5 reuse rule

Kanji5 is a reference for proven learning capabilities, educational data and regression scenarios—not Rinemi 2's visual baseline or a mandate for feature parity.

- Preserve Rinemi 2's Sumi Play editorial direction, Persian-first interaction design, Today → Learn → Explore information architecture, and one obvious next action. Do not wholesale-port Kanji5 screens, global CSS, floating navigation, nested-card treatment or accumulated component overrides.
- Extract the learner value, not necessarily the source implementation. Re-author interactions with Rinemi 2's semantic tokens and components; progressive disclosure should keep the task-relevant answer and useful vocabulary easy to see while leaving secondary reference material optional.
- Treat Kanji5's learning modes, grading, learner model, adaptive planning, recovery and session behavior as contracts to study. Do not introduce competing schedulers or duplicate domain decisions in the UI. Any engine reuse requires an explicit architecture decision, a single-authority map and tests proving compatibility with Rinemi 2's state and data model.
- Prioritize verified Persian explanations, correct Japanese readings, high-value vocabulary, useful memory support and mobile review ergonomics over raw feature count. Every new capability needs a learner problem, trustworthy content/source, failure behavior, accessible interaction and clear maintenance scope.
- Use the [Kanji5 reuse inventory](KANJI5-REUSE-INVENTORY.md) and [reference/migration plan](REFERENCE-AND-MIGRATION.md) to decide what to adopt, adapt, reference or exclude. Re-check source revisions and rendered behavior; historical screenshots or an open PR are not proof that a feature is shipped or accepted.


### Non-goals
Do not build a general-purpose Anki clone, full grammar course, social feed, leaderboards, AI chat tutor, complex reward economy, or a feature surface designed for competitor parity. Each future addition requires evidence and a documented maintenance plan.

## 2. Information architecture

### Primary destinations

**Today**
- Next recommended action: resume session or start a useful session.
- Due review and new-learning workload.
- One understandable estimate of effort when it can be computed honestly.
- A small progress snapshot and relevant warning only when actionable.
- Clear all-caught-up state and a calm missed-day return path.

**Learn**
- Current prompt and exercise.
- Reveal/answer, appropriate feedback, optional useful hint, rating/recovery, and next task.
- Session completion and safe interruption/resume when supported.
- No unrelated dashboard data or exploration controls in the primary review focus.

**Explore**
- Search and browse entry points.
- Kanji detail/reference.
- Topic and level browsing.
- Saved kanji and collections.
- Vocabulary and reading entry points.
- Start a focused practice session from selected items, without corrupting ordinary scheduler state.

### Secondary destinations
Settings, language/theme, data management, help, account/sync (if enabled), detailed progress, import history, and feedback. Secondary tools must not compete with the three primary destinations.

## 3. Critical user journeys

### J1 — First visit to first useful recall
1. App opens in the chosen default language and a coherent initial theme.
2. Onboarding explains the product promise in a few short steps; user may skip nonessential education.
3. No mandatory account wall before the learner can meaningfully study.
4. Learner starts one recommended activity with clear instructions.
5. Prompt presents one task, then reveals the answer on a deliberate action.
6. Learner gets evidence-based feedback and a clear next action.
7. A short completion state summarizes the completed session without overstating mastery.
**Success:** user reaches and completes one useful exercise without confusion or mandatory account creation.

### J2 — Normal returning session
1. Today shows due work and the next action.
2. Learner starts/resumes.
3. Exercise selection respects the authoritative learner model and scheduler if reused.
4. Rating/recovery behavior is explicit, fast, and repeat-safe.
5. Session can end naturally; missing a day does not create a shame-based penalty.
**Success:** learner can start quickly and understand how to finish or pause.

### J3 — Search to saved kanji
1. Learner searches by supported character, reading, meaning, or topic.
2. Result rows show enough information to disambiguate, without becoming mini dashboards.
3. Detail opens while preserving the originating query/filter context.
4. Learner inspects meaning, readings-in-use, vocabulary, and reference details.
5. Learner bookmarks the character or adds it to a collection.
6. Learner can find the item again and optionally study the collection.
**Success:** save and retrieval feel reliable; save does not alter scheduled review state.

### J4 — Similar-kanji confusion
1. Learner opens a character, or an exercise is selected to address a verified confusion.
2. Interface shows the visual contrast and the relevant distinguishing details.
3. Explanation distinguishes verified structure from a memory mnemonic.
4. A follow-up retrieval exercise tests the distinction; later evidence should be checked before claiming the confusion is resolved.
**Success:** information assists discrimination without inventing historical or linguistic explanations.

### J5 — Bring an Anki deck
1. Learner chooses a supported export and sees supported formats and privacy behavior.
2. Parser validates the file and shows a preview before writing any data.
3. Learner checks counts, field mapping, unsupported types/media, duplicate policy, and data that will not transfer.
4. Learner confirms or cancels.
5. Import completes with counts, skipped records, warnings, and actionable errors.
6. Learner can access imported material without silently replacing Rinemi content or changing a card's learning state unexpectedly.
**Success:** user understands what was and was not imported; failure is recoverable and never represented as success.

### J6 — Find vocabulary in a kanji reference
1. Learner opens a kanji.
2. A curated, source-aware set of useful words shows accurate writing, reading, and meaning.
3. The learner can save a word or enter a contextual practice path when the content is valid.
4. Navigation returns to the original kanji/collection/search context.
**Success:** reference naturally leads to useful practice rather than a disconnected feature.

### J7 — Switch language, theme, or direction
- Preference applies consistently across navigation, dialogs, cards, menus, data labels and status messages.
- Japanese text remains legible inside both Persian RTL and English LTR content.
- Language/theme change does not discard current progress, search or import state without explanation.

### J8 — Offline/partial availability
- Show cached/local content when available.
- Distinguish “there are no examples” from “examples could not load.”
- Mark optional network-dependent content honestly.
- Preserve the ability to continue core local study only when the actual runtime contract allows it.
- Provide clear retry behavior and never fake a successful save/sync/import.

## 4. Screen specifications and hierarchy

### Today
Primary: recommended next action.
Secondary: due count, new-learning target, estimated session effort and small recent progress.
Tertiary: detailed analytics and advanced controls.

Avoid:
- Multiple equally prominent start buttons.
- Four or more unrelated statistic tiles competing with the CTA.
- Progress bars that imply mastery without evidence.
- Large onboarding explanations after onboarding has finished.
- Streak pressure or punishing missed days.

Required states: initial loading, new learner, due work, due + new work, no due work, session in progress, failed data read, offline, empty/unknown progress.

### Learning — unrevealed
- Character or prompt is the primary focal point.
- One clear retrieval instruction.
- One obvious reveal/submit path; keyboard interaction is discoverable.
- Any topic/mode label is secondary.
- Avoid showing the answer through accidental accessibility labels or hidden DOM if the question is intended to test recall.

Required states: prompt loading, prompt ready, input required if applicable, unknown/skip option where supported, exercise unavailable, stale request, keyboard focus, reduced motion.

### Learning — revealed
1. Core answer/meaning.
2. One or more useful reading examples when relevant.
3. Verified vocabulary/context evidence.
4. Optional memory aid or structure details when they help this learner.
5. Reference expansion.
6. Review rating and next action.

The layout must make the primary answer visible without forcing an excessive scroll. No sticky element may cover the active content or rating controls.

### Exercise/result feedback
- State what was correct or incorrect.
- Give a concise explanation only when educationally valid.
- Distinguish first-attempt performance from assisted retry/recovery.
- Avoid praise that misrepresents an unknown or near-miss outcome.
- Support keyboard and screen-reader announcement without moving focus unexpectedly.

### Kanji detail
- Character, core meaning and a useful pronunciation/reading context.
- Common reading-in-use with example words.
- Visual composition only with trustworthy data.
- Mnemonic support marked by source/role.
- Stroke-order reference.
- Similar kanji with a meaningful contrast.
- Provenance/reference note as needed.
- Bookmark/collection action.
- One way to start relevant practice.

### Explore/Dictionary
- Search-first layout.
- Frequent useful filters visible; advanced filters progressive.
- Selected filters persist clearly and can be individually removed or reset.
- Matrix/grid and detailed list views only if user needs support for both, not simply to add modes.
- Paginated/virtualized results remain keyboard navigable and do not lose query state.
- Character coverage counts are precise and contextualized; do not imply all topic assignments cover the full corpus.

### Bookmarks and collections
- A bookmark is a simple personal save action.
- Collections provide optional organization and have clear create/rename/delete behavior.
- Bulk add/remove actions must identify affected item counts.
- Destructive collection deletion requires confirmation when it would discard meaningful organization.
- Removing a bookmark does not delete the underlying kanji record or erase learning history.
- Collections must not change due dates, mastery, or the scheduler unless a separate, explicit action starts a study session.

### Import center
- Supported inputs and limits before file selection.
- Local processing/privacy explanation.
- Parse status, preview, field mapping, duplicate resolution, unsupported records/media and confirm action.
- Post-import report with imported/skipped/failed counts, warnings and rollback/removal route where supported.
- Never show a generic spinner indefinitely or a success state when the outcome is partial/unknown.

### Progress
- Focus on actionable signals: workload, delayed recall where measured, repeated confusions, and next recommended improvement.
- Present sample size/window and definitions where meaningful.
- Never describe an unvalidated proxy as “mastery.”
- Deep statistics are secondary.

### Settings and data controls
- Language, theme, daily target, audio, accessibility/motion, backup/restore and account/sync if supported.
- Plain labels and short explanations.
- Show confirmation before destructive reset or irreversible import/deletion.
- Provide clear data export, deletion and privacy information aligned to actual implementation.

## 5. Interaction principles

- Each view should have one dominant task.
- Prefer direct manipulation and clear text over unfamiliar icons alone.
- Persistent controls must never overlap important content.
- Dialogs are reserved for focused tasks that truly need interruption.
- Avoid notification/toast-only confirmation for high-impact operations such as import, restore or deletion; provide a durable result.
- Preserve user context when opening detail views.
- Never discard unsaved edits silently.
- Use loading states for actual work; use skeletons only when layout is stable and they do not imply false data.
- All meaningful controls need hover/focus/pressed/disabled/loading/error states.
- User-facing terminology must distinguish a study session, review rating, bookmark, collection, imported note, and kanji identity.
- Empty states should explain the situation and offer the next useful action, not serve as decorative illustration canvases.

## 6. Content density and responsive behavior

- Phone portrait: one primary column; minimal side-by-side controls; controls reachable without covering content.
- Compact landscape: protect the card's vertical space; don't force a huge header or sticky nav to cover the prompt.
- Tablet: expand reading/detail content moderately; avoid stretched line lengths.
- Desktop: use a restrained content width; whitespace should support reading rather than create excessive empty distance.
- Long Persian copy, long English definitions and Japanese examples are required test fixtures.
- Filters may become a drawer on mobile, but selected-filter state must remain visible.
- Review controls stay predictably placed across prompts and reveal states.
- No meaningful content may only be communicated by an icon, color, motion or pointer hover.

### Review-derived requirements to carry into implementation and acceptance

The [UI/UX review register](UI-UX-REVIEW-REGISTER.md) is the durable record of current review findings. These requirements extend the behavior contract; do not treat them as accepted until exercised in the rendered app.

- **Explore on mobile:** selecting a kanji must make its details immediately apparent without requiring the learner to scroll through a long results list. A dedicated detail view, bottom sheet/dialog, or equivalent focused pattern is acceptable if it preserves search/filter/collection/scroll context and has coherent Back, close, Escape, and focus-return behavior.
- **Keyboard shortcut ownership:** a global Space or numeric shortcut must not override native button/link activation or consume keystrokes intended for text/form controls. Prefer native button keyboard semantics wherever possible.
- **Revealed-card reachability:** keep meaning, useful reading/context evidence, optional reference detail, and review ratings in the intended hierarchy. Review actions must remain predictably reachable on short phone and landscape screens; any fixed/sticky action must reserve space and never obscure content.
- **Dictionary disambiguation:** show a useful reading when reliable data exists, avoid single-line truncation that makes long glosses indistinguishable, and keep metadata secondary to the kanji and meaning.
- **Large result sets:** do not silently cap broad Explore searches at a fixed initial set without an accessible continuation path. Any pagination/virtualization must retain query and selected-filter context and remain keyboard navigable.
- **Compact landscape:** validate short viewport heights and virtual-keyboard states, not only narrow viewport widths. Use a predictable scroll owner in panels/dialogs/drawers and keep the primary action reachable.
- **Today clarity:** a returning learner should identify due work and the next action immediately; a new learner should understand how to begin. Featured editorial content must be distinguishable from scheduled learning.

**Acceptance evidence:** use current rendered screenshots and task-based checks for 320px and 390px phone widths, 844×390 compact landscape, and desktop; Persian RTL / English LTR; light / dark; prompt and revealed-card states; selected Explore detail; and long content. Record exact commit, browser, results, screenshots, and unresolved findings in the review register and manual release checklist.

## 7. UX validation protocol

For each major release slice, test at least these task prompts with users unfamiliar with the implementation:
1. Start a useful learning session.
2. Find a kanji by a provided reading or meaning.
3. Explain what the central meaning and one common reading are.
4. Save the character and find it later.
5. Find what is due next and understand the review rating.
6. Import a sample deck and identify unsupported content before confirming.
7. Change language/theme and continue the current journey.

Record completion, errors, time only when meaningful, observed hesitation, and qualitative feedback. Do not use a tiny convenience sample to claim statistically significant improvement.

## 8. Open product decisions

Record and resolve in `DECISIONS.md`:
- Initial default language and first-run language detection behavior.
- Exact v1 Anki import formats and whether scheduling history is explicitly out of scope.
- Whether initial release supports collection nesting, labels, or only flat collections.
- Which reading passage set can meet content-review and licensing requirements.
- What session interruption/resume semantics are actually guaranteed by the selected engine.
