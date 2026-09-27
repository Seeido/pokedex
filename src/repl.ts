import { initState } from "./state.js";

export function cleanInput(input: string): string[] {
  return input.trim().toLowerCase().split(/\s+/);
}

export async function startREPL() {
  const state = initState();
  state.readline.prompt();
  state.readline.on("line", async (line) => {
    const input = cleanInput(line);
    const cmd = input[0];
    const commands = state.commands;
    if (commands[cmd]) {
      try {
        await commands[cmd].callback(state);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Unknown command");
    }
    state.readline.prompt();
  });
}
