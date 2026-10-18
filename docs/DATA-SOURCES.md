# Rinemi 2 — Data Sources and Attribution

## Jōyō kanji dataset

The initial 2,136-entry dataset is copied from ArdKam/kanji5/kanji-data.json, inspected on 2026-10-18 at source blob SHA b59e124d517313658b090e614130c38ccb00aac9.

- Dataset metadata identifies KANJIDIC2 via jkindrix/japanese-language-data.
- The [official EDRDG licence statement](https://www.edrdg.org/edrdg/licence.html) explicitly covers KANJIDIC2 and declares CC BY-SA 4.0. It requires acknowledgement of EDRDG and links to the source/license; EDRDG also publishes a [sample website acknowledgement](https://www.edrdg.org/edrdg/sample.html). The Rinemi UI includes a persistent KANJIDIC2/EDRDG acknowledgement and links to the official licence and this source record.
- This verifies the current upstream declaration, not legal approval of this exact copied subset, all obligations for any transformed dataset, or the separately authored topic taxonomy/identity assets/application code. Keep owner/legal review open before beta and re-check when the source dataset or terms change.
- Source records contain English glosses and readings. English glosses are retained as source data and are not represented as reviewed Persian learner explanations.
- The initial copy does not transform the source dataset; topic and learner-facing content remain separate.
- Reference repository: https://github.com/ArdKam/kanji5
- This is an engineering provenance record, not legal advice.

## Topic taxonomy

Copied from ArdKam/kanji5/frontend/src/app/kanji-topics.json, inspected on 2026-10-18 at source blob SHA 45036a2007c4cc5d1ff981219d1f04bf175d9f9a. Its metadata describes hand-curated associations and partial coverage. Do not imply all characters are categorized or infer membership from gloss strings.

## Persian glosses and examples

The initial Persian glosses and vocabulary examples in src/content.ts are a separate editorial seed layer. They have not yet passed independent human content QA. Review Japanese forms/readings and Persian explanations before public release.

## Third-party software and fonts

- React / React DOM: MIT.
- Vite and React plugin: MIT.
- TypeScript: Apache-2.0.
- ts-fsrs 5.4.1: MIT.
- Plus Jakarta Sans variable font is provided by `@fontsource-variable/plus-jakarta-sans` 5.3.0. The copyright notice identifies the 2020 Plus Jakarta Sans Project Authors; the full OFL 1.1 text from `fontsource/font-files/fonts/google/plus-jakarta-sans/LICENSE` is shipped at `public/fonts/PlusJakartaSans-LICENSE-OFL.txt` (source inspected 2026-10-19).
- Vazirmatn 33.0.3 is licensed under OFL 1.1 by The Vazirmatn Project Authors. The full notice from upstream `v33.003/OFL.txt` is shipped at `public/fonts/Vazirmatn-LICENSE-OFL.txt` (source inspected 2026-10-19).
- Noto Serif JP regular subset is bundled at `public/fonts/NotoSerifJP-Regular.subset.woff2`, copied from `ArdKam/kanji5/frontend/src/assets/NotoSerifJP-Regular.subset.woff2` at blob SHA `6c4c4ff4bfdaae9b48a10cc44d6f3c2f197086f0` on 2026-10-18. The local notice at `public/fonts/NotoSerifJP-LICENSE-OFL.txt` was incomplete in the copied source; on 2026-10-19 its full OFL 1.1 text was restored from the upstream Google Fonts file at `https://github.com/google/fonts/blob/main/ofl/notoserifjp/OFL.txt`, retaining the matching `Copyright 2012 Google Inc. All Rights Reserved.` notice. This corrects the missing license text; exact font-binary revision and any reserved-font-name implications still require verification before beta.
- Noto Sans JP remains a system-font fallback only; do not imply that all Japanese text uses a bundled sans font.

The project does not yet have an owner-approved overall open-source license. Third-party licenses do not automatically license all Rinemi 2 project code.

## Rinemi identity assets

- The brand mark is adapted from `ArdKam/kanji5/rinemi-mark.svg`, inspected on 2026-10-18 at blob SHA `67889ff0e8eef30035f7674f2e398b7b1ee94ff0`.
- The favicon is adapted from `ArdKam/kanji5/icon.svg`, inspected at blob SHA `9c84619ec2e41ac15c01f8fef772ab9a06dd19a3`.
- A dark-surface variant was derived by adjusting the mark stroke to pale indigo to maintain visibility on the dark canvas. The original source repository remains unchanged.


## Release source/provenance gate matrix

This matrix distinguishes where material came from from whether its legal and content acceptance is complete. A source path or a license label in an upstream document is not a completed release review.

| Material | Current origin / revision evidence | Known declaration | Release status / next check |
|---|---|---|---|
| 2,136-entry kanji corpus | `ArdKam/kanji5/kanji-data.json`, blob SHA `b59e124d517313658b090e614130c38ccb00aac9`; metadata points to KANJIDIC2 via `jkindrix/japanese-language-data`; official [EDRDG licence statement](https://www.edrdg.org/edrdg/licence.html) checked on 2026-10-19 | EDRDG publicly declares KANJIDIC2 under CC BY-SA 4.0 and provides a [sample acknowledgement](https://www.edrdg.org/edrdg/sample.html) | **UPSTREAM DECLARATION VERIFIED; RELEASE SIGN-OFF OPEN** — the app displays an attribution and links to the licence/source record. Owner/legal review must still confirm the exact copied subset/revision, notices and share-alike treatment. |
| Topic taxonomy | `ArdKam/kanji5/frontend/src/app/kanji-topics.json`, blob SHA `45036a2007c4cc5d1ff981219d1f04bf175d9f9a`; described as hand-curated with partial coverage | No independent record-specific license is established in this file | **OWNER/PROVENANCE CONFIRMATION REQUIRED**: establish authorship/permission and keep the partial-coverage limitation visible. |
| Persian glosses and example vocabulary | Rinemi 2 editorial seed in `src/content.ts`; 44 stable character keys | No per-entry source trace is currently recorded in the seed | **HUMAN REVIEW REQUIRED** for Japanese usage/reading and Persian/English translation; record per-entry evidence in [Content QA Register](CONTENT-QA-REGISTER.md). |
| Noto Serif JP subset | Copied from `ArdKam/kanji5/frontend/src/assets/NotoSerifJP-Regular.subset.woff2`, blob SHA `6c4c4ff4bfdaae9b48a10cc44d6f3c2f197086f0`; OFL text compared against Google Fonts `ofl/notoserifjp/OFL.txt` on 2026-10-19 | Full OFL 1.1 text and matching copyright notice now present in `public/fonts/NotoSerifJP-LICENSE-OFL.txt`; the copied-source notice had been truncated | **PARTIALLY FIXED — exact font-binary revision and reserved-font-name/redistribution implications still require verification before release.** |
| Plus Jakarta Sans and Vazirmatn | Plus Jakarta Sans: `@fontsource-variable/plus-jakarta-sans` 5.3.0; Vazirmatn: `vazirmatn` 33.0.3; versions pinned in `package-lock.json` | Full OFL 1.1 notices now ship in `public/fonts/PlusJakartaSans-LICENSE-OFL.txt` and `public/fonts/Vazirmatn-LICENSE-OFL.txt`; copyright-holder notices retained | **NOTICE DELIVERY FIXED — VERIFY ON PACKAGE UPDATE** that assets and pinned notices still correspond; this is not overall legal approval. |
| Rinemi logo marks and favicon | Adapted from `ArdKam/kanji5` brand SVGs at source blob SHAs documented above | Adaptation is documented; no separate project-wide license is approved | **OWNER APPROVAL REQUIRED** for reuse/adaptation terms and final attribution policy. |
| Rinemi 2 application code | `ArdKam/Rinemi2` repository | No owner-approved overall open-source license is recorded | **OPEN DECISION**: do not imply that third-party component licenses license the entire application or dataset. |

### Acceptance rule

Do not close the licensing/provenance release gate just because dependencies have known licenses or a source file is reachable. Record the reviewer, source URL/version, exact license text or authoritative reference, required notice, decision, and date for each redistributed dataset/asset. Legal interpretation and the owner's overall project-license decision remain explicit release gates.
