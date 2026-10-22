import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";

test.beforeEach(async ({ page }) => {
  fs.mkdirSync("artifacts", { recursive: true });
  await page.addInitScript(() => {
    if (!localStorage.getItem("rinemi.theme")) localStorage.setItem("rinemi.theme", "light");
  });
});

test("global footer credits KANJIDIC2 and links its official license and source record", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator(".app-footer");
  await expect(footer).toContainText("KANJIDIC2");
  await expect(footer).toContainText("EDRDG");
  await expect(footer.getByRole("link", { name: "مجوز رسمی EDRDG" })).toHaveAttribute("href", "https://www.edrdg.org/edrdg/licence.html");
  await expect(footer.getByRole("link", { name: "ثبت منابع داده" })).toHaveAttribute("href", "https://github.com/ArdKam/Rinemi2/blob/main/docs/DATA-SOURCES.md");
});

test("both brand marks load in light and dark themes", async ({ page }) => {
  const brandResponses = new Map<string, number>();
  page.on("response", response => {
    const pathname = new URL(response.url()).pathname;
    if (pathname.endsWith("/brand/rinemi-mark.svg") || pathname.endsWith("/brand/rinemi-mark-dark.svg")) {
      brandResponses.set(pathname, response.status());
    }
  });

  await page.goto("/");
  const lightMark = page.locator(".brand-mark-light");
  const darkMark = page.locator(".brand-mark-dark");

  await expect.poll(() => lightMark.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect.poll(() => darkMark.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(lightMark).toBeVisible();
  await expect(darkMark).toBeHidden();

  await page.getByRole("button", { name: "حالت تیره" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(lightMark).toBeHidden();
  await expect(darkMark).toBeVisible();

  expect(brandResponses.get("/brand/rinemi-mark.svg")).toBe(200);
  expect(brandResponses.get("/brand/rinemi-mark-dark.svg")).toBe(200);
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
  await expect(page.locator(".first-session-note")).toBeVisible();
  await expect(page.locator(".overview-metrics")).toHaveCount(0);
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



test("collection rename and bulk clear preserve bookmarks and review history", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "کاوش" }).click();
  await page.getByPlaceholder("مثلاً 日، nichi، خورشید…").fill("日");
  await page.locator(".kanji-result").first().click();

  await page.getByRole("button", { name: /مجموعه‌های شخصی/ }).click();
  await page.getByLabel("نام مجموعه").fill("کانجی‌های روزانه");
  await page.getByRole("button", { name: "ساخت مجموعه" }).click();
  await expect(page.getByText("مجموعه ساخته شد.")).toBeVisible();

  const collectionRow = page.locator(".collection-row").first();
  await page.locator(".detail-collection-control button").click();
  await expect(page.getByText("کانجی به مجموعه افزوده شد.")).toBeVisible();

  await collectionRow.getByRole("button", { name: "تغییر نام" }).click();
  await collectionRow.locator("input").fill("کانجی‌های ضروری");
  await collectionRow.getByRole("button", { name: "ذخیره نام" }).click();
  await expect(collectionRow.locator(".collection-open")).toContainText("کانجی‌های ضروری");
  await expect(page.getByText("نام مجموعه تغییر کرد.")).toBeVisible();

  const before = await page.evaluate(() => {
    const parsed = JSON.parse(localStorage.getItem("rinemi2:local:v2") || "{}");
    return { reviews: parsed.reviews, bookmarks: parsed.bookmarks };
  });
  page.once("dialog", dialog => dialog.accept());
  await collectionRow.getByRole("button", { name: "حذف همهٔ موارد" }).click();
  await expect(page.getByText("همهٔ کانجی‌ها از مجموعه حذف شدند.")).toBeVisible();

  const after = await page.evaluate(() => {
    const parsed = JSON.parse(localStorage.getItem("rinemi2:local:v2") || "{}");
    return { reviews: parsed.reviews, bookmarks: parsed.bookmarks, collection: parsed.collections[0] };
  });
  expect(after.collection.name).toBe("کانجی‌های ضروری");
  expect(after.collection.characters).toEqual([]);
  expect(after.reviews).toEqual(before.reviews);
  expect(after.bookmarks).toEqual(before.bookmarks);
});


test("local backup can be downloaded, validated in preview, and restored after confirmation", async ({ page }) => {
  await page.goto("/");
  await page.locator(".data-tools-toggle").click();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "دانلود پشتیبان" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename().startsWith("rinemi-local-backup-")).toBe(true);
  expect(download.suggestedFilename().endsWith(".json")).toBe(true);
  const downloadPath = await download.path();
  expect(downloadPath).not.toBeNull();
  const exported = JSON.parse(fs.readFileSync(downloadPath!, "utf8"));
  expect(exported.format).toBe("rinemi2-local-backup");
  expect(exported.schemaVersion).toBe(1);
  expect(exported.data.version).toBe(2);

  const backup = {
    format: "rinemi2-local-backup",
    schemaVersion: 1,
    exportedAt: "2026-10-19T00:00:00.000Z",
    data: {
      version: 2,
      language: "en",
      theme: "dark",
      bookmarks: ["日"],
      collections: [{
        id: "restored-set",
        name: "Restored collection",
        characters: ["日"],
        createdAt: "2026-10-18T00:00:00.000Z",
        updatedAt: "2026-10-18T00:00:00.000Z"
      }],
      reviews: {}
    }
  };
  await page.locator(".data-upload-control input").setInputFiles({
    name: "rinemi-backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(backup))
  });
  await expect(page.getByText("فایل بررسی شد؛ هنوز هیچ داده‌ای تغییر نکرده است.")).toBeVisible();
  await expect(page.locator(".data-backup-preview")).toContainText("Restored collection");
  const restoreButton = page.getByRole("button", { name: "جایگزینی با پشتیبان" });
  await expect(restoreButton).toBeEnabled();
  page.once("dialog", dialog => dialog.accept());
  await restoreButton.click();
  await expect(page.getByText("Backup replaced the local data.")).toBeVisible();

  const restored = await page.evaluate(() => JSON.parse(localStorage.getItem("rinemi2:local:v2") || "{}"));
  expect(restored.language).toBe("en");
  expect(restored.theme).toBe("dark");
  expect(restored.bookmarks).toEqual(["日"]);
  expect(restored.collections[0].name).toBe("Restored collection");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
});

test("invalid backup is rejected without replacing existing local data", async ({ page }) => {
  await page.goto("/");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("rinemi2:local:v2"))).not.toBeNull();
  const before = await page.evaluate(() => localStorage.getItem("rinemi2:local:v2"));
  await page.locator(".data-tools-toggle").click();
  await page.locator(".data-upload-control input").setInputFiles({
    name: "invalid.json",
    mimeType: "application/json",
    buffer: Buffer.from("{not-json")
  });
  await expect(page.getByRole("alert")).toHaveText("فایل پشتیبان JSON معتبر نیست.");
  await expect(page.getByRole("button", { name: "جایگزینی با پشتیبان" })).toBeDisabled();
  const after = await page.evaluate(() => localStorage.getItem("rinemi2:local:v2"));
  expect(after).toBe(before);
});

