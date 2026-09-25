import { createInterface, type Interface } from "node:readline";
import { stdin, stdout } from "node:process";
import { commandHelp } from "./command_help.js";
import { commandExit } from "./command_exit.js";
import { commandMap } from "./command_map.js";
import { PokeAPI, ShallowLocations } from "./pokeapi.js";
import { commandMapb } from "./command_mapb.js";

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State) => Promise<void>;
};

export type State = {
  readline: Interface;
  commands: Record<string, CLICommand>;
  pokeapi: PokeAPI;
  nextLocationsURL: ShallowLocations["next"];
  prevLocationsURL: ShallowLocations["previous"];
};

export function initState() {
  const state: State = {
    readline: createInterface({
      input: stdin,
      output: stdout,
      prompt: "Pokédex > ",
    }),
    commands: getCommands(),
    pokeapi: new PokeAPI(),
    nextLocationsURL: "", // "" = not started yet (fetchLocations falls back to page one); null = no more pages
    prevLocationsURL: null,
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
  };
}
