# Rinemi 2 — Decision Log

This file records consequential decisions, not every implementation detail. Update the relevant row when a decision changes and preserve the reason for the change.

## Accepted baseline decisions

### D-001 — Separate repository
- **Date:** 2026-10-18
- **Decision:** Rinemi 2 is built in `ArdKam/Rinemi2`; `ArdKam/kanji5` is read-only reference material for this project.
- **Reason:** allow a clean learner-facing redesign without destabilizing the existing product.
- **Consequences:** all writes, branches, PRs and deployments must target Rinemi2. Reused items require source/license/behavior verification.
- **Status:** ACCEPTED

### D-002 — Product positioning
- **Date:** 2026-10-18
- **Decision:** position Rinemi as a Persian-first kanji learning studio that connects understanding and recall to vocabulary and reading.
- **Reason:** focus on a coherent learning outcome rather than feature parity with general-purpose flashcard or broad language apps.
- **Evidence caveat:** market demand and better learning outcomes are not yet proven.
- **Status:** ACCEPTED AS STRATEGIC HYPOTHESIS

### D-003 — Primary navigation
- **Date:** 2026-10-18
- **Decision:** use three primary destinations: Today, Learn, Explore. Settings, accounts, help and detailed progress remain secondary.
- **Reason:** reduce the number of equally prominent destinations and keep the next learning action obvious.
- **Status:** ACCEPTED AS DESIGN BASELINE; validate in usability tests

### D-004 — Education before feature count
- **Date:** 2026-10-18
- **Decision:** prioritize correct Persian explanations, readings-in-use, reliable examples, targeted repair and context transfer over more modes and decorative rewards.
- **Reason:** content quality and learning transfer are the intended product differentiators.
- **Status:** ACCEPTED

### D-005 — Written art direction before scaffold
- **Date:** 2026-10-18
- **Decision:** use the established written Sumi Play direction as the approved starting point. Image generation and visual mockup selection are optional; implementation must be inspected in a real browser before the product is expanded.
- **Reason:** avoid making image generation a dependency while maintaining an explicit design system and a rendered-UI quality gate.
- **Status:** ACCEPTED

### D-006 — Reuse learning behavior selectively
- **Date:** 2026-10-18
- **Decision:** do not rewrite scheduler/grading/learner-state logic until a current-source audit proves what should be reused or replaced. Where reused, preserve one clear authority for each responsibility.
- **Reason:** avoid duplicate schedulers, incompatible learner states and destructive migration.
- **Status:** ACCEPTED

### D-007 — Bookmark semantics
- **Date:** 2026-10-18
- **Decision:** bookmarks and collections organize content only; they do not automatically change review intervals, mastery, or learning history.
- **Reason:** separate user curation from learning evidence.
- **Status:** ACCEPTED

### D-008 — Anki import is preview-first
- **Date:** 2026-10-18
- **Decision:** import must have a verified support matrix, preview, field mapping, duplicate policy, clear unsupported-content reporting, and recoverable failure behavior before it is considered released.
- **Reason:** user trust and learner-data integrity outweigh breadth of initial compatibility.
- **Status:** ACCEPTED

### D-009 — Mascot role
- **Date:** 2026-10-18
- **Decision:** the cat is a restrained supporting companion, not the tutor or the center of every screen.
- **Reason:** maintain recognizable brand character without infantilizing the product or distracting from recall.
- **Status:** ACCEPTED

### D-010 — No unsupported efficacy claims
- **Date:** 2026-10-18
- **Decision:** software tests, feature presence and usage metrics do not prove improved learning. Public educational claims require appropriate outcome evidence.
- **Reason:** distinguish product quality from efficacy.
- **Status:** ACCEPTED

### D-011 — Skip generated visual concepts
- **Date:** 2026-10-18
- **Decision:** do not block implementation on generated mockups; translate the existing written design brief into the first real UI slice and improve it from browser rendering evidence.
- **Reason:** the owner explicitly asked to continue without image generation.
- **Consequence:** visual QA still requires actual screenshots and accessibility checks; a generated mockup is not evidence of application quality.
- **Status:** ACCEPTED

## Open decisions

### Q-001 — First-run language
- **Question:** should initial language be explicitly selected, follow a safe browser-language heuristic, or ship Persian-first with a visible alternative?
- **Needed evidence:** target learner expectations, browser behavior, and ease of correcting the choice.
- **Must resolve by:** before P5 onboarding ships.
- **Status:** OPEN

### Q-002 — Anki import compatibility
- **Question:** what exact Anki export formats/versions and media/history elements are feasible for the first release?
- **Needed evidence:** current format specifications, real-world fixture set, licensing/privacy review, and parser design.
- **Must resolve by:** before P8 implementation.
- **Status:** OPEN

### Q-003 — Collections model
- **Question:** flat named collections only, or tags/nested collections later?
- **Default proposal:** begin with named flat collections and reliable search/filter; defer nesting until user evidence warrants it.
- **Must resolve by:** before P7 data contract.
- **Status:** OPEN

### Q-004 — Initial reading content
- **Question:** which small, reviewable, properly licensed corpus will support initial reading transfer?
- **Needed evidence:** source terms, level suitability, Japanese naturalness and Persian translation review capacity.
- **Must resolve by:** before P9 content authoring.
- **Status:** OPEN

### Q-005 — Deployment target
- **Question:** which isolated preview and eventual production host should Rinemi2 use?
- **Rule:** no assumption of shared Pages configuration or path with `kanji5`; verify ownership, deployment permissions and artifact behavior first.
- **Must resolve by:** before P12 release configuration.
- **Status:** OPEN

## Decision-change template

Copy this template for consequential decisions:

### D-XXX — Short title
- **Date:**
- **Decision:**
- **Alternatives considered:**
- **Reason/evidence:**
- **User impact:**
- **Data/privacy/license impact:**
- **Implementation and migration consequence:**
- **Verification required:**
- **Status:** PROPOSED / ACCEPTED / REJECTED / SUPERSEDED
