# Rinemi Mascot Design System

**Status (2026-10-23):** The design contract and first UI integration are verified on current deployed app SHA [`fb88901`](https://github.com/ArdKam/Rinemi2/commit/fb88901126d331a55ff2e91f188a0f2907e9c10c), via [CI #188](https://github.com/ArdKam/Rinemi2/actions/runs/39877410690) and [Pages deployment #43](https://github.com/ArdKam/Rinemi2/actions/runs/39877410464). That deployment uses `rinemi-cat-tea.svg`, a hand-authored vector reinterpretation. The owner has now specified the supplied original cat illustration as the canonical artwork; this review branch stages a compact WebP derivative for Today and empty-session placements. That replacement is not yet deployed. Its successful asset-path check, rendered screenshot matrix, and content fidelity need verification before closing the gate.

**Target:** `ArdKam/Rinemi2`  
**Reference-only repository:** `ArdKam/kanji5` — do not modify it.

## 1. Character role

The cat is Rinemi's quiet companion. It supports orientation and recovery; it is not a tutor, reward economy, pet-care mechanic, or persistent narrator. Japanese learning content and the next action remain the focus.

**Brand feeling:** thoughtful, composed, observant, bookish, and gently encouraging. The humor is dry and understated rather than cute or theatrical.

## 2. Canonical identity

The owner's original single-cat illustration is the primary identity reference. Preserve these invariants across every pose and crop:

- **Silhouette:** compact, rounded seated body; head flows into the torso with no visible neck; tail curls around the front/right base of the body.
- **Markings:** cream body; charcoal patch over the viewer-right ear and upper forehead, continuing along the viewer-right body and tail; one muted peach circle on the lower belly; warm tan inside the viewer-left ear.
- **Face:** narrow half-lidded almond eyes with black pupils, small peach triangular nose, tiny two-stroke mouth, fine whiskers. Expression stays neutral/nonchalant with quiet intelligence.
- **Proportions:** rounded head integrated into the body, short/simple paws, compact silhouette, and relatively small triangular ears. Do not make the eyes larger, the head separate from the torso, or the expression sleepy, angry, sad, or hyperactive.
- **Linework:** thin, slightly irregular charcoal-pencil contours; soft colored-pencil/watercolor grain. Avoid thick uniform comic outlines, glossy gradients, 3D rendering, anime styling, or excessive detail.

Any change to the facial geometry, eye shape, patch boundary, belly spot, ear size, or silhouette is a character-design change and needs review—not a routine pose variation.

## 3. Palette

These are **illustration colors**, not UI tokens. Sample values are approximate guides; use the semantic UI palette in `src/styles/design-tokens.css` for interface controls and text.

| Role | Reference |
|---|---|
| Main fur | warm cream / rice paper, approximately `#F7EED8` |
| Main outline and patch | sumi charcoal, approximately `#383834` |
| Inner ear | muted toasted tan, approximately `#D9B28A` |
| Belly spot and nose | dusty peach, approximately `#D9A17F` |
| Optional study prop | muted indigo, approximately `#505F83` |
| Optional seasonal detail | dusty sakura, approximately `#D6A1AA` |
| Optional milestone detail | restrained antique gold, approximately `#C6A04A` |

Do not recolor the main charcoal marking to match light/dark UI themes. Transparent artwork must remain legible on both themes without filters that invert the character.

## 4. Expression and pose grammar

- **Default / waiting:** front-facing or slight three-quarter angle, relaxed paws, half-lidded eyes, closed neutral mouth.
- **Observing / curious:** small head tilt or gaze shift only; do not change the core eye design.
- **Studying:** a brush, blank practice sheet, or closed/open book may be used when directly relevant to a learning task. Never draw a made-up kanji or imply incorrect stroke order.
- **Milestone:** one restrained symbol (for example, a small star or medal). Keep celebration quiet; no confetti, currency, streak flames, or arcade styling.
- **Rest / seasonal:** kotatsu, cup, or subtle seasonal detail only for occasional non-urgent states. Do not imply guilt or suggest the learner disappointed the cat.
- **Loading:** if used later, one static pose or a short, non-looping status treatment is preferred. Never make motion the only source of loading information.

A pose may change limb position or props, but not face style, markings, body-to-head relationship, or palette. AI-generated variants remain drafts until compared with the primary reference at their real display size.

## 5. Placement rules

**Allowed, in limited number:** first-run orientation, a useful empty/recovery state, a meaningful milestone, or a small help illustration.

**Not allowed:** every screen, the persistent brand logo, the main kanji retrieval prompt, rating controls, error feedback that shames the learner, decorative filler cards, or speech bubbles during rapid review.

The current app integration remains intentionally narrow: a small, decorative illustration beside the Today-page heading, plus the larger illustration in the genuinely empty learning-session state. The Today placement remains visible to new and returning learners, while the larger empty-state placement supports recovery. The Rinemi wordmark remains the logo. Do not add the cat to the header or active learning card simply to increase brand presence.

## 6. Component and accessibility contract

- Keep artwork in normal document flow; it must not overlap text, controls, safe areas, or the kanji.
- The selected owner-supplied artwork has a warm rice-paper texture and background. Preserve it; do not vector-trace, redraw, recolor, invert, or remove the texture. Keep a stable intrinsic 4:5 ratio and use `object-fit: contain` so the complete character and paper texture remain visible without distortion.
- In dark mode, preserve the illustration's original colors; do not apply global inversion or opacity reduction to make it blend in.
- When the art is decorative and the adjacent heading, explanation, and recovery action convey the state, use an empty alternative text (`alt=""`) and hide it from assistive technology. If an illustration ever conveys instructional meaning, add a text equivalent instead.
- Never rely on the illustration to explain the state, report success/failure, or communicate the only available action.
- Keep the primary recovery action visible in the same state; at mobile sizes the art must yield space to the message and action.

## 7. Asset inventory and provenance

| Asset | Status | Intended use | Provenance / note |
|---|---|---|---|
| Owner-supplied original cat image | Canonical source artwork | Source-of-truth reference | Original PNG supplied by the owner; keep this master unchanged as the reference for future variants |
| `public/mascot/rinemi-cat-artwork.webp` | Proposed raster replacement, in review | Today heading and empty-session recovery | 256×320 WebP derivative cropped only to remove unused left/right canvas margins and rescaled for UI delivery; it preserves the full cat, linework, marks, paper texture, and palette, without redrawing |
| `public/mascot/rinemi-cat-tea.svg` | Current deployed legacy interpretation | Still used by `main` until the replacement is merged and deployed | Hand-authored vector interpretation; differs from the owner's supplied illustration and should not remain the canonical art |
| Avatar crop, brush/writing pose, book/reading pose, achievement, seasonal and loading variants | Not produced / deferred | Only after the base asset is accepted | Each asset requires visual comparison, provenance and license review |

The WebP derivative is a display asset, not a replacement for the owner's source file. Keep the source artwork unchanged outside this app repository and record the crop/resize/WebP conversion; complete the project's provenance/license review before public-beta sign-off.

## 8. Acceptance gate before adding more assets

1. Compare the base silhouette, face, markings and proportions against the owner's original reference at 24 px, 44 px, 96 px and the empty-state display size.
2. Inspect both live placements in Persian RTL and English LTR, light and dark themes, narrow mobile, compact landscape and desktop. Verify the illustration preserves the reference appearance and does not outgrow the message/action hierarchy.
3. Verify the image request returns successfully, intrinsic size is non-zero, no horizontal overflow or layout shift is introduced, and the state remains understandable with images disabled.
4. Review keyboard, screen-reader, zoom and reduced-motion behavior; the static illustration should not introduce interactive behavior.
5. Record the exact replacement commit, screenshots, test result and owner acceptance of the rendered result. A green build is not visual approval.

Until these criteria are met, the first integration is a review candidate, not a release gate closure. See [Art Direction](ART-DIRECTION.md), [UI/UX Review Register](UI-UX-REVIEW-REGISTER.md), and [Roadmap](../ROADMAP.md).
