import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  retries: 0,
  webServer: {
    command: 'pnpm dev --hostname 127.0.0.1 --port 3000',
    url: 'http://127.0.0.1:3000',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI
  },
  use: {
    baseURL: 'http://127.0.0.1:3000'
  }
})
