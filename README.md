# Rinemi 2

Rinemi 2 is a separately developed, Persian-first kanji learning studio. Its intended journey connects understanding a kanji, retrieving it, learning how it appears in vocabulary, and gradually transferring that knowledge into Japanese reading.

## Current implementation

**Status (2026-10-23):** The latest merged application-code snapshot is [`d983bc3`](https://github.com/ArdKam/Rinemi2/commit/d983bc3169f5d8f9cfed9be1d4f6a9103f9b2139). [PR #63](https://github.com/ArdKam/Rinemi2/pull/63) increases the target kanji's size on compact landscape screens and adds an 844×390 Playwright regression assertion; its full CI run [#197](https://github.com/ArdKam/Rinemi2/actions/runs/39991899942) passed, and the updated compact-landscape screenshot was inspected. The last independently confirmed Pages/live Chromium verification is still deployment [#44](https://github.com/ArdKam/Rinemi2/actions/runs/39940377108) for application SHA [`42ddab9`](https://github.com/ArdKam/Rinemi2/commit/42ddab9dca017146c458f2c8615896624c971951); a post-merge live verification of `d983bc3` has not yet been confirmed here, so do not treat the landscape change as live until the deployed SHA and screenshot are checked. The owner-supplied mascot WebP is verified live on the prior deployment. Rinemi remains **pre-release**: manual accessibility/usability, the 44-record teaching-content review, source/license approval, and data/PWA acceptance remain open. PWA support remains warm-cache only; cold-start offline, sync and cloud recovery are not promised.

Included in this slice:
- Three primary destinations: Today, Learn and Explore.
- Persian RTL by default; English LTR switch and light/dark/system theme preference (system follows the operating system).
- Responsive editorial layout based on the written Sumi Play direction.
- Consistent Rinemi cat mascot on the Today heading for new and returning learners, plus an empty-session recovery illustration; its identity and placement contract lives in [the mascot design system](docs/MASCOT-DESIGN-SYSTEM.md).
- Learning card with reveal, review progress and Again/Hard/Good/Easy ratings.
- Local FSRS scheduling, due-review queue and local browser storage.
- Search over 2,136 kanji, topic/JLPT filters, detail view and local bookmarks. Explore results expose available readings/glosses and an accessible continuation path through the filtered corpus; mobile selected detail appears before secondary collections/Anki tools, and Back/Escape restores result focus/scroll context.
- Named local collections with add/remove, rename, confirmed bulk-clear and deletion, collection filtering and focused sessions (first 20 items per session).
- Local JSON backup download, validated restore preview with explicit replacement confirmation, and local learner-data erasure.
- Versioned local storage migration from v1 to v2 that preserves review records and bookmarks.
- Small Persian gloss and vocabulary seed set, clearly distinguished from unreviewed source glosses.
- Persistent KANJIDIC2/EDRDG source acknowledgement with links to the official licence statement and the project provenance record.
- Full SIL Open Font License 1.1 notices for Noto Serif JP, Plus Jakarta Sans and Vazirmatn, with a regression check in `npm test`.
- Unit/data tests, Playwright browser journey tests, automated axe checks, and CI screenshot artifacts.
- Shared spacing, typography, radius, motion and focus tokens; semantic CSS consumers; system-theme bootstrap and browser `theme-color` synchronization.
- Committed `package-lock.json`; CI and Pages install dependencies with `npm ci`.
- Installable PWA shell: web manifest, 192/512px app icons, base-path-scoped service worker, and warm-cache offline browser tests. The Pages build/smoke checks rebased asset URLs; manual installation/update, installed-app behavior and cache-recovery acceptance remain pending.

Not yet implemented or accepted:
- Manual browser screenshot review and keyboard/focus, zoom, reduced-motion/forced-colors, screen-reader and broader usability acceptance.
- Human review of Persian glosses, Japanese readings/examples and translations in the 44-record starter set; the register currently marks these unreviewed. Track completion in [issue #24](https://github.com/ArdKam/Rinemi2/issues/24).
- Owner/legal approval of corpus attribution/share-alike obligations, exact font-binary provenance and reserved-name considerations, topic taxonomy, identity assets, and the overall application license. The upstream KANJIDIC2/EDRDG declaration and bundled font notices are now documented and displayed, but are not legal sign-off; see [issue #25](https://github.com/ArdKam/Rinemi2/issues/25).
- Multi-item collection selection/bulk add-remove and broader collection management; end-to-end Anki import (the text preview/field-mapping UI is read-only and does not persist or schedule imported notes); adaptive learner-model planning; and full reading-path integration.
- Manual installation/update/cache-recovery checks for the PWA, plus keyboard/screen-reader/zoom/forced-colors acceptance and storage-failure review of backup/restore/erasure controls.
- Complete privacy/legal review; cold-start offline use, sync and cloud recovery are not claimed.
- Public beta or any claim of measured learning efficacy.

## Verification and deployment status

- Latest deployed/evidence snapshot: [`42ddab9`](https://github.com/ArdKam/Rinemi2/commit/42ddab9dca017146c458f2c8615896624c971951). [PR CI](https://github.com/ArdKam/Rinemi2/actions/runs/39939967641) passed, and [Pages deployment/live Chromium verification #44](https://github.com/ArdKam/Rinemi2/actions/runs/39940377108) succeeded on the exact merged application SHA. The smoke test checked the base-prefixed `mascot/rinemi-cat-artwork.webp` asset, and live Chromium confirmed the Today illustration is visible and decodes successfully. The CI screenshot artifact and live Persian RTL/light desktop screenshot were inspected. Broader manual language/theme/viewport and accessibility acceptance remain open.
- The earlier detailed [CI](https://github.com/ArdKam/Rinemi2/actions/runs/39166049955) and [Pages browser run](https://github.com/ArdKam/Rinemi2/actions/runs/39166050054) passed on commit [`de3b9ef`](https://github.com/ArdKam/Rinemi2/commit/de3b9efb89698e395346be8fcdd77ef11517f87c).
- The Pages workflow publishes only Vite's `dist/` under `/Rinemi2/`; all 11 same-origin static resources returned HTTP 200 in that recorded run, including both brand marks, compiled JavaScript, CSS, theme bootstrap, icon and fonts.
- Historical live Chromium coverage verified React mount, the core reveal/rate/advance flow, locale/theme changes, brand assets, mobile width and runtime/network errors. Newer CI additionally covers mobile Explore Back/Escape/scroll/focus behavior, result continuation, responsive learning screens, 320px content insets, route-heading focus and answer-reveal focus, Anki text preview and the PWA warm-cache path. These automated checks and saved screenshots are exact-run evidence, not manual accessibility, teaching-quality or legal acceptance.
- Issues [#7](https://github.com/ArdKam/Rinemi2/issues/7), [#24](https://github.com/ArdKam/Rinemi2/issues/24) and [#25](https://github.com/ArdKam/Rinemi2/issues/25) track the remaining human accessibility/usability, teaching-content and source/licensing approvals. Use the [manual acceptance checklist](docs/MANUAL-RELEASE-ACCEPTANCE.md); automation, attribution links and license notices do not replace those decisions.

## Run locally

Requires Node.js 22 or newer.

```bash
npm ci
npm run dev
```

Checks:

```bash
npm test
npm run typecheck
npm run build
npm run e2e
```

A committed npm lockfile pins the dependency tree. Use `npm ci` for local setup and CI; update the lockfile deliberately whenever dependencies change.

## Source of truth

1. [Roadmap and release gates](ROADMAP.md)
2. [Product and UX specification](docs/PRODUCT-AND-UX-SPEC.md)
3. [Art direction and design system](docs/ART-DIRECTION.md)
4. [Learning design and content QA](docs/LEARNING-DESIGN.md)
5. [Reference and migration policy](docs/REFERENCE-AND-MIGRATION.md)
6. [Kanji5 reuse inventory and extraction priorities](docs/KANJI5-REUSE-INVENTORY.md)
7. [Quality and release policy](docs/QUALITY-AND-RELEASE.md)
8. [Data-source provenance](docs/DATA-SOURCES.md)
9. [Starter content QA register](docs/CONTENT-QA-REGISTER.md)
10. [Manual release acceptance checklist](docs/MANUAL-RELEASE-ACCEPTANCE.md)
11. [Local data and privacy contract](docs/LOCAL-DATA-AND-PRIVACY.md)
12. [Anki import support matrix](docs/ANKI-IMPORT-SUPPORT.md)
13. [UI/UX review register](docs/UI-UX-REVIEW-REGISTER.md)
14. [Decision log](docs/DECISIONS.md)

## Repository boundary

`ArdKam/Rinemi2` is the only implementation target. `ArdKam/kanji5` is read-only reference material for this effort; no changes are to be made there. Reused datasets and assets need provenance and license review before public release.

## Product and data limitations

The base corpus is identified as KANJIDIC2-derived Jōyō data and retains source English glosses/readings. Only a small starter subset has separate learner-facing Persian glosses and vocabulary examples, and that subset still requires independent human review. The presence of a record in the corpus does not mean it is fully taught or human-reviewed in Persian.
