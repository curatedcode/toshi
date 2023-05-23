import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const envVarType = z.object({
  baseUrl: z.string().url(),
  port: z.number(),
  email: z.string(),
  password: z.string(),
});

const processVars = {
  baseUrl: process.env.TESTING_BASE_URL,
  port: Number(process.env.TESTING_PORT),
  email: process.env.TESTING_AUTH_EMAIL,
  password: process.env.TESTING_AUTH_PASSWORD,
};

const parsed = envVarType.safeParse(processVars);

if (!parsed.success) {
  throw new Error(
    `Testing environment variable error: ${parsed.error.message}`
  );
}

export const testingEnv = {
  ...parsed.data,
  url: `${parsed.data.baseUrl}:${parsed.data.port}`,
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: testingEnv.url,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    screenshot: "only-on-failure",

    /* Run browser in headless mode */
    headless: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },

    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
      dependencies: ["setup"],
    },

    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
      dependencies: ["setup"],
    },

    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
      },
      dependencies: ["setup"],
    },

    /* Test against mobile viewports. */
    {
      name: "Mobile Chrome",
      use: {
        ...devices["Pixel 5"],
      },
      dependencies: ["setup"],
    },
    {
      name: "Mobile Safari",
      use: {
        ...devices["iPhone 12"],
      },
      dependencies: ["setup"],
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: `pnpm dev --port=${testingEnv.port}`,
    port: testingEnv.port,
    reuseExistingServer: true,
  },
});
