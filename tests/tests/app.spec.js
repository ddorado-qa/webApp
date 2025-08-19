const { test, expect } = require('@playwright/test');

test('Register and Login flow', async ({ page }) => {
  // Navegar a la app (usa baseURL de playwright.config.js)
  await page.goto('/');
  // Rellenar formulario
  await page.fill('[data-testid="username"]', 'user1');
  await page.fill('[data-testid="password"]', 'pass1');
  await page.click('[data-testid="registerBtn"]');
  await expect(page.locator('[data-testid="message"]')).toContainText('Registered user');

  // Intentar login
  await page.fill('[data-testid="username"]', 'user1');
  await page.fill('[data-testid="password"]', 'pass1');
  await page.click('[data-testid="loginBtn"]');
  await expect(page.locator('[data-testid="message"]')).toContainText('Logged in as');

  // Ver tabla de usuarios
  await expect(page.locator('[data-testid="usersTable"]')).toBeVisible();
});
  