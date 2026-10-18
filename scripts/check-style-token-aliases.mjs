import assert from "node:assert/strict";
import fs from "node:fs";

const tokenCss = fs.readFileSync("src/styles/design-tokens.css", "utf8");
const appCss = fs.readFileSync("src/styles.css", "utf8");
const declared = new Set([...tokenCss.matchAll(/(--rinemi-[a-z0-9-]+)\s*:/g)].map(match => match[1]));
const referenced = new Set([...appCss.matchAll(/var\((--rinemi-[a-z0-9-]+)/g)].map(match => match[1]));
const missing = [...referenced].filter(name => !declared.has(name)).sort();

assert.deepEqual(missing, [], "Application styles must reference only declared semantic tokens. Missing: " + missing.join(", "));
assert.ok(declared.size >= 20, "Expected a meaningful semantic token contract, found " + declared.size);
assert.ok(referenced.has("--rinemi-color-bg-canvas"), "Application canvas must be tied to a canonical semantic token");
assert.ok(referenced.has("--rinemi-color-text-primary"), "Application text must be tied to a canonical semantic token");
assert.ok(referenced.has("--rinemi-color-action-primary-bg"), "Primary actions must use the canonical action token");

console.log("Design-token alias contract passed: " + referenced.size + " references resolve to " + declared.size + " declared Rinemi tokens.");
