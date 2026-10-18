import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const data = JSON.parse(fs.readFileSync(path.join(root, "src/data/kanji.json"), "utf8"));
const topics = JSON.parse(fs.readFileSync(path.join(root, "src/data/kanji-topics.json"), "utf8"));
const content = fs.readFileSync(path.join(root, "src/content.ts"), "utf8");

assert.equal(data.version, 1);
assert.equal(data.count, 2136);
assert.equal(data.kanji.length, 2136);
const characters = new Set();
for (const item of data.kanji) {
  assert.ok(typeof item.character === "string" && item.character.length > 0);
  assert.ok(Array.isArray(item.meaning) && Array.isArray(item.on) && Array.isArray(item.kun));
  assert.ok(Number.isFinite(item.strokes));
  assert.ok(!characters.has(item.character), "Duplicate character: " + item.character);
  characters.add(item.character);
}
assert.ok(Array.isArray(topics.topics) && topics.topics.length > 0);
for (const topic of topics.topics) {
  assert.ok(topic.id && topic.label?.fa && topic.label?.en);
  for (const character of topic.characters.trim().split(/\s+/).filter(Boolean)) {
    assert.ok(characters.has(character), "Topic references missing character: " + character);
  }
}
for (const character of ["日", "一", "国", "会", "人", "年", "大", "水", "山"]) {
  assert.ok(content.includes('"' + character + '"'), "Missing starter gloss: " + character);
}
console.log("Rinemi2 data contract passed: 2,136 unique kanji, topic integrity, and starter content.");