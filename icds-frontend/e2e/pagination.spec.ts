import { test, expect } from "@playwright/test";

test.describe("Pagination", () => {
  const baseUrl = "http://localhost:3000";

  test("should render pagination component", async ({ page }) => {
    await page.goto(baseUrl);
    await expect(page.getByLabel("Pagination Navigation")).toBeVisible();
  });

  test("should default to the first page", async ({ page }) => {
    await page.goto(baseUrl);
    await expect(
      page.getByLabel("Pagination Navigation").locator("a"),
    ).toContainText("Page 1");
  });

  test("should navigate to the next page", async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByLabel("Go to next page").click();
    await page.waitForURL(`${baseUrl}/?page=2`);
    await expect(
      page.getByLabel("Pagination Navigation").locator("a"),
    ).toContainText("Page 2");
  });

  test("should navigate to the previous page", async ({ page }) => {
    await page.goto(`${baseUrl}/?page=2`);
    await page.getByLabel("Go to previous page").click();
    await page.waitForURL(`${baseUrl}/?page=1`);
    await expect(
      page.getByLabel("Pagination Navigation").locator("a"),
    ).toContainText("Page 1");
  });

  test("should update the posts list on page change", async ({ page }) => {
    await page.goto(baseUrl);
    const firstPostOnPage = await page
      .locator("[data-testid=post-item] .card-message")
      .nth(0)
      .allInnerTexts();
    await page.getByLabel("Go to next page").click();
    await page.waitForURL(`${baseUrl}/?page=2`);
    const newPosts = await page
      .locator("[data-testid=post-item] .card-message")
      .nth(0)
      .allInnerTexts();
    expect(newPosts).not.toBe(firstPostOnPage);
  });
});