test("local data erasure clears review, bookmark, collection, legacy and theme preferences", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("rinemi2:local:v2", JSON.stringify({
      version: 2,
      language: "en",
      theme: "dark",
      bookmarks: ["日"],
      collections: [{
        id: "old",
        name: "Old set",
        characters: ["日"],
        createdAt: "2026-10-18T00:00:00.000Z",
        updatedAt: "2026-10-18T00:00:00.000Z"
      }],
      reviews: { "日": { card: { due: "2026-10-20T00:00:00.000Z", state: 2 }, reviews: 3, lapses: 0, lastReviewedAt: "2026-10-18T00:00:00.000Z" } }
    }));
    localStorage.setItem("rinemi2:local:v1", JSON.stringify({ version: 1, language: "fa", theme: "light", bookmarks: ["一"], reviews: {} }));
    localStorage.setItem("rinemi.theme", "dark");
  });
  await page.goto("/");
  await page.locator(".data-tools-toggle").click();
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Erase this browser's data" }).click();
  await expect(page.getByText("Local learner data was erased.")).toBeVisible();

  const state = await page.evaluate(() => ({
    store: JSON.parse(localStorage.getItem("rinemi2:local:v2") || "{}"),
    legacy: localStorage.getItem("rinemi2:local:v1"),
    theme: localStorage.getItem("rinemi.theme")
  }));
  expect(state.store.bookmarks).toEqual([]);
  expect(state.store.collections).toEqual([]);
  expect(state.store.reviews).toEqual({});
  expect(state.legacy).toBeNull();
  expect(state.theme).toBe("system");
});




