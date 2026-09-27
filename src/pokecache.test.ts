import { Cache } from "./pokecache.js";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

test.concurrent.each([
  {
    key: "https://example.com",
    val: "testdata",
    interval: 500, // 1/2 second
  },
  {
    key: "https://example.com/path",
    val: "moretestdata",
    interval: 1000, // 1 second
  },
])("Test Caching $interval ms", async ({ key, val, interval }) => {
  const cache = new Cache(interval);

  cache.add(key, val);
  const cached = cache.get(key);
  expect(cached).toBe(val);

  await new Promise((resolve) => setTimeout(resolve, interval * 2));
  const reaped = cache.get(key);
  expect(reaped).toBe(undefined);

  cache.stopReapLoop();
});

describe("Cache", () => {
  const interval = 1000;
  let cache: Cache;

  beforeEach(() => {
    vi.useFakeTimers();
    cache = new Cache(interval);
  });

  afterEach(() => {
    cache.stopReapLoop();
    vi.useRealTimers();
  });

  test("returns undefined for a key that was never added", () => {
    expect(cache.get("https://example.com/missing")).toBeUndefined();
  });

  test("stores non-string values by reference", () => {
    const val = { results: [{ name: "canalave-city-area" }] };
    cache.add("https://example.com", val);
    expect(cache.get("https://example.com")).toBe(val);
  });

  test("keeps separate values for different keys", () => {
    cache.add("a", 1);
    cache.add("b", 2);
    expect(cache.get("a")).toBe(1);
    expect(cache.get("b")).toBe(2);
  });

  test("keeps an entry that is not yet older than the interval", () => {
    cache.add("key", "val");
    vi.advanceTimersByTime(interval); // first reap: entry is exactly `interval` old
    expect(cache.get("key")).toBe("val");
  });

  test("reaps an entry once it is older than the interval", () => {
    cache.add("key", "val");
    vi.advanceTimersByTime(interval * 2);
    expect(cache.get("key")).toBeUndefined();
  });

  test("only reaps stale entries, keeping fresh ones", () => {
    cache.add("old", "stale");
    vi.advanceTimersByTime(interval * 1.5);
    cache.add("new", "fresh");
    vi.advanceTimersByTime(interval * 0.5); // reap at 2x interval

    expect(cache.get("old")).toBeUndefined();
    expect(cache.get("new")).toBe("fresh");
  });

  test("re-adding a key replaces its value and resets its age", () => {
    cache.add("key", "first");
    vi.advanceTimersByTime(interval * 1.5);
    cache.add("key", "second");
    vi.advanceTimersByTime(interval * 0.5); // the original entry would be reaped here

    expect(cache.get("key")).toBe("second");
  });

  test("stopReapLoop stops entries from being reaped", () => {
    cache.add("key", "val");
    cache.stopReapLoop();

    expect(vi.getTimerCount()).toBe(0);
    vi.advanceTimersByTime(interval * 5);
    expect(cache.get("key")).toBe("val");
  });
});
