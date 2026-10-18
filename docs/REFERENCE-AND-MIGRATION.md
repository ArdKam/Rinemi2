# Rinemi 2 — Reference, Reuse and Migration Plan

**Purpose:** selectively use verified assets from `ArdKam/kanji5` while keeping Rinemi 2 independent and protecting the source project.

## 1. Non-negotiable separation

- `ArdKam/kanji5` is read-only reference material for this effort.
- All new files, adaptations, fixes, commits, branches, configuration and deployment work belong to `ArdKam/Rinemi2`.
- Do not rename, reconfigure, deploy, merge into, or make drive-by changes to `kanji5`.
- Do not use its production credentials, secrets, Supabase records, private backups or user-specific data.
- Do not assume that a source file visible in the repository is current, shipped, correct, independently licensed, or safe to transplant.
- Before reusing any important code/data, inspect the current default branch and the exact source revision; historical descriptions and prior assistant notes are not current verification.

## 2. Reuse categories

Classify candidate material as one of:

1. **Reuse unchanged** — source, license, tests, dependency contract and behavior are verified.
2. **Reuse via adapter** — useful domain behavior is retained behind a small, testable boundary.
3. **Transform / re-author** — useful source data is normalized, enriched, filtered or redesigned with provenance and tests.
4. **Reference only** — informs decisions but is not copied.
5. **Exclude** — unknown license/provenance, obsolete design, untested behavior, unsafe dependency, or inappropriate scope.

Every decision needs a row in the reuse inventory: item/path, exact inspected commit SHA, purpose, authority, upstream license, dependencies, test coverage, target decision, adaptation plan and reviewer.


### Default priority and ordering

The detailed candidate/status register is [`docs/KANJI5-REUSE-INVENTORY.md`](KANJI5-REUSE-INVENTORY.md). Read it before every inspection or extraction and update it as decisions are verified. The register lists audit candidates; it does not mean any candidate has passed data, legal, architectural or UX acceptance.

Use this default sequence:

1. **First, establish the gap on current Rinemi 2.** Rinemi 2 already has its own 2,136-kanji corpus, topic/JLPT filtering, a reveal-and-rate study loop, local `ts-fsrs` scheduling, bookmarks, named collections, backup/restore and local-data erasure. Check the current implementation, open PRs, tests and rendered pages before proposing work; don't recreate an existing capability just because Kanji5 has a parallel version.
2. **Audit high-value educational data.** Compare topic assignments, vocabulary examples, word-specific readings, component/visual-structure information and stroke-order resources field-by-field. Transfer only validated gaps or demonstrably better sourced content. Record provenance and license; treat source glosses as source glosses, not reviewed Persian teaching content.
3. **Reproduce the learning behavior deliberately.** Learn from Kanji5's Meaning, Reading, Production, Vocabulary and Context contracts, learner-model/planner behavior and recovery rules. Start with a crisp recall target and reliable answer feedback; add a mode only when its content, grading contract and maintenance cost are acceptable.
4. **Add memory aids and reference depth progressively.** Mnemonics, component breakdown and similar-kanji contrasts must be trustworthy, clearly labeled and subordinate to the core answer. The review card is not the entire dictionary.
5. **Defer broader reading pathways and complex integrations until the core passes acceptance.** A Reading Lab, additional adaptive modes, account/sync or broader import support must solve a specific learner need and have their own content/data/security acceptance. Feature parity by itself is not a reason to expand scope.

For every candidate, choose one explicit outcome: reuse unchanged, reuse through an adapter, transform/re-author, reference only, or exclude. Do not turn this priority order into a claim that any phase is already complete; `ROADMAP.md` remains authoritative for phase status.


## 3. Priority audit targets

Inspect selectively, not by blindly copying the repository:

### Product/design documentation
- Current brand guide, product strategy and competitive positioning.
- Current learning effectiveness roadmap and educational content audit.
- Current project structure/architecture document.
- Current release evidence and limitations where it affects learner-facing claims.
- Existing screen and rendered visual behavior when a browser or screenshot can verify it.

Use these documents to understand intended semantics and product choices. They do not prove current runtime behavior by themselves.

