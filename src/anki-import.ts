export const MAX_ANKI_TEXT_BYTES = 10 * 1024 * 1024;

export type AnkiTextHeaders = {
  separator: string;
  html: boolean;
  tags: string[];
  columns: string[];
  notetype: string | null;
  deck: string | null;
  tagsColumn: number | null;
  notetypeColumn: number | null;
  deckColumn: number | null;
  guidColumn: number | null;
  ignoredHeaders: string[];
};

export type AnkiImportWarningCode =
  | "ROW_FIELD_COUNT_MISMATCH"
  | "EMPTY_CONTENT_FIELDS"
  | "DUPLICATE_FIRST_FIELD_IN_FILE"
  | "HTML_CONTENT_TREATED_AS_TEXT"
  | "MEDIA_REFERENCES_NOT_INCLUDED";

export type AnkiTextPreviewRow = {
  sourceLine: number;
  fields: string[];
  tags: string[];
  deck: string | null;
  noteType: string | null;
  guid: string | null;
  warnings: AnkiImportWarningCode[];
  duplicateOfRow: number | null;
};

export type AnkiTextPreview = {
  headers: AnkiTextHeaders;
  fieldLabels: string[];
  rows: AnkiTextPreviewRow[];
  ignoredCommentLines: number;
  summary: {
    totalRows: number;
    rowsWithWarnings: number;
    emptyRows: number;
    duplicateRows: number;
    htmlRows: number;
    mediaReferenceRows: number;
  };
  warnings: AnkiImportWarningCode[];
};

type RawRow = { fields: string[]; sourceLine: number };

const SEPARATORS: Record<string, string> = {
  tab: "\t",
  comma: ",",
  semicolon: ";",
  space: " ",
  pipe: "|",
  colon: ":"
};

const SPECIAL_COLUMN_KEYS = new Set(["tags column", "deck column", "notetype column", "guid column"]);

function isRecordSeparator(value: string): boolean {
  return value === "\t" || value === "," || value === ";" || value === " " || value === "|" || value === ":";
}

function byteLength(value: string): number {
  return new TextEncoder().encode(value).byteLength;
}

export function decodeAnkiTextExport(buffer: ArrayBuffer): string {
  if (buffer.byteLength > MAX_ANKI_TEXT_BYTES) throw new Error("ANKI_FILE_TOO_LARGE");
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    throw new Error("ANKI_INVALID_UTF8");
  }
}

function readSeparator(value: string): string | null {
  const normalized = value.trim().toLocaleLowerCase();
  if (Object.hasOwn(SEPARATORS, normalized)) return SEPARATORS[normalized];
  if (value === "\\t") return "\t";
  if (isRecordSeparator(value)) return value;
  return null;
}

function readColumnIndex(value: string): number | null {
  const parsed = Number(value.trim());
  return Number.isInteger(parsed) && parsed >= 1 ? parsed - 1 : null;
}

function scanSeparatorCount(line: string, separator: string): number {
  let quoted = false;
  let count = 0;
  for (let index = 0; index < line.length; index += 1) {
    const current = line[index];
    if (current === '"') {
      if (quoted && line[index + 1] === '"') index += 1;
      else quoted = !quoted;
    } else if (!quoted && current === separator) {
      count += 1;
    }
  }
  return count;
}

function inferSeparator(line: string): string {
  const candidates = ["\t", ",", ";", "|"];
  const ranked = candidates
    .map((separator, index) => ({ separator, index, count: scanSeparatorCount(line, separator) }))
    .sort((left, right) => right.count - left.count || left.index - right.index);
  if (!ranked[0] || ranked[0].count === 0) throw new Error("ANKI_SEPARATOR_NOT_DETECTED");
  return ranked[0].separator;
}

