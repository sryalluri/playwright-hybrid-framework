import { defineConfig, devices } from '@playwright/test';
import { ENV } from './config/env.js';

const isCI = !!process.env.CI;

// 🔒 Fail fast if base URL missing
if (!ENV.API_BASE_URL) {
  throw new Error("❌ API_BASE_URL is not defined. Check your environment variables.");
}

export default defineConfig({
  testDir: './tests',

  globalSetup: require.resolve('./utils/global-setup.js'),

  fullyParallel: false,          // safer for hybrid API+UI flows
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? 'dot' : 'html',

  use: {
    baseURL: ENV.API_BASE_URL,
    storageState: 'storageState.json',

    headless: isCI,                 // Headless in CI
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Maximize locally only
    viewport: isCI ? { width: 1280, height: 720 } : null,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],

        ...(isCI
          ? {}   // CI → default bundled Chromium
          : {
              channel: 'chrome',
              launchOptions: {
                args: ['--start-maximized'],
                slowMo: 500
              }
            }),
      },
    },
  ],
});