for (const viewport of [
  { name: "320px phone", width: 320, height: 640 },
  { name: "390px phone", width: 390, height: 844 }
]) {
  test("mobile Explore restores scroll and supports browser Back, Escape, and its Back action at " + viewport.name, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");
    await page.getByRole("button", { name: "کاوش" }).click();
    const query = page.getByPlaceholder("مثلاً 日، nichi، خورشید…");
    await query.fill("a");
    const results = page.locator(".kanji-result");
    await expect.poll(() => results.count()).toBeGreaterThan(12);

    const chosen = results.nth(12);
    const character = await chosen.locator(".result-glyph").textContent();
    await chosen.scrollIntoViewIfNeeded();
    const returnScrollY = await page.evaluate(() => window.scrollY);
    await chosen.click();
    await expect(page.locator(".explore-layout")).toHaveClass(/is-mobile-detail/);
    await expect(page.locator(".kanji-results")).toBeHidden();
    await expect(page.locator(".kanji-detail")).toBeVisible();
    await expect(page.locator(".kanji-detail")).toBeFocused();
    await expect(page.locator(".detail-character")).toHaveText(character ?? "");

    // Selecting a result on mobile must show its detail before secondary
    // collection and Anki tools; learners should not scroll past those tools.
    const detailTop = await page.locator(".kanji-detail").evaluate(element => element.getBoundingClientRect().top);
    const collectionsTop = await page.locator(".collections-entry").evaluate(element => element.getBoundingClientRect().top);
    const ankiTop = await page.locator(".anki-import-entry").evaluate(element => element.getBoundingClientRect().top);
    expect(detailTop, "Selected kanji detail precedes collections controls").toBeLessThan(collectionsTop);
    expect(detailTop, "Selected kanji detail precedes Anki preview tools").toBeLessThan(ankiTop);
    await expect(page.getByRole("button", { name: "بازگشت به نتایج" })).toBeVisible();
    // Full-page captures of fixed skip links are only representative from scroll origin.
    await page.evaluate(() => { document.documentElement.scrollTop = 0; document.body.scrollTop = 0; });
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await page.screenshot({ path: testInfo.outputPath("selected-detail-before-secondary-tools.png"), fullPage: true });

    // Browser Back should dismiss the mobile detail state rather than leave Explore.
    await page.evaluate(() => window.history.back());
    await expect(page.locator(".explore-layout")).not.toHaveClass(/is-mobile-detail/);
    await expect(page.locator(".kanji-results")).toBeVisible();
    await expect(query).toHaveValue("a");
    await expect(page.locator(".kanji-result.is-selected .result-glyph")).toHaveText(character ?? "");
    await expect(page.locator(".kanji-result.is-selected")).toBeFocused();
    await expect.poll(async () => Math.abs(await page.evaluate(() => window.scrollY) - returnScrollY)).toBeLessThan(3);

    // Escape follows the same return path and preserves the result context.
    await page.locator(".kanji-result.is-selected").click();
    await expect(page.locator(".explore-layout")).toHaveClass(/is-mobile-detail/);
    await page.keyboard.press("Escape");
    await expect(page.locator(".explore-layout")).not.toHaveClass(/is-mobile-detail/);
    await expect(page.locator(".kanji-result.is-selected")).toBeFocused();
    await expect.poll(async () => Math.abs(await page.evaluate(() => window.scrollY) - returnScrollY)).toBeLessThan(3);

    // The explicit Back action must also return focus and scroll to the originating result.
    await page.locator(".kanji-result.is-selected").click();
    await expect(page.locator(".explore-layout")).toHaveClass(/is-mobile-detail/);
    await page.getByRole("button", { name: "بازگشت به نتایج" }).click();
    await expect(page.locator(".explore-layout")).not.toHaveClass(/is-mobile-detail/);
    await expect(page.locator(".kanji-result.is-selected")).toBeFocused();
    await expect.poll(async () => Math.abs(await page.evaluate(() => window.scrollY) - returnScrollY)).toBeLessThan(3);
  });
}


