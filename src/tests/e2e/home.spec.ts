import { test, expect } from '@playwright/test';

test.describe('HomePage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/HabitTrackr/);
  });

  test('should display empty state when no habits exist', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/No habits yet/)).toBeVisible();
  });
});

