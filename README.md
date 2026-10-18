# Rinemi 2

Rinemi 2 is a separately developed, Persian-first kanji learning studio. Its intended journey connects understanding a kanji, retrieving it, learning how it appears in vocabulary, and gradually transferring that knowledge into Japanese reading.

## Current implementation

**Status:** the first functional vertical slice is merged into `main`; the preview is published from the Vite `dist/` artifact at [Rinemi 2 on GitHub Pages](https://ardkam.github.io/Rinemi2/). Static assets and a real Chromium journey against the public URL passed on commit [`de3b9ef`](https://github.com/ArdKam/Rinemi2/commit/de3b9efb89698e395346be8fcdd77ef11517f87c). The app is still **pre-release**: manual keyboard/screen-reader/accessibility acceptance, broader usability review, learner-facing content review, source/licensing review, privacy/data lifecycle, offline/PWA acceptance and major roadmap features remain open.

Included in this slice:
- Three primary destinations: Today, Learn and Explore.
- Persian RTL by default; English LTR switch and light/dark/system theme preference (system follows the operating system).
- Responsive editorial layout based on the written Sumi Play direction.
- Learning card with reveal, review progress and Again/Hard/Good/Easy ratings.
- Local FSRS scheduling, due-review queue and local browser storage.
- Search over 2,136 kanji, topic/JLPT filters, detail view and local bookmarks.
- Named local collections with add/remove, rename, confirmed bulk-clear and deletion, collection filtering and focused sessions (first 20 items per session).
- Local JSON backup download, validated restore preview with explicit replacement confirmation, and local learner-data erasure.
- Versioned local storage migration from v1 to v2 that preserves review records and bookmarks.
- Small Persian gloss and vocabulary seed set, clearly distinguished from unreviewed source glosses.
- Unit/data tests, Playwright browser journey tests, automated axe checks, and CI screenshot artifacts.
- Shared spacing, typography, radius, motion and focus tokens; semantic CSS consumers; system-theme bootstrap and browser `theme-color` synchronization.
- Committed `package-lock.json`; CI and Pages install dependencies with `npm ci`.
- PWA groundwork under review: install manifest, 192/512px app icons, base-path-scoped service worker, and warm-cache offline E2E checks. Offline behavior is not yet release-accepted.

Not yet implemented or accepted:
- Manual browser screenshot review and keyboard/focus, zoom, reduced-motion/forced-colors, screen-reader and broader usability acceptance.
- Human review of Persian glosses, Japanese readings/examples and translations in the starter set; the register currently marks these unreviewed.
- Independent license/provenance confirmation for the corpus, topic taxonomy, identity assets and bundled fonts; owner approval of the overall project license.
- Multi-item collection selection/bulk add-remove and broader collection management; end-to-end Anki import (parser/support matrix exists, UI and persistence acceptance remain open); adaptive learner-model planning; and full reading-path integration.
- PWA installation and warm-cache offline behavior are under test; manual device/install/update/cache-recovery acceptance remains open.
- Manual acceptance and storage-failure review of the backup/restore/erasure controls; complete privacy/legal review and offline/PWA acceptance.
- Public beta or any claim of measured learning efficacy.

## Verification and deployment status

- At the latest checked main snapshot on 2026-10-19, commit [`63c42c0`](https://github.com/ArdKam/Rinemi2/commit/63c42c0106218d6bfaf6cca3296c34cf95776e9d) passed [main CI](https://github.com/ArdKam/Rinemi2/actions/runs/39169365213) and the [Pages deployment, smoke test, and live Chromium verification](https://github.com/ArdKam/Rinemi2/actions/runs/39169365252). This confirms the pipeline checks for that SHA, not manual visual/accessibility acceptance.
- The earlier detailed [CI](https://github.com/ArdKam/Rinemi2/actions/runs/39166049955) and [Pages browser run](https://github.com/ArdKam/Rinemi2/actions/runs/39166050054) passed on commit [`de3b9ef`](https://github.com/ArdKam/Rinemi2/commit/de3b9efb89698e395346be8fcdd77ef11517f87c).
- The Pages workflow publishes only Vite's `dist/` under `/Rinemi2/`; all 11 same-origin static resources returned HTTP 200 in that recorded run, including both brand marks, compiled JavaScript, CSS, theme bootstrap, icon and fonts.
- The recorded live Chromium check verified React mounts, Today renders, a review can be revealed/rated and advanced, Persian RTL switches to English LTR, the system → light → dark theme cycle works, both brand images load, and a 390px mobile viewport has no horizontal overflow. It reported no page/console errors or failed/escaped same-origin resources; screenshots were retained in the workflow artifact. This evidence belongs to the cited SHA/run and is not a claim about every later commit.
- Issue [#7](https://github.com/ArdKam/Rinemi2/issues/7) tracks the remaining manual accessibility/usability acceptance. Use the [manual acceptance checklist](docs/MANUAL-RELEASE-ACCEPTANCE.md); automated tests do not replace human keyboard, zoom, forced-colors or screen-reader review.

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
6. [Quality and release policy](docs/QUALITY-AND-RELEASE.md)
7. [Data-source provenance](docs/DATA-SOURCES.md)
8. [Starter content QA register](docs/CONTENT-QA-REGISTER.md)
9. [Manual release acceptance checklist](docs/MANUAL-RELEASE-ACCEPTANCE.md)
10. [Local data and privacy contract](docs/LOCAL-DATA-AND-PRIVACY.md)
11. [Anki import support matrix](docs/ANKI-IMPORT-SUPPORT.md)
12. [UI/UX review register](docs/UI-UX-REVIEW-REGISTER.md)
13. [Decision log](docs/DECISIONS.md)

## Repository boundary

`ArdKam/Rinemi2` is the only implementation target. `ArdKam/kanji5` is read-only reference material for this effort; no changes are to be made there. Reused datasets and assets need provenance and license review before public release.

## Product and data limitations

The base corpus is identified as KANJIDIC2-derived Jōyō data and retains source English glosses/readings. Only a small starter subset has separate learner-facing Persian glosses and vocabulary examples, and that subset still requires independent human review. The presence of a record in the corpus does not mean it is fully taught or human-reviewed in Persian.
