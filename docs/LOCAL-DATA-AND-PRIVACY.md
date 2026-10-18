# Rinemi 2 — Local Data, Backup and Erasure Contract

**Status:** implementation contract for the local-only learner-data model. Feature behavior must be verified on the exact release candidate; this document is not a legal privacy notice and does not approve public beta.

## Scope and data location

The current application has no account, cloud synchronization, or remote learner-data API. The application stores the following learner state in the browser's local storage:

- Language and theme preference.
- Saved kanji/bookmarks.
- User-created collections and their kanji membership.
- FSRS review cards, due dates, review counts, lapses and last-reviewed timestamps.

Current app store key: `rinemi2:local:v2`. The legacy migration key is `rinemi2:local:v1`. The theme bootstrap preference is also stored separately at `rinemi.theme`. The v1 key is retained during ordinary migration to avoid silently destroying potentially recoverable state; explicit erasure removes both store keys and the separate theme key.

This local-only implementation means data is tied to that browser profile and origin. Clearing browser/site storage, using a private session, switching devices or browsers, or browser quota/storage failure can make local records unavailable. The app must not imply that data is synced or recoverable from a server.

## Backup format and restore contract

- Export produces a UTF-8 JSON file with format identifier `rinemi2-local-backup`, backup schema version `1`, an export timestamp, and a version-2 store snapshot.
- The backup contains preferences, bookmarks, collections, and complete saved review records. It should be treated as private learner data.
- The parser rejects malformed JSON, unsupported envelope/store versions, invalid store structures, and payloads larger than 5 MiB.
- File selection only validates and previews the payload; it must not mutate local storage.
- The preview reports the export date and counts for bookmarks, collections, collection memberships and review records, and shows up to ten collection names.
- Restore replaces the current local store after explicit confirmation. It is not a merge operation. Learners should download a current backup before replacing data they may need.
- Restored records pass through the same normalization contract used when the app loads local storage. A failed persistence attempt shows a warning; persistence attempts are rolled back on a best-effort basis if one of the storage writes fails.

Only Rinemi's documented backup envelope is supported. This is not an Anki importer, and the format must not be advertised as interoperable with Anki or other apps.

## Erasure contract

The explicit erase action removes the current store key, the retained legacy store key, and the separate theme preference from this browser, clears the in-memory review/bookmark/collection state, and reinitializes an empty default store when browser storage is available. It requires confirmation because review history and personal organization are not recoverable without a separate backup.

Erasure does not delete files already downloaded by the learner, files copied elsewhere, browser/OS backups, screenshots, or data outside this browser origin. No cloud records exist in the current architecture. If account or synchronization features are introduced, this local erasure action alone will not satisfy account deletion; server-side ownership, retention, backup, export, deletion and conflict behavior must be designed and tested separately.

## Failure and security considerations

- Local storage can be unavailable, denied, quota-limited or partially failing. Never show a successful save/restore message solely because an in-memory React state update succeeded.
- The restore parser is input validation, not a security boundary for a trusted server; do not upload backup contents to analytics or logging.
- Treat a downloaded backup like a file containing personal learning data. The UI should explain that restore replaces the current local state and should allow cancellation before any mutation.
- A valid JSON file may still contain semantically poor learning data; restored review metadata is preserved for continuity, not certified as educationally correct.
- Data export/restore and erasure UI should be checked in Persian RTL and English LTR, light/dark themes, keyboard-only operation and narrow viewports.
- The proposed service worker is network-first for same-origin GET requests and caches successful responses; it is intended to support a previously warmed app shell when later requests fail. First visit without connectivity, a full cache, a deployment/update race, or an uncached URL may still fail.
- Do not claim end-to-end account deletion, secure cryptographic erasure, multi-device backup, offline-first PWA guarantees or cloud recovery unless those capabilities are implemented and independently verified.

## Acceptance evidence still required

Before release, run the backup/restore/erase browser tests on the exact candidate SHA, inspect the real UI, and manually verify browser storage failure/quota behavior and cancellation paths. Confirm the public privacy notice matches this local-only contract and obtain owner/legal approval where required. Record any exception as an open release gate rather than treating this document as proof of acceptance.
