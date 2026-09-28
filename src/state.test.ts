import { initState, State } from "./state.js";
import { commandExit } from "./command_exit.js";
import { commandHelp } from "./command_help.js";
import { commandMap } from "./command_map.js";
import { commandMapb } from "./command_mapb.js";
import { commandExplore } from "./command_explore.js";
import { commandCatch } from "./command_catch.js";
import { commandInspect } from "./command_inspect.js";
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

  test("registers an explore command wired to commandExplore", () => {
    state = initState();
    expect(state.commands.explore).toEqual({
      name: "explore",
      description: "Displays a list of all the Pokémon in a given area",
      callback: commandExplore,
    });
  });

  test("registers a catch command wired to commandCatch", () => {
    state = initState();
    expect(state.commands.catch).toEqual({
      name: "catch",
      description: "Attempts to catch a Pokémon",
      callback: commandCatch,
    });
  });

  test("registers an inspect command wired to commandInspect", () => {
    state = initState();
    expect(state.commands.inspect).toEqual({
      name: "inspect",
      description: "Inspect a Pokemon in your Pokedex",
      callback: commandInspect,
    });
  });

  test("registers only the catch, exit, explore, help, inspect, map, and mapb commands", () => {
    state = initState();
    expect(Object.keys(state.commands).sort()).toEqual([
      "catch",
      "exit",
      "explore",
      "help",
      "inspect",
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

  test("starts with an empty pokedex", () => {
    state = initState();
    expect(state.pokedex).toEqual({});
  });
});
