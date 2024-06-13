import { test, expect } from '@playwright/test';

test.describe('Search', () => {

  // Assuming your test URL is something like http://localhost:3000
  const baseUrl = 'http://localhost:3000';

  test('should render search bar', async ({ page }) => {
    await page.goto(baseUrl);
    const searchBar = page.locator('ic-search-bar');
    await expect(searchBar).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Search' })).toBeVisible();
  });

  test('should update URL with search query', async ({ page }) => {
    await page.goto(baseUrl);
    const searchBar = page.getByRole('textbox', { name: 'Search' })
    await searchBar.fill('test query');
    await page.waitForTimeout(1000); // wait for debounced callback
    const url = page.url();
    expect(url).toContain('query=test+query');
  });

  test('should clear search query from URL', async ({ page }) => {
    await page.goto(baseUrl);
    const searchBar = page.getByRole('textbox', { name: 'Search' })
    await searchBar.fill('test query');
    await page.waitForTimeout(1000); // wait for debounced callback
    const url = page.url();
    expect(url).toContain('query=test+query');
    await searchBar.fill('');
    await page.waitForTimeout(2000); // wait for debounced callback
    const newUrl = page.url();
    expect(newUrl).not.toContain('query=test+query');
  });

  test('should update the posts list based on search query', async ({ page }) => {
    await page.goto(baseUrl);
    const search = 'Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim.'
    const existingPosts = await page.locator('[data-testid=post-item] .card-message' ).nth(0).allInnerTexts();
    expect(existingPosts).not.toContain(search);
    const searchBar = page.getByRole('textbox', { name: 'Search' })
    await searchBar.fill(search);
    await page.waitForTimeout(300); // wait for debounced callback
    await page.waitForURL(`${baseUrl}/?page=1&query=Vivamus+in+felis+eu+sapien+cursus+vestibulum.+Proin+eu+mi.+Nulla+ac+enim.`);
    const newPosts = await page.locator('[data-testid=post-item] .card-message' ).nth(0).allInnerTexts();
    expect(newPosts).toContain(search);
  });

});
