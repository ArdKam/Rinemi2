# Rinemi 2 — Manual Release Acceptance Checklist

**Purpose:** record human checks that automation cannot certify. This checklist supplements, and does not replace, the automated Playwright/axe tests and the release criteria in `ROADMAP.md` and `docs/QUALITY-AND-RELEASE.md`.

**Current status:** NOT RUN / NOT ACCEPTED. Do not mark a check as passed without recording the reviewer, date, browser/assistive technology, commit, and findings.

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

## Explore and collection usability

- [ ] Search by character and text; clear query and filters; verify zero-results recovery.
- [ ] Change JLPT/topic filters, toggle saved-only, open/close detail, and return without losing expected context.
- [ ] Create a collection, add a kanji, open the collection, remove the item, and verify bookmark and review history remain unchanged.
- [ ] Inspect empty collections, duplicate collection names, long names, and the maximum/limit error if reachable.
- [ ] Verify controls remain usable at mobile width and keyboard-only.

## Required handoff

- [ ] Attach screenshots or a short recording for any visual/focus defect.
- [ ] Create/link an issue for every reproducible failure, with severity and exact reproduction steps.
- [ ] Record which checks were not possible and why; do not convert NOT RUN into PASS.
- [ ] Update issue #7 with the run summary and evidence.
- [ ] Close issue #7 only when all release-blocking manual checks have been completed or explicitly dispositioned by the project owner.

**Important:** this is a test procedure, not a statement that the application has passed it. Automated axe and Playwright results do not replace a human keyboard, zoom, forced-colors or screen-reader review.
