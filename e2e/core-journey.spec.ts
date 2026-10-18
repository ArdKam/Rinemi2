import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";

test.beforeEach(() => {
  fs.mkdirSync("artifacts", { recursive: true });
});

test("Today starts a useful session and learning rating advances the queue", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page).toHaveTitle(/Rinemi/);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator(".brand-mark-light")).toBeVisible();
  const serifState = await page.evaluate(async () => {
    await document.fonts.ready;
    return Array.from(document.fonts).find(face => face.family.includes("Noto Serif JP"))?.status ?? "missing";
  });
  expect(serifState).toBe("loaded");
  await expect(page.getByRole("heading", { name: "امروز، یک قدم به خواندن نزدیک‌تر." })).toBeVisible();
  await expect(page.locator(".hero-kanji-glyph")).toHaveText("日");
  await page.screenshot({ path: "artifacts/today-fa-light.png", fullPage: true });

  await page.getByRole("button", { name: /شروع یادگیری/ }).click();
  await expect(page.locator(".session-counter")).toHaveText("۱ / ۵");
  await expect(page.locator(".prompt-kanji")).toHaveText("日");
  await page.getByRole("button", { name: /نمایش پاسخ/ }).click();
  await expect(page.getByText("معنای فارسی آغازین")).toBeVisible();
  await expect(page.locator(".answer-heading h2")).toHaveText("خورشید؛ روز");
  await page.screenshot({ path: "artifacts/learning-revealed-fa-light.png", fullPage: true });

  await page.locator(".rating-good").click();
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

test("personal collections can add, filter, and remove kanji without altering bookmarks or review state", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "کاوش" }).click();
  await page.getByPlaceholder("مثلاً 日، nichi، خورشید…").fill("日");
  await page.locator(".kanji-result").first().click();
  await page.locator(".detail-bookmark").click();
  await expect(page.locator(".detail-bookmark")).toHaveAttribute("aria-pressed", "true");

  const before = await page.evaluate(() => {
    const parsed = JSON.parse(localStorage.getItem("rinemi2:local:v2") || "{}");
    return { reviews: parsed.reviews, bookmarks: parsed.bookmarks };
  });

  await page.getByRole("button", { name: /مجموعه‌های شخصی/ }).click();
  await page.getByLabel("نام مجموعه").fill("کانجی‌های مهم");
  await page.getByRole("button", { name: "ساخت مجموعه" }).click();
  await expect(page.getByText("مجموعه ساخته شد.")).toBeVisible();

  await page.locator(".detail-collection-control select").selectOption({ index: 1 });
  await page.getByRole("button", { name: "افزودن به مجموعه" }).click();
  await expect(page.getByText("کانجی به مجموعه افزوده شد.")).toBeVisible();

  await page.getByRole("button", { name: /کانجی‌های مهم/ }).click();
  await page.screenshot({ path: "artifacts/collections-fa-light.png", fullPage: true });
  await expect(page.locator(".kanji-result")).toHaveCount(1);
  await expect(page.locator(".kanji-result").first()).toContainText("日");

  await page.locator(".detail-collection-control button").click();
  await expect(page.getByText("کانجی از مجموعه حذف شد.")).toBeVisible();
  await expect(page.locator(".kanji-result")).toHaveCount(0);

  const after = await page.evaluate(() => {
    const parsed = JSON.parse(localStorage.getItem("rinemi2:local:v2") || "{}");
    return { reviews: parsed.reviews, bookmarks: parsed.bookmarks, collections: parsed.collections };
  });
  expect(after.reviews).toEqual(before.reviews);
  expect(after.bookmarks).toEqual(before.bookmarks);
  expect(after.bookmarks).toContain("日");
  expect(after.collections[0].characters).toEqual([]);
});


for (const viewport of [
  { name: "small phone portrait", width: 320, height: 640 },
  { name: "typical phone portrait", width: 390, height: 844 },
  { name: "compact landscape", width: 844, height: 390 },
  { name: "desktop", width: 1365, height: 768 }
]) {
  test("responsive layout and review actions remain usable at " + viewport.name, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "امروز، یک قدم به خواندن نزدیک‌تر." })).toBeVisible();

    const overflowsBefore = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflowsBefore, "No horizontal overflow on Today").toBe(false);
    await page.screenshot({ path: testInfo.outputPath("today.png"), fullPage: true });

    await page.getByRole("button", { name: /شروع یادگیری/ }).click();
    await expect(page.locator(".prompt-kanji")).toHaveText("日");
    await page.getByRole("button", { name: /نمایش پاسخ/ }).click();
    const again = page.getByRole("button", { name: /دوباره/ });
    await again.scrollIntoViewIfNeeded();
    await expect(again).toBeVisible();

    const measurements = await page.evaluate(() => {
      const targets = [...document.querySelectorAll("button, select, input:not([type='checkbox'])")]
        .filter(element => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden";
        })
        .map(element => {
          const rect = element.getBoundingClientRect();
          return { tag: element.tagName, label: element.getAttribute("aria-label") || element.textContent?.trim() || "", width: rect.width, height: rect.height };
        });
      const checkboxLabel = document.querySelector(".saved-filter")?.getBoundingClientRect();
      return {
        width: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        targets,
        checkboxLabel: checkboxLabel ? { width: checkboxLabel.width, height: checkboxLabel.height } : null
      };
    });
    expect(measurements.width).toBeLessThanOrEqual(measurements.viewportWidth + 1);
    expect(measurements.targets.filter(target => target.width < 44 || target.height < 44), JSON.stringify(measurements.targets, null, 2)).toEqual([]);
    expect(measurements.checkboxLabel === null || measurements.checkboxLabel.height >= 44).toBe(true);
    await page.screenshot({ path: testInfo.outputPath("revealed-card.png"), fullPage: true });
  });
}

test("primary screens pass automated WCAG 2.1/2.2 A/AA checks", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  async function expectNoViolations(label: string) {
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(scan.violations, label + "\n" + JSON.stringify(scan.violations, null, 2)).toEqual([]);
  }

  await expectNoViolations("Today · Persian · light");
  await page.getByRole("button", { name: /شروع یادگیری/ }).click();
  await page.getByRole("button", { name: /نمایش پاسخ/ }).click();
  await expectNoViolations("Learning · Persian · light");

  await page.getByRole("button", { name: "کاوش" }).click();
  await page.getByRole("button", { name: "Switch to English" }).click();
  await page.getByRole("button", { name: "Dark mode" }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await expectNoViolations("Explore · English · dark · mobile");
});
