import { test, expect } from '@playwright/test'

test('basic navigation works', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/BetterLocal/i)
  await expect(page.getByRole('heading', { name: /You've Tried Everything\./i })).toBeVisible()

  const nav = page.getByRole('banner').getByRole('navigation')
  await nav.getByRole('link', { name: 'Contact', exact: true }).click()
  await expect(page).toHaveURL(/\/contact$/)
  await expect(page.getByRole('heading', { name: 'Contact', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Send message' })).toBeVisible()
})
