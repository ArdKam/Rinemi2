# Rinemi 2 — Art Direction and Design System

**Status:** Approved written starting direction for Rinemi 2. The owner explicitly asked to skip image generation. This is a design baseline, not a claim that rendered UI has been verified; refine it against browser screenshots.  
**Creative intent:** an adult, calm, Persian-first Japanese learning studio with editorial Japanese influence—not generic SaaS, anime, or decorative Japan-themed stock UI.  
**Token authority:** [`DESIGN-TOKENS.md`](DESIGN-TOKENS.md) defines semantic roles and [`../src/styles/design-tokens.css`](../src/styles/design-tokens.css) is the runtime source. The seed palette below is art-direction reference, not a second implementation palette.

## 1. Brand character

Rinemi should feel:
- thoughtful, precise, calm, literate, quietly encouraging;
- premium through editing, typography, consistency and craft—not through visual effects;
- Japanese-informed without pretending to be Japanese calligraphy or a traditional school;
- Persian-native in alignment, language, rhythm and educational voice;
- approachable but adult.

It should not feel:
- like a generic dashboard with Japanese glyphs pasted into cards;
- childish, anime/manga-inspired, kawaii, chibi, or mascot-driven;
- like a game economy with points and pressure;
- crowded with gradients, glass effects, shadows, pill badges, decorative icons, and nested cards;
- excessively minimal to the point that learners cannot tell what to do.

## 2. Creative principles

1. **Typography is the main illustration.** Kanji should be given space and visual weight.
2. **Paper and ink are a vocabulary, not a texture requirement.** Use warm surfaces, precise rules and measured negative space; avoid noisy paper textures.
3. **Editorial hierarchy beats card quantity.** Sections, typographic levels, columns and grouping do much of the work.
4. **Accent is scarce.** Strong brand color marks action and meaningful emphasis; neutral tones carry most surfaces.
5. **Illustrations earn their place.** A drawing should teach, distinguish, or add humane character to a meaningful state.
6. **The interface remains fast.** Motion and ornament must never compromise repeated review.
7. **Every visual rule has an RTL/LTR and dark-theme interpretation.**

## 3. Color system

The existing Rinemi brand direction provides a useful seed palette:
- Warm Rice Paper `#F7F4EE`
- Warm Surface `#FDFBF7`
- Sumi Charcoal `#292B2D`
- Muted Indigo `#505F83`
- Dusty Sakura `#D6A1AA`
- Desaturated Moss `#8C9B87`
- Soft Border `#DED8CE`

These are reference colors, not permission to ship without contrast testing.

### Intended semantic roles
- **Canvas / paper:** warm background; should not be confused with an elevated dialog.
- **Primary text / ink:** near-charcoal.
- **Secondary text:** muted but comfortably readable; do not use faint gray merely for an elegant look.
- **Primary action:** vermilion/coral is the semantic primary-action role in both themes; values are tuned separately per theme and validated by the token contrast check.
- **Secondary actions and links:** muted indigo; focus indicators use a separate explicit focus token, not the same role as selection or action.
- **Positive/progress:** desaturated moss used with explicit labels/icons, not color alone.
- **Sakura:** subtle editorial annotation, rare illustrations, or decorative micro-accent—not body text and not a critical state on its own.
- **Error/destructive:** semantic red family that remains distinct from the brand's ordinary primary action.
- **Borders/dividers:** soft neutral; interactive boundaries must have enough contrast to be perceivable.
- **Dark theme:** separate tested tokens for canvas, surface, elevated surface, text, muted text, border, controls, status, focus and overlay. Do not simply invert hex values.

### Color rules
- Maintain WCAG AA contrast for text and essential controls, with documented exceptions if any and a remediation path.
- Do not communicate correctness, errors, due status, active selection or mastery through color alone.
- Test disabled, selected, hover, focus-visible, pressed, loading, error and modal-overlay states.
- Keep semantic color use consistent across the whole product.
- Avoid per-component arbitrary colors and one-off overrides; fix the role/token instead.
- Vermilion/coral as primary action and indigo as secondary/link roles are recorded in D-012 and implemented in the token sheet. Automated contrast checks pass for the current semantic token pairs; rendered-browser evaluation remains open. Generated mockups are not required.

## 4. Typography

### Roles
- **Persian UI and educational copy:** Vazirmatn, with appropriate Persian punctuation, digits policy and line-height.
- **English/LTR UI:** Plus Jakarta Sans (or a single approved equivalent if bundle/legal/performance constraints require it).
- **Japanese display:** Noto Serif JP for selected large kanji/editorial moments.
- **Japanese body/reference:** a clear Japanese sans-serif stack for dense readings, vocabulary and explanatory text.

### Rules
- Avoid applying display serif to dense reference lists, controls, or long body text.
- Define dedicated roles for display kanji, prompt kanji, inline kanji, vocabulary headword, kana reading, gloss, helper text, label and metadata.
- Define Persian, English and Japanese mixed-string behavior, including line wrapping, punctuation and baseline alignment.
- Persian body text should be comfortably readable on mobile. Do not use tiny typography to fit content that should be simplified.
- All fonts and weights must have known sources and licenses recorded in the asset inventory.
- Verify glyph coverage, fallback behavior, loading stability, variable font support and offline/cache requirements.

