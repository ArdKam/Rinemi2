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
- Japanese serif/sans fonts are not bundled in this slice; verify glyph coverage and local font licensing before release.

The project does not yet have an owner-approved overall open-source license. Third-party licenses do not automatically license all Rinemi 2 project code.

## Rinemi identity assets

- The brand mark is adapted from `ArdKam/kanji5/rinemi-mark.svg`, inspected on 2026-10-18 at blob SHA `67889ff0e8eef30035f7674f2e398b7b1ee94ff0`.
- The favicon is adapted from `ArdKam/kanji5/icon.svg`, inspected at blob SHA `9c84619ec2e41ac15c01f8fef772ab9a06dd19a3`.
- A dark-surface variant was derived by adjusting the mark stroke to pale indigo to maintain visibility on the dark canvas. The original source repository remains unchanged.
