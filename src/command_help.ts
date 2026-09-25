import { State } from "./state.js";

export async function commandHelp(state: State) {
  let messages = [];
  const commands = state.commands;
  for (const cmd in commands) {
    messages.push(`${commands[cmd].name}: ${commands[cmd].description}`);
  }
  console.log(`Welcome to the Pokedex!\nUsage:\n\n${messages.join("\n")}`);
}
