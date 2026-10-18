# Kanji5 → Rinemi 2 Reuse Inventory

**Purpose:** give every future review a durable, evidence-based answer to what Rinemi 2 should learn from or reuse from Kanji5. This is a decision register, not an assertion that the listed material has already been imported or accepted.

- **Target product/repository:** `ArdKam/Rinemi2`; all implementation, branches, issues, documentation, pull requests and deployment changes belong here.
- **Reference repository:** `ArdKam/kanji5`; read-only reference. Never modify it as part of Rinemi 2 work.
- **Reference snapshot inspected for this register:** Kanji5 `main` at `b1a181abee4e2f08debb2d76bb5c6aaf2bd9eeee` (2026-10-18); re-check the latest main and open PRs before acting.
- **Target snapshot used to start this documentation work:** Rinemi 2 `main` at `54abf8b9f47dbb1690176584dbdc3c972448f734`; re-check current main before implementation or merge.
- **Governing documents:** [Roadmap](../ROADMAP.md), [Reference and Migration Plan](REFERENCE-AND-MIGRATION.md), [Product and UX Spec](PRODUCT-AND-UX-SPEC.md), [Learning Design](LEARNING-DESIGN.md), [Quality and Release](QUALITY-AND-RELEASE.md), [Decision Log](DECISIONS.md).

## Direction to preserve

**Use Kanji5 for high-value learning capability, verified educational data, behavioral contracts, and regression-test ideas. Do not transplant its accumulated presentation or duplicate its learning-engine responsibilities.**

Rinemi 2 is the canonical product, not a reskin of Kanji5. Preserve the Sumi Play editorial direction, Persian-first experience, Today → Learn → Explore information architecture, one obvious next action, progressive disclosure, and content-quality gates.

Rinemi 2 already has its own 2,136-kanji corpus, topic/JLPT filtering, reveal-and-rate study loop, local FSRS scheduling, bookmarks, named collections, backup/restore and local-data erasure. First identify a specific gap or verified quality improvement; do not recreate an existing capability merely because Kanji5 also has it.

## Candidate register

All entries below are **proposals to audit**, not approved code/data imports. A source path existing or a feature being described in documentation is not proof that it is shipped, correct, reusable, licensed for redistribution, or suitable for Rinemi 2.

| Candidate | Kanji5 reference paths (snapshot above; re-verify before use) | Target approach | Priority | Status / required evidence |
|---|---|---|---|---|
| Topic taxonomy and assignments | `frontend/src/app/kanji-topics.json`, `frontend/src/app/topic-taxonomy.ts`, `docs/KANJI-TOPIC-TAXONOMY.md`, `scripts/test-kanji-topic-taxonomy.mjs` | Transform only after comparing with `Rinemi2/src/data/kanji-topics.json`; keep Rinemi's own IDs/shape unless a documented migration is justified. | P1 | **TO AUDIT** — compare coverage, duplicates, mapping correctness, source/license and representative topic labels. |
| Vocabulary and word-specific readings | `frontend/src/app/VocabularyExamples.tsx`, `v1.8-vocabulary-core.js`, `v1.8-context-core.js`, related `scripts/test-v1.8-vocabulary.mjs` and vocabulary contract tests | Prefer content with provenance and deterministic behavior contracts; re-author to Rinemi 2's schema. Show useful, verified examples before expanding reference detail. | P0/P1 | **TO AUDIT** — sample Japanese writing, kana readings, meanings, ambiguity, source IDs, redistribution rights and failure behavior. |
| Learning-mode definitions and grading expectations | `v1.8-production-core.js`, `v1.8-vocabulary-core.js`, `v1.8-context-core.js`, `v1.9-outcome-core.js`, `v1.9-learner-model-core.js`, `v1.9-adaptive-planner-core.js`, `v1.9-recovery-core.js`, `ARCHITECTURE.md` | Use initially as behavioral/design references. Reuse code only after an explicit architecture decision and adapter contract; never duplicate grader, learner-model, recovery or planner authority in React. | P1, after core loop | **REFERENCE FIRST** — map current Rinemi 2 behavior and decide whether the value justifies a distinct implementation slice. |
| Component / visual-structure information | `kanji-components.json`, `frontend/src/app/ComponentBreakdown.tsx`, `frontend/src/app/ComponentLearningPath.tsx`, related component tests | Transform only with source/confidence metadata; distinguish observed components from etymology or mnemonic stories. | P1 | **TO AUDIT** — verify content, source, licensing, coverage, confidence and representative glyphs. |
| Stroke-order support | `frontend/src/app/StrokeOrderViewer.tsx`, `frontend/src/app/stroke-order-core.ts`, related stroke-order tests | Rebuild or adapt the useful learning behavior in Rinemi 2's design system; do not copy surrounding card/panel styling by default. | P1/P2 | **TO AUDIT** — inspect asset/data rights, accuracy, dependencies, touch behavior, reduced motion and offline needs. |
| Mnemonic support | `frontend/src/app/mnemonic-library.ts`, `frontend/src/app/mnemonic-support.ts`, `frontend/src/app/MnemonicSupport.tsx`, `frontend/src/app/prepared-mnemonic-core.js`, related tests | Adopt a content taxonomy and useful behavior only after review. Preserve source/provenance; distinguish reviewed mnemonic, learner-authored cue and generated scaffold. | P1 | **TO AUDIT** — review license, language/cultural fit, character-specific usefulness, factual claims, personal-data boundaries and how cues fade. |
| Review scheduling and session behavior | `review-runtime.js`, `v1.5-state.js`, `v1.6-session-core.js`, `v1.6-session.js` | Use as behavioral reference. Rinemi 2 already uses `ts-fsrs`; do **not** add a second scheduler or import storage/session state without a dedicated compatibility plan. | P0 test/contract review; code reuse undecided | **DO NOT PORT WHOLESALE** — define one authority, compare rating/interval semantics and test interruption/resume before any adoption. |
| Regression tests and failure scenarios | Relevant Kanji5 contract and browser tests adjacent to any selected capability | Re-author equivalent tests against Rinemi 2 components/contracts. Reuse fixtures only when license, privacy and expected behavior are verified. | P0, ongoing | **TO AUDIT PER FEATURE** — the target-specific test must fail on the target defect and pass on its accepted fix. |
| Reading Lab and guided reading | `frontend/src/app/ReadingLab.tsx`, `frontend/src/app/ReadingLabDialog.tsx`, `docs/LEARNING-EFFECTIVENESS-ROADMAP.md` | Treat as later product research/reference; don't expand before core recall and reviewed vocabulary are dependable. | P2, later | **DEFERRED** — define content corpus, licensing, level suitability, comprehension tasks and acceptance first. |
| Presentation, global CSS and navigation | `frontend/src/styles.css`, `frontend/src/experience-nav.css`, old page/component presentation | Reference only for observed interaction problems or relevant behavior; re-author in Rinemi 2's semantic tokens and component language. | Never wholesale-port | **EXCLUDE AS A PORT** — retain editorial hierarchy, responsive top navigation and restrained surfaces. |
| Persistence schemas, storage keys, live user data, Supabase/auth configuration | Existing Kanji5 state, storage and deployment environments | Do not copy by default. Use a documented export/import adapter only if a learner-data transfer requirement is approved. Never use production credentials or real private learner data. | Exclude unless separately approved | **EXCLUDE** — no live learner data, secrets, session credentials or unplanned migration. |

