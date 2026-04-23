import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login and redirect to dashboard', async ({ page }) => {
    await page.goto('/login');

    // Fill in credentials using data-testid
    await page.getByTestId('email-input').fill('admin@pixspace.test');
    await page.getByTestId('password-input').fill('Admin123!');

    // Submit form using data-testid
    await page.getByTestId('login-submit-btn').click();

    // Wait for navigation
    await page.waitForURL('**/dashboard');

    // Verify dashboard content is visible
    await expect(
      page.getByRole('menuitem', { name: '数据统计' })
    ).toBeVisible();
  });
});
