import { defineConfig, devices } from "@playwright/test";

// End-to-end smoke tests. These drive a real browser against a running app.
// The smoke specs here only hit PUBLIC pages (no auth/DB), so they pass against
// any running instance. Authenticated flows (signup → onboard → RSVP) need a
// seeded test database — expand e2e/ once that's available (see the commented
// example in e2e/smoke.spec.ts).
//
// Run locally:  npx playwright install chromium   (one-time browser download)
//               npm run test:e2e
// Point at an already-running instance:  E2E_BASE_URL=http://localhost:3000 npm run test:e2e
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: true,
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Auto-start the dev server unless a base URL is provided or one is already up.
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