## Execution order for future work

1. **Baseline and gap analysis (P0):** inspect current `Rinemi2/main`, open PRs, deployed artifact, roadmap, design/learning specs, current tests and rendered screens. Record the exact source and target SHAs; distinguish merged, open-PR, deployed and merely documented features.
2. **Core study UX and regression safety (P0):** keep the learning target clear, answer information easy to access, and rating controls reachable. Validate on short mobile viewports, Persian RTL/English LTR, light/dark themes and keyboard navigation.
3. **Data/content audit (P0/P1):** compare current Rinemi 2 data with topic, vocabulary and reading candidates. Fill verified gaps rather than duplicating complete datasets. Human review and redistribution rights are release gates.
4. **Selective learning-depth additions (P1):** add well-scoped structure, mnemonic, confusable-character, production or vocabulary capability only where it addresses a known learner need and has valid content plus deterministic acceptance tests.
5. **Reading expansion and broader imports (P2):** advance to guided reading or expanded import behavior only after the core journey, content trust, accessibility and data-integrity requirements are met.

This order does not automatically change `ROADMAP.md` phase statuses. Update the canonical roadmap only when the current branch and evidence show a real status change.

## Required protocol for every future inspection/extraction

- [ ] Read this register and the current roadmap/specs; inspect current target `main`, all relevant open PRs, and deployed/rendered evidence. Do not rely on earlier summaries or stale screenshots.
- [ ] Verify whether the capability already exists in Rinemi 2, including tests, content, failure states and current visual behavior.
- [ ] Inspect the precise Kanji5 source path at an exact commit; record commit SHA, license/provenance, dependencies, status (main/open PR/deployed), inputs/outputs, failure modes and test coverage.
- [ ] Choose one category explicitly: unchanged, adapter, transform/re-author, reference only, or exclude. Record rationale and whether a port is actually necessary.
- [ ] Make all code and docs changes only in Rinemi 2, on a focused feature branch and PR. Do not modify Kanji5.
- [ ] Preserve one authority for scheduling, learner state, grading, recovery, planning, persistence and sync. Keep user-created notes and review history safe.
- [ ] Validate the target behavior with relevant automated tests and current rendered browser evidence; test keyboard/focus, reduced motion, themes, RTL/LTR, responsive layouts and failure states where applicable.
- [ ] Update this inventory with the decision, target PR/commit, evidence, limitations and status. Do not mark an item reused/done merely because a patch or CI run exists; require acceptance and, for deployment-dependent claims, verified deployment.

## Status definitions

- **TO AUDIT:** no sufficient current-source, data, license and target-gap review has been completed.
- **REFERENCE FIRST:** study the behavior/contract before making a code-port decision.
- **ADOPTED:** an explicit reuse decision and adaptation have been reviewed and merged into Rinemi 2, with evidence recorded.
- **VERIFIED:** the relevant target behavior has passed the required tests and rendered/manual acceptance against an identified commit.
- **DEFERRED / EXCLUDED:** no implementation expected unless a new learner need and scope decision reopen it.
