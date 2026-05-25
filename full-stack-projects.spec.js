import { expect, test } from '@playwright/test';

test('frontend loads projects from backend API', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/');
  await expect(page.getByText('title').first()).toBeVisible();
  await expect(page.getByText('Could not load projects right now.')).toHaveCount(0);

  const browserFetchResult = await page.evaluate(async () => {
    const response = await fetch('http://127.0.0.1:8000/projects');
    const payload = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      projectCount: payload.projects.length
    };
  });

  expect(browserFetchResult).toEqual({
    ok: true,
    status: 200,
    projectCount: 1
  });
});
