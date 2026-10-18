# Rinemi 2 — Anki Import Support Matrix

**Status:** the text-export parser and preview contract are under development. The current implementation is a pure parser/preview utility; it does **not** yet persist imported notes, create scheduled cards, or provide an import screen. Do not advertise Anki import as released until the end-to-end flow is implemented and accepted.

## Supported input target for the first import slice

| Input | Initial decision | Details / limitations |
|---|---|---|
| UTF-8 .txt / plain-text export | Planned support | Anki's “Notes in Plain Text” format and compatible delimited text, up to 10 MiB. Invalid UTF-8 is rejected. |
| Tab-separated text | Planned support | Preferred default because Anki's plain-text note export uses tabs. |
| Comma- or semicolon-separated text | Planned support | Use explicit #separator header or a consistent detectable delimiter; quoted delimiters and multiline quoted fields are covered by parser tests. |
| Pipe, colon, or space delimiter | Header-only support in parser | Accept when explicitly selected through a supported #separator header; do not guess these delimiters when a header is absent. |
| Anki metadata headers | Parser support | Supports separator, html, tags, columns, notetype, deck, plus tags/deck/notetype/GUID column declarations. Special metadata columns are separated from content fields. |
| Multiple content fields, tags, deck, note type, GUID | Preview only | Content fields remain separately available for explicit mapping. |
| HTML-like content | Preview with warning | Content is retained as text and must not be injected as HTML. The current parser does not render HTML. |
| References to audio/video/image files | Warning only | References such as [sound:...] or image tags may be detected, but assets are not packaged, copied, or imported. |
| .apkg, .colpkg, .anki2, .zip and other packaged/database exports | Not supported in the first slice | Packaged decks contain more than note fields, including cards, note types, scheduling/collection metadata and potentially media. Supporting them requires a separately reviewed parser and migration plan. |
| Direct import of arbitrary cards into the FSRS queue | Not implemented | The current scheduler uses stable kanji identity. Arbitrary front/back notes cannot safely be inserted into that queue without a separate card-identity and persistence contract. |

## Safety behavior

- Enforce a 10 MiB byte-size limit before parsing.
- Decode UTF-8 strictly; do not silently replace malformed byte sequences.
- Parse quoted separators, escaped quotes, CRLF/LF line endings and multiline fields. Reject unclosed quoted fields.
- Preserve all parsed rows for review; do not silently discard duplicate first fields or extra columns.
- Show source line, field values, and row-level warnings for differing column counts, empty content, duplicate first fields, HTML-like markup and media references.
- Duplicate detection in the preview is a warning only. It does not choose an import/update policy and does not compare against the learner's stored cards.
- File selection and preview must not write to local storage. The eventual UI must provide explicit field mapping, import counts, duplicate disposition, unsupported-content reporting, confirmation, cancellation and recoverable failure handling before writing data.
- No imported note should overwrite an existing FSRS review record or change kanji identity implicitly.

## Fixture and test inventory

The initial parser tests are in scripts/anki-import.test.ts and are run by npm test on the feature branch. They cover:
- Anki-style headers plus tags/deck/GUID metadata columns.
- Quoted CSV separators, escaped quote characters, and multiline fields.
- Headerless tab-delimited plain text.
- Duplicate first fields without row loss.
- HTML/media warnings, empty rows and inconsistent field counts.
- Unsupported separator, unclosed quotes, invalid UTF-8 and oversized inputs.

These fixtures exercise parsing, not import persistence, scheduler correctness, rendering safety, import cancellation, rollback, or real-world compatibility with all Anki exports. Those remain separate release gates.

## Source references

- [Anki Manual — Text Files](https://docs.ankiweb.net/importing/text-files.html): UTF-8 text, separators, headers, field mapping, HTML, media references and duplicate behavior.
- [Anki Manual — Exporting](https://docs.ankiweb.net/exporting.html): distinguishes plain-text notes export from packaged decks.
- [Anki Manual — Importing](https://docs.ankiweb.net/importing/intro.html): supported import families in Anki itself; this does not imply that Rinemi supports the same formats.

## Release acceptance still required

Before calling import supported, implement and test the end-to-end flow: choose a file, preview and map columns, handle duplicates explicitly, confirm/cancel without writes, persist imported note identity and FSRS state through the correct boundary, show a durable result and warnings, and recover from storage failure. Test representative exports generated by current Anki versions, Persian/Japanese/mixed-script content, HTML/media references, malformed and oversized files, interrupted import, repeated import and keyboard/screen-reader use. Do not claim .apkg compatibility until packaged decks have their own verified implementation and fixture corpus.
