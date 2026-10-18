#!/usr/bin/env node
/**
 * Check semantic text/control contrast in the canonical Rinemi 2 token sheet.
 * Run from any directory: node scripts/check-design-token-contrast.mjs
 * This verifies declared token pairs, not rendered screenshots or font loading.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const cssPath = fileURLToPath(new URL("../src/styles/design-tokens.css", import.meta.url));
const css = readFileSync(cssPath, "utf8");

function parseTheme(pattern, label) {
  const match = css.match(pattern);
  if (!match) throw new Error(`Could not find the ${label} theme block.`);
  const tokens = Object.fromEntries(
    [...match[1].matchAll(/--rinemi-([\w-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;/g)]
      .map((item) => [item[1], item[2].toUpperCase()])
  );
  if (Object.keys(tokens).length < 35) {
    throw new Error(`The ${label} theme exposed only ${Object.keys(tokens).length} hex tokens; check the stylesheet parser.`);
  }
  return tokens;
}

const themes = {
  light: parseTheme(/:root,\s*:root\[data-theme="light"\]\s*\{([^}]*)\}/s, "light"),
  dark: parseTheme(/:root\[data-theme="dark"\]\s*\{([^}]*)\}/s, "dark"),
};

function luminance(hex) {
  const [r, g, b] = hex.slice(1).match(/../g).map((part) => parseInt(part, 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const first = luminance(a);
  const second = luminance(b);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

const failures = [];
let checked = 0;

for (const [themeName, token] of Object.entries(themes)) {
  const pairs = [];
  const textRoles = ["color-text-primary", "color-text-secondary", "color-text-muted", "color-link"];
  const surfaceRoles = ["color-bg-canvas", "color-bg-surface", "color-bg-raised", "color-bg-inset"];

  for (const foreground of textRoles) {
    for (const background of surfaceRoles) pairs.push([foreground, background, 4.5]);
  }

  for (const background of ["color-action-primary-bg", "color-action-primary-hover-bg", "color-action-primary-pressed-bg"]) {
    pairs.push(["color-action-primary-fg", background, 4.5]);
  }
  pairs.push(["color-action-primary-disabled-fg", "color-action-primary-disabled-bg", 4.5]);
  pairs.push(["color-danger-fg", "color-danger-bg", 4.5]);
  pairs.push(["color-action-danger-fg", "color-action-danger-bg", 4.5]);
  pairs.push(["color-action-danger-fg", "color-action-danger-hover-bg", 4.5]);
  pairs.push(["color-success-fg", "color-success-bg", 4.5]);
  pairs.push(["color-warning-fg", "color-warning-bg", 4.5]);
  pairs.push(["color-info-fg", "color-info-bg", 4.5]);
  pairs.push(["color-selection-fg", "color-selection-bg", 4.5]);

  for (const background of surfaceRoles) {
    pairs.push(["color-focus-ring", background, 3]);
    pairs.push(["color-border-interactive", background, 3]);
  }

  for (const [foregroundRole, backgroundRole, minimum] of pairs) {
    const foreground = token[foregroundRole];
    const background = token[backgroundRole];
    if (!foreground || !background) {
      failures.push(`${themeName}: missing ${!foreground ? foregroundRole : backgroundRole}`);
      continue;
    }
    checked += 1;
    const ratio = contrast(foreground, background);
    if (ratio < minimum) {
      failures.push(`${themeName}: ${foregroundRole} on ${backgroundRole} is ${ratio.toFixed(2)}:1; needs ${minimum}:1`);
    }
  }
}

if (failures.length) {
  console.error(`Design-token contrast check FAILED (${failures.length} issue(s), ${checked} pair(s) checked):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Design-token contrast check passed: ${checked} semantic pairs checked across light and dark themes.`);
  console.log("Note: rendered-browser, opacity/overlay, focus-shape and actual font checks remain manual acceptance gates.");
}
