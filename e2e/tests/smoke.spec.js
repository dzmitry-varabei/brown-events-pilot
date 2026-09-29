import { test, expect } from '@playwright/test'

// Smoke test: the stack is up and the main read path works end to end
// (browser -> frontend, whose API client calls the backend on port 5000 -> database
// with seeded demo data).
// It checks seeded data, not static headings: a page that renders but fails
// to load its data must fail this test.
test('conference list opens and a conference shows its seeded sessions', async ({ page }) => {
  await page.goto('/')

  const card = page.locator('.card', { hasText: '.NET Summit 2024' })
  await expect(card).toBeVisible()

  await card.getByRole('link', { name: 'View Details' }).click()

  await expect(page).toHaveURL(/\/conferences\/\d+$/)
  await expect(page.getByRole('heading', { name: '.NET Summit 2024', level: 1 })).toBeVisible()
  await expect(page.getByText('EF Core Performance Deep Dive')).toBeVisible()
})
