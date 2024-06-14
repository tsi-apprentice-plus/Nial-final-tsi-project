import { test, expect } from "@playwright/test";
import { v4 } from "uuid";

test("Create Post, Search and Like", async ({ page }) => {
  const testuuid = v4();
  await page.goto("http://localhost:3000/");
  await page.getByLabel("Create Post").click();
  const postContent = `playwright test ${testuuid}`;
  await page.getByLabel("Create Post").fill(postContent);
  await page.getByRole("button", { name: "Submit" }).click();
  await page.getByRole("textbox", { name: "Search" }).click();
  await page.getByRole("textbox", { name: "Search" }).fill(postContent);
  await page.waitForTimeout(2000); // wait for search results to load and debounce to finish
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.locator("ic-card")).toContainText(postContent);
  const likeButton = page.getByTestId("like-button");
  await expect(likeButton).toBeVisible();
  await expect(likeButton).toContainText("0");
  await likeButton.click();
  await expect(likeButton).toContainText("1");
});
