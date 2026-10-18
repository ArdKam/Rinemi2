# Rinemi 2

Rinemi 2 is a separately developed, Persian-first kanji learning studio. Its intended journey connects understanding a kanji, retrieving it, learning how it appears in vocabulary, and gradually transferring that knowledge into Japanese reading.

## Current implementation

**Status:** the first functional app slice is under review on `feat/app-vertical-slice`; shared token and pre-React theme integration is being reviewed separately on `feat/design-system-runtime-v2`. Neither candidate is production-ready or deployed.

Included in this slice:
- Three primary destinations: Today, Learn and Explore.
- Persian RTL by default; English LTR switch and light/dark theme.
- Shared semantic token sheet and a pre-React resolver for saved/system theme preference, wired into the current React shell in the design-system candidate branch.
- Responsive editorial layout based on the written Sumi Play direction.
- Learning card with reveal, review progress and Again/Hard/Good/Easy ratings.
- Local FSRS scheduling, due-review queue and local browser storage.
- Search over 2,136 kanji, topic/JLPT filters, detail view and local bookmarks.
- Small Persian gloss and vocabulary seed set, clearly distinguished from unreviewed source glosses.
- Data-integrity checks and GitHub Actions typecheck/build workflow.

Not yet implemented or accepted:
- Browser screenshot review and manual usability/accessibility acceptance.
- Reviewed Persian content beyond the editorial seed set.
- Personal collections, Anki import, adaptive learner-model planning and reading-path integration.
- Lockfile reproducibility, PWA/offline acceptance, full backup/export/deletion workflows and production hosting.
- Public beta or a claim of measured learning efficacy.

## Run locally

Requires Node.js 22.12 or newer; CI uses Node.js 24.

```bash
npm install
npm run dev
```

Checks:

```bash
npm test
npm run typecheck
npm run build
```

The repository currently does not include a committed npm lockfile. Generate and review one before beta/release, then use `npm ci` in CI.

## Source of truth

1. [Roadmap and release gates](ROADMAP.md)
2. [Product and UX specification](docs/PRODUCT-AND-UX-SPEC.md)
3. [Art direction](docs/ART-DIRECTION.md)
4. [Design token contract](docs/DESIGN-TOKENS.md) — canonical semantic roles, theme integration and validation policy; runtime tokens live in `src/styles/design-tokens.css`.
5. [Learning design and content QA](docs/LEARNING-DESIGN.md)
6. [Reference and migration policy](docs/REFERENCE-AND-MIGRATION.md)
7. [Quality and release policy](docs/QUALITY-AND-RELEASE.md)
8. [Data-source provenance](docs/DATA-SOURCES.md)
9. [Decision log](docs/DECISIONS.md)

## Repository boundary

`ArdKam/Rinemi2` is the only implementation target. `ArdKam/kanji5` is read-only reference material for this effort; no changes are to be made there. Reused datasets and assets need provenance and license review before public release.

## Product and data limitations

The base corpus is identified as KANJIDIC2-derived Jōyō data and retains source English glosses/readings. Only a small starter subset has separate learner-facing Persian glosses and vocabulary examples, and that subset still requires independent human review. The presence of a record in the corpus does not mean it is fully taught or human-reviewed in Persian.
