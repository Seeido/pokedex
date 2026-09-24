import { createInterface, type Interface } from "node:readline";
import { stdin, stdout } from "node:process";
import { commandHelp } from "./command_help.js";
import { commandExit } from "./command_exit.js";

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State) => void;
};

export type State = {
  readline: Interface;
  commands: Record<string, CLICommand>;
};

export function initState() {
  const state: State = {
    readline: createInterface({
      input: stdin,
      output: stdout,
      prompt: "> ",
    }),
    commands: getCommands(),
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
  };
}
