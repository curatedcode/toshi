import { test, expect, type Page } from "@playwright/test";
import { max_search_results } from "~/customVariables";

test("should show search results", async ({ page }) => {
  await page.goto("/");

  // search for product
  const searchBar = page.getByPlaceholder("Search");
  await searchBar.type("a");
  await searchBar.press("Enter");

  // wait for search page results
  await expect(page.locator("#results")).toBeVisible();

  // expect results to be maximum allowed per page
  const productResults = await page.locator("#product").all();
  expect(productResults.length).toBe(max_search_results);
});

/**
 * TESTING
 * TODO: sort by
 * TODO: filter by price (individually and then together)
 * TODO: filter by reviews (only do one of them to confirm working)
 * TODO: filter to include out of stock
 * TODO: clear filters
 */

//TODO: if item is out of stock put a warning on it

async function search(page: Page) {
  await page.goto("/");

  const searchBar = page.getByPlaceholder("Search");
  await searchBar.type("a");
  await searchBar.press("Enter");

  // wait for search page results
  await expect(page.locator("#results")).toBeVisible();
}

test("should sort by price; low to high", async ({ page }) => {
  await search(page);

  // get first result price for comparison
  const initialResult = await page
    .locator("#product")
    .first()
    .locator("#price")
    .textContent();
  const initialResultPrice = Number(initialResult?.split("$"));

  // sort by price
  const sortByElement = page
    .getByRole("combobox", { name: "Sort results" })
    .first();
  await sortByElement.click();
  await sortByElement.selectOption("Price: Low to High");

  // artificial delay to await new results
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, 1000);
  });

  // first result should now be less than it previously was
  const newResult = await page
    .locator("#product")
    .first()
    .locator("#price")
    .textContent();
  const newResultPrice = Number(newResult?.split("$"));

  expect(newResultPrice).toBeLessThan(initialResultPrice);
});

test("should sort by price; high to low", async ({ page }) => {
  await search(page);

  // get first result price for comparison
  const initialResult = await page
    .locator("#product")
    .first()
    .locator("#price")
    .textContent();
  const initialResultPrice = Number(initialResult?.split("$"));

  // sort by price
  const sortByElement = page
    .getByRole("combobox", { name: "Sort results" })
    .first();
  await sortByElement.click();
  await sortByElement.selectOption("Price: High to Low");

  // artificial delay to await new results
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, 1000);
  });

  // first result should now be less than it previously was
  const newResult = await page
    .locator("#product")
    .first()
    .locator("#price")
    .textContent();
  const newResultPrice = Number(newResult?.split("$"));

  expect(newResultPrice).toBeGreaterThan(initialResultPrice);
});
