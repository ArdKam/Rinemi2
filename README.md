# Rinemi 2

Rinemi 2 is a clean, separately developed Persian-first kanji learning studio. Its goal is to help learners understand kanji, retrieve meanings and readings, connect characters to useful vocabulary, and transfer that knowledge into Japanese reading.

**Current state:** planning/specification plus a standalone design-token baseline. The application UI and engine integration have not been implemented.

## Start here

1. [Roadmap and release gates](ROADMAP.md) — canonical phase order and status.
2. [Product and UX specification](docs/PRODUCT-AND-UX-SPEC.md) — target learner, navigation, journeys, and screen behaviors.
3. [Art direction](docs/ART-DIRECTION.md) — creative intent, visual principles, illustration and mascot rules.
4. [Design token contract](docs/DESIGN-TOKENS.md) — token roles, theme contract, typography, spacing, focus and validation policy; runtime values live in `src/styles/design-tokens.css`.
5. [Learning design](docs/LEARNING-DESIGN.md) — educational information hierarchy, practice behavior, content quality, and evidence.
6. [Reference and migration plan](docs/REFERENCE-AND-MIGRATION.md) — safe reuse of verified material from `ArdKam/kanji5`.
7. [Quality and release plan](docs/QUALITY-AND-RELEASE.md) — accessibility, test matrix, security/privacy, and release evidence.
8. [Decision log](docs/DECISIONS.md) — durable decisions and unresolved questions.

## Hard boundary

`ArdKam/kanji5` is reference-only. Do not write to, merge into, deploy, or alter the configuration of that repository. All Rinemi 2 changes belong in this repository and must be verified against its own commit SHA.

## Current status

The planning baseline is present on `main`; the design-token contract and initial CSS token sheet are being reviewed separately before application-shell integration. No finished application UI or production deployment is claimed. The written Sumi Play direction is the approved starting point. Image generation is optional and explicitly skipped; the first rendered implementation slice must be verified in a real browser before expanding.
