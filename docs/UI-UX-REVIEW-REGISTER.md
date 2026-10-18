# Rinemi 2 — UI/UX Review Register

**Status:** Active; source review recorded on 2026-10-19. Rendered-browser visual acceptance is still outstanding.  
**Scope:** Responsive UI, core learning flow, Explore/dictionary, keyboard interaction, design-system execution, and documentation accuracy.  
**Target repository:** `ArdKam/Rinemi2`.  
**Review baseline:** `ce01a2a34a555b385ccc14ca73de6d29ef83dbfd` (main, checked 2026-10-19).  
**Public preview:** https://ardkam.github.io/Rinemi2/

This register preserves review findings between inspections. It is the canonical place to track UI/UX findings, severity, evidence, disposition, and acceptance criteria. The product and UX specification owns intended behavior; the art direction and design-token contract own visual rules; the roadmap owns phase order and release status; this register owns the durable list of review findings and their verification state.

## 1. How to use this register

- Re-read this file before any later UI/UX inspection. Check each finding against the current main commit, open PRs, and the actually deployed version; do not assume code, deployment, and screenshots are the same version.
- Reproduce a finding on the current rendered app before calling it a verified runtime defect. Source inspection can establish a code-level risk, but it cannot prove clipping, visual hierarchy, actual scrolling burden, or accessibility conformance.
- Keep historical findings until they are fixed or explicitly dispositioned. Do not delete a finding simply because code changed; record the verifying commit, browser/viewport, result, and screenshot/test artifact.
- Do not mark a design or accessibility acceptance item DONE solely because unit tests, a build, an automated contrast check, or an axe scan passes.
- For each accepted UI change, capture the actual rendered screen and inspect the saved image. Use the same representative content across Persian RTL / English LTR, light / dark, mobile / desktop, and relevant interaction states.
- Status vocabulary: **OPEN** = active finding; **NEEDS RENDERED VERIFICATION** = source or test evidence indicates a risk but actual UI behavior is not established; **IN PROGRESS** = fix is underway; **VERIFIED FIX** = acceptance criteria passed against an exact commit with evidence; **DISPOSITIONED** = intentionally not fixed with the reason and owner decision recorded.

## 2. Audit snapshot and evidence limits

The source and documentation review checked the main branch baseline above, including `src/App.tsx`, `src/styles.css`, `docs/PRODUCT-AND-UX-SPEC.md`, `docs/ART-DIRECTION.md`, `docs/DESIGN-TOKENS.md`, `docs/MANUAL-RELEASE-ACCEPTANCE.md`, `docs/QUALITY-AND-RELEASE.md`, `README.md`, and `ROADMAP.md`.

The recorded GitHub Actions live Chromium journey on commit `de3b9efb89698e395346be8fcdd77ef11517f87c` verifies a prior deployment's minimum learner journey, locale/theme switching, asset loading, and no horizontal overflow at a 390px viewport. It is **historical smoke-test evidence**, not visual acceptance of the current main commit or every state in this register. See [the recorded deployment and browser run](https://github.com/ArdKam/Rinemi2/actions/runs/39166050054).

No fresh screenshots were captured or visually inspected for this register entry. Consequently, the layout-related items below are source-based risks or validation gaps until a current build is captured in a real browser. Do not describe this document as a completed screenshot audit.

## 3. Findings

### UIUX-001 — Mobile Explore selection does not bring the selected detail into view

- **Priority:** P1 — high-impact core discovery flow.
- **Status:** NEEDS RENDERED VERIFICATION; implementation change required if reproduced as expected.
- **Evidence:** `src/App.tsx` renders the results section before the selected kanji's `.kanji-detail` panel (see [results](https://github.com/ArdKam/Rinemi2/blob/main/src/App.tsx#L406) and [detail panel](https://github.com/ArdKam/Rinemi2/blob/main/src/App.tsx#L416)). `src/styles.css` converts `.explore-layout` to one column at 680px and changes the detail panel from sticky to static (see [responsive rule](https://github.com/ArdKam/Rinemi2/blob/main/src/styles.css#L298)). The list may render up to 240 rows.
- **User impact:** on a phone, selecting a row may leave its detail far below the list, making the tap appear ineffective and forcing a long scroll.
- **Recommendation:** implement a deliberate mobile selection pattern: either a dedicated detail view with a clear Back action, a focused bottom sheet/dialog with correct focus behavior, or an equivalent pattern that makes the selected details immediately apparent. Preserve query, active filters, collection selection, and selected character when returning to results. Avoid leaving the selected detail below a long result list.
- **Acceptance:** at 320px and 390px widths, select a result while the list is long; the detail becomes immediately visible without traversing the results. Verify Back/close returns to the same query/filter/scroll context; keyboard focus is restored to the originating row; Escape works where applicable; browser Back behavior is coherent; there is no horizontal overflow; Persian RTL and English LTR both work.
- **Required evidence:** current-run screenshots of results, selected-detail state, and return-to-results state in both language directions, plus a Playwright regression test.

### UIUX-002 — Global Space shortcut can hijack native button activation

