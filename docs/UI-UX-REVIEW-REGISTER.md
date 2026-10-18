# Rinemi 2 — UI/UX Review Register

**Status:** Active; source review recorded on 2026-10-19. Rendered-browser visual acceptance remains outstanding.  
**Scope:** Responsive UI, core learning flow, Explore/dictionary, keyboard interaction, design-system execution, and documentation accuracy.  
**Target repository:** `ArdKam/Rinemi2`.  
**Review baseline:** `36b1373fea55fda205c0e328621e3b8d6ce9c581` (current integrated main code and evidence-capture snapshot checked on 2026-10-19).  
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

The current main code/evidence snapshot is `36b1373fea55fda205c0e328621e3b8d6ce9c581`; [main CI](https://github.com/ArdKam/Rinemi2/actions/runs/39172536333) and [Pages deployment/live verification](https://github.com/ArdKam/Rinemi2/actions/runs/39172536262) both passed on this exact SHA.

Responsive screenshots from [run 39172388405](https://github.com/ArdKam/Rinemi2/actions/runs/39172388405) were downloaded and visually inspected for 320px portrait, 390px portrait, compact landscape, and desktop. The 320px revealed-card capture confirms the answer meaning heading is focusable and the skip link is not over the content after the screenshot was corrected to begin at the scroll origin. It also shows the Today inset fix. This is useful partial rendered evidence, not completion of the full Persian RTL/English LTR × light/dark × viewport matrix, not manual screen-reader acceptance, and not proof of teaching quality or legal approval.

## 3. Findings

### UIUX-001 — Mobile Explore return context requires rendered verification

- **Priority:** P1 — high-impact core discovery flow.
- **Status:** NEEDS RENDERED / MANUAL VERIFICATION; implementation and regression coverage are merged.
- **Evidence:** PR #33 adds browser-history state for mobile detail, Escape handling, and return focus/scroll restoration. Playwright tests long filtered result sets at 320px and 390px, including browser Back, Escape and explicit Back. The deployed interface still needs both-language and filter-context acceptance.
- **User impact:** on a phone, selecting a row may leave its detail far below the list, making the tap appear ineffective and forcing a long scroll.
- **Recommendation:** implement a deliberate mobile selection pattern: either a dedicated detail view with a clear Back action, a focused bottom sheet/dialog with correct focus behavior, or an equivalent pattern that makes selected details immediately apparent. Preserve query, active filters, collection selection, and selected character on return. Avoid leaving selected detail below a long result list.
- **Acceptance:** at 320px and 390px widths, select a result while the list is long; detail becomes immediately visible without traversing results. Verify Back/close returns to the same query/filter/scroll context; keyboard focus returns to the originating row; Escape works where applicable; browser Back is coherent; there is no horizontal overflow; Persian RTL and English LTR both work.
- **Required evidence:** current-run screenshots of results, selected-detail state, and return-to-results state in both language directions, plus a Playwright regression test.

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
- **Status:** IN PROGRESS in this documentation sync; exact-SHA and feature statuses are being reconciled.
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
