import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import PaginationButtons from "~/components/Search/PaginationButtons";

afterEach(() => cleanup());

it("should not allow going back a page if the current page is the first page", () => {
  render(<PaginationButtons currentPage={1} linkTo="" totalPages={12} />);

  const prevButton = screen.getByRole("link", { name: /previous/i });

  expect(prevButton.tabIndex).toEqual(-1);

  expect(prevButton).toHaveAttribute("aria-disabled", "true");
});

it("should not allow going to the next page if current page is the last page", () => {
  render(<PaginationButtons currentPage={12} linkTo="" totalPages={12} />);

  const nextButton = screen.getByRole("link", { name: /next/i });

  expect(nextButton.tabIndex).toEqual(-1);
  expect(nextButton).toHaveAttribute("aria-disabled", "true");
});

it("should show the total number of pages", () => {
  render(<PaginationButtons currentPage={1} linkTo="" totalPages={12} />);

  expect(screen.getByText("12")).toBeVisible();
});
