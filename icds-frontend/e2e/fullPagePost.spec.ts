import { test, expect } from "@playwright/test";
import { v4 } from "uuid";

test.describe('Full Page View', () => {
// http://localhost:3000/posts/66617587e22163b194d2f799
  const baseUrl = 'http://localhost:3000';
  const postId = '66617587e22163b194d2f799';
  test('should render full post view with initial data', async ({ page }) => {
    await page.goto(`${baseUrl}/posts/${postId}`);
    
    await expect(page.getByText("User 42")).toBeVisible(); //posting user
    await expect(page.getByText('In quis justo.')).toBeVisible(); //post content
    await expect(page.getByRole('button', { name: '3' })).toBeVisible(); //like button
    await expect(page.getByText("User 45")).toBeVisible(); //commenting user
    await expect(page.getByText('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.')).toBeVisible(); //comment content
  });

  test('should like and unlike the post', async ({ page }) => {
    await page.goto(`${baseUrl}/posts/${postId}`);
    
    const likeButton = page.getByRole('button', { name: '3' });
    await likeButton.click();
    await expect(page.locator('text=4')).toBeVisible();
    
    await likeButton.click();
    await expect(page.locator('text=3')).toBeVisible();
  });

  test('should add a new comment', async ({ page }) => {
    await page.goto(`${baseUrl}/posts/${postId}`);
    
    const commentText = `playwright comment ${v4()}`;
    
    await page.getByPlaceholder('Write a comment...').fill(commentText);
    await page.getByRole('button', { name: 'Reply' }).click();
    
    // Wait for the comment to be added
    await page.waitForTimeout(2000); // Adjust this timeout as needed
    
    await expect(page.locator('text=' + commentText)).toBeVisible();
  });

});
