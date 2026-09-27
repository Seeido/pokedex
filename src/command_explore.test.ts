import type { Interface } from "node:readline";
import { commandExplore } from "./command_explore.js";
import { Location, PokeAPI } from "./pokeapi.js";
import { State } from "./state.js";
import { describe, expect, test, vi, afterEach } from "vitest";

function makeState(overrides: Partial<State> = {}): State {
  return {
    readline: {} as Interface,
    commands: {},
    pokeapi: new PokeAPI(60_000),
    nextLocationsURL: "",
    prevLocationsURL: null,
    ...overrides,
  };
}

const location: Location = {
  id: 1,
  name: "canalave-city-area",
  pokemon_encounters: [
    { pokemon: { name: "tentacool", url: "" } },
    { pokemon: { name: "tentacruel", url: "" } },
    { pokemon: { name: "staryu", url: "" } },
  ],
};

describe("commandExplore", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("fetches the given location and prints the names of its Pokemon", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const state = makeState();
    const fetchSpy = vi
      .spyOn(state.pokeapi, "fetchLocation")
      .mockResolvedValue(location);

    await commandExplore(state, "canalave-city-area");

    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(fetchSpy).toHaveBeenCalledWith("canalave-city-area");
    expect(logSpy).toHaveBeenCalledOnce();
    expect(logSpy).toHaveBeenCalledWith(
      "Found Pokemon:\n-tentacool\n-tentacruel\n-staryu",
    );
  });

  test("propagates errors from the API without printing", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const state = makeState();
    vi.spyOn(state.pokeapi, "fetchLocation").mockRejectedValue(
      new Error(
        "Request failed (404 Not Found) for https://pokeapi.co/api/v2/location-area/nowhere",
      ),
    );

    await expect(commandExplore(state, "nowhere")).rejects.toThrow(
      "Request failed (404 Not Found) for https://pokeapi.co/api/v2/location-area/nowhere",
    );
    expect(logSpy).not.toHaveBeenCalled();
  });
});
