import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the demonstration suite.
 *
 * Every setting below is a decision with a reason attached. Where a value would
 * be arbitrary in this small project, the comment says what it should be derived
 * from in a real one.
 */

/** The site and the demo API are served from the same origin - see vite.config.ts. */
const ORIGIN = (process.env.BASE_URL ?? 'http://localhost:4173').replace(/\/+$/, '');

/**
 * The GitHub Pages build is served from a sub-path and runs the demo endpoints
 * in the browser instead of over HTTP, so `DEMO_MODE=static` points the suite at
 * that build. CI runs the UI tests both ways: what is deployed is tested, not
 * only what runs locally.
 */
const staticDemo = process.env.DEMO_MODE === 'static';
const REPO_BASE = '/test-automation-enablement-playbook/';

// Ends with a slash so that specs can use paths relative to the deployed base.
const BASE_URL = staticDemo ? `${ORIGIN}${REPO_BASE}` : `${ORIGIN}/`;

const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: './tests',

  // Tests do not share state, so they can run in parallel within a file too.
  // This is only safe because of the test-independence guardrail.
  fullyParallel: true,

  // A stray test.only would silently shrink the suite in CI.
  forbidOnly: isCI,

  // One retry in CI absorbs genuine infrastructure noise. It is deliberately not
  // higher: retries hide reliability problems, and a test that only passes on
  // the second attempt is tracked as an open issue rather than accepted.
  // Locally there are no retries, so flakiness is visible while writing tests.
  retries: isCI ? 1 : 0,

  // Fixed worker count in CI so that runs are comparable and do not vary with
  // the runner's core count. Locally Playwright's default (half the cores) is fine.
  workers: isCI ? 2 : undefined,

  // 'list' for readable local output, HTML for investigation after the fact.
  // The HTML report is uploaded as a CI artifact rather than opened automatically.
  reporter: isCI
    ? [['github'], ['list'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],

  // A short global expect timeout keeps genuine failures fast; individual
  // assertions can override it where an operation is legitimately slow.
  expect: { timeout: 5_000 },
  timeout: 30_000,

  use: {
    baseURL: BASE_URL,

    // Diagnostics: enough to investigate a CI failure without re-running it,
    // without recording gigabytes for runs that pass.
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Fail fast on a locator that cannot be found, rather than waiting 30s.
    actionTimeout: 10_000,
  },

  projects: [
    // The API project is skipped for the static build, which has no HTTP
    // endpoints to test - the browser answers those calls there.
    ...(staticDemo
      ? []
      : [
          {
            name: 'api',
            testDir: './tests/api',
            // No browser is launched for API tests: they use the `request` fixture.
            use: { baseURL: BASE_URL },
          },
        ]),
    {
      name: 'chromium',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testDir: './tests/ui',
      use: { ...devices['Desktop Firefox'] },
    },
    // WebKit is intentionally not enabled here. For a real project the browser
    // matrix should follow the browsers the application actually supports and
    // the execution time the pipeline can afford - not the full list by default.
  ],

  // The suite starts the application itself, so `npx playwright test` works from
  // a clean checkout. In CI the server is always started fresh; locally an
  // already-running preview server is reused.
  webServer: {
    command: staticDemo
      ? 'npm run build:pages && npm run preview:pages'
      : 'npm run build && npm run preview',
    url: BASE_URL,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
