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

test("starter examples align direct meanings for 本, 生, 会, 社, 学, 東, 金, 家, 語, 事, 十, 食 and 電", () => {
  assert.ok(EXAMPLES["本"].some(example => example.word === "本屋" && example.reading === "ほんや"),
    "本 should include 本屋 (ほんや) to demonstrate the book sense");
  assert.ok(EXAMPLES["生"].some(example => example.word === "生きる" && example.reading === "いきる"),
    "生 should include 生きる (いきる) to demonstrate the life/live sense");
  assert.ok(EXAMPLES["会"].some(example => example.word === "会う" && example.reading === "あう"),
    "会 should include 会う (あう) to demonstrate the meet sense");
  assert.ok(EXAMPLES["社"].some(example => example.word === "神社" && example.reading === "じんじゃ"),
    "社 should include 神社 (じんじゃ) to demonstrate the shrine sense");
  assert.ok(EXAMPLES["学"].some(example => example.word === "学ぶ" && example.reading === "まなぶ"),
    "学 should include 学ぶ (まなぶ) to demonstrate the learn/study sense");
  assert.ok(EXAMPLES["東"].some(example => example.word === "東" && example.reading === "ひがし"),
    "東 should include 東 (ひがし) to demonstrate the east sense");
  assert.ok(EXAMPLES["金"].some(example => example.word === "金" && example.reading === "きん"),
    "金 should include 金 (きん) to demonstrate the gold sense");
  assert.ok(EXAMPLES["家"].some(example => example.word === "家" && example.reading === "いえ"),
    "家 should include 家 (いえ) to demonstrate the house sense");
  assert.ok(EXAMPLES["語"].some(example => example.word === "単語" && example.reading === "たんご"),
    "語 should include 単語 (たんご) to demonstrate the word sense");
  assert.ok(EXAMPLES["事"].some(example => example.word === "事" && example.reading === "こと"),
    "事 should include 事 (こと) to demonstrate the matter/thing sense");
  assert.ok(EXAMPLES["十"].some(example => example.word === "十" && example.reading === "じゅう"),
    "十 should include 十 (じゅう) to demonstrate the number-ten sense");
  assert.ok(EXAMPLES["食"].some(example => example.word === "食べ物" && example.reading === "たべもの"),
    "食 should include 食べ物 (たべもの) to demonstrate the food sense");
  assert.ok(EXAMPLES["電"].some(example => example.word === "電気" && example.reading === "でんき"),
    "電 should include 電気 (でんき) to demonstrate the electricity sense");
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
