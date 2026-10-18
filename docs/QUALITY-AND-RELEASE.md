# Rinemi 2 — Quality, Accessibility and Release Plan

**Status:** Required acceptance policy for every phase.  
**Authority:** `ROADMAP.md` controls release sequencing; this document defines verification standards.

## 1. Quality philosophy

A green compile or passing unit suite is one type of evidence. It does not prove visual quality, correct teaching, accessibility, browser behavior, data integrity or deployment correctness. Acceptance requires evidence appropriate to the claim.

## 2. Required evidence classes

1. **Source evidence:** exact diff, dependencies, and source/license/provenance record.
2. **Automated evidence:** unit, component, contract, accessibility and end-to-end tests as appropriate.
3. **Rendered evidence:** browser screenshots or recordings showing the actual changed interface.
4. **Manual UX evidence:** representative user tasks or structured review by a person.
5. **Educational evidence:** content validation and, for learning claims, an appropriate outcome evaluation.
6. **Operational evidence:** clean build, deployment identity, runtime smoke checks, offline/failure tests.
7. **Trust evidence:** privacy/security, data export/deletion/restore and truthful product copy.

A PR should state which evidence applies, link results, and list exceptions.

## 3. Baseline test matrix

### Viewport classes
- Small phone: approximately 320–360 CSS px width.
- Typical phone: approximately 375–430px.
- Compact landscape/short viewport.
- Tablet portrait and landscape where the layout changes meaningfully.
- Desktop with constrained reading width.

These are test classes, not claims about support until the actual browser matrix is declared.

### Language/layout
- Persian RTL with realistic long text.
- English LTR with realistic long text.
- Mixed Persian/Latin/numbers.
- Japanese kanji/kana combined with either UI language.
- Long readings, long vocabulary and no-result/error strings.

### Theme
- Light.
- Dark.
- Forced colors/high-contrast where supported and meaningful.

### Interaction
- Mouse/pointer.
- Keyboard only.
- Touch.
- Screen-reader spot check for primary journey, dialogs and dynamic feedback.
- Reduced motion.

Each relevant PR runs a focused subset; release acceptance runs the integrated matrix.

## 4. Accessibility acceptance

- Use semantic controls and heading hierarchy.
- Every input has a persistent programmatic label.
- Icon-only controls have a contextual accessible name.
- Focus is visible, follows a sensible order, enters modal/drawer appropriately and returns to the trigger on close.
- No keyboard trap; Escape and cancellation behavior are defined.
- Updates such as answer feedback, loading completion, import result and recoverable failures are announced without overwhelming users.
- Text contrast meets WCAG AA for applicable text; required control and focus indicators remain perceivable.
- Color is never the only signal for selected, correct, incorrect, due or disabled status.
- Core touch targets are comfortable and don't overlap other actions.
- Zoom/text enlargement, overflow, dynamic content, RTL and mixed Japanese text are tested.
- Reduced-motion settings are honored.
- Automated checks are supplemented by manual review; a clean scanner result is not a complete accessibility audit.

## 5. Functional test gates

### Learning
- Prompt/reveal and input/submit state machine.
- Correct, incorrect, unknown, near-miss, hinted and recovery outcome semantics.
- Exactly-once rating and safe repeated clicks.
- No stale async content displayed for a new character.
- Scheduler and learner state written through the authoritative boundary only.
- Next-item selection, interruption/resume if claimed, and session completion.
- Invalid/unavailable content does not create false success or consume a session step incorrectly.
- Offline and rejected-network requests have distinguishable results.

### Dictionary/bookmarks
- Search normalization and supported search kinds.
- Filter add/remove/clear, query persistence, zero results, large lists and keyboard use.
- Bookmark idempotency, collection creation/rename/delete, bulk operations and persistence.
- Removal from a collection doesn't delete content or affect scheduler history.
- Detail navigation preserves context.

### Anki import
- Valid/invalid/oversized files, unsupported format, encoding issues, duplicates, media-heavy decks and no cards.
- Preview shows exact expected effects before confirmation.
- Cancellation writes nothing.
- Malformed or storage-failing import is atomic or recoverable and explicitly reported.
- Repeated import follows documented duplicate policy.
- User can distinguish notes/cards and understand unavailable history/media.
- Unsupported content is never silently passed off as imported.

### Data and preference
- Local persistence and storage failure.
- Backup/restore validation and rollback.
- Language/theme preference persists and does not break current flow.
- Account/sync if implemented: auth lifecycle, ownership, conflict handling, delete, export and offline transitions.
- No secret/token/user data included in test artifacts or logs.

## 6. Visual regression and browser QA

For major screens capture the same representative content in:
- Persian RTL light/dark;
- English LTR light/dark;
- small phone and desktop;
- unrevealed and revealed card;
- selected filters and open/closed dialogs;
- loading, empty, error and content-heavy states.

Review against the approved concept for hierarchy, type, whitespace, clipping, scrolling, safe-area overlap, color, focus, text wrapping, kanji glyph rendering and component consistency. Do not baseline a broken screenshot merely to make the diff green.

A source-level review cannot substitute for opening the actual rendered app.

## 7. Educational content acceptance

Maintain a QA register with stable content IDs, source, reviewer, review date, status, defect severity and correction history.

Release blockers:
- incorrect target answer or unsupported accepted answer;
- mismatched kanji reading/vocabulary;
- misleading semantic/component explanation represented as fact;
- serious Persian translation error;
- licensing/provenance problem;
- systematic typography/RTL issue that corrupts Japanese or Persian content.

