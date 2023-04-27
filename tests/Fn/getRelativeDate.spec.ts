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

  it("should return 1s", () => {
    // March 30, 2023 @ 5:00:00
    const fakeDate = new Date(2023, 2, 30, 6, 0, 0);
    vi.setSystemTime(fakeDate);

    // March 30, 2023 @ 5:00:01
    const reviewDate = new Date(2023, 2, 30, 6, 0, 1).toUTCString();

    expect(getRelativeDate(reviewDate)).toBe("1s");
  });

  it("should return 5s", () => {
    // March 30, 2023 @ 6:00:00
    const fakeDate = new Date(2023, 2, 30, 6, 0, 0);
    vi.setSystemTime(fakeDate);

    // March 30, 2023 @ 6:00:05
    const reviewDate = new Date(2023, 2, 30, 6, 0, 5).toUTCString();

    expect(getRelativeDate(reviewDate)).toBe("5s");
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

  it("should return 1m", () => {
    // March 30, 2023 @ 6:00
    const fakeDate = new Date(2023, 2, 30, 6, 0);
    vi.setSystemTime(fakeDate);

    // March 30, 2023 @ 6:01
    const reviewDate = new Date(2023, 2, 30, 6, 1).toUTCString();

    expect(getRelativeDate(reviewDate)).toBe("1m");
  });

  it("should return 5m", () => {
    // March 30, 2023 @ 6:00
    const fakeDate = new Date(2023, 2, 30, 6, 0);
    vi.setSystemTime(fakeDate);

    // March 30, 2023 @ 6:05
    const reviewDate = new Date(2023, 2, 30, 6, 5).toUTCString();

    expect(getRelativeDate(reviewDate)).toBe("5m");
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

  it("should return 1h", () => {
    // March 30, 2023 @ 6:00
    const fakeDate = new Date(2023, 2, 30, 6, 0);
    vi.setSystemTime(fakeDate);

    // March 30, 2023 @ 7:00
    const reviewDate = new Date(2023, 2, 30, 7, 0).toUTCString();

    expect(getRelativeDate(reviewDate)).toBe("1h");
  });

  it("should return 5h", () => {
    // March 30, 2023 @ 6:00
    const fakeDate = new Date(2023, 2, 30, 6, 0);
    vi.setSystemTime(fakeDate);

    // March 30, 2023 @ 11:00
    const reviewDate = new Date(2023, 2, 30, 11, 0).toUTCString();

    expect(getRelativeDate(reviewDate)).toBe("5h");
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
    const reviewDate = new Date(2023, 2, 29).toUTCString();

    expect(getRelativeDate(reviewDate)).toBe("Mar 29");
  });

  it("should return Mar 29 2022", () => {
    // March 30, 2023
    const fakeDate = new Date(2023, 2, 30);
    vi.setSystemTime(fakeDate);

    // March 29, 2022
    const reviewDate = new Date(2022, 2, 29).toUTCString();

    expect(getRelativeDate(reviewDate)).toBe("Mar 29 2022");
  });
});