## 5. Layout, spacing and surfaces

- Use a constrained editorial content width and a clear spacing scale.
- Prefer flat surfaces and one dominant learning region over multiple nested cards.
- Keep corner radii restrained and semantically consistent.
- Shadows should express true layering, not decorate every panel.
- Use dividers and typographic grouping when they communicate structure more clearly.
- Grid/card layouts are appropriate for genuine collections and visual browsing, not every section.
- Preserve clear focus and interaction boundaries without outlining every passive container.
- Use consistent content margins and adequate line length for Persian/English paragraphs.
- Fixed navigation, sticky actions, drawers and dialogs must respect safe areas, viewport height, and scroll ownership.

## 6. Components and required states

Specify and visually verify:
- app header and primary navigation;
- primary, secondary, tertiary and destructive buttons;
- icon buttons with text alternatives;
- text input, search, textarea, select, segmented control and filter chips;
- lists, dictionary rows, kanji tiles and collection items;
- section headings, editorial dividers and reference disclosures;
- review rating controls;
- progress indicator and progress summary;
- toast, inline feedback, loading, skeleton, empty, error and offline states;
- modal dialog, mobile drawer, menu, popover and confirmation;
- bookmark action, collection selection and bulk-action toolbar;
- file picker/import preview, mapping rows, duplicate warning and import report;
- audio control, stroke-order viewer and structure diagram;
- mascot/illustration frame with layout-safe dimensions.

For each interactive component, define idle, hover, focus-visible, active/pressed, selected, disabled, loading and error/success state as relevant. Define minimum target size and keyboard behavior.

## 7. Motion and sound

- Motion is optional explanation, not decoration.
- Card reveal may use a quick transition if it is understandable and can be disabled.
- Stroke-order motion must teach order, direction and sequence.
- No mandatory animation should delay a learner's next review.
- Avoid parallax, looping mascot animation, attention-seeking bouncing, and movement in long reading contexts.
- Honor reduced-motion preference consistently.
- Audio controls must be user-initiated, labeled, and degrade honestly when speech synthesis or audio is unavailable.
- Sound is off by default unless a future user study supports another choice.

## 8. Mascot and illustration system

### The Rinemi cat
The cat is a quiet companion, not a tutor, pet-care mechanic or constant narrator.

Character constraints:
- small, rounded head integrated naturally into the body—not an oval resting on a neck;
- relatively small ears and compact silhouette;
- nonchalant, calm eyes with quiet intelligence; not sleepy, lazy, exaggeratedly charming, or sinister;
- editorial Japanese stationery/ink illustration sensibility;
- restrained line weight and small palette;
- the same face, proportions, eye direction and silhouette must survive changes of pose, scale and emotion;
- no anime-style oversized eyes, chibi proportions, gradients, 3D render, thick cartoon outlines or cute accessory overload.

### Allowed contexts
- first-run welcome and rare explanatory onboarding moments;
- empty or failed states where the character adds warmth without hiding the recovery action;
- occasional meaningful milestones;
- a small support illustration in a help page.

### Disallowed patterns
- cat on every screen;
- animated tutor speech bubbles during review;
- guilt, shame or disappointed cat for missed days;
- cat art competing with the kanji during retrieval;
- variable eye style/expression across generated assets;
- decorative mascot cards added solely to fill space.

### Asset production requirements
- maintain a canonical reference sheet (front/side/3-quarter proportions, face and eye rules, line weight, palette);
- make a small curated asset set before producing many variants;
- evaluate silhouette and expression at intended UI sizes, in light/dark mode;
- keep source file, export, prompt/brief, license and approved status;
- generated variants are drafts until visually checked against the reference;
- prefer simple, consistent 2D vectors or clean line illustrations for interface use.

### Educational illustration rules
- Component diagrams show actual glyph forms and justified relationships.
- Mnemonic art is explicitly metaphorical, not historical etymology.
- Similar-kanji illustrations isolate the distinguishing strokes.
- Strokes and stroke order must come from valid data/assets; never approximate them with generic calligraphy.
- Images need a text equivalent when they convey information.

## 9. Photography and stock imagery

Use photography sparingly, mostly for marketing/editorial material. Do not rely on generic stock photos to decorate the in-app experience. The core app should use Japanese text, data visualization, diagrams and purpose-built illustration. All reused images must have documented licenses and provenance.

## 10. Visual QA gate

For each major screen, capture:
- Persian RTL light and dark;
- English LTR light and dark;
- narrow phone portrait;
- compact landscape;
- tablet/desktop;
- keyboard focus and modal/drawer states;
- loading, empty, error and content-heavy cases.

Review:
- hierarchy, rhythm, typography, density, spacing, content accuracy, clipping, scroll position, contrast, visual consistency, and action clarity.
- If a screenshot differs from the approved design, record the difference and resolve it. A running app screenshot is required; source inspection alone is insufficient.

## 11. What not to introduce

Do not create parallel visual systems or add another token library without a documented gap. Avoid gradients, glassmorphism, excessive rounding, excessive shadows, arbitrary status badges, multiple competing accent colors, icons without clear semantics, and one-off inline styles. Existing palette names are not a reason to use every color frequently.
