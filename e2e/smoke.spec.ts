import { test, expect } from "@playwright/test";

// Public-page smoke tests — no auth or database required.
test.describe("public pages", () => {
  test("landing page renders and shows the cookie banner", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /Your Campus, Reimagined/i })
    ).toBeVisible();
    await expect(
      page.getByRole("dialog", { name: /cookie consent/i })
    ).toBeVisible();
  });

  test("login page renders the sign-in form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByPlaceholder(/school email/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /log in with password/i })
    ).toBeVisible();
  });

  test("privacy and terms pages render", async ({ page }) => {
    await page.goto("/privacy");
    await expect(
      page.getByRole("heading", { name: "Privacy Policy" })
    ).toBeVisible();

    await page.goto("/terms");
    await expect(
      page.getByRole("heading", { name: "Terms of Service" })
    ).toBeVisible();
  });

  test("unknown routes show the custom 404", async ({ page }) => {
    await page.goto("/this-route-does-not-exist");
    await expect(page.getByText("404")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /page not found/i })
    ).toBeVisible();
  });
});

// ── Authenticated flow (needs a seeded test DB) — enable when ready ───────────
// test("student can RSVP to an event", async ({ page }) => {
//   await page.goto("/login");
//   await page.getByPlaceholder(/school email/i).fill("student@collegeofidaho.edu");
//   await page.getByPlaceholder(/password/i).fill("password123");
//   await page.getByRole("button", { name: /log in with password/i }).click();
//   await page.waitForURL(/\/dashboard/);
//   // …navigate to an event and assert the RSVP button toggles to "Going"…
// });
