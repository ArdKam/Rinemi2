# Rinemi 2

Rinemi 2 is a separately developed, Persian-first kanji learning studio. Its intended journey connects understanding a kanji, retrieving it, learning how it appears in vocabulary, and gradually transferring that knowledge into Japanese reading.

## Current implementation

**Status:** the first functional vertical slice is merged into `main` at [`50c0ab8`](https://github.com/ArdKam/Rinemi2/commit/50c0ab8ea028da8e803ac2b2cd5d1b1a2bc01a37). It is not production-ready. GitHub Pages has been serving the source tree through Jekyll instead of Vite's `dist/`, so the public application runtime remains unverified. The repository now defines an explicit Vite-to-Pages deployment workflow; the repository Pages source must be switched to **GitHub Actions** before that workflow can publish.

Included in this slice:
- Three primary destinations: Today, Learn and Explore.
- Persian RTL by default; English LTR switch and light/dark/system theme preference (system follows the operating system).
- Responsive editorial layout based on the written Sumi Play direction.
- Learning card with reveal, review progress and Again/Hard/Good/Easy ratings.
- Local FSRS scheduling, due-review queue and local browser storage.
- Search over 2,136 kanji, topic/JLPT filters, detail view and local bookmarks.
- Named local collections with add/remove, collection filtering and focused sessions (first 20 items per session).
- Versioned local storage migration from v1 to v2 that preserves review records and bookmarks.
- Small Persian gloss and vocabulary seed set, clearly distinguished from unreviewed source glosses.
- Unit/data tests, Playwright browser journey tests, and CI screenshot artifacts.
- Shared spacing, typography, radius, motion and focus tokens; semantic CSS consumers; system-theme bootstrap and browser `theme-color` synchronization.

Not yet implemented or accepted:
- Browser screenshot review and manual usability/accessibility acceptance.
- Reviewed Persian content beyond the editorial seed set.
- Collection rename, bulk operations and comprehensive collection management; Anki import; adaptive learner-model planning; and full reading-path integration.
- Lockfile reproducibility, PWA/offline acceptance, full backup/export/deletion workflows and production hosting.
- Public beta or a claim of measured learning efficacy.

## Verification and deployment status

- The post-merge [Rinemi2 CI run](https://github.com/ArdKam/Rinemi2/actions/runs/39160367180) passed on the merged code tree, including data/unit tests, TypeScript typecheck, Vite build, contrast checks and Playwright end-to-end tests (11/11).
- Browser screenshots were captured in CI, but manual visual, usability and accessibility acceptance is still open. Automated green checks do not close those release gates.
- `.github/workflows/deploy-pages.yml` builds the app with the `/Rinemi2/` base path, publishes only `dist/`, and checks the deployed HTML, module bundle, theme bootstrap, stylesheets, icons and local CSS assets for successful responses.
- **Required one-time setting:** open repository **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**. The GitHub connection used for this change cannot modify that repository setting. Until it is changed, the new workflow cannot replace the old branch/Jekyll deployment.
- Keep [issue #7](https://github.com/ArdKam/Rinemi2/issues/7) open until the Actions deployment and post-deployment smoke test pass, then verify Persian RTL / English LTR, light/dark themes, mobile layout and refresh behavior in a real browser. A passing deploy or smoke test alone does not establish production readiness.

## Run locally

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Checks:

```bash
npm test
npm run typecheck
npm run build
npm run e2e
```

The repository currently does not include a committed npm lockfile. Generate and review one before beta/release, then use `npm ci` in CI.

## Source of truth

1. [Roadmap and release gates](ROADMAP.md)
2. [Product and UX specification](docs/PRODUCT-AND-UX-SPEC.md)
3. [Art direction and design system](docs/ART-DIRECTION.md)
4. [Learning design and content QA](docs/LEARNING-DESIGN.md)
5. [Reference and migration policy](docs/REFERENCE-AND-MIGRATION.md)
6. [Quality and release policy](docs/QUALITY-AND-RELEASE.md)
7. [Data-source provenance](docs/DATA-SOURCES.md)
8. [Decision log](docs/DECISIONS.md)

## Repository boundary

`ArdKam/Rinemi2` is the only implementation target. `ArdKam/kanji5` is read-only reference material for this effort; no changes are to be made there. Reused datasets and assets need provenance and license review before public release.

## Product and data limitations

The base corpus is identified as KANJIDIC2-derived Jōyō data and retains source English glosses/readings. Only a small starter subset has separate learner-facing Persian glosses and vocabulary examples, and that subset still requires independent human review. The presence of a record in the corpus does not mean it is fully taught or human-reviewed in Persian.
