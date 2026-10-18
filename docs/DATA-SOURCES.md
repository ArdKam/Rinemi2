# Rinemi 2 — Data Sources and Attribution

## Jōyō kanji dataset

The initial 2,136-entry dataset is copied from ArdKam/kanji5/kanji-data.json, inspected on 2026-10-18 at source blob SHA b59e124d517313658b090e614130c38ccb00aac9.

- Dataset metadata identifies KANJIDIC2 via jkindrix/japanese-language-data.
- The reference repository documents this KANJIDIC2-derived set as CC BY-SA 4.0. Attribution and share-alike obligations must be rechecked before public release.
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
- Plus Jakarta Sans and Vazirmatn: SIL Open Font License 1.1.
- Noto Serif JP regular subset is bundled at `public/fonts/NotoSerifJP-Regular.subset.woff2`, copied from `ArdKam/kanji5/frontend/src/assets/NotoSerifJP-Regular.subset.woff2` at blob SHA `6c4c4ff4bfdaae9b48a10cc44d6f3c2f197086f0` on 2026-10-18. Its OFL license is preserved at `public/fonts/NotoSerifJP-LICENSE-OFL.txt`, copied from blob SHA `02c8dec85e4a568f052d8aaa36b2ef93fa942e7f`.
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
| 2,136-entry kanji corpus | `ArdKam/kanji5/kanji-data.json`, blob SHA `b59e124d517313658b090e614130c38ccb00aac9`; metadata points to KANJIDIC2 via `jkindrix/japanese-language-data` | Existing project metadata says CC BY-SA 4.0 | **RECHECK REQUIRED** against the exact upstream source/license and required attribution/share-alike notice before beta; record current upstream URL/revision and redistribution obligations. |
| Topic taxonomy | `ArdKam/kanji5/frontend/src/app/kanji-topics.json`, blob SHA `45036a2007c4cc5d1ff981219d1f04bf175d9f9a`; described as hand-curated with partial coverage | No independent record-specific license is established in this file | **OWNER/PROVENANCE CONFIRMATION REQUIRED**: establish authorship/permission and keep the partial-coverage limitation visible. |
| Persian glosses and example vocabulary | Rinemi 2 editorial seed in `src/content.ts`; 44 stable character keys | No per-entry source trace is currently recorded in the seed | **HUMAN REVIEW REQUIRED** for Japanese usage/reading and Persian/English translation; record per-entry evidence in [Content QA Register](CONTENT-QA-REGISTER.md). |
| Noto Serif JP subset | Copied from `ArdKam/kanji5/frontend/src/assets/NotoSerifJP-Regular.subset.woff2`, blob SHA `6c4c4ff4bfdaae9b48a10cc44d6f3c2f197086f0` | OFL license notice preserved in `public/fonts/NotoSerifJP-LICENSE-OFL.txt` | **VERIFY BEFORE RELEASE** that the bundled subset, its exact upstream notice, and any applicable reserved-name/redistribution terms match the source package. |
| Plus Jakarta Sans and Vazirmatn | npm dependencies declared in `package.json`; lockfile pins resolved packages | Existing source documentation records SIL OFL 1.1 | **VERIFY PACKAGED NOTICES** from the locked installed packages and retain required license/author notices in any redistributed build. |
| Rinemi logo marks and favicon | Adapted from `ArdKam/kanji5` brand SVGs at source blob SHAs documented above | Adaptation is documented; no separate project-wide license is approved | **OWNER APPROVAL REQUIRED** for reuse/adaptation terms and final attribution policy. |
| Rinemi 2 application code | `ArdKam/Rinemi2` repository | No owner-approved overall open-source license is recorded | **OPEN DECISION**: do not imply that third-party component licenses license the entire application or dataset. |

### Acceptance rule

Do not close the licensing/provenance release gate just because dependencies have known licenses or a source file is reachable. Record the reviewer, source URL/version, exact license text or authoritative reference, required notice, decision, and date for each redistributed dataset/asset. Legal interpretation and the owner's overall project-license decision remain explicit release gates.
