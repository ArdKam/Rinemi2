import { test, expect } from "@playwright/test";

const sampleText = [
  "#separator:Tab",
  "#columns:Front\tBack\tTags\tDeck",
  "#tags column:3",
  "#deck column:4",
  "日本\tJapan\tbeginner\tJapanese::Kanji",
  "日本\tJapan duplicate\tbeginner\tJapanese::Kanji",
  "一\tone\tn5\tJapanese::Kanji"
].join("\n");

test("Anki text preview maps content fields and reports duplicates without writing learner data", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "کاوش" }).click();
  await page.getByRole("button", { name: "پیش‌نمایش Anki" }).click();

  await expect.poll(() => page.evaluate(() => localStorage.getItem("rinemi2:local:v2"))).not.toBeNull();
  const before = await page.evaluate(() => localStorage.getItem("rinemi2:local:v2"));

  await page.locator(".anki-file-control input").setInputFiles({
    name: "kanji-export.txt",
    mimeType: "text/plain",
    buffer: Buffer.from(sampleText, "utf8")
  });

  await expect(page.locator(".anki-preview-table tbody tr")).toHaveCount(3);
  await expect(page.locator(".anki-preview-table")).toContainText("日本");
  await expect(page.locator(".anki-preview-table")).toContainText("Japan");
  await expect(page.locator(".anki-preview-table")).toContainText("Japanese::Kanji");
  await expect(page.getByText("مقدار فیلد اول در این فایل تکراری است")).toBeVisible();
  await expect(page.locator(".anki-import-safe-note")).toContainText("هنوز هیچ یادداشت یا کارت زمان‌بندی‌شده‌ای وارد نمی‌شود");

  const selects = page.locator(".anki-field-mapping select");
  await selects.nth(0).selectOption("1");
  await expect(page.locator(".anki-preview-table tbody tr").first().locator("td").nth(1)).toHaveText("Japan");

  const after = await page.evaluate(() => localStorage.getItem("rinemi2:local:v2"));
  expect(after).toBe(before);
});

test("Anki text preview rejects undelimited input and leaves learner data unchanged", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "کاوش" }).click();
  await page.getByRole("button", { name: "پیش‌نمایش Anki" }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("rinemi2:local:v2"))).not.toBeNull();
  const before = await page.evaluate(() => localStorage.getItem("rinemi2:local:v2"));

  await page.locator(".anki-file-control input").setInputFiles({
    name: "unsupported.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("single column with no delimiter", "utf8")
  });
  await expect(page.getByRole("alert")).toHaveText("جداکنندهٔ ستون‌ها قابل تشخیص نیست؛ یک فایل متنی جداشده با تب یا جداکنندهٔ پشتیبانی‌شده انتخاب کن.");
  await expect(page.locator(".anki-preview-table")).toHaveCount(0);
  const after = await page.evaluate(() => localStorage.getItem("rinemi2:local:v2"));
  expect(after).toBe(before);
});
