import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import getPreviousDate from "~/components/Fn/getPreviousDate";

describe("formatted date", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("get day minus 3 days in short date", () => {
    // March 30 2023
    const date = new Date(2023, 2, 30);
    vi.setSystemTime(date);

    expect(getPreviousDate(3, "day", "short")).toBe("Mar 27, 2023");
  });

  it("get day minus 3 days in long date", () => {
    // March 30 2023
    const date = new Date(2023, 2, 30);
    vi.setSystemTime(date);

    expect(getPreviousDate(3, "day")).toBe("March 27, 2023");
  });

  it("accept date strings and returns correct date", () => {
    // March 30 2023
    const date = "03/30/2023";
    vi.setSystemTime(date);

    expect(getPreviousDate(3, "day")).toBe("March 27, 2023");
  });
});
