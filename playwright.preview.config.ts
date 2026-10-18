import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "preview-live.spec.ts",
  fullyParallel: false,
  forbidOnly: true,
  retries: 1,
  reporter: "list",
  use: {
    baseURL: process.env.RINEMI_DEPLOY_URL ?? "https://ardkam.github.io/Rinemi2/",
    trace: "retain-on-failure"
  }
});
