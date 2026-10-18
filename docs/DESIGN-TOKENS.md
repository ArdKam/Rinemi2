# Rinemi 2 — Design Token Contract

**Purpose:** the implementation contract for Rinemi 2's shared visual language.  
**Runtime source of truth:** [`src/styles/design-tokens.css`](../src/styles/design-tokens.css).  
**Status:** initial token baseline created; theme integration and rendered-browser verification remain open.

## 1. Authority and change policy

- The CSS token file is the only runtime source for shared color values and semantic token definitions.
- This document defines how those tokens must be used. It intentionally does not maintain a second copy of the hex palette.
- [Art direction](ART-DIRECTION.md) owns creative intent; this file and the CSS token sheet own the semantic contract; [the decision log](DECISIONS.md) records why consequential choices were made; [the roadmap](../ROADMAP.md) owns phase order.
- If a component needs a standard color, type scale, spacing, radius, border, focus, elevation, or motion value, it must consume a shared token. Do not introduce a component-local palette or a second token library.
- When a genuine new role is needed, add it to the canonical token sheet, document its semantics here, check both themes and contrast, then migrate consumers. Do not solve a missing token with a one-off literal.
- Color literals are allowed in the token sheet and in inherently data-driven content only where their semantics are documented. They are not allowed as substitutes for shared UI tokens in component styles.

## 2. Token layers and naming

Use semantic variables such as `--rinemi-color-bg-canvas`, `--rinemi-color-text-primary`, `--rinemi-color-action-primary-bg`, and `--rinemi-color-focus-ring`. Component CSS must not depend on a raw palette name or infer meaning from a color's hue.

| Role family | Use |
|---|---|
| `color-bg-*` | Canvas, base surface, raised surface, inset surface and overlays. |
| `color-text-*` | Primary, secondary, muted, disabled and inverse text; links use their explicit role. |
| `color-border-*` | Subtle visual separators versus strong/interactive boundaries. |
| `color-action-primary-*` | The single dominant action on a screen, including hover, pressed and disabled states. |
| `color-action-secondary-*` | Secondary actions that must not compete with the primary action. |
| `color-action-danger-*` / `color-danger-*` | Destructive actions and error/failure feedback; never repurpose the brand primary token. |
| `color-selection-*` | Selected navigation items, filters, tabs and options. Selection is not focus. |
| `color-focus-ring` | Keyboard focus indicator. It is independent of button and selection styling. |
| `color-success-*`, `color-warning-*`, `color-info-*` | Status text, background and border for meaningful feedback. |

## 3. Color decision

The primary action uses the restrained vermilion/coral brand family in **both light and dark themes**. Values are separately tuned for each theme so the button remains legible; dark mode must not silently switch the primary action to indigo.

Muted indigo is reserved for secondary emphasis, links, selected-state cues and the focus family where the explicit focus token is used. Focus, selection and primary action are three different states and must not be represented by one shared color role.

Danger/destructive feedback has its own semantic role and must remain distinguishable from the ordinary primary action. Sakura and moss remain restrained accents; neither becomes a default body-text color nor a standalone signal of error, success, due status or mastery.

## 4. Theme contract

- Apply the resolved theme to the document root using `data-theme="light"` or `data-theme="dark"`. Components do not own their own theme classes or local palette overrides.
- The future pre-React bootstrap must resolve the stored preference and system default, then set the document-root theme **before first paint**. Use one documented preference key, `rinemi.theme`, with `light`, `dark` or `system` values.
- React, onboarding and any pre-React/loading shell must all consume the same token stylesheet and root `data-theme`. They must not implement independent color maps or independently infer a theme.
- With `system` selected, resolve the effective theme from `prefers-color-scheme`; update it if the OS setting changes while the preference remains `system`.
- React must adopt the already resolved root value instead of briefly forcing light mode on hydration/mount. Theme changes must update the root attribute and persisted preference through one shared path.
- Use the semantic surface roles rather than simply inverting light-mode hex values. Validate onboarding, dialogs, overlays, disabled controls and the pre-React state as part of the same theme matrix.

**Current repository limitation:** Rinemi 2 has not yet implemented its HTML/React shell or onboarding. These are binding requirements for the first shell slice, not claims of current runtime integration.

## 5. Typography policy

Font families and scale values are defined in the canonical CSS token sheet. Load only families/weights that have been verified for availability, glyph coverage, licensing and performance.

