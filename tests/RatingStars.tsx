import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import RatingStars from "~/components/Reviews/RatingStars";

afterEach(() => cleanup());

it("should return 0 filled stars", () => {
  render(<RatingStars rating={0} />);

  const ratingStar = screen.getByTestId(/rating-stars/i);

  expect(ratingStar).toBeVisible();

  expect(ratingStar).toHaveAttribute("data-rating", "0");
});

it("should return 0.5 filled stars", () => {
  render(<RatingStars rating={0.5} />);

  const ratingStar = screen.getByTestId(/rating-stars/i);

  expect(ratingStar).toBeVisible();

  expect(ratingStar).toHaveAttribute("data-rating", "0.5");
});

it("should return 1 filled stars", () => {
  render(<RatingStars rating={1} />);

  const ratingStar = screen.getByTestId(/rating-stars/i);

  expect(ratingStar).toBeVisible();

  expect(ratingStar).toHaveAttribute("data-rating", "1");
});

it("should return 1.5 filled stars", () => {
  render(<RatingStars rating={1.5} />);

  const ratingStar = screen.getByTestId(/rating-stars/i);

  expect(ratingStar).toBeVisible();

  expect(ratingStar).toHaveAttribute("data-rating", "1.5");
});

it("should return 2 filled stars", () => {
  render(<RatingStars rating={2} />);

  const ratingStar = screen.getByTestId(/rating-stars/i);

  expect(ratingStar).toBeVisible();

  expect(ratingStar).toHaveAttribute("data-rating", "2");
});

it("should return 2.5 filled stars", () => {
  render(<RatingStars rating={2.5} />);

  const ratingStar = screen.getByTestId(/rating-stars/i);

  expect(ratingStar).toBeVisible();

  expect(ratingStar).toHaveAttribute("data-rating", "2.5");
});

it("should return 3 filled stars", () => {
  render(<RatingStars rating={3} />);

  const ratingStar = screen.getByTestId(/rating-stars/i);

  expect(ratingStar).toBeVisible();

  expect(ratingStar).toHaveAttribute("data-rating", "3");
});

it("should return 3.5 filled stars", () => {
  render(<RatingStars rating={3.5} />);

  const ratingStar = screen.getByTestId(/rating-stars/i);

  expect(ratingStar).toBeVisible();

  expect(ratingStar).toHaveAttribute("data-rating", "3.5");
});

it("should return 4 filled stars", () => {
  render(<RatingStars rating={4} />);

  const ratingStar = screen.getByTestId(/rating-stars/i);

  expect(ratingStar).toBeVisible();

  expect(ratingStar).toHaveAttribute("data-rating", "4");
});

it("should return 4.5 filled stars", () => {
  render(<RatingStars rating={4.5} />);

  const ratingStar = screen.getByTestId(/rating-stars/i);

  expect(ratingStar).toBeVisible();

  expect(ratingStar).toHaveAttribute("data-rating", "4.5");
});

it("should return 5 filled stars", () => {
  render(<RatingStars rating={5} />);

  const ratingStar = screen.getByTestId(/rating-stars/i);

  expect(ratingStar).toBeVisible();

  expect(ratingStar).toHaveAttribute("data-rating", "5");
});
