import type { Interface } from "node:readline";
import { commandMapb } from "./command_mapb.js";
import { PokeAPI, ShallowLocations } from "./pokeapi.js";
import { State } from "./state.js";
import { describe, expect, test, vi, afterEach } from "vitest";

function makeState(overrides: Partial<State> = {}): State {
  return {
    readline: {} as Interface,
    commands: {},
    pokeapi: new PokeAPI(),
    nextLocationsURL: "",
    prevLocationsURL: null,
    ...overrides,
  };
}

const page: ShallowLocations = {
  count: 3,
  next: "https://pokeapi.co/api/v2/location-area?offset=20&limit=20",
  previous: null,
  results: [
    { name: "canalave-city-area", url: "" },
    { name: "eterna-city-area", url: "" },
  ],
};

describe("commandMapb", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("fetches the previous page, prints location names, and updates page URLs", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const state = makeState({
      nextLocationsURL:
        "https://pokeapi.co/api/v2/location-area?offset=40&limit=20",
      prevLocationsURL:
        "https://pokeapi.co/api/v2/location-area?offset=0&limit=20",
    });
    const fetchSpy = vi
      .spyOn(state.pokeapi, "fetchLocations")
      .mockResolvedValue(page);

    await commandMapb(state);

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://pokeapi.co/api/v2/location-area?offset=0&limit=20",
    );
    expect(logSpy).toHaveBeenCalledWith(
      "canalave-city-area\neterna-city-area",
    );
    expect(state.nextLocationsURL).toBe(page.next);
    expect(state.prevLocationsURL).toBeNull();
  });

  test("prints a message and does not fetch when on the first page", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const state = makeState({ prevLocationsURL: null });
    const fetchSpy = vi.spyOn(state.pokeapi, "fetchLocations");

    await commandMapb(state);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith("you're on the first page");
  });
});
