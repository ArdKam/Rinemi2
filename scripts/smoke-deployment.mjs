import assert from "node:assert/strict";

const providedUrl = process.argv[2];
assert.ok(providedUrl, "Usage: node scripts/smoke-deployment.mjs <deployed-page-url>");

const baseUrl = new URL(providedUrl);
if (!baseUrl.pathname.endsWith("/")) baseUrl.pathname += "/";

const homeResponse = await fetch(baseUrl, { redirect: "follow" });
assert.ok(homeResponse.ok, `Homepage returned HTTP ${homeResponse.status}: ${baseUrl.href}`);
const html = await homeResponse.text();

assert.match(html, /id=["']root["']/i, "Deployed HTML is missing the React root element");
assert.doesNotMatch(html, /\/src\/main\.tsx(?:[?#"']|$)/i,
  "The deployment is serving the source TypeScript entry instead of a compiled bundle");

const tags = [...html.matchAll(/<(script|link)\b[^>]*>/gi)];
const moduleSources = [];
const pendingAssets = [];

function attributes(tag) {
  const result = {};
  for (const match of tag.matchAll(/([^\s=]+)\s*=\s*["']([^"']*)["']/g)) {
    result[match[1].toLowerCase()] = match[2];
  }
  return result;
}

for (const match of tags) {
  const type = match[1].toLowerCase();
  const attrs = attributes(match[0]);
  if (type === "script" && attrs.src) {
    pendingAssets.push({ value: attrs.src, kind: attrs.type === "module" ? "module" : "script" });
    if (attrs.type === "module") moduleSources.push(attrs.src);
  }
  if (type === "link" && attrs.href) pendingAssets.push({ value: attrs.href, kind: "link" });
}

assert.ok(
  moduleSources.some((source) => {
    const url = new URL(source, baseUrl);
    return url.origin === baseUrl.origin
      && url.pathname.startsWith(`${baseUrl.pathname}assets/`)
      && /\.m?js$/i.test(url.pathname);
  }),
  `No compiled JavaScript bundle was found under ${baseUrl.pathname}assets/`
);
assert.ok(
  pendingAssets.some((asset) => new URL(asset.value, baseUrl).pathname.endsWith("/theme-bootstrap.js")),
  "Theme bootstrap script was not included in the deployed page"
);
assert.ok(
  pendingAssets.some((asset) => new URL(asset.value, baseUrl).pathname.endsWith("/icon.svg")),
  "Rinemi icon was not included in the deployed page"
);

const visited = new Set();
while (pendingAssets.length) {
  const asset = pendingAssets.shift();
  const url = new URL(asset.value, asset.relativeTo ?? baseUrl);
  if (url.protocol !== "http:" && url.protocol !== "https:") continue;
  if (url.origin !== baseUrl.origin) continue;

  assert.ok(
    url.pathname.startsWith(baseUrl.pathname),
    `Same-origin asset escaped the GitHub Pages base path ${baseUrl.pathname}: ${url.href}`
  );
  if (visited.has(url.href)) continue;
  visited.add(url.href);

  const response = await fetch(url, { redirect: "follow" });
  assert.ok(response.ok, `Asset returned HTTP ${response.status}: ${url.href}`);
  const body = await response.text();

  if (asset.kind === "module") {
    assert.doesNotMatch(body, /<!doctype\s+html/i, `Module URL returned HTML instead of JavaScript: ${url.href}`);

    for (const brandAsset of ["brand/rinemi-mark.svg", "brand/rinemi-mark-dark.svg"]) {
      const expectedPath = `${baseUrl.pathname}${brandAsset}`;
      assert.ok(
        body.includes(expectedPath),
        `Compiled app does not reference the base-prefixed brand asset ${expectedPath}`
      );
      pendingAssets.push({ value: brandAsset, kind: "brand-asset" });
    }
  }

  if (/\.css(?:$|\?)/i.test(url.href)) {
    for (const match of body.matchAll(/url\(\s*["']?([^"'\)]+)["']?\s*\)/gi)) {
      const value = match[1].trim();
      if (!value || /^(?:data:|blob:|#)/i.test(value)) continue;
      pendingAssets.push({ value, kind: "css-asset", relativeTo: url.href });
    }
  }

  console.log(`PASS HTTP ${response.status} [${asset.kind}] ${url.href}`);
}

assert.ok(visited.size >= 3, `Too few local resources were verified (${visited.size})`);
console.log(`PASS: deployed entry page and ${visited.size} same-origin resources are reachable at ${baseUrl.href}`);
