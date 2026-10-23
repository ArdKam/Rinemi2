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

### Source freshness and update procedure

The [official EDRDG licence statement](https://www.edrdg.org/edrdg/licence.html) says software packages and applications that use these files must have a procedure for regular updating from the most recent available versions; it specifically states that web-based dictionary servers should update at least monthly. The precise treatment of this embedded PWA and its fixed 2,136 Jōyō-character scope should be confirmed by the project owner/legal reviewer, but Rinemi should not imply that the bundled copy is perpetually current.

**Required operational procedure (monthly workflow merged; initial run is triggered when the workflow-change PR merges):**
1. At least monthly, check the authoritative EDRDG KANJIDIC2 project and licence pages plus the documented upstream source/revision used for the app dataset.
2. Record the check date, upstream version or commit/file hash, source URL, and whether an update is available; link the result from the release/provenance issue.
3. If changed, review the source delta and regenerate the 2,136-entry dataset only from the approved source, preserving the Jōyō scope and current data schema.
4. Review any changed readings/meanings, confirm attribution/share-alike notices, run data-contract/unit/type/build/browser tests, and inspect relevant UI diffs before accepting the update.
5. Update this record and the user-facing source acknowledgement if the source/version or obligations change. Do not close the provenance gate until the initial source lineage and owner/legal approval are recorded.

**Automation status:** [PR #72](https://github.com/ArdKam/Rinemi2/pull/72) merged the [monthly source-freshness workflow](../.github/workflows/kanjidic2-source-freshness.yml), which checks the official project/licence pages, downloads the current KANJIDIC2 XML snapshot, validates its gzip/XML structure, records the database/schema version and SHA-256, and comments the result on issue #25. Proposed [PR #73](https://github.com/ArdKam/Rinemi2/pull/73) adds a path-filtered `push` trigger intended to run the first check when the workflow/parser files change on `main`. It does **not** update the app dataset or determine legal compliance. The first successful audit is still pending; it must compare the exact upstream lineage and current 2,136-entry derived subset before beta.

**Baseline investigation (2026-10-23):** the public [`jkindrix/japanese-language-data`](https://github.com/jkindrix/japanese-language-data) repository currently points to main commit [`04014e06019fc9d4af76e6dbb64ec709fe863c4d`](https://github.com/jkindrix/japanese-language-data/commit/04014e06019fc9d4af76e6dbb64ec709fe863c4d), dated 2026-04-14. Its tree includes `data/core/kanji-joyo.json`. This is a **current candidate comparison point only**, not proof that the app's copied corpus was generated from this exact commit or file revision. During the first recorded freshness audit, compare the Jōyō source file and transformations against the `kanji5` blob currently identified above, record exact hashes and reconcile count/content differences before declaring provenance complete.

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
- Noto Serif JP regular subset is bundled at `public/fonts/NotoSerifJP-Regular.subset.woff2`, copied from `ArdKam/kanji5/frontend/src/assets/NotoSerifJP-Regular.subset.woff2` at blob SHA `6c4c4ff4bfdaae9b48a10cc44d6f3c2f197086f0` on 2026-10-18. The local notice at `public/fonts/NotoSerifJP-LICENSE-OFL.txt` was incomplete in the copied source; on 2026-10-19 its full OFL 1.1 text was restored from the upstream Google Fonts file at `https://github.com/google/fonts/blob/main/ofl/notoserifjp/OFL.txt`, retaining the matching `Copyright 2012 Google Inc. All Rights Reserved.` notice. On 2026-10-23, the exact deployed Pages artifact for application SHA `42ddab9dca017146c458f2c8615896624c971951` was inspected: the bundled subset metadata identifies family `Noto Serif JP`, style `Regular`, and font version `2.003-H1`; the shipped OFL text contains no actual Reserved Font Name declaration after the copyright notice. The OFL explains that reserved names must be specifically declared, and modified/subsetted font redistribution must retain required copyright/license information ([Reserved Font Names](https://openfontlicense.org/ofl-reserved-font-names/), [modifying OFL fonts](https://openfontlicense.org/how-to-modify-ofl-fonts/)). The required notice is present in the deployed artifact. This closes the engineering check for the local notice and explicit RFN declaration, but does **not** substitute for owner/legal approval of the binary's exact upstream revision, redistribution terms, or any separate third-party permission question.
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
| Noto Serif JP subset | Copied from `ArdKam/kanji5/frontend/src/assets/NotoSerifJP-Regular.subset.woff2`, blob SHA `6c4c4ff4bfdaae9b48a10cc44d6f3c2f197086f0`; deployed binary metadata reports Noto Serif JP Regular, version `2.003-H1`; inspected in Pages artifact for app SHA `42ddab9dca017146c458f2c8615896624c971951` | Full OFL 1.1 text and matching copyright notice are present in the deployed artifact. No actual Reserved Font Name is declared in the bundled OFL notice; official [OFL RFN guidance](https://openfontlicense.org/ofl-reserved-font-names/) and [modification guidance](https://openfontlicense.org/how-to-modify-ofl-fonts/) checked 2026-10-23. | **ENGINEERING CHECK COMPLETE; OWNER/LEGAL SIGN-OFF OPEN** — confirm exact upstream binary/revision and redistribution terms with the owner/legal reviewer; keep public-release gate open until recorded. |
| Plus Jakarta Sans and Vazirmatn | Plus Jakarta Sans: `@fontsource-variable/plus-jakarta-sans` 5.3.0; Vazirmatn: `vazirmatn` 33.0.3; versions pinned in `package-lock.json` | Full OFL 1.1 notices now ship in `public/fonts/PlusJakartaSans-LICENSE-OFL.txt` and `public/fonts/Vazirmatn-LICENSE-OFL.txt`; copyright-holder notices retained | **NOTICE DELIVERY FIXED — VERIFY ON PACKAGE UPDATE** that assets and pinned notices still correspond; this is not overall legal approval. |
| Rinemi logo marks and favicon | Adapted from `ArdKam/kanji5` brand SVGs at source blob SHAs documented above | Adaptation is documented; no separate project-wide license is approved | **OWNER APPROVAL REQUIRED** for reuse/adaptation terms and final attribution policy. |
| Rinemi 2 application code | `ArdKam/Rinemi2` repository | No owner-approved overall open-source license is recorded | **OPEN DECISION**: do not imply that third-party component licenses license the entire application or dataset. |

### Acceptance rule

Do not close the licensing/provenance release gate just because dependencies have known licenses or a source file is reachable. Record the reviewer, source URL/version, exact license text or authoritative reference, required notice, decision, and date for each redistributed dataset/asset. Legal interpretation and the owner's overall project-license decision remain explicit release gates.