function parseDelimitedRows(input: string, separator: string, startLine: number): RawRow[] {
  const rows: RawRow[] = [];
  let fields: string[] = [];
  let field = "";
  let quoted = false;
  let afterQuote = false;
  let physicalLine = startLine;
  let rowStartLine = startLine;
  let fieldStarted = false;

  const pushField = () => {
    fields.push(field);
    field = "";
    fieldStarted = false;
    afterQuote = false;
  };
  const pushRow = () => {
    const rowWasPresent = fields.length > 0 || field.length > 0 || fieldStarted || afterQuote;
    pushField();
    // Ignore physically blank lines but preserve rows with explicit empty delimiters or quoted empty fields.
    if (rowWasPresent) rows.push({ fields, sourceLine: rowStartLine });
    fields = [];
    rowStartLine = physicalLine + 1;
  };

  for (let index = 0; index < input.length; index += 1) {
    const current = input[index];
    if (quoted) {
      if (current === '"') {
        if (input[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          quoted = false;
          afterQuote = true;
        }
      } else {
        field += current;
        if (current === "\n") physicalLine += 1;
        else if (current === "\r" && input[index + 1] !== "\n") physicalLine += 1;
      }
      continue;
    }

    if (afterQuote && current !== separator && current !== "\n" && current !== "\r") {
      if (current === " " || current === "\t") continue;
      throw new Error("ANKI_MALFORMED_QUOTED_FIELD");
    }

    if (current === '"' && !fieldStarted && field.length === 0) {
      quoted = true;
      fieldStarted = true;
    } else if (current === separator) {
      pushField();
    } else if (current === "\n" || current === "\r") {
      if (current === "\r" && input[index + 1] === "\n") index += 1;
      pushRow();
      physicalLine += 1;
      rowStartLine = physicalLine;
    } else {
      field += current;
      fieldStarted = true;
      afterQuote = false;
    }
  }

  if (quoted) throw new Error("ANKI_UNCLOSED_QUOTED_FIELD");
  if (field.length > 0 || fields.length > 0 || fieldStarted || afterQuote) {
    pushRow();
  }
  return rows;
}

function parseHeadersAndBody(text: string): {
  headers: AnkiTextHeaders;
  body: string;
  firstDataLine: number;
  ignoredCommentLines: number;
  separatorWasDeclared: boolean;
} {
  const lines = text.replace(/^\uFEFF/u, "").split(/\r\n|\n|\r/u);
  const collected: Record<string, string> = {};
  const ignoredHeaders: string[] = [];
  let index = 0;
  let ignoredCommentLines = 0;
  let sawHeader = false;

  while (index < lines.length) {
    const trimmed = lines[index].trim();
    if (trimmed === "") {
      if (sawHeader) {
        index += 1;
        continue;
      }
      index += 1;
      continue;
    }
    if (!trimmed.startsWith("#")) break;
    sawHeader = true;
    ignoredCommentLines += 1;
    const match = /^#([^:]+):(.*)$/u.exec(trimmed);
    if (match) {
      const key = match[1].trim().toLocaleLowerCase();
      const value = match[2].trim();
      if (["separator", "html", "tags", "columns", "notetype", "deck", ...SPECIAL_COLUMN_KEYS].includes(key)) {
        collected[key] = value;
      } else {
        ignoredHeaders.push(key);
      }
    }
    index += 1;
  }

  const declaredSeparator = collected.separator ? readSeparator(collected.separator) : null;
  if (collected.separator && declaredSeparator === null) throw new Error("ANKI_UNSUPPORTED_SEPARATOR");
  const separator = declaredSeparator ?? (lines[index] ? inferSeparator(lines[index]) : null);
  if (!separator) throw new Error("ANKI_NO_DATA_ROWS");

  const columns = collected.columns && collected.columns.length > 0
    ? parseDelimitedRows(collected.columns, separator, 1)[0]?.fields ?? []
    : [];

  const headers: AnkiTextHeaders = {
    separator,
    html: collected.html?.toLocaleLowerCase() === "true",
    tags: collected.tags ? collected.tags.split(/\s+/u).filter(Boolean) : [],
    columns,
    notetype: collected.notetype || null,
    deck: collected.deck || null,
    tagsColumn: collected["tags column"] ? readColumnIndex(collected["tags column"]) : null,
    notetypeColumn: collected["notetype column"] ? readColumnIndex(collected["notetype column"]) : null,
    deckColumn: collected["deck column"] ? readColumnIndex(collected["deck column"]) : null,
    guidColumn: collected["guid column"] ? readColumnIndex(collected["guid column"]) : null,
    ignoredHeaders
  };

  for (const key of SPECIAL_COLUMN_KEYS) {
    if (collected[key] && readColumnIndex(collected[key]) === null) throw new Error("ANKI_INVALID_SPECIAL_COLUMN");
  }

  return {
    headers,
    body: lines.slice(index).join("\n"),
    firstDataLine: index + 1,
    ignoredCommentLines,
    separatorWasDeclared: declaredSeparator !== null
  };
}

function detectHtml(value: string): boolean {
  return /<\/?[a-z][^>]*>/iu.test(value);
}

function detectMediaReference(value: string): boolean {
  return /\[sound:[^\]]+\]|<img\b[^>]*\bsrc\s*=|\[video:[^\]]+\]/iu.test(value);
}

