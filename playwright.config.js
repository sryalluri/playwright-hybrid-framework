import { defineConfig } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  globalSetup: './utils/global-setup.js',

  use: {
    baseURL: 'https://rahulshettyacademy.com',
    storageState: 'storageState.json',
    headless: isCI,                // headless in CI, headed locally
    trace: 'on-first-retry',
    viewport: isCI ? undefined : null,   // maximize only locally
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...(isCI
          ? {}  // CI → default bundled chromium
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