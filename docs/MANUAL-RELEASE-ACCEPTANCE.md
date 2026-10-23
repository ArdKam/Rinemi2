# Rinemi 2 — Manual Release Acceptance Checklist

**Purpose:** record human checks that automation cannot certify. This checklist supplements, and does not replace, the automated Playwright/axe tests and the release criteria in `ROADMAP.md` and `docs/QUALITY-AND-RELEASE.md`. Use [the UI/UX review register](UI-UX-REVIEW-REGISTER.md) as the persistent finding list; record status and evidence against the exact commit being accepted.

**Current status:** NOT RUN / NOT ACCEPTED. Do not mark a check as passed without recording the reviewer, date, browser/assistive technology, commit, and findings.

**Last independently confirmed deployment evidence checkpoint (2026-10-23):** application-code SHA `42ddab9dca017146c458f2c8615896624c971951` passed [main CI #189](https://github.com/ArdKam/Rinemi2/actions/runs/39939967641) and [Pages deployment/live Chromium verification #44](https://github.com/ArdKam/Rinemi2/actions/runs/39940377108). The CI job completed `npm ci`, data/unit tests, typecheck, production build, design-token contrast, regular/offline Playwright, and the GitHub Pages build. Deployment #44 completed the Pages build/deploy, live asset smoke test and live Chromium journey on that exact SHA; its evidence artifact is attached to the deployment run. Since then, [PR #63](https://github.com/ArdKam/Rinemi2/pull/63) has merged a compact-landscape target-kanji sizing improvement as application SHA [`d983bc3`](https://github.com/ArdKam/Rinemi2/commit/d983bc3169f5d8f9cfed9be1d4f6a9103f9b2139). Its exact PR head passed the full [CI run #197](https://github.com/ArdKam/Rinemi2/actions/runs/39991899942), and the updated 844×390 screenshot was inspected. Post-merge Pages/live-browser verification for `d983bc3` is not yet independently confirmed here. None of these automated checks establishes manual accessibility/usability acceptance, human teaching-content approval, owner/legal license approval, or manual storage/PWA failure acceptance. Earlier [forced-colors automated checks in PR #53](https://github.com/ArdKam/Rinemi2/actions/runs/39859285047) remain supplementary evidence only; emulation is not a real OS high-contrast review. The manual checklist remains **NOT RUN / NOT ACCEPTED** until a reviewer records the required evidence against the candidate being accepted.

## Recording a run

- Commit SHA:
- Preview URL:
- Reviewer:
- Date/time:
- Browser and OS:
- Assistive technology (if applicable):
- Overall result: NOT RUN / PASS / BLOCKED
- Blocking findings / linked issues:

For each item, record PASS, FAIL, or NOT RUN and attach a concise observation. “Looks fine” without a task and outcome is not evidence.

## Keyboard-only journey

- [ ] Reload the page and complete Today → start session → reveal answer → choose each available rating in separate runs → next item, using only Tab, Shift+Tab, Enter, Space and Escape where appropriate.
- [ ] Verify visible focus never disappears behind overlays or is clipped by scrolling.
- [ ] Verify focus order follows the visual/reading order in Persian RTL and English LTR.
- [ ] Open and close kanji detail, collection controls, and any dialog/drawer; verify focus enters the surface and returns to the triggering control after close.
- [ ] Verify no keyboard trap and that Escape/cancel behavior is consistent.
- [ ] Verify controls can be operated without pointer-only hover behavior.

## Text enlargement, zoom and viewport

- [ ] At 200% browser zoom, complete the primary learning journey without lost controls or two-dimensional scrolling for ordinary content.
- [ ] At 320 CSS px width and compact landscape height, inspect Today, unrevealed/revealed learning, Explore results, detail and collections.
- [ ] Check long Persian, English and Japanese strings, mixed-script content, numerals and punctuation for clipping, overlap and incorrect ordering.
- [ ] Check dialogs/menus remain reachable when the virtual keyboard or short viewport reduces available height (where applicable).

## Motion and high contrast

- [ ] Enable the OS/browser reduced-motion preference before loading the app; verify nonessential transitions are reduced or removed and no content/action depends on animation.
- [ ] Enable forced-colors/high-contrast mode where supported; verify text, focus indicators, selected filters, rating states, disabled states and boundaries remain distinguishable.
- [ ] Confirm color is not the sole means of conveying correctness, selection, status or errors.

## Screen-reader spot check

- [ ] Inspect the page title, primary landmarks, heading hierarchy and primary navigation labels.
- [ ] Complete Today → start → reveal → rating → next; confirm the kanji prompt, answer meaning, rating choices and changed state are announced intelligibly.
- [ ] Inspect icon-only controls and bookmark/collection controls for meaningful accessible names and state (for example, pressed/saved).
- [ ] Trigger an empty result, storage warning or other recoverable error where possible; verify the message is discoverable and is not announced repeatedly.
- [ ] Check Persian RTL and English LTR with the actual Japanese character/reading content. Record screen reader and voice/language settings.

## PWA installation and warm-cache offline behavior

- [ ] On the deployed HTTPS URL, inspect the manifest link and both 192px/512px icons under the `/Rinemi2/` base path; confirm there are no root-path 404s.
- [ ] Install the app on a supported desktop/mobile browser, open the installed version, and record the browser/OS and outcome; test update/reload after a new deployment.
- [ ] With a warm online session, visit Today, Learn and Explore and reveal a card. Disable connectivity, reload/navigate and verify only the resources actually cached remain available; record missing-resource behavior explicitly.
- [ ] Re-enable connectivity and confirm network-first behavior refreshes changed assets after an update; check for stale JS/CSS, a mixed-version shell, failed service-worker update, and recovery after cache clear/unregister.
- [ ] Where possible, simulate denied/full browser storage and confirm cache-write failures do not break an otherwise successful online response.
- [ ] Do not infer cold-start offline support: first visit without network and uncached resources are intentionally not guaranteed by the current warm-cache contract.

## Source attribution and content/legal acceptance

- [ ] Confirm the persistent footer attribution names KANJIDIC2/EDRDG and the licence/source links resolve to the official EDRDG statement and the repository provenance record.
- [ ] Confirm source attribution and OFL 1.1 notices are present in the published artifact for Noto Serif JP, Plus Jakarta Sans and Vazirmatn. This verifies notice delivery only; it is not an owner/legal decision on the exact font binaries or reserved-font-name implications.
- [ ] Obtain owner/legal approval for the exact copied KANJIDIC2-derived subset and CC BY-SA 4.0/share-alike obligations, the hand-curated topic taxonomy, identity assets/marks, font-binary provenance and the overall project license; record the decision in issue #25.
- [ ] Review the 44 starter content records for Japanese readings/usage and Persian/English teaching explanations, record reviewers/date/source evidence in the content QA register, and update issue #24.

## Explore and collection usability

- [ ] Search by character and text; clear query and filters; verify zero-results recovery.
- [ ] Change JLPT/topic filters, toggle saved-only, open/close detail, and return without losing expected context.
- [ ] Create a collection, add a kanji, open the collection, remove the item, and verify bookmark and review history remain unchanged.
- [ ] Inspect empty collections, duplicate collection names, long names, and the maximum/limit error if reachable.
- [ ] Verify controls remain usable at mobile width and keyboard-only.

## UI/UX review-register regression checks

Run these checks alongside the broader acceptance sections above. Findings and evidence requirements are tracked in the [UI/UX review register](UI-UX-REVIEW-REGISTER.md).

- [ ] **UIUX-001 — Mobile Explore detail:** at 320px and 390px widths, select a result from a long list. Confirm detail appears immediately; Back/close restores query, filters, scroll position, and keyboard focus.
- [ ] **UIUX-002 — Shortcut ownership:** focus Back, bookmark, reveal, and rating controls. Space must perform the focused control's native action; the global reveal shortcut must not steal activation. Confirm shortcuts do not fire from text/form controls.
- [ ] **UIUX-003 — Review ratings:** inspect the revealed card at 320×640, 390×844, and 844×390. Record whether ratings are easy to reach after core meaning and useful examples. Confirm sticky controls never cover content.
- [ ] **UIUX-004 — Result disambiguation:** inspect long Persian and English meanings, available Japanese readings, saved state, focus state, and similar candidates in both RTL/LTR and light/dark.
- [ ] **UIUX-005 — Result continuation:** use a query/topic returning more than 240 results. Confirm there is an accessible path to all results and query/filter/selection state remains coherent.
- [ ] **UIUX-006 — Compact landscape:** inspect Today, prompt, revealed card, Explore, selected detail, collections, and dialogs at 844×390; test virtual-keyboard-reduced height where supported.
- [ ] **UIUX-007 — Rendered evidence:** save and inspect current screenshots across language/theme/viewport states. Record deployed SHA, browser/OS, screenshot paths, and manual outcomes; do not reuse prior-run screenshots as proof of the current build.
- [ ] **UIUX-008 — Documentation consistency:** confirm README, roadmap, open PRs, and deployment evidence describe current main accurately, distinguishing implemented behavior from branch-only work.
- [ ] **UIUX-009 — Today clarity:** ask an unfamiliar reviewer what to do next on a new-learner and returning-learner state; record hesitation and whether featured editorial content is confused with scheduled work.
- [ ] **PWA acceptance:** perform the installation, update, warm-cache offline, cache recovery, and base-path checks listed above on the exact candidate SHA.

A check can be PASS only after a current run and evidence are recorded. A design choice that deliberately differs from a recommendation must be dispositioned in the register with rationale.

## Required handoff

- [ ] Attach screenshots or a short recording for any visual/focus defect.
- [ ] Create/link an issue for every reproducible failure, with severity and exact reproduction steps.
- [ ] Record which checks were not possible and why; do not convert NOT RUN into PASS.
- [ ] Update issue #7 with the run summary and evidence.
- [ ] Close issue #7 only when all release-blocking manual checks have been completed or explicitly dispositioned by the project owner.

**Important:** this is a test procedure, not a statement that the application has passed it. Automated axe and Playwright results do not replace a human keyboard, zoom, forced-colors or screen-reader review.
