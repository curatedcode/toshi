import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import useDimensions from "~/components/Fn/useDimensions";

function TestComponent() {
  const { ref } = useDimensions();
  return <nav style={{ width: 500, height: 1000 }} ref={ref}></nav>;
}

it("return dimension of node", () => {
  render(<TestComponent />);

  const component = screen.getByRole("navigation");

  expect(component.style.width).toEqual("500px");
  expect(component.style.height).toEqual("1000px");
});
