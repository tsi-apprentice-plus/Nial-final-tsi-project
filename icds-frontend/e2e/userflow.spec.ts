import { test, expect } from "@playwright/test";
import { v4 } from "uuid";

test("test", async ({ page }) => {
  const testuuid = v4();
  await page.goto("http://localhost:3000/");
  await page.getByLabel("Create Post").click();
  await page.getByLabel("Create Post").fill(`playwright test ${testuuid}`);
  await page.getByRole("button", { name: "Submit" }).click();
  await page.getByRole("textbox", { name: "Search" }).click();
  await page
    .getByRole("textbox", { name: "Search" })
    .fill(`playwright test ${testuuid}`);
  await page.waitForTimeout(2000); // wait for search results to load and debounce to finish
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.locator("ic-card")).toContainText(
    `playwright test ${testuuid}`,
  );
  await expect(page.getByRole("button", { name: "Likes" })).toBeVisible();
  await expect(page.locator("ic-card")).toContainText("0 Likes");
  await page.getByRole("button", { name: "Likes" }).click();
  await expect(page.locator("ic-card")).toContainText("1 Likes");
});