test("English mobile Explore shows selected detail before secondary tools", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to English", exact: true }).click();
  await page.getByRole("button", { name: "Explore", exact: true }).click();
  const query = page.getByPlaceholder("Try 日, nichi, sun…");
  await query.fill("a");
  const result = page.locator(".kanji-result").first();
  await expect(result).toBeVisible();
  await result.click();
  await expect(page.locator(".kanji-detail")).toBeVisible();
  const detailTop = await page.locator(".kanji-detail").evaluate(element => element.getBoundingClientRect().top);
  const collectionsTop = await page.locator(".collections-entry").evaluate(element => element.getBoundingClientRect().top);
  const ankiTop = await page.locator(".anki-import-entry").evaluate(element => element.getBoundingClientRect().top);
  expect(detailTop, "LTR detail appears before collections").toBeLessThan(collectionsTop);
  expect(detailTop, "LTR detail appears before Anki tools").toBeLessThan(ankiTop);
  await expect(page.getByRole("button", { name: "Back to results", exact: true })).toBeVisible();
  // Full-page captures of fixed skip links are only representative from scroll origin.
  await page.evaluate(() => { document.documentElement.scrollTop = 0; document.body.scrollTop = 0; });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.screenshot({ path: testInfo.outputPath("selected-detail-before-secondary-tools.png"), fullPage: true });
  await page.getByRole("button", { name: "Back to results", exact: true }).click();
  await expect(page.locator(".kanji-results")).toBeVisible();
  await page.evaluate(() => { document.documentElement.scrollTop = 0; document.body.scrollTop = 0; });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.screenshot({ path: testInfo.outputPath("return-to-results.png"), fullPage: true });
});

