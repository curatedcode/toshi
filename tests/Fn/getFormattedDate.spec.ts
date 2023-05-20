import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import getFormattedDate from "~/components/Fn/getFormattedDate";

describe("formatted date", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("turns date object into short date", () => {
    // March 30 2023
    const date = new Date(2023, 2, 30);
    vi.setSystemTime(date);

    expect(getFormattedDate(date, "short")).toBe("Mar 30, 2023");
  });

  it("turns date object into long date", () => {
    // March 30 2023
    const date = new Date(2023, 2, 30);
    vi.setSystemTime(date);

    expect(getFormattedDate(date)).toBe("March 30, 2023");
  });

  it("accept date strings and returns correct date", () => {
    // March 30 2023
    const date = "03/30/2023";
    vi.setSystemTime(date);

    expect(getFormattedDate(date)).toBe("March 30, 2023");
  });
});