- **Priority:** P1 — keyboard interaction defect.
- **Status:** OPEN; source-level behavior identified.
- **Evidence:** the global keyboard handler in `src/App.tsx` intercepts Space to reveal the card. It excludes inputs, textareas, selects, and contenteditable targets, but does not exclude buttons, links, or other native interactive controls (see [keyboard handler](https://github.com/ArdKam/Rinemi2/blob/main/src/App.tsx#L257)).
- **User impact:** when a button such as Back or the bookmark control has focus, pressing Space can reveal the answer instead of activating the focused control. Global shortcuts can also compete with assistive technology and expected browser behavior.
- **Recommendation:** preserve native keyboard behavior on interactive elements. Restrict the Space shortcut to an explicitly defined non-interactive context, or rely on the reveal button's native keyboard activation. Keep numeric rating shortcuts only where focus is not inside a control that uses those keys, and document shortcuts near the relevant task when needed.
- **Acceptance:** keyboard-only walkthrough verifies Tab / Shift+Tab focus order; Space activates the focused button normally; Space reveals only in the intended prompt context; Enter works as expected; numeric shortcuts do not trigger from text fields or focused buttons; no focus trap occurs in detail/dialog/drawer states.

### UIUX-003 — Learning rating reachability is not proven by the current viewport test

- **Priority:** P1 — core study-flow usability.
- **Status:** NEEDS RENDERED VERIFICATION; do not assume a defect from the test alone.
- **Evidence:** the revealed answer contains meaning, readings, vocabulary examples, and then the four review ratings in a vertical flow in `src/App.tsx`. The responsive E2E test calls `scrollIntoViewIfNeeded()` on the Again button before asserting visibility in [the viewport test](https://github.com/ArdKam/Rinemi2/blob/main/e2e/core-journey.spec.ts#L181), so the test establishes reachability, not that the ratings are available without a substantial scroll.
- **User impact:** repeated review can feel slow when the main decision is displaced by secondary reference content, especially on short phone and landscape viewports.
- **Recommendation:** keep the information hierarchy (core meaning → useful reading/vocabulary evidence → optional reference detail → rating) but progressively disclose secondary information where appropriate. Consider a compact revealed layout on phones. If a persistent rating bar is tested, reserve its layout space and respect safe areas; never obscure content. Do not hide educationally necessary feedback merely to fit the screen.
- **Acceptance:** inspect revealed cards at 320×640, 390×844, and 844×390. Record whether the core meaning, at least one relevant example where available, and all rating actions are clear and usable. No sticky/fixed element may cover content or controls. Add a test that checks actual visible geometry or scroll position instead of only scrolling the control into view.

### UIUX-004 — Dictionary rows do not expose enough reading information and truncate long glosses

- **Priority:** P1 — discovery quality.
- **Status:** OPEN; source-level content hierarchy identified.
- **Evidence:** in `src/App.tsx`, each result row shows a gloss, level/stroke metadata, and saved state, but no reading. In `src/styles.css`, `.result-copy strong` uses single-line truncation with ellipsis (see [row styles](https://github.com/ArdKam/Rinemi2/blob/main/src/styles.css#L217)).
- **User impact:** users cannot efficiently distinguish candidates by reading, and similar meanings can become indistinguishable when truncated.
- **Recommendation:** retain the kanji as the dominant glyph; provide a common reading when the data contains a usable value; allow the primary gloss up to two lines where necessary; keep level/strokes as quieter metadata. Do not show empty or misleading readings, and avoid turning every row into a dense multi-field card.
- **Acceptance:** test short and long Persian glosses, English glosses, Japanese readings, and mixed-script content. Similar candidates remain distinguishable; text is not clipped; row heights remain orderly; row focus and saved state remain understandable in RTL/LTR and both themes.

### UIUX-005 — Explore stops at 240 rows rather than offering a complete browsing path

- **Priority:** P1 — information access.
- **Status:** OPEN; implementation and specification are misaligned.
- **Evidence:** `src/App.tsx` renders `filteredKanji.slice(0, 240)` and provides a message asking the user to refine the search when there are more results. The UX specification calls for paginated or virtualized results that remain keyboard navigable and retain query state.
- **User impact:** browsing a broad topic or an imprecise search has an arbitrary stopping point even though the corpus contains 2,136 kanji.
- **Recommendation:** introduce incremental pagination or virtualization with accessible keyboard navigation, stable result identity, retained query/filter state, and a clear indication of result totals and current range. Choose virtualization only if needed for performance, not as needless complexity.
- **Acceptance:** users can reach every matching record without inventing a more specific search; query, filters, active collection, and selected item persist as intended; keyboard navigation and screen-reader semantics remain logical when more results load.

### UIUX-006 — Compact landscape and short-viewport behavior need explicit validation

- **Priority:** P2 — responsive quality and accessibility.
- **Status:** NEEDS RENDERED VERIFICATION.
- **Evidence:** the responsive stylesheet has width-based breakpoints but no explicit short-viewport rule. The E2E suite includes an 844×390 class, but the manual checklist must inspect actual behavior, not only horizontal overflow and control dimensions.
- **User impact:** on landscape phones or when a virtual keyboard reduces height, the wrapped header, progress line, prompt, answer, and rating controls may leave little useful space in the viewport.
- **Recommendation:** keep the header and study navigation compact at short heights, protect the prompt and primary action, and give dialogs/drawers a single predictable scroll owner. Allow vertical scrolling where necessary; optimize to prevent controls from being obscured or displaced without purpose.
- **Acceptance:** manually inspect Today, prompt, revealed answer, rating controls, Explore, kanji detail, collection editing, and dialogs at 844×390 and with the virtual keyboard where supported.

### UIUX-007 — Rendered UI acceptance remains a release blocker

- **Priority:** P1 — release gate.
- **Status:** OPEN until current rendered evidence and manual checks are recorded.
- **Evidence:** `docs/MANUAL-RELEASE-ACCEPTANCE.md` declares human acceptance not run/not accepted. `ROADMAP.md` leaves design-system, shell, learning and cross-cutting accessibility/responsive phases open.
- **Recommendation:** run the manual acceptance checklist on the deployed build corresponding to an exact SHA and inspect current screenshots. Cover Persian RTL / English LTR, light / dark, narrow phone, typical phone, compact landscape, tablet/desktop, unrevealed/revealed learning, filters, selected detail, collection states, no results, storage/error states, and relevant focus states. Perform keyboard, zoom/text enlargement, reduced-motion, forced-colors, and screen-reader spot checks.
- **Acceptance:** reviewer, date/time, browser/OS, exact deployed SHA/URL, results, issues, and screenshot/test artifacts are recorded. No NOT RUN item is treated as PASS. Any release-blocking failure links to a reproducible issue.

### UIUX-008 — Documentation status must be kept in sync with implemented behavior

- **Priority:** P1 — inspection reliability.
- **Status:** IN PROGRESS through this documentation change; recheck all statuses before merge.
- **Evidence:** before this update, README/roadmap still listed collection rename and bulk operations as future work although rename, clearing all characters from a collection, and collection deletion are present in the current implementation. Anki parser work appeared briefly in main but was subsequently reverted; do not describe it as implemented in main merely because an open PR exists.
- **Recommendation:** use `ROADMAP.md` for current phase status and this register for UX findings; use the README only as a concise summary. Describe collection rename and bulk clear as implemented, while distinguishing them from unimplemented multi-item selection/bulk add/remove. Distinguish an Anki text-export parser or preview in a branch from a user-accessible end-to-end import flow on main. Keep verification claims tied to the exact commit/deployment.
- **Acceptance:** README, phase status, and open-work summary are checked against current main and open PRs. The deployed SHA is reported only after a successful deployment and live verification.

### UIUX-009 — Today should distinguish a returning learner's next action from editorial content

- **Priority:** P2 — clarity; hypothesis to validate.
- **Status:** NEEDS USABILITY VALIDATION; not a confirmed defect.
- **Evidence:** Today combines a primary study action/workload summary with a featured kanji and editorial example.
- **Recommendation:** keep the single dominant start/continue action. Check whether returning learners immediately understand due workload and next action, and whether new learners understand how to begin. Label featured educational content clearly if it is not the next item in the queue. Avoid adding competing statistic tiles or decorative dashboard panels.
- **Acceptance:** unfamiliar users can identify what to do next on first visit and return visits, explain the due-work state, and distinguish the featured example from their scheduled learning.

## 4. Implementation order

1. **UIUX-002 and UIUX-001:** fix keyboard shortcut ownership and make mobile Explore selection reveal details predictably.
2. **UIUX-003:** inspect real revealed-card screenshots and reduce unnecessary scrolling without compromising educational order.
3. **UIUX-004 and UIUX-005:** improve result disambiguation and remove the arbitrary browsing ceiling with an accessible continuation pattern.
4. **UIUX-006 and UIUX-007:** perform the full responsive and manual accessibility acceptance pass.
5. **UIUX-008:** keep the documents and status claims synchronized with main, open PRs, and the deployed artifact.
6. **UIUX-009:** validate Today with short usability tasks, then refine only where evidence shows confusion.

Fix sequencing may change if the current browser run reveals a more severe blocker, but every change must retain the finding ID and record why the order changed.

## 5. Related source-of-truth documents

- [Product and UX specification](PRODUCT-AND-UX-SPEC.md) — intended journeys and behavior.
- [Art direction](ART-DIRECTION.md) — visual principles and screenshot review standards.
- [Design token contract](DESIGN-TOKENS.md) — semantic tokens and contrast rules.
- [Manual release acceptance checklist](MANUAL-RELEASE-ACCEPTANCE.md) — human keyboard, screen-reader, zoom, and responsive checks.
- [Quality and release plan](QUALITY-AND-RELEASE.md) — test coverage, evidence, and release gates.
- [Roadmap](../ROADMAP.md) — phase order, current status, and ownership.
- [README](../README.md) — concise implementation and release summary.

**Do not mark UI/UX readiness complete until UIUX-001 through UIUX-008 are either verified fixed or explicitly dispositioned, all required manual checks are recorded, and the current rendered screenshots have been inspected.** UIUX-009 requires a documented usability disposition before making claims about Today’s effectiveness.