test("Explore continues past 240 results and exposes a reading cue on each result row", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "کاوش" }).click();
  await expect(page.locator(".kanji-result")).toHaveCount(60);
  await expect(page.locator(".result-reading").first()).toBeVisible();

  for (let pageNumber = 0; pageNumber < 4; pageNumber += 1) {
    await page.locator(".load-more-results").click();
  }
  await expect(page.locator(".kanji-result")).toHaveCount(300);
  await expect(page.locator(".load-more-results")).toBeVisible();
  await expect(page.locator(".list-limit")).toHaveCount(0);
  await expect(page.locator(".result-count[role=\"status\"]")).toContainText("از");
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

    if (viewport.width <= 680) {
      const headerLayout = await page.evaluate(() => {
        const rect = (selector: string) => {
          const element = document.querySelector(selector);
          if (!element) return null;
          const box = element.getBoundingClientRect();
          return { x: box.x, y: box.y, width: box.width, height: box.height };
        };
        return {
          header: rect(".app-header"),
          brand: rect(".brand-lockup"),
          tools: rect(".header-tools"),
          nav: rect(".primary-nav"),
          viewportWidth: window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth
        };
      });
      expect(headerLayout.brand, "Mobile brand remains rendered").not.toBeNull();
      expect(headerLayout.tools, "Mobile utility controls remain rendered").not.toBeNull();
      expect(headerLayout.nav, "Mobile primary navigation remains rendered").not.toBeNull();
      expect(Math.abs(headerLayout.brand!.y - headerLayout.tools!.y), "Brand and utilities share the top header row").toBeLessThanOrEqual(2);
      expect(headerLayout.nav!.y, "Primary navigation occupies the second row").toBeGreaterThan(headerLayout.brand!.y + headerLayout.brand!.height - 1);
      expect(headerLayout.header!.height, "The mobile header avoids a third row").toBeLessThanOrEqual(120);
      expect(headerLayout.scrollWidth, "The two-row header does not create horizontal overflow").toBeLessThanOrEqual(headerLayout.viewportWidth + 1);
    }

    await page.screenshot({ path: testInfo.outputPath("today.png"), fullPage: true });

    if (viewport.width <= 680) {
      const overviewPadding = await page.locator(".overview-copy").evaluate(element => {
        const style = getComputedStyle(element);
        return Math.min(parseFloat(style.paddingInlineStart), parseFloat(style.paddingInlineEnd));
      });
      expect(overviewPadding, "Today content remains inset from the card edge on mobile").toBeGreaterThanOrEqual(12);
    }

    await page.getByRole("button", { name: /شروع یادگیری/ }).click();
    await expect(page.locator("#learn-title")).toBeFocused();
    await expect(page.locator(".skip-link")).not.toBeFocused();
    await expect(page.locator(".prompt-kanji")).toHaveText("日");
    await page.getByRole("button", { name: /نمایش پاسخ/ }).click();
    await expect(page.locator("#answer-meaning-title")).toBeFocused();
    await expect(page.locator(".skip-link")).not.toBeFocused();
    const skipLinkBottom = await page.locator(".skip-link").evaluate(element => element.getBoundingClientRect().bottom);
    expect(skipLinkBottom, "The skip link stays hidden after the reveal control is removed").toBeLessThanOrEqual(0);
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
    // Capture the full page from scroll origin. A fullPage screenshot taken after
    // scrolling to the ratings can composite fixed-position off-canvas links at
    // that scroll offset even when the link is correctly hidden in the viewport.
    await page.evaluate(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
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


test("all language/theme pairs render and keep browser chrome color synchronized", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const combinations = [
    { language: "fa", theme: "light", direction: "rtl" },
    { language: "fa", theme: "dark", direction: "rtl" },
    { language: "en", theme: "light", direction: "ltr" },
    { language: "en", theme: "dark", direction: "ltr" }
  ] as const;

  for (const combination of combinations) {
    await page.goto("/");
    await page.evaluate(({ language, theme }) => {
      const previous = JSON.parse(localStorage.getItem("rinemi2:local:v2") || "{}");
      localStorage.setItem("rinemi.theme", theme);
      localStorage.setItem("rinemi2:local:v2", JSON.stringify({
        ...previous,
        version: 2,
        language,
        theme,
        bookmarks: previous.bookmarks ?? [],
        collections: previous.collections ?? [],
        reviews: previous.reviews ?? {}
      }));
    }, combination);
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("dir", combination.direction);
    await expect(page.locator("html")).toHaveAttribute("data-theme", combination.theme);
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      combination.theme === "dark" ? "#1D2022" : "#F7F4EE"
    );
    await expect(page.getByRole("button", { name: combination.language === "fa" ? "یادگیری" : "Learn", exact: true })).toBeVisible();
    await page.screenshot({ path: `artifacts/theme-${combination.language}-${combination.theme}.png`, fullPage: true });
  }
});

