import type { Interface } from "node:readline";
import { commandPokedex } from "./command_pokedex.js";
import { PokeAPI, Pokemon } from "./pokeapi.js";
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

function makePokemon(id: number, name: string): Pokemon {
  return {
    id,
    name,
    base_experience: 50,
    height: 3,
    weight: 18,
    stats: [],
    types: [],
  };
}

describe("commandPokedex", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("prints every caught Pokemon in the order they were caught", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const state = makeState({
      pokedex: {
        pidgey: makePokemon(16, "pidgey"),
        caterpie: makePokemon(10, "caterpie"),
        bulbasaur: makePokemon(1, "bulbasaur"),
      },
    });

    await commandPokedex(state);

    expect(logSpy).toHaveBeenCalledOnce();
    expect(logSpy).toHaveBeenCalledWith(
      "Your Pokedex:\n - pidgey\n - caterpie\n - bulbasaur",
    );
  });

  test("prints a single caught Pokemon", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const state = makeState({ pokedex: { pidgey: makePokemon(16, "pidgey") } });

    await commandPokedex(state);

    expect(logSpy).toHaveBeenCalledOnce();
    expect(logSpy).toHaveBeenCalledWith("Your Pokedex:\n - pidgey");
  });

  test("prints a message when no Pokemon have been caught", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await commandPokedex(makeState());

    expect(logSpy).toHaveBeenCalledOnce();
    expect(logSpy).toHaveBeenCalledWith("You haven't caught any Pokemon");
  });

  test("does not call the API or modify the pokedex", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const pidgey = makePokemon(16, "pidgey");
    const state = makeState({ pokedex: { pidgey } });
    const fetchSpy = vi.spyOn(state.pokeapi, "fetchPokemon");

    await commandPokedex(state);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(state.pokedex).toEqual({ pidgey });
  });
});