- Use Vazirmatn for Persian UI and learning copy; Plus Jakarta Sans (with a safe fallback) for English; Noto Serif JP selectively for display kanji; and a readable Japanese sans-serif stack for readings and dense reference data.
- Default body copy to at least `1rem / 16px` on mobile. The `xs` size is for non-essential metadata only; do not use it for learning instructions, readings, status messages or required controls.
- Use regular (400) for body content, medium (500) for controls and short labels, semibold (600) for section headings and primary button labels, and bold (700) sparingly for strong emphasis. Do not use extra-light, 300, 800 or heavier weights as a visual shortcut.
- Persian paragraphs need generous line height; Japanese readings and mixed Persian/Latin/Japanese strings require their own wrapping and baseline checks. Do not force the display serif into dense lists or form controls.
- Use semantic type roles and line-height tokens. Do not shrink type solely to fit excessive content; simplify or progressively disclose the content instead.

## 6. Spacing, surfaces, borders and elevation

- Use the shared spacing scale. New one-off spacing values require a documented exception (for example, a data visualization or glyph-specific optical adjustment).
- Use restrained radius tokens consistently. The fully rounded token is for genuinely circular controls or compact indicators, not a default style for every card, button, chip and panel.
- Canvas, surface, raised surface and inset surface have distinct roles. Do not nest surfaces without a clear hierarchy.
- Passive content containers should not all have borders. Use subtle dividers and typography for grouping; use strong interactive boundaries where an input or control needs a visible edge.
- Shadows communicate real layering only: a low-contrast raised surface or an overlay. Do not add shadows to every card or use them as a replacement for spacing and hierarchy.
- Keep z-index decisions within the shared layer scale. If two components compete at the same level, fix ownership rather than increasing values arbitrarily.
- Fixed and sticky UI must respect safe areas, short viewports and a single, predictable scroll owner.

## 7. Focus and interaction states

Every interactive component must define only the states relevant to its behavior: idle, hover, focus-visible, pressed, selected, disabled, loading, success/warning feedback, and destructive/error. The state must be communicated by more than color alone where meaning matters.

- Preserve a visible focus ring. Do not remove browser outlines without providing the shared focus token, required width and offset.
- Focus is not the same as hover or selected. Keyboard focus must remain visible on selected controls and against both theme surfaces.
- Use semantic disabled tokens and cursor/interaction behavior; disabled content must not look enabled. Where contrast exceptions are permitted by the applicable accessibility standard, still keep disabled content understandable.
- Error messages must identify the problem and a recovery action when possible. Success and warning feedback must use explicit text or icons alongside color.
- Avoid arbitrary animation; use the shared motion values for useful transitions and honor reduced-motion preferences.

## 8. Contrast and validation policy

Target WCAG 2.2 AA: at least 4.5:1 for ordinary text and 3:1 for large text. Essential non-text UI boundaries and focus indicators must remain perceivable against adjacent colors, with a 3:1 target where the WCAG criterion applies. Do not treat a color token as proven accessible simply because it looks strong.

Run the source-level check with `node scripts/check-design-token-contrast.mjs`. Before a theme/token change is accepted:

1. Run automated contrast calculations for primary, secondary and muted text, primary/destructive action labels, all status labels against their status surface, links, selected states and focus indicators.
2. Check hover, pressed, disabled, loading, empty, warning, error and overlay states in both themes.
3. Inspect rendered screenshots for Persian RTL and English LTR, phone and desktop, dense kanji/vocabulary content, and keyboard focus. Source-level checks do not replace rendered verification.
4. Add a small component gallery once the app shell exists; use the same examples in light/dark and both languages.
5. Record exact commit SHA, test output and screenshots in the PR. Do not mark the design-system phase complete until browser-rendered evidence exists.

The initial values in the CSS are a starting baseline. Browser-rendered contrast, actual font loading and component consistency are still unverified in the current documentation-only repository.

## 9. Implementation checklist

- [x] Create one token sheet for shared colors, semantic roles, type, spacing, radius, focus, borders, elevation, layering and motion.
- [x] Establish vermilion/coral as the primary action in both themes; keep indigo secondary and danger separate.
- [x] Add a pre-React theme bootstrap that resolves `rinemi.theme` and sets root `data-theme` before React mounts, preserving v2/v1 stored theme values as fallbacks.
- [x] Make the current React shell use the shared resolver and document-root theme; onboarding is not implemented yet and must use the same contract when added.
- [x] Remove the duplicated light/dark palette from the current global app CSS; compatibility aliases now reference semantic tokens instead of declaring alternate colors.
- [x] Add a standalone semantic-token contrast checker at `scripts/check-design-token-contrast.mjs`.
- [x] Wire the checker into GitHub Actions for token-sheet, theme resolver, app styles, app entry and preference changes.
- [ ] Build a rendered component gallery.
- [ ] Validate Persian RTL / English LTR, light / dark, mobile / desktop, keyboard focus and reduced motion.
