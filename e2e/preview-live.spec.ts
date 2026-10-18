import { test, expect } from "@playwright/test";
import fs from "node:fs";

const deployedBase = new URL(process.env.RINEMI_DEPLOY_URL ?? "https://ardkam.github.io/Rinemi2/");

test("live preview mounts React and completes a minimal learner journey without runtime or network errors", async ({ page }) => {
  fs.mkdirSync("artifacts", { recursive: true });

  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  const failedResponses: string[] = [];

  page.on("pageerror", error => pageErrors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("response", response => {
    const url = new URL(response.url());
    if (url.origin !== deployedBase.origin) return;
    if (response.status() >= 400) failedResponses.push(`HTTP ${response.status()} ${url.href}`);
    if (!url.pathname.startsWith(deployedBase.pathname)) {
      failedResponses.push(`Same-origin URL escaped the deployed base path: ${url.href}`);
    }
  });

  await page.setViewportSize({ width: 1365, height: 900 });
  await page.goto("./", { waitUntil: "networkidle" });

  await expect(page).toHaveTitle(/Rinemi/);
  await expect(page.locator("#root .app-shell")).toBeVisible();
  await expect(page.getByRole("heading", { name: "امروز، یک قدم به خواندن نزدیک‌تر." })).toBeVisible();

  const lightMark = page.locator(".brand-mark-light");
  const darkMark = page.locator(".brand-mark-dark");
  await expect.poll(() => lightMark.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect.poll(() => darkMark.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect(lightMark).toBeVisible();
  await expect(darkMark).toBeHidden();
  expectAssetPath(await lightMark.getAttribute("src"), "brand/rinemi-mark.svg");
  expectAssetPath(await darkMark.getAttribute("src"), "brand/rinemi-mark-dark.svg");

  await page.screenshot({ path: "artifacts/live-preview-fa-light.png", fullPage: true });

  await page.getByRole("button", { name: /شروع یادگیری/ }).click();
  await expect(page.locator(".prompt-kanji")).toHaveText("日");
  await page.getByRole("button", { name: /نمایش پاسخ/ }).click();
  await expect(page.locator(".answer-heading h2")).toHaveText("خورشید؛ روز");
  await page.locator(".rating-good").click();
  await expect(page.locator(".prompt-kanji")).toHaveText("一");

  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  // Fresh learners start with the system preference, so choose explicit light before dark.
  await page.getByRole("button", { name: "Light mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Dark mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(lightMark).toBeHidden();
  await expect(darkMark).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  const widths = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport + 1);
  await page.screenshot({ path: "artifacts/live-preview-en-dark-mobile.png", fullPage: true });

  expect(failedResponses, failedResponses.join("\n")).toEqual([]);
  expect(pageErrors, pageErrors.join("\n")).toEqual([]);
  expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
});

function expectAssetPath(source: string | null, asset: string) {
  expect(source, `Missing source URL for ${asset}`).not.toBeNull();
  const url = new URL(source!, deployedBase);
  expect(url.origin).toBe(deployedBase.origin);
  expect(url.pathname).toBe(`${deployedBase.pathname}${asset}`);
}

test("deployed Pages base path serves the install manifest and supports warm-cache offline study", async ({ page, context }) => {
  const appRoot = new URL("./", deployedBase).href;
  const manifestUrl = new URL("manifest.webmanifest", appRoot).href;
  const manifestResponse = await page.request.get(manifestUrl);
  expect(manifestResponse.status()).toBe(200);
  const manifest = await manifestResponse.json();
  expect(manifest.start_url).toBe("./");
  expect(manifest.scope).toBe("./");
  expect(manifest.display).toBe("standalone");

  for (const icon of manifest.icons as Array<{ src: string }>) {
    const iconUrl = new URL(icon.src, manifestUrl);
    expect(iconUrl.origin).toBe(deployedBase.origin);
    expect(iconUrl.pathname.startsWith(deployedBase.pathname)).toBe(true);
    expect((await page.request.get(iconUrl.href)).status()).toBe(200);
  }

  await page.goto(appRoot, { waitUntil: "networkidle" });
  await expect(page.locator("#root .app-shell")).toBeVisible();
  await page.waitForFunction(async () => {
    if (!("serviceWorker" in navigator)) return false;
    const registration = await navigator.serviceWorker.getRegistration();
    return Boolean(registration?.active && navigator.serviceWorker.controller);
  }, undefined, { timeout: 20_000 });
  const actualScope = await page.evaluate(async () => (await navigator.serviceWorker.getRegistration())?.scope ?? "");
  expect(actualScope).toBe(appRoot);

  // The second online load caches all same-origin assets actually used by the app.
  await page.reload({ waitUntil: "networkidle" });
  await page.evaluate(async () => { await document.fonts.ready; });
  const cacheState = await page.evaluate(async () => {
    const name = (await caches.keys()).find(key => key.startsWith("rinemi2-app-shell:"));
    if (!name) return { paths: [] as string[], base: "" };
    const cache = await caches.open(name);
    const requests = await cache.keys();
    return { paths: requests.map(request => new URL(request.url).pathname), base: name };
  });
  expect(cacheState.base).not.toBe("");
  expect(cacheState.paths).toContain(new URL(appRoot).pathname);
  expect(cacheState.paths.some(path => path.includes("/assets/") && path.endsWith(".js"))).toBe(true);
  expect(cacheState.paths.some(path => path.includes("/assets/") && path.endsWith(".css"))).toBe(true);

  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#root .app-shell")).toBeVisible();
  await expect(page.getByRole("heading", { name: "امروز، یک قدم به خواندن نزدیک‌تر." })).toBeVisible();
  await page.getByRole("button", { name: /شروع یادگیری/ }).click();
  await expect(page.locator(".prompt-kanji")).toBeVisible();
  await page.getByRole("button", { name: /نمایش پاسخ/ }).click();
  await expect(page.locator(".answer-heading h2")).toBeVisible();
});
