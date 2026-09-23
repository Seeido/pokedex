import { CLICommand } from "./command.js";
import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";
import { commandExit } from "./command_exit.js";
import { commandHelp } from "./command_help.js";

const rl = createInterface({
  input: stdin,
  output: stdout,
  prompt: "> ",
});

export function cleanInput(input: string): string[] {
  return input.trim().toLowerCase().split(/\s+/);
}

export function startREPL() {
  rl.prompt();
  rl.on("line", (line) => {
    const input = cleanInput(line);
    const cmd = input[0];
    const commands = getCommands();
    if (commands[cmd]) {
      try {
        commands[cmd].callback(commands);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Unkown command");
    }
    rl.prompt();
  });
}

export function getCommands(): Record<string, CLICommand> {
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
