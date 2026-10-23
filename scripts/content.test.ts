import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import { EXAMPLES, PERSIAN_GLOSSES, STARTER_CHARACTERS } from "../src/content.ts";

const source = JSON.parse(
  fs.readFileSync(new URL("../src/data/kanji.json", import.meta.url), "utf8")
) as { kanji: Array<{ character: string }> };
const corpus = new Set(source.kanji.map(item => item.character));
const kanaOnly = /^[\u3040-\u30ffー・]+$/u;

test("starter content IDs exist in the kanji corpus and are unique", () => {
  assert.ok(STARTER_CHARACTERS.length > 0, "Starter set must not be empty");
  assert.equal(new Set(STARTER_CHARACTERS).size, STARTER_CHARACTERS.length, "Duplicate starter character");
  for (const character of STARTER_CHARACTERS) {
    assert.ok(corpus.has(character), `Starter character is missing from the corpus: ${character}`);
  }
});

test("every starter character has a Persian/English gloss and at least one example", () => {
  for (const character of STARTER_CHARACTERS) {
    const gloss = PERSIAN_GLOSSES[character];
    assert.ok(gloss, `Missing glossary entry for ${character}`);
    assert.ok(gloss.fa.trim(), `Missing Persian gloss for ${character}`);
    assert.ok(gloss.en.trim(), `Missing English source gloss for ${character}`);
    assert.ok(Array.isArray(EXAMPLES[character]) && EXAMPLES[character].length > 0,
      `Missing example vocabulary for ${character}`);
  }
});

test("starter examples connect 本 with books and 生 with living, alongside common compound words", () => {
  assert.ok(EXAMPLES["本"].some(example => example.word === "本屋" && example.reading === "ほんや"),
    "本 should include 本屋 (ほんや) to demonstrate the book sense");
  assert.ok(EXAMPLES["生"].some(example => example.word === "生きる" && example.reading === "いきる"),
    "生 should include 生きる (いきる) to demonstrate the life/live sense");
});

test("gloss and example keys reference real kanji and contain non-empty fields", () => {
  for (const [character, gloss] of Object.entries(PERSIAN_GLOSSES)) {
    assert.ok(corpus.has(character), `Gloss key is not in the corpus: ${character}`);
    assert.ok(gloss.fa.trim(), `Empty Persian gloss for ${character}`);
    assert.ok(gloss.en.trim(), `Empty English gloss for ${character}`);
  }

  for (const [character, examples] of Object.entries(EXAMPLES)) {
    assert.ok(corpus.has(character), `Example key is not in the corpus: ${character}`);
    assert.ok(PERSIAN_GLOSSES[character], `Examples exist without a gloss for ${character}`);
    assert.ok(Array.isArray(examples) && examples.length > 0, `Empty example list for ${character}`);

    for (const [index, example] of examples.entries()) {
      const id = `${character} example #${index + 1}`;
      assert.ok(example.word.trim(), `Missing Japanese word in ${id}`);
      assert.ok(example.reading.trim(), `Missing kana reading in ${id}`);
      assert.ok(example.fa.trim(), `Missing Persian translation in ${id}`);
      assert.ok(example.en.trim(), `Missing English translation in ${id}`);
      assert.ok(example.word.includes(character), `Target kanji ${character} is absent from ${id}`);
      assert.match(example.reading, kanaOnly, `Reading must contain only kana/reading punctuation in ${id}: ${example.reading}`);
    }
  }
});
