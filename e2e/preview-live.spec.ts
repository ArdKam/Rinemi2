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
