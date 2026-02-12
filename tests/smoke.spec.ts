import { test, expect } from '@playwright/test'

test('basic navigation works', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Demo/i)

  await page.getByRole('link', { name: 'Services', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Services', exact: true })).toBeVisible()

  await page.getByRole('link', { name: 'About', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'About', exact: true })).toBeVisible()

  await page.getByRole('link', { name: 'Contact', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Contact', exact: true })).toBeVisible()
})