### Educational/domain data
- Kanji dataset and reading/meaning fields.
- Topic taxonomy and topic-character assignments.
- Vocabulary examples and their source identifiers/normalization.
- Stroke-order data or assets.
- Component/visual-structure information and any confidence/provenance.
- Curated mnemonics, guided scaffolds and personal mnemonic storage contracts.
- Confusable-kanji relations and their target-specific visual contrasts.

For each dataset, inspect source metadata, license, completeness, duplicates, invalid records, update strategy, and representative content. Coverage counts are not quality evidence.

### Learning behavior
If the established engine is reused, document the runtime boundary and prove:
- the scheduler is the one authority for due intervals/review ratings;
- the learner model is the authority for learner state;
- the adaptive planner is the authority for practice selection;
- grading and recovery semantics are not duplicated in the UI;
- persistence and sync rules remain behind one approved boundary;
- imported material cannot mutate the engine outside supported contracts.

Avoid porting the old UI along with the engine merely because it is in the same directory.

### Assets/fonts/licenses
For every copied/adapted font, illustration, glyph asset, audio file, icon or dataset:
- record origin, creator/provider, license, source link, exact version and required attribution;
- check redistribution and modification rights;
- keep original and transformed assets distinguishable;
- do not strip license headers or attribution notices;
- exclude items with unclear rights until resolved.

## 4. Things that must not be copied blindly

- Legacy, duplicated or compatibility-only presentation flows.
- Old visual style that conflicts with the selected Rinemi 2 direction.
- CSS patch stacks or component-local visual overrides.
- Any second copy of scheduler, learner state, grader, recovery or sync logic.
- Persistence schemas or keys without a migration/compatibility plan.
- Production environment variables, auth/session configuration or live user data.
- External API behavior treated as guaranteed content authority.
- Imported Anki records treated as verified Rinemi educational content.
- Any generated mnemonic or decomposition described as established etymology.

## 5. Boundary design

Prefer small explicit adapters around reused behavior and data. Each adapter documents:
- input/output shape and version;
- identity rules;
- ownership of state;
- error/empty/unavailable behavior;
- offline behavior;
- provenance;
- tests and compatibility fixtures;
- what it intentionally does not support.

Presentation should consume typed view models or well-defined service results, not reach into hidden storage/planner internals. Keep authority rules in the learning engine rather than reimplementing them in React components.

## 6. Data portability and migration

Do not attempt a broad migration merely to get the new UI running. First decide whether the new product can read a supported source format through an adapter.

For learner progress, bookmarks, collections, personal mnemonics and imported cards:
- define stable identities;
- define schema versioning and validation;
- separate content identity from review-card identity;
- define duplicate and conflict handling;
- preserve user-created content;
- offer backup/export before destructive transitions;
- test old/new/malformed/partial input;
- make failure atomic or explain exactly what was applied;
- never silently reset a due interval, score, mnemonic or collection.

Do not import live learner data from the reference environment into fixtures. Use synthetic or properly anonymized fixtures.

## 7. Change isolation and audit trail

- All implementation happens on a Rinemi2 feature branch.
- Each PR names any `kanji5` reference paths and exact source revision it relies on.
- Do not write upstream compatibility patches into `kanji5`; if a defect blocks reuse, decide whether an isolated Rinemi2 adapter/fix is sufficient.
- Re-verify the target repository before every write operation and PR creation.
- If any accidental write to `kanji5` occurs, stop, disclose, identify exact affected object/commit and seek a safe remediation; do not conceal it.
- Before release, inspect changed-file manifests and deployment configuration to prove no source-repo side effects.

## 8. Reuse acceptance checklist

For each reused item:
- [ ] Current source revision recorded.
- [ ] Intended role and state authority documented.
- [ ] License/provenance verified.
- [ ] Inputs/outputs and failure modes known.
- [ ] Relevant test fixtures exist.
- [ ] Offline/network behavior known.
- [ ] No credentials or personal data included.
- [ ] No old presentation or duplicate logic accidentally coupled.
- [ ] Adaptation and limitations described.
- [ ] A reviewer can reproduce the selection decision.
