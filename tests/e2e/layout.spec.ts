import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const viewports = [
  { name: "small phone portrait", width: 320, height: 640 },
  { name: "typical phone portrait", width: 390, height: 844 },
  { name: "compact landscape", width: 844, height: 390 },
  { name: "desktop", width: 1365, height: 768 }
];

for (const viewport of viewports) {
  test("layout, card actions and touch targets remain usable at " + viewport.name, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "با یک قدم کوچک شروع کن." })).toBeVisible();

    const pageOverflowsHorizontally = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1
    );
    expect(pageOverflowsHorizontally).toBe(false);

    await page.screenshot({ path: testInfo.outputPath("today.png"), fullPage: true });
    await page.getByRole("button", { name: "شروع مطالعه" }).click();
    await page.getByRole("button", { name: "نمایش پاسخ" }).click();

    const retry = page.getByRole("button", { name: "دوباره" });
    await retry.scrollIntoViewIfNeeded();
    await expect(retry).toBeVisible();

    const geometry = await page.evaluate(() => {
      const action = document.querySelector(".rating-button--again");
      const nav = document.querySelector(".primary-nav");
      if (!action || !nav) throw new Error("Expected review action and primary navigation.");
      const actionRect = action.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      const cardBody = document.querySelector(".study-card__body");
      if (!cardBody) throw new Error("Expected study card body.");
      const cardBodyStyle = getComputedStyle(cardBody);
      const cardBodyGeometry = {
        overflowY: cardBodyStyle.overflowY,
        clientHeight: cardBody.clientHeight,
        scrollHeight: cardBody.scrollHeight
      };
      const buttons = [...document.querySelectorAll("button")].map((button) => {
        const rect = button.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      });
      return {
        actionBottom: actionRect.bottom,
        navTop: navRect.top,
        cardBodyGeometry,
        buttons
      };
    });

    expect(geometry.actionBottom).toBeLessThanOrEqual(geometry.navTop + 1);
    expect(geometry.cardBodyGeometry.overflowY).toBe("visible");
    expect(geometry.cardBodyGeometry.scrollHeight).toBeLessThanOrEqual(geometry.cardBodyGeometry.clientHeight + 1);
    expect(geometry.buttons.every((button) => button.width >= 44 && button.height >= 44)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);

    await page.screenshot({ path: testInfo.outputPath("revealed-card.png"), fullPage: true });
  });
}

test("keyboard focus is visible and the language switch changes direction", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.keyboard.press("Tab");

  const skipLink = page.getByRole("link", { name: "رفتن به محتوای اصلی" });
  await expect(skipLink).toBeFocused();
  expect(await skipLink.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe("solid");

  await page.getByRole("button", { name: "تغییر زبان به انگلیسی" }).click();
  await expect(page.locator(".app-shell")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { name: "Start with one small step." })).toBeVisible();
});

test("light and dark shells have no automated WCAG 2 A/AA violations on primary screens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const todayScan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(todayScan.violations, JSON.stringify(todayScan.violations, null, 2)).toEqual([]);

  await page.getByRole("button", { name: "فعال‌کردن حالت تیره" }).click();
  const darkScan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(darkScan.violations, JSON.stringify(darkScan.violations, null, 2)).toEqual([]);

  await page.getByRole("button", { name: "شروع مطالعه" }).click();
  await page.getByRole("button", { name: "نمایش پاسخ" }).click();
  const cardScan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(cardScan.violations, JSON.stringify(cardScan.violations, null, 2)).toEqual([]);
});