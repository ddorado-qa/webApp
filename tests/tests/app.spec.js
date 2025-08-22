const { test, expect } = require('@playwright/test');

test('Register and Login flow', async ({ page }) => {
  // Navegar a la app (usa baseURL de playwright.config.js)
  await page.goto('http://frontend:3000/');
  // Rellenar formulario
  await page.fill('[datatest-id="username"]', 'user1');
  await page.fill('[datatest-id="password"]', 'pass1');
  await page.click('[datatest-id="registerBtn"]');
  await expect(page.locator('[datatest-id="message"]')).toContainText('Registered user');

  // Intentar login
  await page.fill('[datatest-id="username"]', 'user1');
  await page.fill('[datatest-id="password"]', 'pass1');
  await page.click('[datatest-id="loginBtn"]');
  await expect(page.locator('[datatest-id="message"]')).toContainText('Logged in as');

  // Ver tabla de usuarios
  await expect(page.locator('[datatest-id="usersTable"]')).toBeVisible();
});
  