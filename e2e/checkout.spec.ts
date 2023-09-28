import { expect, test } from "@playwright/test";

test("should be able to complete checkout", async ({ page }) => {
  await page.goto("/");

  page.on("console", (message) => {
    console.log(message);
  });

  // add item to cart
  await page.locator("#product").first().click();
  await page.getByText("add to cart").click();

  // get into checkout
  await page.getByTestId("cart-link").click();
  await page.getByRole("link", { name: "proceed to checkout" }).click();

  // fill in all fields
  await page.getByLabel("first name").type("test");
  await page.getByLabel("last name").type("user");
  await page.getByLabel("street address").type("101 Tall Street");
  await page.getByLabel("city").type("testVil");
  await page.getByLabel("state").type("kansas");
  await page.getByLabel("ZIP Code").type("26492");
  await page.getByLabel("country").type("United States");
  await page.getByRole("button", { name: "next" }).click();

  await page.getByLabel("first name").type("tester");
  await page.getByLabel("last name").type("unserer");
  await page.getByLabel("card number").type("34544946848");
  await page.getByLabel("security code").type("345");
  await page.getByRole("button", { name: "next" }).click();

  // submit order
  await page.getByRole("button", { name: "place your order" }).click();

  await expect(page.getByText("your order has been place")).toBeVisible();
});
