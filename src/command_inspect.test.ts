import type { Interface } from "node:readline";
import { commandInspect } from "./command_inspect.js";
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

const pidgey: Pokemon = {
  id: 16,
  name: "pidgey",
  base_experience: 50,
  height: 3,
  weight: 18,
  stats: [
    {
      base_stat: 40,
      effort: 0,
      stat: { name: "hp", url: "https://pokeapi.co/api/v2/stat/1/" },
    },
    {
      base_stat: 45,
      effort: 0,
      stat: { name: "attack", url: "https://pokeapi.co/api/v2/stat/2/" },
    },
    {
      base_stat: 56,
      effort: 1,
      stat: { name: "speed", url: "https://pokeapi.co/api/v2/stat/6/" },
    },
  ],
  types: [
    {
      slot: 1,
      type: { name: "normal", url: "https://pokeapi.co/api/v2/type/1/" },
    },
    {
      slot: 2,
      type: { name: "flying", url: "https://pokeapi.co/api/v2/type/3/" },
    },
  ],
};

describe("commandInspect", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("prints the name, height, weight, stats, and types of a caught Pokemon", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const state = makeState({ pokedex: { pidgey } });

    await commandInspect(state, "pidgey");

    expect(logSpy).toHaveBeenCalledOnce();
    expect(logSpy).toHaveBeenCalledWith(
      "Name: pidgey\n" +
        "Height: 3\n" +
        "Weight: 18\n" +
        "Stats:\n" +
        "  -hp: 40\n" +
        "  -attack: 45\n" +
        "  -speed: 56\n" +
        "Types:\n" +
        "  - normal\n" +
        "  - flying",
    );
  });

  test("prints a message when the Pokemon has not been caught", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const state = makeState({ pokedex: { pidgey } });

    await commandInspect(state, "pikachu");

    expect(logSpy).toHaveBeenCalledOnce();
    expect(logSpy).toHaveBeenCalledWith("you have not caught that pokemon");
  });

  test("prints a message when the pokedex is empty", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await commandInspect(makeState(), "pidgey");

    expect(logSpy).toHaveBeenCalledOnce();
    expect(logSpy).toHaveBeenCalledWith("you have not caught that pokemon");
  });

  test("does not call the API", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const state = makeState({ pokedex: { pidgey } });
    const fetchSpy = vi.spyOn(state.pokeapi, "fetchPokemon");

    await commandInspect(state, "pidgey");
    await commandInspect(state, "pikachu");

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
