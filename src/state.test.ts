import { initState, State } from "./state.js";
import { commandExit } from "./command_exit.js";
import { commandHelp } from "./command_help.js";
import { commandMap } from "./command_map.js";
import { commandMapb } from "./command_mapb.js";
import { PokeAPI } from "./pokeapi.js";
import { describe, expect, test, afterEach } from "vitest";

describe("initState", () => {
  let state: State;

  afterEach(() => {
    state.readline.close();
  });

  test("registers an exit command wired to commandExit", () => {
    state = initState();
    expect(state.commands.exit).toEqual({
      name: "exit",
      description: "Exit the Pokedex",
      callback: commandExit,
    });
  });

  test("registers a help command wired to commandHelp", () => {
    state = initState();
    expect(state.commands.help).toEqual({
      name: "help",
      description: "Print help message",
      callback: commandHelp,
    });
  });

  test("registers a map command wired to commandMap", () => {
    state = initState();
    expect(state.commands.map).toEqual({
      name: "map",
      description: "Displays the names of the next 20 location areas",
      callback: commandMap,
    });
  });

  test("registers a mapb command wired to commandMapb", () => {
    state = initState();
    expect(state.commands.mapb).toEqual({
      name: "mapb",
      description: "Displays the names of the previous 20 location areas",
      callback: commandMapb,
    });
  });

  test("registers only the exit, help, map, and mapb commands", () => {
    state = initState();
    expect(Object.keys(state.commands).sort()).toEqual([
      "exit",
      "help",
      "map",
      "mapb",
    ]);
  });

  test("creates a readline interface with the 'Pokédex > ' prompt", () => {
    state = initState();
    expect(state.readline.getPrompt()).toBe("Pokédex > ");
  });

  test("creates a PokeAPI client and starts before the first locations page", () => {
    state = initState();
    expect(state.pokeapi).toBeInstanceOf(PokeAPI);
    expect(state.nextLocationsURL).toBe("");
    expect(state.prevLocationsURL).toBeNull();
  });
});
