import { test, expect } from '@playwright/test';

test('create → list → detail → edit → list', async ({ page, request }) => {
  const title = `E2E Order ${Date.now()}`;

  await page.goto('/work-orders/new');
  await page.getByLabel('Title').fill(title);
  await page.getByLabel('Description').fill('Created from Playwright');
  await page.getByLabel('Priority').selectOption('High');
  await page.getByRole('button', { name: /create/i }).click();

  await page.waitForURL('**/');

  const res = await request.get(`/api/work-orders?q=${encodeURIComponent(title)}`);
  expect(res.ok()).toBeTruthy();
  const matches: Array<{ id: string; title: string }> = await res.json();
  expect(matches.length, 'Created order not found in API list').toBeGreaterThan(0);
  const id = matches.find(m => m.title === title)!.id;

  await page.goto(`/work-orders/${id}`);
  await expect(page.getByRole('heading', { name: title })).toBeVisible();

  await page.getByRole('link', { name: /edit/i }).click();
  await page.getByLabel('Status').selectOption('Open');
  await page.getByRole('button', { name: /save|update/i }).click();

  await page.waitForLoadState('networkidle');

  const resAfter = await request.get(`/api/work-orders/${id}`);
  expect(resAfter.ok()).toBeTruthy();
  const itemAfter: { status: string } = await resAfter.json();
  expect(itemAfter.status).toBe('Open');

  if (page.url().endsWith('/')) {
    await page.goto(`/work-orders/${id}`);
  }
});
