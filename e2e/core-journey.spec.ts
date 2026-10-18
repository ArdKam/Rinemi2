import { test, expect } from "@playwright/test";
import fs from "node:fs";

test.beforeEach(() => {
  fs.mkdirSync("artifacts", { recursive: true });
});

test("Today starts a useful session and learning rating advances the queue", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page).toHaveTitle(/Rinemi/);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { name: "امروز، یک قدم به خواندن نزدیک‌تر." })).toBeVisible();
  await expect(page.locator(".hero-kanji-glyph")).toHaveText("日");
  await page.screenshot({ path: "artifacts/today-fa-light.png", fullPage: true });

  await page.getByRole("button", { name: /شروع یادگیری/ }).click();
  await expect(page.locator(".prompt-kanji")).toHaveText("日");
  await page.getByRole("button", { name: /نمایش پاسخ/ }).click();
  await expect(page.getByText("معنای یادگیرنده")).toBeVisible();
  await expect(page.locator(".answer-heading h2")).toHaveText("خورشید؛ روز");
  await page.screenshot({ path: "artifacts/learning-revealed-fa-light.png", fullPage: true });

  await page.getByRole("button", { name: "به یاد آوردم", exact: true }).click();
  await expect(page.locator(".prompt-kanji")).toHaveText("一");
});

test("Explore can search, bookmark, switch language/theme, and fit mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "کاوش" }).click();
  await page.getByPlaceholder("مثلاً 日، nichi، خورشید…").fill("日");
  await expect(page.locator(".kanji-result").first()).toContainText("日");
  await page.locator(".kanji-result").first().click();
  await expect(page.locator(".kanji-detail")).toBeVisible();
  await page.locator(".detail-bookmark").click();
  await expect(page.locator(".detail-bookmark")).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await page.getByRole("button", { name: "Dark mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.screenshot({ path: "artifacts/explore-en-dark-mobile.png", fullPage: true });

  const widths = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);
});