test("system theme follows OS preference changes and can be persisted as an explicit preference", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await page.evaluate(() => {
    const previous = JSON.parse(localStorage.getItem("rinemi2:local:v2") || "{}");
    localStorage.setItem("rinemi.theme", "system");
    localStorage.setItem("rinemi2:local:v2", JSON.stringify({ ...previous, version: 2, language: "fa", theme: "system" }));
  });
  await page.reload();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#1D2022");

  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#F7F4EE");

  await page.getByRole("button", { name: "حالت روشن" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("rinemi.theme"))).toBe("light");
});

test("saved language and theme are applied before the React module boots", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("rinemi2:local:v2", JSON.stringify({
      version: 2,
      language: "en",
      theme: "dark",
      bookmarks: [],
      collections: [],
      reviews: {}
    }));
    localStorage.setItem("rinemi.theme", "dark");
  });
  await page.route("**/src/main.tsx", route => route.abort());
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});


test("forced-colors mode uses system colors and keeps keyboard focus visible", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "امروز، یک قدم به خواندن نزدیک‌تر." })).toBeVisible();
  const start = page.getByRole("button", { name: /شروع یادگیری/ });
  await start.focus();

  const state = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const button = document.querySelector<HTMLButtonElement>(".button-primary");
    if (!button) throw new Error("Primary learning action is missing");
    const buttonStyle = getComputedStyle(button);
    return {
      forcedColors: matchMedia("(forced-colors: active)").matches,
      canvasToken: root.getPropertyValue("--rinemi-color-bg-canvas").trim(),
      textToken: root.getPropertyValue("--rinemi-color-text-primary").trim(),
      focusToken: root.getPropertyValue("--rinemi-color-focus-ring").trim(),
      pageBackground: root.backgroundColor,
      pageText: root.color,
      actionBackground: buttonStyle.backgroundColor,
      actionText: buttonStyle.color,
      focusStyle: buttonStyle.outlineStyle,
      focusWidth: buttonStyle.outlineWidth,
      focusColor: buttonStyle.outlineColor,
      actionShadow: buttonStyle.boxShadow
    };
  });

  expect(state.forcedColors).toBe(true);
  expect(state.canvasToken).toBe("Canvas");
  expect(state.textToken).toBe("CanvasText");
  expect(state.focusToken).toBe("Highlight");
  expect(state.pageBackground).not.toBe("rgba(0, 0, 0, 0)");
  expect(state.pageText).not.toBe(state.pageBackground);
  expect(state.actionBackground).not.toBe("rgba(0, 0, 0, 0)");
  expect(state.actionText).not.toBe(state.actionBackground);
  expect(state.focusStyle).toBe("solid");
  expect(state.focusWidth).toBe("2px");
  expect(state.focusColor).not.toBe("rgba(0, 0, 0, 0)");
  expect(state.actionShadow).toBe("none");

  // Secondary links must remain readable when hovered under user-selected high-contrast palettes.
  await page.getByRole("button", { name: "کاوش" }).click();
  await page.getByPlaceholder("مثلاً 日، nichi، خورشید…").fill("日");
  await page.locator(".kanji-result").first().click();
  const bookmark = page.locator(".detail-bookmark");
  await bookmark.hover();
  const secondaryState = await bookmark.evaluate(button => {
    const root = getComputedStyle(document.documentElement);
    const style = getComputedStyle(button);
    return {
      hoverBackgroundToken: root.getPropertyValue("--rinemi-color-action-secondary-hover-bg").trim(),
      pageBackground: root.backgroundColor,
      buttonBackground: style.backgroundColor,
      buttonText: style.color
    };
  });
  expect(secondaryState.hoverBackgroundToken).toBe("Canvas");
  expect(secondaryState.buttonBackground).toBe(secondaryState.pageBackground);
  expect(secondaryState.buttonText).not.toBe(secondaryState.buttonBackground);
});
