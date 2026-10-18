# Rinemi 2 — UI/UX Review Register

**Status:** Active; source review recorded on 2026-10-19. Rendered-browser visual acceptance remains outstanding.  
**Scope:** Responsive UI, core learning flow, Explore/dictionary, keyboard interaction, design-system execution, and documentation accuracy.  
**Target repository:** `ArdKam/Rinemi2`.  
**Review baseline:** `a5ac705a5a035c9ed7e019e519e140e324e0f05a` (current integrated main application-code snapshot checked on 2026-10-19).  
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

For current main `a5ac705`, the integration includes the mobile Explore return fix, result-reading/continuation updates, responsive visual finishing, a 320px inset and route-heading-focus correction, read-only Anki preview, complete bundled-font notices, persistent KANJIDIC2 attribution and PWA warm-cache support. See [main CI](https://github.com/ArdKam/Rinemi2/actions/runs/39171719479) and [Pages deployment/live verification](https://github.com/ArdKam/Rinemi2/actions/runs/39171719486) for exact-SHA evidence.

The visual-finishing PR's [browser screenshot artifact](https://github.com/ArdKam/Rinemi2/actions/runs/39171122230) from head `86eb56e4698ca0d598df5a91e51282e9252df384` was downloaded and inspected for Today (Persian/light), a small-phone revealed card, and compact landscape. Those sampled screens show a calmer hierarchy, visible rating controls and no horizontal clipping. The same screenshots exposed the 320px side-inset and screen-transition focus defects that led to PR #41; that follow-up is now merged and has exact-head CI in [run 39171598092](https://github.com/ArdKam/Rinemi2/actions/runs/39171598092). This is partial rendered evidence, not the full RTL/LTR × light/dark × viewport matrix and not a keyboard/screen-reader audit. The current deployed SHA still needs its own inspection.

## 3. Findings

### UIUX-001 — Mobile Explore return context requires rendered verification

- **Priority:** P1 — high-impact core discovery flow.
- **Status:** NEEDS RENDERED / MANUAL VERIFICATION; implementation and regression coverage are merged.
- **Evidence:** PR #33 merged the mobile detail pattern with browser-history state, Escape handling, and return focus/scroll restoration. Playwright exercises a long filtered result set at 320px and 390px, including browser Back, Escape and the explicit Back action. Source/test coverage removes the original code-level gap, but the deployed UI still needs both-language and filter-context acceptance.
- **User impact:** on a phone, selecting a row may leave its detail far below the list, making the tap appear ineffective and forcing a long scroll.
- **Recommendation:** implement a deliberate mobile selection pattern: either a dedicated detail view with a clear Back action, a focused bottom sheet/dialog with correct focus behavior, or an equivalent pattern that makes selected details immediately apparent. Preserve query, active filters, collection selection, and selected character on return. Avoid leaving selected detail below a long result list.
- **Acceptance:** at 320px and 390px widths, select a result while the list is long; detail becomes immediately visible without traversing results. Verify Back/close returns to the same query/filter/scroll context; keyboard focus returns to the originating row; Escape works where applicable; browser Back is coherent; there is no horizontal overflow; Persian RTL and English LTR both work.
- **Required evidence:** current-run screenshots of results, selected-detail state, and return-to-results state in both language directions, plus a Playwright regression test.

### UIUX-002 — Verify native keyboard activation after the Space-shortcut fix

- **Priority:** P1 — keyboard interaction defect.
- **Status:** NEEDS RENDERED / MANUAL VERIFICATION; source fix is present on current main.
- **Evidence:** the global Space shortcut excludes native interactive controls through `target.closest(...)` and a focused Playwright regression test covers this. Main CI has passed on integration snapshots, but a full manual keyboard/screen-reader check on the currently deployed runtime remains outstanding.
- **User impact if regressed:** when Back, bookmark, reveal, or rating controls have focus, Space must perform the control's expected action rather than an unrelated global shortcut.
- **Recommendation:** retain the guard and regression test. Recheck its behavior with real keyboard focus in both languages and with assistive technology; keep shortcuts from firing in text/form controls.
- **Acceptance:** keyboard-only walkthrough verifies Tab / Shift+Tab focus order; Space activates the focused button normally; Space reveals only in the intended prompt context; Enter works as expected; numeric shortcuts do not trigger from text fields or focused buttons; no focus trap occurs in detail/dialog/drawer states. Record the deployed SHA and result.

### UIUX-003 — Learning rating reachability is not proven by the current viewport test

- **Priority:** P1 — core study-flow usability.
- **Status:** NEEDS RENDERED VERIFICATION; do not assume a defect from the test alone.
- **Evidence:** the revealed answer still prioritizes meaning, readings and vocabulary before ratings. The inspected visual-finishing artifact includes the revealed card in small-phone portrait and 844×390 compact landscape, with rating controls visible and no overlay; however, screenshots alone do not establish that repeated reviews are effortless or that every language/theme behaves identically. Keep scroll-burden and short-height checks in the manual acceptance run.
- **User impact:** repeated review can feel slow when the main decision is displaced by secondary reference content, especially on short phone and landscape viewports.
- **Recommendation:** keep the information hierarchy (core meaning → useful reading/vocabulary evidence → optional reference detail → rating) but progressively disclose secondary information where appropriate. Consider a compact revealed layout on phones. If a persistent rating bar is tested, reserve its layout space and respect safe areas; never obscure content. Do not hide educationally necessary feedback merely to fit the screen.
- **Acceptance:** inspect revealed cards at 320×640, 390×844, and 844×390. Record whether the core meaning, at least one relevant example where available, and all rating actions are clear and usable. No sticky/fixed element may cover content or controls. Add a test that checks actual visible geometry or scroll position instead of only scrolling the control into view.

### UIUX-004 — Dictionary rows do not expose enough reading information and truncate long glosses

- **Priority:** P1 — discovery quality.
- **Status:** NEEDS RENDERED VERIFICATION; result-level reading/gloss cues are merged.
- **Evidence:** Explore now exposes available reading information alongside the gloss and keeps secondary metadata quieter. The change is covered by core-journey E2E, but visually similar candidates, long Persian/English meanings, Japanese wrapping and saved/focus states still need review in RTL/LTR and both themes.
- **User impact:** users cannot efficiently distinguish candidates by reading, and similar meanings can become indistinguishable when truncated.
- **Recommendation:** retain the kanji as the dominant glyph; provide a common reading when the data contains a usable value; allow the primary gloss up to two lines where needed; keep level/strokes as quieter metadata. Do not show empty or misleading readings, and avoid turning every row into a dense multi-field card.
- **Acceptance:** test short and long Persian glosses, English glosses, Japanese readings, and mixed-script content. Similar candidates remain distinguishable; text is not clipped; row heights remain orderly; row focus and saved state remain understandable in RTL/LTR and both themes.

### UIUX-005 — Explore stops at 240 rows rather than offering a complete browsing path

- **Priority:** P1 — information access.
- **Status:** NEEDS RENDERED VERIFICATION; the arbitrary 240-row ceiling has been replaced by incremental continuation.
- **Evidence:** PR #30 removed the hard stop and added a continuation path, with E2E coverage proving a result beyond the first 240 can be reached. Manual review still needs a broad query/topic, screen-reader/keyboard continuity, stable selected identity, query/filter retention and performance on a lower-powered phone.
- **User impact:** browsing a broad topic or imprecise search has an arbitrary stopping point even though the corpus contains 2,136 kanji.
- **Recommendation:** introduce incremental pagination or virtualization with accessible keyboard navigation, stable result identity, retained query/filter state, and a clear indication of result totals and current range. Choose virtualization only if needed for performance.
- **Acceptance:** users can reach every matching record without inventing a more specific search; query, filters, active collection, and selected item persist as intended; keyboard navigation and screen-reader semantics remain logical when more results load.

### UIUX-006 — Compact landscape and short-viewport behavior need explicit validation

- **Priority:** P2 — responsive quality and accessibility.
- **Status:** NEEDS RENDERED / MANUAL VERIFICATION; responsive finishing and screenshot coverage are merged.
- **Evidence:** PR #37 adds compact short-height/mobile styling and responsive Playwright coverage. Selected artifact screenshots show the revealed card at small-phone and 844×390 widths with ratings visible and no horizontal clipping. PR #41 also adds 320px side-inset and page-heading-focus assertions. Dialogs, virtual-keyboard height, RTL/LTR, both themes and focus order remain to be accepted manually.
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
- **Status:** IN PROGRESS in this synchronization PR; exact-SHA implementation/deployment statuses are being reconciled here. Keep this finding open for future syncs if a code, PR or deployment change makes the records stale.
- **Evidence:** main's roadmap lists collection rename and bulk-clear as merged, while README and detailed roadmap items did not consistently reflect these changes. Main now includes Anki text-export parser/tests and a support matrix, but end-to-end import UI and persistence acceptance remain open.
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
- **Status:** IMPLEMENTATION MERGED; selected screenshots inspected; full visual/release acceptance remains open. 320px inset and destination-focus follow-up is merged as `a5ac705`.
- **Evidence:** the visual review of the recorded desktop/mobile evidence for commit `63c42c0` identified a wireframe-like Today composition, utility controls competing with primary navigation, weak visual continuity in the learning card, unnecessary mobile header overhead, and global placement of the content-review notice. The first implementation is merged as `d094147e66455b62f7b53fac26f27ca5479e637d`. The browser evidence from [CI run 39171122230](https://github.com/ArdKam/Rinemi2/actions/runs/39171122230) was manually inspected. It confirms the more coherent desktop surfaces and first-session message, but also exposed the edge-hugging Today CTA at 320px and the focused skip link appearing over the revealed card in the captured navigation journey. Those follow-up fixes are merged as `a5ac705a5a035c9ed7e019e519e140e324e0f05a` and have [exact-head CI](https://github.com/ArdKam/Rinemi2/actions/runs/39171598092); the current main deployment is available in [run 39171719486](https://github.com/ArdKam/Rinemi2/actions/runs/39171719486). The art direction/tokens remain the source of truth; a redesign or second token set is unnecessary.
- **Implementation scope:** reduce header height and the visual weight of utility controls; replace the fresh-account zero-counter row with concise first-session guidance; give Today one restrained focal surface; make the prompt, reveal, answer and rating controls read as one learning surface; use consistent line icons for theme, bookmark and search; compact mobile and short-height spacing without pinning actions over content; remove the content-review notice from the global footer while retaining the explicit source/content caveat in the relevant learning and Explore contexts.
- **Non-goals:** no new learning features, no broad dashboard cards, no decorative gradients, no fixed rating bar, and no claim that content has been reviewed.
- **Acceptance:** inspect artifacts from the exact PR head and deployed SHA where available. Review Today, unrevealed and revealed learning states, rating controls, Explore results and selected details at 320px, 360px, 390px, 844×390, tablet and desktop; cover Persian RTL / English LTR and light / dark. Confirm focus visibility, button states, text wrapping, contrast, rating reachability, and no horizontal overflow. Verify that a fresh account sees a clear first action without noisy zero counters, and that the content-provenance caveat remains visible in context.
- **Required evidence:** save and actually inspect the screenshots, link the images/artifact and exact SHA here, and record any remaining defects. CI and screenshots merely existing are not enough to set this finding to VERIFIED FIX.

### UIUX-012 — Mobile Today inset and screen-transition focus need correction

- **Priority:** P1 — core usability and rendered polish.
- **Status:** IMPLEMENTATION MERGED (`a5ac705`); exact-head CI passed, deployed visual acceptance pending.
- **Evidence:** screenshots from [browser run 39171122230](https://github.com/ArdKam/Rinemi2/actions/runs/39171122230), especially the 320px Today and revealed-card captures. In the mobile Today composition, `.overview-copy` had zero horizontal padding, leaving the primary CTA/text too close to the focal surface edge. During Today → Learn, the captured revealed card had the skip link visibly over its content. The merged fix adds token-based logical insets and destination-heading focus, with assertions at 320px and after route change in [CI run 39171598092](https://github.com/ArdKam/Rinemi2/actions/runs/39171598092).
- **Implementation:** apply token-based horizontal insets to the mobile overview content; compact the data-tools control to an accessible icon at 320px so the brand and utility controls can share the first row; programmatically focus the active page heading when switching destinations without stealing focus on initial load; give the page headings programmatic focusability.
- **Acceptance:** at 320×640 and 390×844, the header has no unnecessary extra utility row, the Today CTA has at least 12 CSS px inset on both logical sides, and there is no horizontal overflow. After Today → Learn, `#learn-title` receives focus, the skip link is not left focused/overlapping content, the prompt/reveal/rating flow remains operable, and no control is hidden. Re-inspect captured screenshots at 320px, 390px, 844×390 and desktop before dispositioning this finding.
- **Required evidence:** CI run/artifact from the exact follow-up head, manual inspection of the relevant screenshots, exact deployed SHA after merge, and any remaining visual findings.

## 4. Implementation order

1. **UIUX-007:** complete the integrated manual screenshot/accessibility pass on the current deployed SHA; the implementation and sampled screenshot artifacts are not the full matrix.
2. **UIUX-001 and UIUX-002:** perform real keyboard navigation, result/detail return-context, Back/Escape, focus, scroll and shortcut-ownership checks across RTL/LTR and themes.
3. **UIUX-003 and UIUX-006:** finish rating-reachability and short-viewport review at 320×640, 390×844, 844×390, tablet and desktop, including virtual keyboard and focus visibility.
4. **UIUX-004 and UIUX-005:** inspect result disambiguation and continuation beyond 240 with keyboard, screen reader, long meanings and low-powered/mobile performance.
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
