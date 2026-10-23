#!/usr/bin/env python3
"""Validate and fingerprint the official KANJIDIC2 XML snapshot for a source-freshness audit.

This script never edits Rinemi's bundled 2,136-entry data. It records the source snapshot
metadata so a human can decide whether the approved derived dataset needs regeneration.
"""
from __future__ import annotations

import gzip
import hashlib
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


def fail(message: str) -> "None":
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def safe_output(value: str, label: str) -> str:
    value = value.strip()
    if not value or not re.fullmatch(r"[A-Za-z0-9._:+-]+", value):
        fail(f"KANJIDIC2 header field {label!r} is empty or contains unexpected characters")
    return value


def main() -> None:
    if len(sys.argv) != 2:
        fail("Usage: check-kanjidic2-freshness.py <kanjidic2.xml.gz>")
    source_path = Path(sys.argv[1])
    if not source_path.is_file():
        fail(f"Source snapshot does not exist: {source_path}")

    digest = hashlib.sha256()
    with source_path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)

    try:
        with gzip.open(source_path, "rb") as compressed:
            root = ET.parse(compressed).getroot()
    except (OSError, EOFError, ET.ParseError) as error:
        fail(f"Downloaded KANJIDIC2 snapshot is not valid gzip/XML: {error}")

    if root.tag != "kanjidic2":
        fail(f"Unexpected XML root: {root.tag!r}")

    header = root.find("header")
    if header is None:
        fail("KANJIDIC2 XML has no header")
    file_version = safe_output(header.findtext("file_version", ""), "file_version")
    database_version = safe_output(header.findtext("database_version", ""), "database_version")
    character_count = sum(1 for child in root if child.tag == "character")
    if character_count < 1000 or character_count > 100_000:
        fail(f"Unexpected number of character records: {character_count}")

    # GitHub Actions output format: KEY=VALUE, one key per line.
    print(f"snapshot_sha256={digest.hexdigest()}")
    print(f"file_version={file_version}")
    print(f"database_version={database_version}")
    print(f"character_count={character_count}")


if __name__ == "__main__":
    main()
