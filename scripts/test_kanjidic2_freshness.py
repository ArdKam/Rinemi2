from __future__ import annotations

import gzip
import hashlib
import subprocess
import sys
import tempfile
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path


SCRIPT = Path(__file__).with_name("check-kanjidic2-freshness.py")


def write_snapshot(path: Path, count: int = 1000, root_tag: str = "kanjidic2") -> None:
    root = ET.Element(root_tag)
    header = ET.SubElement(root, "header")
    ET.SubElement(header, "file_version").text = "4"
    ET.SubElement(header, "database_version").text = "2026-10-23"
    for index in range(count):
        character = ET.SubElement(root, "character")
        ET.SubElement(character, "literal").text = chr(0x4E00 + (index % 2000))
    with gzip.open(path, "wb") as compressed:
        compressed.write(ET.tostring(root, encoding="utf-8", xml_declaration=True))


class Kanjidic2FreshnessScriptTests(unittest.TestCase):
    def run_checker(self, path: Path) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [sys.executable, str(SCRIPT), str(path)],
            capture_output=True,
            text=True,
            check=False,
        )

    def test_valid_snapshot_outputs_version_count_and_sha256(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            snapshot = Path(temp) / "kanjidic2.xml.gz"
            write_snapshot(snapshot)
            result = self.run_checker(snapshot)

            self.assertEqual(result.returncode, 0, result.stderr)
            fields = dict(line.split("=", 1) for line in result.stdout.splitlines())
            self.assertEqual(fields["file_version"], "4")
            self.assertEqual(fields["database_version"], "2026-10-23")
            self.assertEqual(fields["character_count"], "1000")
            self.assertEqual(fields["snapshot_sha256"], hashlib.sha256(snapshot.read_bytes()).hexdigest())

    def test_rejects_non_gzip_input(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            snapshot = Path(temp) / "not-gzip.xml.gz"
            snapshot.write_text("not a gzip archive", encoding="utf-8")
            result = self.run_checker(snapshot)

            self.assertNotEqual(result.returncode, 0)
            self.assertIn("not valid gzip/XML", result.stderr)

    def test_rejects_unexpected_root_and_implausible_entry_count(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            wrong_root = Path(temp) / "wrong-root.xml.gz"
            write_snapshot(wrong_root, root_tag="unexpected")
            result = self.run_checker(wrong_root)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("Unexpected XML root", result.stderr)

            too_small = Path(temp) / "too-small.xml.gz"
            write_snapshot(too_small, count=10)
            result = self.run_checker(too_small)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("Unexpected number of character records", result.stderr)


if __name__ == "__main__":
    unittest.main()
