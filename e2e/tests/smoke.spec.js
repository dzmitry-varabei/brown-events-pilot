import { test, expect } from '@playwright/test'

// Smoke test: the stack is up and data flows end to end
// (browser -> frontend, whose API client calls the backend on port 5000 -> database
// with seeded demo data).
// It checks seeded data, not static headings: a page that renders but fails
// to load its data must fail this test. It deliberately covers only the
// conference list; deeper flows belong to the tasks' own e2e tests.
test('conference list shows the seeded conferences', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Conferences', level: 1 })).toBeVisible()
  const card = page.locator('.card', { hasText: '.NET Summit 2024' })
  await expect(card).toBeVisible()
  await expect(card.getByRole('link', { name: 'View Details' })).toHaveAttribute('href', /\/conferences\/\d+$/)
  await expect(page.locator('.card', { hasText: 'CloudOps Days' })).toBeVisible()
})
