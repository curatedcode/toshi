import { test as setup } from "@playwright/test";
import { testingEnv } from "playwright.config";

setup("authentication", async ({ page }) => {
  console.log(page.url());
  // navigate home, go to sign in page
  await page.goto("/");
  await page.getByRole("button", { name: "Hello, Sign In" }).click();
  await page.getByRole("button", { name: "Sign In", exact: true }).click();

  // sign in
  await page.getByRole("textbox", { name: /email/i }).type(testingEnv.email);
  await page
    .getByRole("textbox", { name: /password/i })
    .type(testingEnv.password);
  await page.getByRole("button", { name: /sign in/i }).click();
});
