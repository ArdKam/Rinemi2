import { test, expect } from "@playwright/test";

test("Space respects focused native controls while remaining a recall shortcut off controls", async ({ page }) => {
  await page.goto("/");
  const start = page.getByRole("button", { name: /شروع یادگیری/ });
  await start.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".prompt-kanji")).toHaveText("日");

  // Space on the actual back button must activate it, not be stolen by the global reveal shortcut.
  const back = page.locator(".learn-topline button");
  await back.focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("heading", { name: "امروز، یک قدم به خواندن نزدیک‌تر." })).toBeVisible();

  // Starting a session with the keyboard removes the focused button; Space can then reveal the prompt.
  await page.getByRole("button", { name: /شروع یادگیری/ }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".prompt-kanji")).toHaveText("日");
  await page.keyboard.press("Space");
  await expect(page.locator(".answer-heading h2")).toHaveText("خورشید؛ روز");
});

test("a review rating does not advance the session when local persistence fails", async ({ page }) => {
  await page.addInitScript(() => {
    const nativeSetItem = Storage.prototype.setItem;
    Object.defineProperty(window, "__failRinemiStoreWrites", { value: false, writable: true, configurable: true });
    Storage.prototype.setItem = function (key: string, value: string) {
      const shouldFail = (window as unknown as { __failRinemiStoreWrites?: boolean }).__failRinemiStoreWrites;
      if (shouldFail && key === "rinemi2:local:v2") throw new Error("simulated storage quota failure");
      return nativeSetItem.call(this, key, value);
    };
  });

  await page.goto("/");
  await page.getByRole("button", { name: /شروع یادگیری/ }).click();
  await page.getByRole("button", { name: /نمایش پاسخ/ }).click();
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem("rinemi2:local:v2") || "{}"));
  await page.evaluate(() => { (window as unknown as { __failRinemiStoreWrites: boolean }).__failRinemiStoreWrites = true; });

  await page.locator(".rating-good").click();
  await expect(page.locator(".prompt-kanji")).toHaveText("日");
  await expect(page.locator(".answer-heading h2")).toHaveText("خورشید؛ روز");
  await expect(page.locator(".status-banner")).toContainText("ذخیره‌سازی محلی");
  const afterFailure = await page.evaluate(() => JSON.parse(localStorage.getItem("rinemi2:local:v2") || "{}"));
  expect(afterFailure.reviews).toEqual(before.reviews);

  await page.evaluate(() => { (window as unknown as { __failRinemiStoreWrites: boolean }).__failRinemiStoreWrites = false; });
  await page.locator(".rating-good").click();
  await expect(page.locator(".prompt-kanji")).toHaveText("一");
  const afterRetry = await page.evaluate(() => JSON.parse(localStorage.getItem("rinemi2:local:v2") || "{}"));
  expect(afterRetry.reviews["日"].reviews).toBe(1);
});
