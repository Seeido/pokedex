import { PokeAPI, ShallowLocations } from "./pokeapi.js";
import { describe, expect, test, vi, afterEach } from "vitest";

const page: ShallowLocations = {
  count: 1,
  next: null,
  previous: null,
  results: [{ name: "canalave-city-area", url: "" }],
};

describe("PokeAPI.fetchLocations", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("fetches the first location-area page when no URL is given", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json(page));
    vi.stubGlobal("fetch", fetchMock);

    const result = await new PokeAPI().fetchLocations();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://pokeapi.co/api/v2/location-area",
    );
    expect(result).toEqual(page);
  });

  test("fetches the first page when given an empty URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json(page));
    vi.stubGlobal("fetch", fetchMock);

    await new PokeAPI().fetchLocations("");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://pokeapi.co/api/v2/location-area",
    );
  });

  test("fetches the given page URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json(page));
    vi.stubGlobal("fetch", fetchMock);
    const url = "https://pokeapi.co/api/v2/location-area?offset=20&limit=20";

    await new PokeAPI().fetchLocations(url);

    expect(fetchMock).toHaveBeenCalledWith(url);
  });

  test("throws when the response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 500 })),
    );

    await expect(new PokeAPI().fetchLocations()).rejects.toThrow(
      "Response status: 500",
    );
  });
});
