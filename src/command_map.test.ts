import type { Interface } from "node:readline";
import { commandMap } from "./command_map.js";
import { PokeAPI, ShallowLocations } from "./pokeapi.js";
import { State } from "./state.js";
import { describe, expect, test, vi, afterEach } from "vitest";

function makeState(overrides: Partial<State> = {}): State {
  return {
    readline: {} as Interface,
    commands: {},
    pokeapi: new PokeAPI(60_000),
    nextLocationsURL: "",
    prevLocationsURL: null,
    pokedex: {},
    ...overrides,
  };
}

const page: ShallowLocations = {
  count: 3,
  next: "https://pokeapi.co/api/v2/location-area?offset=40&limit=20",
  previous: "https://pokeapi.co/api/v2/location-area?offset=0&limit=20",
  results: [
    { name: "canalave-city-area", url: "" },
    { name: "eterna-city-area", url: "" },
  ],
};

describe("commandMap", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("fetches the next page, prints location names, and updates page URLs", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const state = makeState({
      nextLocationsURL:
        "https://pokeapi.co/api/v2/location-area?offset=20&limit=20",
    });
    const fetchSpy = vi
      .spyOn(state.pokeapi, "fetchLocations")
      .mockResolvedValue(page);

    await commandMap(state);

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://pokeapi.co/api/v2/location-area?offset=20&limit=20",
    );
    expect(logSpy).toHaveBeenCalledWith(
      "canalave-city-area\neterna-city-area",
    );
    expect(state.nextLocationsURL).toBe(page.next);
    expect(state.prevLocationsURL).toBe(page.previous);
  });

  test("fetches the first page when no page has been loaded yet", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const state = makeState();
    const fetchSpy = vi
      .spyOn(state.pokeapi, "fetchLocations")
      .mockResolvedValue(page);

    await commandMap(state);

    expect(fetchSpy).toHaveBeenCalledWith("");
  });

  test("prints a message and does not fetch when on the last page", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const state = makeState({ nextLocationsURL: null });
    const fetchSpy = vi.spyOn(state.pokeapi, "fetchLocations");

    await commandMap(state);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith("you're on the last page");
  });
});
