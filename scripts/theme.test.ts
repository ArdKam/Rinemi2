import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  applyThemePreference,
  nextThemePreference,
  readThemePreference,
  resolveThemePreference
} from "../src/theme.ts";

function overrideGlobal(name: string, value: unknown) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, name);
  Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  return () => {
    if (previous) Object.defineProperty(globalThis, name, previous);
    else Reflect.deleteProperty(globalThis, name);
  };
}

function installBrowser(prefersDark = false, stored: Record<string, string> = {}) {
  const values = new Map(Object.entries(stored));
  const listeners = new Set<(event?: unknown) => void>();
  const media = {
    matches: prefersDark,
    addEventListener: (_name: string, listener: (event?: unknown) => void) => listeners.add(listener),
    removeEventListener: (_name: string, listener: (event?: unknown) => void) => listeners.delete(listener)
  };
  const root = { dataset: {} as Record<string, string>, style: {} as Record<string, string> };
  const meta = { content: "" };
  const fakeWindow = {
    matchMedia: (_query: string) => media,
    localStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key)
    }
  };
  const fakeDocument = {
    documentElement: root,
    querySelector: (selector: string) => selector === 'meta[name="theme-color"]' ? meta : null
  };
  const restore = [
    overrideGlobal("window", fakeWindow),
    overrideGlobal("document", fakeDocument),
    overrideGlobal("getComputedStyle", (_element: unknown) => ({
      getPropertyValue: (name: string) => name === "--rinemi-color-bg-canvas"
        ? root.dataset.theme === "dark" ? "#1D2022" : "#F7F4EE"
        : ""
    }))
  ];
  return {
    values, media, root, meta, listeners,
    restore: () => restore.reverse().forEach(dispose => dispose())
  };
}

test("explicit preferences resolve to their fixed theme and system follows the OS", () => {
  assert.equal(resolveThemePreference("light", true), "light");
  assert.equal(resolveThemePreference("dark", false), "dark");
  assert.equal(resolveThemePreference("system", true), "dark");
  assert.equal(resolveThemePreference("system", false), "light");
});

test("canonical preference wins and the legacy app-store preference remains a migration fallback", () => {
  const browser = installBrowser(false, { "rinemi.theme": "dark" });
  try {
    assert.equal(readThemePreference("light"), "dark");
    browser.values.delete("rinemi.theme");
    assert.equal(readThemePreference("light"), "light");
    assert.equal(readThemePreference(undefined), "system");
    assert.equal(readThemePreference("system"), "system");
  } finally {
    browser.restore();
  }
});

test("theme action can switch away from system and between explicit themes", () => {
  const browser = installBrowser(true);
  try {
    assert.equal(nextThemePreference("system"), "light");
    assert.equal(nextThemePreference("light"), "dark");
    assert.equal(nextThemePreference("dark"), "system");
  } finally {
    browser.restore();
  }
});

test("applying an explicit theme updates document state and browser chrome color", () => {
  const browser = installBrowser(false);
  try {
    const cleanup = applyThemePreference("dark");
    assert.equal(browser.root.dataset.theme, "dark");
    assert.equal(browser.root.style.colorScheme, "dark");
    assert.equal(browser.meta.content, "#1D2022");
    assert.equal(browser.listeners.size, 0);
    cleanup();
  } finally {
    browser.restore();
  }
});

test("system preference reacts to OS theme changes and removes its listener on cleanup", () => {
  const browser = installBrowser(false);
  try {
    const cleanup = applyThemePreference("system");
    assert.equal(browser.root.dataset.theme, "light");
    assert.equal(browser.listeners.size, 1);

    browser.media.matches = true;
    for (const listener of browser.listeners) listener();
    assert.equal(browser.root.dataset.theme, "dark");
    assert.equal(browser.meta.content, "#1D2022");

    cleanup();
    assert.equal(browser.listeners.size, 0);
  } finally {
    browser.restore();
  }
});

test("pre-React bootstrap loads canonical styles and resolves theme before React mounts", () => {
  const htmlPath = fileURLToPath(new URL("../index.html", import.meta.url));
  const html = readFileSync(htmlPath, "utf8");
  const tokenStyles = html.indexOf('href="/src/styles/design-tokens.css"');
  const appStyles = html.indexOf('href="/src/styles.css"');
  const bootstrap = html.indexOf('localStorage.getItem("rinemi.theme")');
  const reactEntry = html.indexOf('src="/src/main.tsx"');

  assert.ok(tokenStyles >= 0 && appStyles > tokenStyles, "token and app stylesheets must load in order");
  assert.ok(bootstrap > appStyles && bootstrap < reactEntry, "theme preference must resolve before the React entry point");
  assert.match(html, /rinemi2:local:v1/, "legacy preferences remain readable during migration");
  assert.match(html, /prefers-color-scheme: dark/, "the bootstrap handles the system preference");
  assert.match(html, /--rinemi-color-bg-canvas/, "browser chrome uses the semantic canvas token");
});
