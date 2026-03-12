import { defineConfig } from '@playwright/test';
import { ENV } from './config/env.js';
import { writeEnvironmentInfo } from './utils/environment.js';
import allureEnvironmentSetup from "./utils/allureEnvironmentSetup.js";

const isCI = !!process.env.CI;

// 🔒 Fail fast if base URL missing
if (!ENV.API_BASE_URL) {
  throw new Error("❌ API_BASE_URL is not defined. Check your environment variables.");
}
writeEnvironmentInfo();
export default defineConfig({
  testDir: './tests',

  globalSetup: './utils/frameworkSetup.js',

  fullyParallel: false,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: [
    [isCI ? 'dot' : 'html'],
    ['allure-playwright']
  ],

  use: {
    baseURL: ENV.API_BASE_URL,
    storageState: 'storageState.json',

    headless: isCI,                 // headless in CI only
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    // 🔥 Critical fix
    viewport: isCI ? { width: 1280, height: 720 } : null,
  },

  projects: [
    {
      name: 'chromium',
      use: isCI
        ? {} // CI → default bundled chromium
        : {
            channel: 'chrome',
            launchOptions: {
              args: ['--start-maximized'],
              slowMo: 500
            }
          }
    },
  ],
});