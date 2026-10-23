# Rinemi 2 — UI/UX Review Register

**Status:** Active; source review recorded on 2026-10-19. Rendered-browser visual acceptance remains outstanding.  
**Scope:** Responsive UI, core learning flow, Explore/dictionary, keyboard interaction, design-system execution, and documentation accuracy.  
**Target repository:** `ArdKam/Rinemi2`.  
**Review baseline:** `36b1373fea55fda205c0e328621e3b8d6ce9c581` (historical review baseline from 2026-10-19; current application-code and rendered-evidence status is recorded in Section 2 below).  
**Public preview:** https://ardkam.github.io/Rinemi2/

This register preserves review findings between inspections. It is the canonical place to track UI/UX findings, severity, evidence, disposition, and acceptance criteria. The product and UX specification owns intended behavior; the art direction and design-token contract own visual rules; the roadmap owns phase order and release status; this register owns the durable list of review findings and their verification state.

## 1. How to use this register

- Re-read this file before every later UI/UX inspection. Check each finding against the current main commit, open PRs, and the actually deployed version; do not assume code, deployment, and screenshots represent the same version.
- Also read [the Kanji5 reuse inventory](KANJI5-REUSE-INVENTORY.md) before proposing feature transfers; preserve Rinemi 2's editorial direction and track source provenance, target gaps, single-authority boundaries and acceptance evidence.
- Reproduce findings on the current rendered app before describing them as verified runtime defects. Source inspection can establish a code-level risk, but cannot prove clipping, visual hierarchy, actual scrolling burden, or accessibility conformance.
- Keep historical findings until fixed or explicitly dispositioned. Do not delete a finding simply because code changed; record the verifying commit, browser/viewport, result, and screenshot/test artifact.
- Do not mark a design or accessibility acceptance item DONE solely because unit tests, a build, an automated contrast check, or an axe scan passes.
- For each accepted UI change, capture the actual rendered screen and inspect the saved image. Use consistent representative content across Persian RTL / English LTR, light / dark, phone / desktop, and relevant interaction states.
- Status vocabulary: **OPEN** = active finding; **NEEDS RENDERED VERIFICATION** = source or test evidence indicates a risk but actual UI behavior is not established; **IN PROGRESS** = fix is underway; **VERIFIED FIX** = acceptance criteria passed against an exact commit with evidence; **DISPOSITIONED** = intentionally not fixed with the reason and owner decision recorded.

## 2. Audit snapshot and evidence limits

The source and documentation review checked the main baseline above, including `src/App.tsx`, `src/styles.css`, `e2e/core-journey.spec.ts`, `e2e/keyboard-transaction.spec.ts`, `docs/PRODUCT-AND-UX-SPEC.md`, `docs/ART-DIRECTION.md`, `docs/DESIGN-TOKENS.md`, `docs/MANUAL-RELEASE-ACCEPTANCE.md`, `docs/QUALITY-AND-RELEASE.md`, `README.md`, and `ROADMAP.md`.

The recorded GitHub Actions live Chromium journey on commit `de3b9efb89698e395346be8fcdd77ef11517f87c` verifies a prior deployment's minimum learner journey, locale/theme switching, asset loading, and no horizontal overflow at a 390px viewport. It is **historical smoke-test evidence**, not visual acceptance of every state in this register. See [the recorded deployment and browser run](https://github.com/ArdKam/Rinemi2/actions/runs/39166050054).

