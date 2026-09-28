import type { Interface } from "node:readline";
import { commandCatch } from "./command_catch.js";
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

const pokemon: Pokemon = {
  id: 25,
  name: "pikachu",
  base_experience: 112,
};

describe("commandCatch", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("catches the Pokemon and adds it to the pokedex when the roll beats its base experience", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    const state = makeState();
    const fetchSpy = vi
      .spyOn(state.pokeapi, "fetchPokemon")
      .mockResolvedValue(pokemon);

    await commandCatch(state, "pikachu");

    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(fetchSpy).toHaveBeenCalledWith("pikachu");
    expect(logSpy.mock.calls).toEqual([
      ["Throwing a Pokeball at pikachu..."],
      ["pikachu was caught!"],
    ]);
    expect(state.pokedex).toEqual({ pikachu: pokemon });
  });

  test("lets the Pokemon escape and leaves the pokedex unchanged when the roll is too low", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(Math, "random").mockReturnValue(0);
    const state = makeState();
    vi.spyOn(state.pokeapi, "fetchPokemon").mockResolvedValue(pokemon);

    await commandCatch(state, "pikachu");

    expect(logSpy.mock.calls).toEqual([
      ["Throwing a Pokeball at pikachu..."],
      ["pikachu escaped!"],
    ]);
    expect(state.pokedex).toEqual({});
  });

  test("lets the Pokemon escape when the roll exactly equals its base experience", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(Math, "random").mockReturnValue(pokemon.base_experience / 600);
    const state = makeState();
    vi.spyOn(state.pokeapi, "fetchPokemon").mockResolvedValue(pokemon);

    await commandCatch(state, "pikachu");

    expect(logSpy).toHaveBeenLastCalledWith("pikachu escaped!");
    expect(state.pokedex).toEqual({});
  });

  test("keeps previously caught Pokemon when catching another", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    const bulbasaur: Pokemon = { id: 1, name: "bulbasaur", base_experience: 64 };
    const state = makeState({ pokedex: { bulbasaur } });
    vi.spyOn(state.pokeapi, "fetchPokemon").mockResolvedValue(pokemon);

    await commandCatch(state, "pikachu");

    expect(state.pokedex).toEqual({ bulbasaur, pikachu: pokemon });
  });

  test("propagates errors from the API without printing", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const state = makeState();
    vi.spyOn(state.pokeapi, "fetchPokemon").mockRejectedValue(
      new Error(
        "Request failed (404 Not Found) for https://pokeapi.co/api/v2/pokemon/missingno",
      ),
    );

    await expect(commandCatch(state, "missingno")).rejects.toThrow(
      "Request failed (404 Not Found) for https://pokeapi.co/api/v2/pokemon/missingno",
    );
    expect(logSpy).not.toHaveBeenCalled();
    expect(state.pokedex).toEqual({});
  });
});