export function parseAnkiTextExport(text: string): AnkiTextPreview {
  if (typeof text !== "string") throw new Error("ANKI_INVALID_TEXT");
  if (byteLength(text) > MAX_ANKI_TEXT_BYTES) throw new Error("ANKI_FILE_TOO_LARGE");
  const parsed = parseHeadersAndBody(text);
  const rawRows = parseDelimitedRows(parsed.body, parsed.headers.separator, parsed.firstDataLine);
  if (rawRows.length === 0) throw new Error("ANKI_NO_DATA_ROWS");

  const firstWidth = rawRows[0].fields.length;
  const width = parsed.headers.columns.length || firstWidth;
  const declaredSpecialIndexes = [
    parsed.headers.tagsColumn,
    parsed.headers.notetypeColumn,
    parsed.headers.deckColumn,
    parsed.headers.guidColumn
  ].filter((value): value is number => value !== null);
  if (parsed.headers.columns.length > 0
    && declaredSpecialIndexes.some(index => index >= parsed.headers.columns.length)) {
    throw new Error("ANKI_UNSUPPORTED_SPECIAL_COLUMN");
  }
  const specialIndexes = new Set(declaredSpecialIndexes);

  const normalIndexes = Array.from({ length: Math.max(width, ...rawRows.map(row => row.fields.length)) }, (_, index) => index)
    .filter(index => !specialIndexes.has(index));
  if (normalIndexes.length === 0) throw new Error("ANKI_UNSUPPORTED_NO_CONTENT_FIELDS");
  const fieldLabels = normalIndexes.map((index, labelIndex) => {
    const declared = parsed.headers.columns[index];
    return declared || "Field " + (labelIndex + 1);
  });

  const firstFieldSeen = new Map<string, number>();
  const globalWarnings = new Set<AnkiImportWarningCode>();
  const previewRows: AnkiTextPreviewRow[] = [];

  for (const raw of rawRows) {
    const rowWarnings = new Set<AnkiImportWarningCode>();
    if (raw.fields.length !== width) rowWarnings.add("ROW_FIELD_COUNT_MISMATCH");

    const fields = normalIndexes.map(index => raw.fields[index] ?? "");
    if (fields.some(detectHtml) || parsed.headers.html) rowWarnings.add("HTML_CONTENT_TREATED_AS_TEXT");
    if (fields.some(detectMediaReference)) rowWarnings.add("MEDIA_REFERENCES_NOT_INCLUDED");
    if (fields.every(value => value.trim() === "")) rowWarnings.add("EMPTY_CONTENT_FIELDS");

    const firstField = fields[0]?.trim() ?? "";
    const noteType = parsed.headers.notetypeColumn !== null
      ? raw.fields[parsed.headers.notetypeColumn]?.trim() || null
      : parsed.headers.notetype;
    if (firstField) {
      const duplicateKey = (noteType ?? "") + "\u0000" + firstField;
      const previousLine = firstFieldSeen.get(duplicateKey);
      if (previousLine !== undefined) {
        rowWarnings.add("DUPLICATE_FIRST_FIELD_IN_FILE");
      } else {
        firstFieldSeen.set(duplicateKey, raw.sourceLine);
      }
    }

    const rowTags = parsed.headers.tagsColumn !== null
      ? (raw.fields[parsed.headers.tagsColumn] ?? "").split(/\s+/u).filter(Boolean)
      : [];
    const tags = [...new Set([...parsed.headers.tags, ...rowTags])];
    const deck = parsed.headers.deckColumn !== null
      ? raw.fields[parsed.headers.deckColumn]?.trim() || null
      : parsed.headers.deck;
    const guid = parsed.headers.guidColumn !== null
      ? raw.fields[parsed.headers.guidColumn]?.trim() || null
      : null;

    for (const warning of rowWarnings) globalWarnings.add(warning);
    previewRows.push({
      sourceLine: raw.sourceLine,
      fields,
      tags,
      deck,
      noteType,
      guid,
      warnings: [...rowWarnings],
      duplicateOfRow: rowWarnings.has("DUPLICATE_FIRST_FIELD_IN_FILE")
        ? firstFieldSeen.get((noteType ?? "") + "\u0000" + firstField) ?? null
        : null
    });
  }

  return {
    headers: parsed.headers,
    fieldLabels,
    rows: previewRows,
    ignoredCommentLines: parsed.ignoredCommentLines,
    summary: {
      totalRows: previewRows.length,
      rowsWithWarnings: previewRows.filter(row => row.warnings.length > 0).length,
      emptyRows: previewRows.filter(row => row.warnings.includes("EMPTY_CONTENT_FIELDS")).length,
      duplicateRows: previewRows.filter(row => row.warnings.includes("DUPLICATE_FIRST_FIELD_IN_FILE")).length,
      htmlRows: previewRows.filter(row => row.warnings.includes("HTML_CONTENT_TREATED_AS_TEXT")).length,
      mediaReferenceRows: previewRows.filter(row => row.warnings.includes("MEDIA_REFERENCES_NOT_INCLUDED")).length
    },
    warnings: [...globalWarnings]
  };
}
