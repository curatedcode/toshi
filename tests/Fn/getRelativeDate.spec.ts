import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import getRelativeDate from "~/components/Fn/getRelativeDate";

describe("seconds", () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers();
  });

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
  });

  it("should return 1s ago", () => {
    // March 30, 2023 @ 5:00:00
    const fakeDate = new Date(2023, 2, 30, 6, 0, 0);
    vi.setSystemTime(fakeDate);

    // March 30, 2023 @ 5:00:01
    const reviewDate = new Date(2023, 2, 30, 6, 0, 1);

    expect(getRelativeDate(reviewDate)).toBe("1s ago");
  });

  it("should return 5s ago", () => {
    // March 30, 2023 @ 6:00:00
    const fakeDate = new Date(2023, 2, 30, 6, 0, 0);
    vi.setSystemTime(fakeDate);

    // March 30, 2023 @ 6:00:05
    const reviewDate = new Date(2023, 2, 30, 6, 0, 5);

    expect(getRelativeDate(reviewDate)).toBe("5s ago");
  });
});

describe("minutes", () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers();
  });

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
  });

  it("should return 1m ago", () => {
    // March 30, 2023 @ 6:00
    const fakeDate = new Date(2023, 2, 30, 6, 0);
    vi.setSystemTime(fakeDate);

    // March 30, 2023 @ 6:01
    const reviewDate = new Date(2023, 2, 30, 6, 1);

    expect(getRelativeDate(reviewDate)).toBe("1m ago");
  });

  it("should return 5m ago", () => {
    // March 30, 2023 @ 6:00
    const fakeDate = new Date(2023, 2, 30, 6, 0);
    vi.setSystemTime(fakeDate);

    // March 30, 2023 @ 6:05
    const reviewDate = new Date(2023, 2, 30, 6, 5);

    expect(getRelativeDate(reviewDate)).toBe("5m ago");
  });
});

describe("hours", () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers();
  });

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
  });

  it("should return 1h ago", () => {
    // March 30, 2023 @ 6:00
    const fakeDate = new Date(2023, 2, 30, 6, 0);
    vi.setSystemTime(fakeDate);

    // March 30, 2023 @ 7:00
    const reviewDate = new Date(2023, 2, 30, 7, 0);

    expect(getRelativeDate(reviewDate)).toBe("1h ago");
  });

  it("should return 5h ago", () => {
    // March 30, 2023 @ 6:00
    const fakeDate = new Date(2023, 2, 30, 6, 0);
    vi.setSystemTime(fakeDate);

    // March 30, 2023 @ 11:00
    const reviewDate = new Date(2023, 2, 30, 11, 0);

    expect(getRelativeDate(reviewDate)).toBe("5h ago");
  });
});

describe("dates outside of current day", () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers();
  });

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
  });

  it("should return Mar 29", () => {
    // March 30, 2023
    const fakeDate = new Date(2023, 2, 30);
    vi.setSystemTime(fakeDate);

    // March 29, 2023
    const reviewDate = new Date(2023, 2, 29);

    expect(getRelativeDate(reviewDate)).toBe("Mar 29");
  });

  it("should return Mar 29 2022", () => {
    // March 30, 2023
    const fakeDate = new Date(2023, 2, 30);
    vi.setSystemTime(fakeDate);

    // March 29, 2022
    const reviewDate = new Date(2022, 2, 29);

    expect(getRelativeDate(reviewDate)).toBe("Mar 29 2022");
  });
});
