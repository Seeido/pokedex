import { initState, State } from "./state.js";
import { commandExit } from "./command_exit.js";
import { commandHelp } from "./command_help.js";
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

  test("registers only the exit and help commands", () => {
    state = initState();
    expect(Object.keys(state.commands).sort()).toEqual(["exit", "help"]);
  });

  test("creates a readline interface with the '> ' prompt", () => {
    state = initState();
    expect(state.readline.getPrompt()).toBe("> ");
  });
});
