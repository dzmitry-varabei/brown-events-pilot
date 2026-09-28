import { defineConfig, devices } from '@playwright/test'

// Runs against the live stack started with `docker-compose up --build`.
// Override the address with E2E_BASE_URL if the frontend runs elsewhere.
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:5173',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
