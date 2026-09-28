import { test, expect } from '@playwright/test'

// Smoke test: the stack is up and the main read path works end to end
// (frontend -> nginx -> API -> database with seeded demo data).
test('conference list opens and a conference shows its sessions', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Conferences', level: 1 })).toBeVisible()
  const detailsLinks = page.getByRole('link', { name: 'View Details' })
  await expect(detailsLinks.first()).toBeVisible()

  await detailsLinks.first().click()

  await expect(page).toHaveURL(/\/conferences\/\d+$/)
  await expect(page.getByRole('heading', { name: 'Sessions', level: 2 })).toBeVisible()
})
