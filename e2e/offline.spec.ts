import { test, expect } from "@playwright/test";

test("installable manifest is valid and a warmed app shell can continue studying offline", async ({ page, context }) => {
  const manifestResponse = await page.request.get("/manifest.webmanifest");
  expect(manifestResponse.status()).toBe(200);
  const manifest = await manifestResponse.json();
  expect(manifest.name).toContain("Rinemi");
  expect(manifest.start_url).toBe("./");
  expect(manifest.scope).toBe("./");
  expect(manifest.display).toBe("standalone");
  expect(manifest.icons.some((icon: { src: string; sizes: string }) => icon.src === "./icon.svg" && icon.sizes === "any")).toBe(true);
  const iconResponses = await Promise.all(["/icon-192.png", "/icon-512.png", "/icon.svg"].map(path => page.request.get(path)));
  expect(iconResponses.map(response => response.status())).toEqual([200, 200, 200]);

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "امروز، یک قدم به خواندن نزدیک‌تر." })).toBeVisible();
  await page.waitForFunction(async () => {
    if (!("serviceWorker" in navigator)) return false;
    const registration = await navigator.serviceWorker.getRegistration();
    return Boolean(registration?.active && navigator.serviceWorker.controller);
  }, undefined, { timeout: 20_000 });

  // Reload under service-worker control so the HTML, compiled JS/CSS, fonts and
  // same-origin static requests used by this journey are present in the cache.
  await page.reload();
  await page.waitForFunction(() => Boolean(navigator.serviceWorker?.controller));
  await page.evaluate(async () => { await document.fonts.ready; });
  await expect(page.locator(".brand-mark-light")).toBeVisible();

  const cachedPaths = await page.evaluate(async () => {
    const cacheName = (await caches.keys()).find(name => name.startsWith("rinemi2-app-shell:"));
    if (!cacheName) return [];
    const requests = await (await caches.open(cacheName)).keys();
    return requests.map(request => new URL(request.url).pathname);
  });
  expect(cachedPaths.some(path => /\/assets\/.*\.js$/u.test(path))).toBe(true);
  expect(cachedPaths.some(path => /\/assets\/.*\.css$/u.test(path))).toBe(true);

  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "امروز، یک قدم به خواندن نزدیک‌تر." })).toBeVisible();
  await expect(page.locator(".brand-mark-light")).toBeVisible();

  await page.getByRole("button", { name: /شروع یادگیری/ }).click();
  await expect(page.locator(".prompt-kanji")).toHaveText("日");
  await page.getByRole("button", { name: /نمایش پاسخ/ }).click();
  await expect(page.locator(".answer-heading h2")).toHaveText("خورشید؛ روز");
  await page.locator(".rating-good").click();
  await expect(page.locator(".prompt-kanji")).toHaveText("一");

  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("rinemi2:local:v2") || "{}"));
  expect(stored.reviews["日"].reviews).toBe(1);
});
