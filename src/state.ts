import { createInterface, type Interface } from "node:readline";
import { stdin, stdout } from "node:process";
import { commandHelp } from "./command_help.js";
import { commandExit } from "./command_exit.js";
import { commandMap } from "./command_map.js";
import { PokeAPI, Pokemon, ShallowLocations } from "./pokeapi.js";
import { commandMapb } from "./command_mapb.js";
import { commandExplore } from "./command_explore.js";
import { commandCatch } from "./command_catch.js";

const CACHE_INTERVAL_MS = 5 * 60 * 1000;

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State, ...args: string[]) => Promise<void>;
};

export type State = {
  readline: Interface;
  commands: Record<string, CLICommand>;
  pokeapi: PokeAPI;
  nextLocationsURL: ShallowLocations["next"];
  prevLocationsURL: ShallowLocations["previous"];
  pokedex: Record<string, Pokemon>;
};

export function initState() {
  const state: State = {
    readline: createInterface({
      input: stdin,
      output: stdout,
      prompt: "Pokédex > ",
    }),
    commands: getCommands(),
    pokeapi: new PokeAPI(CACHE_INTERVAL_MS),
    nextLocationsURL: "", // "" = not started yet (fetchLocations falls back to page one); null = no more pages
    prevLocationsURL: null,
    pokedex: {},
  };
  return state;
}

function getCommands(): Record<string, CLICommand> {
  return {
    exit: {
      name: "exit",
      description: "Exit the Pokedex",
      callback: commandExit,
    },
    help: {
      name: "help",
      description: "Print help message",
      callback: commandHelp,
    },
    map: {
      name: "map",
      description: "Displays the names of the next 20 location areas",
      callback: commandMap,
    },
    mapb: {
      name: "mapb",
      description: "Displays the names of the previous 20 location areas",
      callback: commandMapb,
    },
    explore: {
      name: "explore",
      description: "Displays a list of all the Pokémon in a given area",
      callback: commandExplore,
    },
    catch: {
      name: "catch",
      description: "Attempts to catch a Pokémon",
      callback: commandCatch,
    },
  };
}