Sampling must cover diverse difficulty, reading patterns, common/rare vocabulary, similar characters, mnemonics and source types. Do not describe a sample as a complete review of the full corpus.

## 8. Privacy and security

- Collect only data required for defined learner-facing functionality.
- Do not transmit deck contents or raw learner answers to analytics by default.
- Keep credentials out of source, documentation and client bundles.
- Treat imported files and external API responses as untrusted input.
- Enforce ownership boundaries for user-created data if a backend is used.
- Validate file size, type, encoding, parsing limits and resource consumption.
- Define local-data erase, export, backup/restore and account deletion wherever those features exist.
- Ensure privacy/terms statements match actual behavior.
- Test failure, stale-session and unauthorized access paths if account/sync exists.
- Record untested production controls as blockers, not assumptions.

## 9. Offline and resilience

Only promise the behavior that is tested. Test:
- cold start online and offline;
- initial required asset unavailable;
- cached learning and local save where supported;
- external content API absent, malformed or rate-limited;
- browser storage unavailable or quota exhausted;
- stale service-worker/app version if a PWA is shipped;
- interrupted import or study;
- safe retry and meaningful recovery message.

Distinguish empty data from unavailable data at service and UI boundaries.

## 10. PR checklist

A PR should contain:
- user problem and narrow scope;
- relevant roadmap/decision IDs;
- before/after screenshots for visual changes;
- changed paths and any `kanji5` source references;
- tests run and exact result;
- RTL/LTR, theme, viewport and keyboard checks where relevant;
- content/source/license implications;
- migration/rollback behavior if any;
- known limitations and risk;
- confirmation that no changes were made to `kanji5`.

A PR may not merge with a known P0 defect simply because the UI looks complete.

## 11. Release gate

A candidate is eligible for beta only after:
- all blocking phase acceptance criteria pass;
- one exact commit SHA is frozen;
- clean build/tests run against that SHA;
- relevant browser tests and screenshots are retained;
- educational content QA and accessibility review are complete to the defined scope;
- privacy/security/data controls match actual behavior;
- deployment target and artifact identity are verified where deployment is configured;
- offline behavior and failure states are checked where claimed;
- known limitations are published and do not contradict marketing;
- `kanji5` remains unchanged.

### Required release note fields
- candidate SHA and branch/tag;
- workflow/run identifiers and result;
- artifact/deployment target and verification status;
- content QA sample/limitations;
- accessibility/browser matrix;
- unresolved issues, severity and decision;
- what is not supported;
- confirmation of reference-repo isolation.

## 12. Incident and regression handling

When a defect appears:
1. Reproduce it on the current Rinemi2 branch and record exact SHA/browser/settings.
2. Classify severity by learner/data impact, not visual annoyance alone.
3. Check whether the failure is source content, UI, engine contract, browser, network, or deployment.
4. Make a focused fix with a regression test where possible.
5. Verify on the same scenario and the closest neighboring states.
6. Record the finding and evidence; mark reopened only when it reproduces on the target branch.
7. Never cite a failed PR candidate as proof that current main is broken, or cite a stale successful build as proof of current health.


## Semantic token and automated accessibility gates

- CI must run `npm run check:contrast` against the canonical `src/styles/design-tokens.css` and verify that every `--rinemi-*` alias consumed by the app resolves to a declared token.
- Core browser journeys must run at small phone, typical phone, compact landscape and desktop viewport classes with horizontal-overflow assertions.
- Core controls must retain comfortable target size; this implementation uses a 44 CSS-pixel minimum for button/select and text-input controls, with larger touch surfaces where appropriate.
- Axe-based browser checks cover Today, revealed learning and Explore in representative Persian/English and light/dark states. Any exception must be explicit, narrowly scoped, and tracked to resolution.
- Automated accessibility tools do not prove conformance. Manual keyboard, focus order, screen-reader, zoom, RTL/LTR and actual-render checks remain required.
- Saved language/theme preference bootstrap runs before the React module so a returning learner does not intentionally wait for hydration to get the correct document direction/theme. Storage failures must fall back safely without blocking app startup.


## Deployment acceptance — GitHub Pages preview

- GitHub Pages must publish the Vite production artifact from `dist/`; publishing the source tree with Jekyll is not a successful application deployment.
- The GitHub Pages project base is `/Rinemi2/`. Use the dedicated `npm run build:pages` script so HTML references, module scripts, stylesheet links and public assets are rebased to that path without changing local development defaults.
- Repository **Settings → Pages → Build and deployment → Source** must be set to **GitHub Actions**. The deployment workflow is not a substitute for this repository-level setting.
- `.github/workflows/deploy-pages.yml` must install dependencies, pass the existing test/typecheck/build/e2e gates, upload only `dist/`, deploy via the Pages artifact action, and run `scripts/smoke-deployment.mjs` against the returned deployed URL.
- The smoke test must request the deployed entry page and every same-origin script, stylesheet, icon and locally referenced CSS asset; require successful HTTP responses; ensure a compiled module is present; ensure the source `/src/main.tsx` is not served; and ensure all local URLs remain under the `/Rinemi2/` base path.
- Keep the hosting issue open until the deployment action and smoke test pass. Then manually verify Persian RTL, English LTR, light/dark themes, a narrow mobile viewport, refresh/navigation, and browser console/network errors.
- A green GitHub Pages/Jekyll run, a successful build, or a passing smoke test in isolation does not establish full visual acceptance or production readiness.
