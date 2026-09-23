import { CLICommand } from "./command.js";

export function commandHelp(commands: Record<string, CLICommand>) {
  let messages = [];
  for (const cmd in commands) {
    messages.push(`${commands[cmd].name}: ${commands[cmd].description}`);
  }
  console.log(`Welcome to the Pokedex!\nUsage:\n\n${messages.join("\n")}`);
}