The latest merged application-code SHA is [`4709e52`](https://github.com/ArdKam/Rinemi2/commit/4709e52c14286e32c34eb5c44335275d73c3807d). [PR #70](https://github.com/ArdKam/Rinemi2/pull/70)'s compact-landscape header/recall/reveal correction was verified live on deployment SHA [`65d09ed`](https://github.com/ArdKam/Rinemi2/commit/65d09edf1dc10add3f64bc3d87f5e514bf366c95), [run #40005713742](https://github.com/ArdKam/Rinemi2/actions/runs/40005713742); screenshots were downloaded and inspected. [PR #76](https://github.com/ArdKam/Rinemi2/pull/76) adds a minimum 8px bottom inset beneath the reveal action and actual bounding-box assertions in local and live tests. PR CI [#40007109679](https://github.com/ArdKam/Rinemi2/actions/runs/40007109679) and exact-main CI [#40007448689](https://github.com/ArdKam/Rinemi2/actions/runs/40007448689) passed; Pages deployment [#40007448666](https://github.com/ArdKam/Rinemi2/actions/runs/40007448666) is still queued, so the extra inset remains pending live screenshot verification. These artifacts are not a substitute for the broader manual language/theme/viewport and accessibility acceptance.

Responsive screenshots from [run 39172388405](https://github.com/ArdKam/Rinemi2/actions/runs/39172388405) were downloaded and visually inspected for 320px portrait, 390px portrait, compact landscape, and desktop. The 320px revealed-card capture confirms the answer meaning heading is focusable and the skip link is not over the content after the screenshot was corrected to begin at the scroll origin. It also shows the Today inset fix. This is useful partial rendered evidence, not completion of the full Persian RTL/English LTR × light/dark × viewport matrix, not manual screen-reader acceptance, and not proof of teaching quality or legal approval.

## 3. Findings

### UIUX-016 — Target kanji and recall prompt must remain prominent in compact landscape

- **Priority:** P2 — learning-screen hierarchy at short viewport heights.
- **Status:** BASIC REACHABILITY VERIFIED live on deployed SHA `65d09edf1dc10add3f64bc3d87f5e514bf366c95`; PR #76 improves the remaining bottom inset, with post-merge live acceptance pending.
- **Evidence:** earlier 844×390 captures showed the target kanji was too small and the recall prompt/reveal action could fall below the initial viewport. PR #63 raised the glyph size; PR #70 compacted the header and asserts the complete prompt and reveal action fit without scrolling.
- **Verification:** live [Pages run #40005713742](https://github.com/ArdKam/Rinemi2/actions/runs/40005713742) passed on `65d09ed`; its prompt and revealed-answer screenshots were downloaded and inspected. At 844×390 the full prompt/reveal action are reachable and the revealed view retains meaning, readings, vocabulary and all four rating controls.
- **Remaining refinement:** [PR #76](https://github.com/ArdKam/Rinemi2/pull/76) adds an 8px bottom inset and stronger bounds assertions. PR CI #40007109679 and main CI #40007448689 passed, while post-merge Pages run #40007448666 is queued. Reinspect the deployed prompt screenshot before calling the extra inset live-verified.
- **Acceptance still open:** finish the deployed screenshot matrix at 320×640, 390×844, 844×390 and desktop, then perform manual keyboard, zoom, screen-reader, reduced-motion and forced-colors acceptance. See issue #7.
### UIUX-001 — Mobile Explore return context and selected-detail priority

- **Priority:** P1 — high-impact core discovery flow.
- **Status:** IMPLEMENTATION MERGED in [PR #47](https://github.com/ArdKam/Rinemi2/pull/47) to app SHA `65e92fc8c539a92d4cc13841e653a563e96d2e8b`; PR-head CI passed and selected-detail screenshots were inspected. Remaining manual keyboard/screen-reader acceptance stays open.
- **Evidence:** the focused correction moves the Explore result/detail region before the Collections and optional Anki-preview sections in the DOM. The exact PR-head [CI and screenshot run](https://github.com/ArdKam/Rinemi2/actions/runs/39841371594) passed after two test setup mistakes were corrected (an outdated English placeholder and screenshot scroll origin). The final artifact was inspected at 320px Persian RTL and 390px English LTR: detail appears before secondary tools, the kanji/gloss are visible, and a Back-to-results action remains available. Automated coverage checks browser Back, Escape, explicit Back, query/selection context, focus return, and scroll restoration. At that integration checkpoint, [main CI](https://github.com/ArdKam/Rinemi2/actions/runs/39854370909) and [deployed Chromium verification](https://github.com/ArdKam/Rinemi2/actions/runs/39854370784) passed on the then-merged application-code SHA; the current snapshot is recorded above.
- **User impact before the fix:** on a phone, the tap could appear ineffective and the learner had to scroll past unrelated collections/Anki tools to reach the selected kanji.
- **Implemented behavior:** Explore's primary path is search/filters → result list or selected detail → secondary collections → optional Anki text preview. No duplicate detail view or additional dialog was introduced; query, filters, selected character, Back/Escape history, focus, and scroll handling remain.
- **Acceptance still open:** conduct human keyboard-only and screen-reader checks, review filter/collection context after repeated navigation, and verify behavior in the deployed app across both languages and themes. No horizontal overflow is asserted by Playwright at the tested mobile sizes; visual evidence is partial, not a claim that the entire release acceptance suite passed.
- **Evidence required to close this finding:** retain exact-SHA browser screenshots and automated checks, then record manual keyboard/screen-reader and return-context acceptance against the deployed candidate.

### UIUX-002 — Verify native keyboard activation after the Space-shortcut fix

- **Priority:** P1 — keyboard interaction defect.
- **Status:** NEEDS RENDERED / MANUAL VERIFICATION; source fix is present on current main.
- **Evidence:** the global Space shortcut excludes native interactive controls through `target.closest(...)` and a focused Playwright regression test covers this. Automated CI has passed on current snapshots, but manual keyboard/screen-reader review on the live deployed version remains outstanding.
- **User impact if regressed:** when Back, bookmark, reveal, or rating controls have focus, Space must perform the control's expected action rather than an unrelated global shortcut.
- **Recommendation:** retain the guard and regression test. Recheck its behavior with real keyboard focus in both languages and with assistive technology; keep shortcuts from firing in text/form controls.
- **Acceptance:** keyboard-only walkthrough verifies Tab / Shift+Tab focus order; Space activates the focused button normally; Space reveals only in the intended prompt context; Enter works as expected; numeric shortcuts do not trigger from text fields or focused buttons; no focus trap occurs in detail/dialog/drawer states. Record the deployed SHA and result.

### UIUX-003 — Learning rating reachability is not proven by the current viewport test

- **Priority:** P1 — core study-flow usability.
- **Status:** NEEDS RENDERED VERIFICATION; do not assume a defect from the test alone.
- **Evidence:** the answer still prioritizes meaning, readings and vocabulary before ratings. Responsive screenshots at small-phone and compact-landscape widths show rating controls visible in the full-page capture; E2E checks rating reachability but cannot establish effortless repeated review or scroll burden. Manual usability testing remains open.
- **User impact:** repeated review can feel slow when the main decision is displaced by secondary reference content, especially on short phone and landscape viewports.
- **Recommendation:** keep the information hierarchy (core meaning → useful reading/vocabulary evidence → optional reference detail → rating) but progressively disclose secondary information where appropriate. Consider a compact revealed layout on phones. If a persistent rating bar is tested, reserve its layout space and respect safe areas; never obscure content. Do not hide educationally necessary feedback merely to fit the screen.
- **Acceptance:** inspect revealed cards at 320×640, 390×844, and 844×390. Record whether the core meaning, at least one relevant example where available, and all rating actions are clear and usable. No sticky/fixed element may cover content or controls. Add a test that checks actual visible geometry or scroll position instead of only scrolling the control into view.

### UIUX-004 — Dictionary rows do not expose enough reading information and truncate long glosses

- **Priority:** P1 — discovery quality.
- **Status:** NEEDS RENDERED VERIFICATION; result-level reading/gloss cues are merged.
- **Evidence:** Explore now exposes available reading information alongside the gloss and keeps secondary metadata quieter. E2E covers this code path, but visually similar candidates, long Persian/English glosses, Japanese wrapping, saved state and focus styling still need both-language and both-theme review.
- **User impact:** users cannot efficiently distinguish candidates by reading, and similar meanings can become indistinguishable when truncated.
- **Recommendation:** retain the kanji as the dominant glyph; provide a common reading when the data contains a usable value; allow the primary gloss up to two lines where needed; keep level/strokes as quieter metadata. Do not show empty or misleading readings, and avoid turning every row into a dense multi-field card.
- **Acceptance:** test short and long Persian glosses, English glosses, Japanese readings, and mixed-script content. Similar candidates remain distinguishable; text is not clipped; row heights remain orderly; row focus and saved state remain understandable in RTL/LTR and both themes.

### UIUX-005 — Explore stops at 240 rows rather than offering a complete browsing path

- **Priority:** P1 — information access.
- **Status:** NEEDS RENDERED VERIFICATION; the arbitrary 240-row ceiling has been replaced by incremental continuation.
- **Evidence:** PR #30 introduced continuation with E2E coverage proving results beyond the former 240 limit are reachable. Manual keyboard/screen-reader continuity, stable identity, query/filter retention and low-powered mobile performance remain open.
- **User impact:** browsing a broad topic or imprecise search has an arbitrary stopping point even though the corpus contains 2,136 kanji.
- **Recommendation:** introduce incremental pagination or virtualization with accessible keyboard navigation, stable result identity, retained query/filter state, and a clear indication of result totals and current range. Choose virtualization only if needed for performance.
- **Acceptance:** users can reach every matching record without inventing a more specific search; query, filters, active collection, and selected item persist as intended; keyboard navigation and screen-reader semantics remain logical when more results load.

### UIUX-006 — Compact landscape and short-viewport behavior need explicit validation

- **Priority:** P2 — responsive quality and accessibility.
- **Status:** NEEDS RENDERED / MANUAL VERIFICATION; responsive layout and short-height refinements are merged.
- **Evidence:** inspected screenshots include 320×640, 390×844, 844×390 and desktop views; automated checks cover insets, overflow, target size, route focus and the revealed-answer focus state. Dialogs, virtual keyboard behavior, zoom, forced colors, both themes/languages and focus order remain manual acceptance items.
- **User impact:** on landscape phones or when a virtual keyboard reduces height, the wrapped header, progress line, prompt, answer, and rating controls may leave little useful space in the viewport.
- **Recommendation:** keep the header and study navigation compact at short heights, protect the prompt and primary action, and give dialogs/drawers a single predictable scroll owner. Allow vertical scrolling where necessary; prevent controls from being obscured or displaced without purpose.
- **Acceptance:** manually inspect Today, prompt, revealed answer, rating controls, Explore, kanji detail, collection editing, and dialogs at 844×390 and with the virtual keyboard where supported.

### UIUX-007 — Rendered UI acceptance remains a release blocker

- **Priority:** P1 — release gate.
- **Status:** OPEN until current rendered evidence and manual checks are recorded.
- **Evidence:** `docs/MANUAL-RELEASE-ACCEPTANCE.md` declares human acceptance not run/not accepted. `ROADMAP.md` leaves design-system, shell, learning, and cross-cutting accessibility/responsive phases open.
- **Recommendation:** run the manual acceptance checklist on the deployed build corresponding to an exact SHA and inspect current screenshots. Cover Persian RTL / English LTR, light / dark, narrow phone, typical phone, compact landscape, tablet/desktop, unrevealed/revealed learning, filters, selected detail, collection states, no results, storage/error states, and relevant focus states. Perform keyboard, zoom/text enlargement, reduced-motion, forced-colors, and screen-reader spot checks.
- **Acceptance:** reviewer, date/time, browser/OS, exact deployed SHA/URL, results, issues, and screenshot/test artifacts are recorded. No NOT RUN item is treated as PASS. Every release-blocking failure links to a reproducible issue.

### UIUX-008 — Documentation status must stay synchronized with implemented behavior

- **Priority:** P1 — inspection reliability.
- **Status:** The release/docs snapshot was synchronized in [PR #52](https://github.com/ArdKam/Rinemi2/pull/52) to application SHA `1929c774b67c8ec3990f1ccb2f43aef7c463e7f1`. That exact application SHA passed [main CI](https://github.com/ArdKam/Rinemi2/actions/runs/39859508305), [design-token contrast](https://github.com/ArdKam/Rinemi2/actions/runs/39859508249), and [Pages/live Chromium verification](https://github.com/ArdKam/Rinemi2/actions/runs/39859508390). Repeat this synchronization after later application/deployment changes; human accessibility, content QA, and source/license sign-off remain independent gates.
- **Evidence:** README, roadmap and manual acceptance are being aligned to the merged Explore, visual finishing, Anki preview, font-notice, attribution and PWA work. Full Anki persistence/scheduling and all human content/legal/accessibility gates remain open.
- **Recommendation:** use `ROADMAP.md` for current phase status and this register for UX findings; use the README only as a concise summary. Distinguish implemented collection rename/clear/delete from unimplemented multi-item selection/bulk add-remove. Distinguish Anki parser and support-matrix infrastructure from a user-accessible end-to-end import flow. Keep all verification claims tied to the exact commit and deployment.
- **Acceptance:** README, phase status, and open-work summary are checked against current main and open PRs. Report the deployed SHA only after successful deployment and live verification.

### UIUX-009 — Today should distinguish a returning learner's next action from editorial content

- **Priority:** P2 — clarity; hypothesis to validate.
- **Status:** NEEDS USABILITY VALIDATION; not a confirmed defect.
- **Evidence:** Today combines a primary study action/workload summary with a featured kanji and editorial example.
- **Recommendation:** keep the single dominant start/continue action. Check whether returning learners immediately understand due workload and next action, and whether new learners understand how to begin. Label featured educational content clearly if it is not the next item in the queue. Avoid adding competing statistic tiles or decorative dashboard panels.
- **Acceptance:** unfamiliar users can identify what to do next on first visit and return visits, explain the due-work state, and distinguish the featured example from their scheduled learning.


### UIUX-010 — Keep Kanji5 capability reuse from eroding Rinemi 2's editorial hierarchy

- **Priority:** P1 — product coherence guardrail for future feature transfers.
- **Status:** NEEDS RENDERED VERIFICATION; this is a direction/acceptance requirement, not a claim that the current deployed UI has regressed.
- **Evidence:** the current design contracts favor editorial hierarchy, restrained surfaces, progressive disclosure, and one dominant next action. Kanji5 has more feature-dense presentation and persistent bottom navigation patterns that should not be adopted by default. This assessment was based on current source/spec inspection; fresh comparative screenshots were not visually inspected in this review.
- **Recommendation:** transfer learner value and verified data/behavior, not Kanji5's accumulated screens or CSS. Keep Today → Learn → Explore as the three primary destinations, preserve the task-relevant kanji/meaning/vocabulary hierarchy, avoid adding dashboard/statistic tiles or nested surfaces without a demonstrated user need, and keep secondary reference content progressively disclosed. Continue using Rinemi 2's semantic tokens and its own responsive navigation. Any proposed exception should be justified by user testing or rendered evidence, not feature parity.
- **Acceptance:** inspect actual current screenshots and new/changed screens on desktop and at 320px, 360px and 390px phone widths, in Persian RTL / English LTR and light / dark themes. Check that Today still has one obvious next action, Learn remains focused, Explore stays discoverable, the answer/rating action remains clear, and no new sticky/fixed component obscures content. Record the exact target SHA, screenshots and decision.
- **Required evidence:** rendered screenshot review and regression evidence tied to the implementation PR; do not close this guardrail from a source diff alone.


### UIUX-011 — Core screens need visual finishing to match the approved art direction

- **Priority:** P1 — product-quality gate before broader release.
- **Status:** IMPLEMENTATION MERGED; selected responsive screenshots manually inspected; full visual/release acceptance remains open.
- **Evidence:** the visual-finishing implementation is merged as `d094147e66455b62f7b53fac26f27ca5479e637d`; the 320px inset and route-heading focus fix is merged as `a5ac705a5a035c9ed7e019e519e140e324e0f05a`, and the answer-reveal focus handoff as `df3afc35e1ebee201cd20abafd5746944a1b9247`. Screenshots from [run 39172388405](https://github.com/ArdKam/Rinemi2/actions/runs/39172388405) were inspected after the full-page capture was changed to start at scroll origin. The revealed-card screenshot no longer shows the fixed skip link overlaying the meaning explanation. The art direction/tokens remain the source of truth; a second design system is unnecessary. This is partial screenshot evidence, not full manual accessibility acceptance.
- **Implementation scope:** reduce header height and the visual weight of utility controls; replace the fresh-account zero-counter row with concise first-session guidance; give Today one restrained focal surface; make the prompt, reveal, answer and rating controls read as one learning surface; use consistent line icons for theme, bookmark and search; compact mobile and short-height spacing without pinning actions over content; remove the content-review notice from the global footer while retaining the explicit source/content caveat in the relevant learning and Explore contexts.
- **Non-goals:** no new learning features, no broad dashboard cards, no decorative gradients, no fixed rating bar, and no claim that content has been reviewed.
- **Acceptance:** inspect artifacts from the exact PR head and deployed SHA where available. Review Today, unrevealed and revealed learning states, rating controls, Explore results and selected details at 320px, 360px, 390px, 844×390, tablet and desktop; cover Persian RTL / English LTR and light / dark. Confirm focus visibility, button states, text wrapping, contrast, rating reachability, and no horizontal overflow. Verify that a fresh account sees a clear first action without noisy zero counters, and that the content-provenance caveat remains visible in context.
- **Required evidence:** save and actually inspect the screenshots, link the images/artifact and exact SHA here, and record any remaining defects. CI and screenshots merely existing are not enough to set this finding to VERIFIED FIX.

### UIUX-012 — Mobile layout, answer-reveal focus, and screenshot evidence

- **Priority:** P1 — core usability and rendered polish.
- **Status:** CORE UI/FLOW FIXES MERGED TO `main` at `36b1373fea55fda205c0e328621e3b8d6ce9c581`; PARTIAL SCREENSHOT ACCEPTANCE RECORDED, full rendered/manual acceptance pending.
- **Evidence:** the original responsive artifact identified an edge-hugging Today CTA and an apparently overlaid skip link. PR #41 fixes the logical insets and route-heading focus; PR #43 moves focus into the meaning heading when reveal removes the button and tests that the skip link is off-screen. The apparent remaining overlap was a full-page-capture offset artifact, corrected by PR #44. The refreshed 320px screenshot from [run 39172388405](https://github.com/ArdKam/Rinemi2/actions/runs/39172388405) was inspected and no longer shows the link over content.
- **Implementation:** token-based mobile insets, compact data-tools control, page-heading focus on destination changes, answer-meaning focus on reveal, regression assertions for skip-link visibility, isolated offline Playwright output, and full-page screenshots captured from the scroll origin are merged.
- **Acceptance:** at 320×640 and 390×844, the header has no unnecessary extra utility row, the Today CTA has at least 12 CSS px inset on both logical sides, and there is no horizontal overflow. After Today → Learn, `#learn-title` receives focus, the skip link is not left focused/overlapping content, the prompt/reveal/rating flow remains operable, and no control is hidden. Re-inspect captured screenshots at 320px, 390px, 844×390 and desktop before dispositioning this finding.
- **Required evidence:** CI run/artifact from the exact follow-up head, manual inspection of the relevant screenshots, exact deployed SHA after merge, and any remaining visual findings.


### UIUX-013 — Restore the editorial hierarchy after the visual-finishing pass

- **Priority:** P1 — user-reported premium-quality regression.
- **Status:** FIX MERGED in [PR #46](https://github.com/ArdKam/Rinemi2/pull/46); exact PR-head CI passed, representative screenshots were inspected, and current-main CI/Pages verification passed at application-code SHA `65e92fc8c539a92d4cc13841e653a563e96d2e8b`. The broader manual acceptance gate remains open.
- **Evidence:** the original main screenshot set at `8e79f400acc2169f40aa1478e78e5f74017724ba` showed the Today overview and Learn sheet as full outlined rounded panels and a ringed first-session cue. Mobile screenshots also showed a three-row header. PR #46 changes the surfaces to restrained top/bottom editorial rules, restores the smaller semantic action/rating radius, removes unnecessary rating lift, replaces the decorative ring with a short accent rule, and keeps brand and utility controls on the first mobile row with navigation on the second.
- **Verification:** exact final PR-head [CI run](https://github.com/ArdKam/Rinemi2/actions/runs/39839681292) passed all automated checks, including Playwright geometry assertions for the two-row header. The PR screenshot artifact was inspected for desktop Today, learning/revealed state, small/typical phone, and compact landscape. [Main CI](https://github.com/ArdKam/Rinemi2/actions/runs/39854370909) and [Pages deployment/live Chromium verification](https://github.com/ArdKam/Rinemi2/actions/runs/39854370784) also passed on the merged app SHA. The result restores the flatter editorial direction; it is not evidence that every locale/theme/viewport and assistive-technology case has passed.
- **Non-goals:** no palette redesign, new token system, gradients/glass effects, nested cards, persistent/fixed rating bars, feature additions, or changes to learning/data behavior.
- **Acceptance still open:** complete remaining visual review in all language/theme/viewport combinations; test zoom, keyboard focus, reduced motion, forced colors, virtual-keyboard behavior and screen readers manually. Keep all content and attribution warnings visible. Record any remaining defect with its finding ID and exact deployed SHA.
- **Evidence required to close the broader gate:** screenshot artifacts were saved and inspected, but the formal [manual release acceptance checklist](MANUAL-RELEASE-ACCEPTANCE.md) remains `NOT RUN / NOT ACCEPTED` until a human reviewer records the full set of checks and results.


### UIUX-014 — Forced-colors/high-contrast design-token fallback

- **Priority:** P1 — release accessibility coverage.
- **Status:** AUTOMATED FALLBACK AND SECONDARY-HOVER REFINEMENT MERGED in [PR #51](https://github.com/ArdKam/Rinemi2/pull/51) and [PR #53](https://github.com/ArdKam/Rinemi2/pull/53) to application SHA `1929c774b67c8ec3990f1ccb2f43aef7c463e7f1`. PR #53's [full CI](https://github.com/ArdKam/Rinemi2/actions/runs/39859285047) and [contrast run](https://github.com/ArdKam/Rinemi2/actions/runs/39859285118) passed; exact merged-SHA [main CI](https://github.com/ArdKam/Rinemi2/actions/runs/39859508305), [design-token contrast](https://github.com/ArdKam/Rinemi2/actions/runs/39859508249), and [Pages/live Chromium verification](https://github.com/ArdKam/Rinemi2/actions/runs/39859508390) also passed.
- **Implementation:** `src/styles/design-tokens.css` maps canvas/surface, primary/secondary text, links, borders, action buttons, selection, status roles and focus to system color keywords in `@media (forced-colors: active)`. Shadows are removed and focus uses the system Highlight color. Secondary-action hover now uses `Canvas` rather than pairing `LinkText` foreground with `Highlight` background. `e2e/core-journey.spec.ts` emulates forced colors/reduced motion and asserts token assignments, rendered primary surface, visible focus, and the hovered bookmark's secondary text/surface pairing.
- **Evidence limit:** Playwright's forced-colors emulation proves that the browser applies the declared fallbacks; it does not prove real Windows High Contrast usability or screen-reader behavior. No full forced-colors screenshot matrix was captured as part of this regression test.
- **Acceptance still open:** manually inspect Today, revealed Learn, Explore filters/details, collection controls, selected states, disabled/error states and dialogs under an actual supported OS/browser forced-colors setting; test keyboard focus; confirm status is not communicated through color alone. Issue [#7](https://github.com/ArdKam/Rinemi2/issues/7) and the checklist's `NOT RUN / NOT ACCEPTED` status remain open.


### UIUX-015 — Mascot was missing from the ordinary Today screen

- **Priority:** P2 — brand/implementation visibility; not a learning-engine defect.
- **Status:** IMPLEMENTATION MERGED AND LIVE-VERIFIED on application commit [`fb88901`](https://github.com/ArdKam/Rinemi2/commit/fb88901126d331a55ff2e91f188a0f2907e9c10c); PR [#57](https://github.com/ArdKam/Rinemi2/pull/57).
- **Root cause:** the first integration placed the cat only in the empty-session recovery state. A fresh learner and a returning learner with due/new work see the ordinary Today screen instead, so the mascot appeared to be absent during normal use.
- **Fix:** add the small decorative cat beside the Today heading unconditionally, independent of local review history. Keep the larger existing illustration in the empty-session recovery state. Do not place it in the wordmark or active review card.
- **Verification:** [Main CI #188](https://github.com/ArdKam/Rinemi2/actions/runs/39877410690) passed, including mobile viewport screenshots at 320px and 390px and the Today image-load assertion. [Pages deployment #43](https://github.com/ArdKam/Rinemi2/actions/runs/39877410464) passed the live smoke test and Chromium journey on the same SHA; the live test asserts the cat is visible on Today, its image decodes to non-zero dimensions, and its URL stays under the deployed `/Rinemi2/` base path. The actual live Persian RTL/light desktop screenshot was downloaded and inspected.
- **Acceptance still open:** complete the owner-supplied artwork fidelity matrix across Persian RTL / English LTR, light / dark, phone / compact landscape / desktop; finish provenance/license, screen-reader, zoom and the remaining manual accessibility checks. Automated live verification now covers the WebP on Today, not every visual/accessibility combination. Do not infer complete brand or accessibility acceptance from this single live visual fix.


## 4. Implementation order

1. **UIUX-007:** complete manual accessibility and visual acceptance on the current deployed SHA; the screenshot matrix remains incomplete.
2. **UIUX-001 and UIUX-002:** test real keyboard navigation, filter/query return context, Back/Escape, focus and screen-reader behavior in both languages/themes.
3. **UIUX-003 and UIUX-006:** evaluate rating reachability, short viewports, dialogs, virtual keyboard, text enlargement and focus visibility at phone/tablet/desktop sizes.
4. **UIUX-004 and UIUX-005:** inspect result disambiguation, long glosses and continuation beyond 240 for keyboard/screen-reader continuity and low-powered mobile performance.
6. **UIUX-008:** keep documents and status claims synchronized with main, open PRs, and the deployed artifact.
7. **UIUX-009:** validate Today with short usability tasks, then refine only where evidence shows confusion.
8. **UIUX-010:** apply the Kanji5 reuse guardrail during feature transfers and verify the resulting visual hierarchy with current rendered screenshots.

Fix sequencing may change if the current browser run reveals a more severe blocker, but every change must retain the finding ID and record why the order changed.

## 5. Related source-of-truth documents

- [Product and UX specification](PRODUCT-AND-UX-SPEC.md) — intended journeys and behavior.
- [Art direction](ART-DIRECTION.md) — visual principles and screenshot review standards.
- [Design token contract](DESIGN-TOKENS.md) — semantic tokens and contrast rules.
- [Manual release acceptance checklist](MANUAL-RELEASE-ACCEPTANCE.md) — human keyboard, screen-reader, zoom, and responsive checks.
- [Quality and release plan](QUALITY-AND-RELEASE.md) — test coverage, evidence, and release gates.
- [Roadmap](../ROADMAP.md) — phase order, current status, and ownership.
- [README](../README.md) — concise implementation and release summary.

**Do not mark UI/UX readiness complete until UIUX-001 through UIUX-008 are either verified fixed or explicitly dispositioned, all required manual checks are recorded, and current rendered screenshots have been inspected.** UIUX-009 requires a documented usability disposition before making claims about Today's effectiveness. UIUX-010 is an ongoing reuse guardrail and requires a documented rendered-UI disposition whenever new Kanji5-derived capabilities change core screens.
