import { PokeAPI, Pokemon, ShallowLocations } from "./pokeapi.js";
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

    const result = await new PokeAPI(60_000).fetchLocations();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://pokeapi.co/api/v2/location-area",
    );
    expect(result).toEqual(page);
  });

  test("fetches the first page when given an empty URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json(page));
    vi.stubGlobal("fetch", fetchMock);

    await new PokeAPI(60_000).fetchLocations("");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://pokeapi.co/api/v2/location-area",
    );
  });

  test("fetches the given page URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json(page));
    vi.stubGlobal("fetch", fetchMock);
    const url = "https://pokeapi.co/api/v2/location-area?offset=20&limit=20";

    await new PokeAPI(60_000).fetchLocations(url);

    expect(fetchMock).toHaveBeenCalledWith(url);
  });

  test("throws when the response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(null, {
            status: 500,
            statusText: "Internal Server Error",
          }),
        ),
    );

    await expect(new PokeAPI(60_000).fetchLocations()).rejects.toThrow(
      "Request failed (500 Internal Server Error) for https://pokeapi.co/api/v2/location-area",
    );
  });

  test("returns a cached page without fetching it again", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json(page));
    vi.stubGlobal("fetch", fetchMock);
    const api = new PokeAPI(60_000);

    const first = await api.fetchLocations();
    const second = await api.fetchLocations();

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(second).toEqual(first);
  });

  test("caches pages separately by URL", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation(async () => Response.json(page));
    vi.stubGlobal("fetch", fetchMock);
    const api = new PokeAPI(60_000);

    await api.fetchLocations();
    await api.fetchLocations(
      "https://pokeapi.co/api/v2/location-area?offset=20&limit=20",
    );

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test("does not cache a failed response", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(null, {
          status: 500,
          statusText: "Internal Server Error",
        }),
      )
      .mockResolvedValueOnce(Response.json(page));
    vi.stubGlobal("fetch", fetchMock);
    const api = new PokeAPI(60_000);

    await expect(api.fetchLocations()).rejects.toThrow(
      "Request failed (500 Internal Server Error) for https://pokeapi.co/api/v2/location-area",
    );
    await expect(api.fetchLocations()).resolves.toEqual(page);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

const pokemon: Pokemon = {
  id: 25,
  name: "pikachu",
  base_experience: 112,
};

describe("PokeAPI.fetchPokemon", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("fetches the Pokemon by name", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json(pokemon));
    vi.stubGlobal("fetch", fetchMock);

    const result = await new PokeAPI(60_000).fetchPokemon("pikachu");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://pokeapi.co/api/v2/pokemon/pikachu",
    );
    expect(result).toEqual(pokemon);
  });

  test("strips fields not in the schema", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(Response.json({ ...pokemon, height: 4, weight: 60 })),
    );

    const result = await new PokeAPI(60_000).fetchPokemon("pikachu");

    expect(result).toEqual(pokemon);
  });

  test("throws when the response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(null, { status: 404, statusText: "Not Found" }),
        ),
    );

    await expect(new PokeAPI(60_000).fetchPokemon("missingno")).rejects.toThrow(
      "Request failed (404 Not Found) for https://pokeapi.co/api/v2/pokemon/missingno",
    );
  });

  test("returns a cached Pokemon without fetching it again", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json(pokemon));
    vi.stubGlobal("fetch", fetchMock);
    const api = new PokeAPI(60_000);

    const first = await api.fetchPokemon("pikachu");
    const second = await api.fetchPokemon("pikachu");

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(second).toEqual(first);
  });
});
