import { initState } from "./state.js";

export function cleanInput(input: string): string[] {
  return input.trim().toLowerCase().split(/\s+/);
}

export function startREPL() {
  const state = initState();
  state.readline.prompt();
  state.readline.on("line", (line) => {
    const input = cleanInput(line);
    const cmd = input[0];
    const commands = state.commands;
    if (commands[cmd]) {
      try {
        commands[cmd].callback(state);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Unkown command");
    }
    state.readline.prompt();
  });
}
