import assert from "node:assert/strict";
import test from "node:test";
import {
  decodeAnkiTextExport,
  MAX_ANKI_TEXT_BYTES,
  parseAnkiTextExport
} from "../src/anki-import.ts";

test("parses Anki headers, mapped content columns, tags, note type, deck and GUID metadata", () => {
  const text = [
    "#separator:Tab",
    "#html:false",
    "#tags:imported",
    "#columns:Front\tBack\tTags\tDeck\tGUID",
    "#tags column:3",
    "#deck column:4",
    "#guid column:5",
    "日本\tJapan\tbeginner\tJapanese::Kanji\tguid-1",
    "一\tone\tn5\tJapanese::Kanji\tguid-2"
  ].join("\n");
  const result = parseAnkiTextExport(text);

  assert.deepEqual(result.fieldLabels, ["Front", "Back"]);
  assert.deepEqual(result.rows.map(row => row.fields), [["日本", "Japan"], ["一", "one"]]);
  assert.deepEqual(result.rows[0].tags, ["imported", "beginner"]);
  assert.equal(result.rows[0].deck, "Japanese::Kanji");
  assert.equal(result.rows[0].guid, "guid-1");
  assert.equal(result.headers.separator, "\t");
  assert.equal(result.summary.totalRows, 2);
  assert.equal(result.summary.rowsWithWarnings, 0);
});

test("parses quoted CSV separators, escaped quotes, and multiline fields", () => {
  const text = [
    "#separator:Comma",
    "#columns:Front,Back",
    '"hello, world","said ""hello""',
    'then left"'
  ].join("\n");
  const result = parseAnkiTextExport(text);
  assert.deepEqual(result.fieldLabels, ["Front", "Back"]);
  assert.equal(result.rows[0].fields[0], "hello, world");
  assert.equal(result.rows[0].fields[1], 'said "hello"\nthen left');
  assert.equal(result.rows[0].sourceLine, 3);
});

test("infers a tab separator for a headerless plain-text export", () => {
  const result = parseAnkiTextExport("Front one\tBack one\nFront two\tBack two");
  assert.equal(result.headers.separator, "\t");
  assert.deepEqual(result.rows.map(row => row.fields), [["Front one", "Back one"], ["Front two", "Back two"]]);
  assert.deepEqual(result.fieldLabels, ["Field 1", "Field 2"]);
});

test("reports first-field duplicates without dropping either row", () => {
  const result = parseAnkiTextExport([
    "#separator:Tab",
    "#columns:Front\tBack",
    "same\tfirst",
    "same\tsecond",
    "different\tthird"
  ].join("\n"));
  assert.equal(result.rows.length, 3);
  assert.equal(result.summary.duplicateRows, 1);
  assert.ok(result.rows[1].warnings.includes("DUPLICATE_FIRST_FIELD_IN_FILE"));
  assert.equal(result.rows[1].duplicateOfRow, 3);
});

test("preserves content while warning about inconsistent field counts, empty content, HTML and media references", () => {
  const result = parseAnkiTextExport([
    "#separator:Tab",
    "#html:true",
    "#columns:Front\tBack",
    "<b>term</b>\t[sound:term.mp3]",
    "\t",
    "extra\tfield\tunexpected"
  ].join("\n"));
  assert.equal(result.rows[0].fields[0], "<b>term</b>");
  assert.ok(result.rows[0].warnings.includes("HTML_CONTENT_TREATED_AS_TEXT"));
  assert.ok(result.rows[0].warnings.includes("MEDIA_REFERENCES_NOT_INCLUDED"));
  assert.ok(result.rows[1].warnings.includes("EMPTY_CONTENT_FIELDS"));
  assert.ok(result.rows[2].warnings.includes("ROW_FIELD_COUNT_MISMATCH"));
  assert.equal(result.rows.length, 3);
});

test("rejects malformed or unsupported input without silently guessing", () => {
  assert.throws(() => parseAnkiTextExport("single column only"), /ANKI_SEPARATOR_NOT_DETECTED/);
  assert.throws(() => parseAnkiTextExport("#separator:xml\na\tb"), /ANKI_UNSUPPORTED_SEPARATOR/);
  assert.throws(() => parseAnkiTextExport('#separator:Tab\n#columns:Front\tBack\n"unclosed\tvalue'), /ANKI_UNCLOSED_QUOTED_FIELD/);
});

test("rejects invalid UTF-8 and oversized uploads before parsing", () => {
  assert.throws(() => decodeAnkiTextExport(new Uint8Array([0xc3, 0x28]).buffer), /ANKI_INVALID_UTF8/);
  assert.throws(() => decodeAnkiTextExport(new ArrayBuffer(MAX_ANKI_TEXT_BYTES + 1)), /ANKI_FILE_TOO_LARGE/);
  assert.throws(() => parseAnkiTextExport("x".repeat(MAX_ANKI_TEXT_BYTES + 1)), /ANKI_FILE_TOO_LARGE/);
});
