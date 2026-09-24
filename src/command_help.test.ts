import { commandHelp } from "./command_help.js";
import type { Interface } from "node:readline";
import { CLICommand, State } from "./state.js";
import { describe, expect, test, vi, afterEach } from "vitest";

function makeState(commands: Record<string, CLICommand>): State {
  return { readline: {} as Interface, commands };
}

describe("commandHelp", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("prints the welcome message and every command's name and description", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const commands: Record<string, CLICommand> = {
      exit: {
        name: "exit",
        description: "Exit the Pokedex",
        callback: vi.fn(),
      },
      help: {
        name: "help",
        description: "Print help message",
        callback: vi.fn(),
      },
    };

    commandHelp(makeState(commands));

    expect(logSpy).toHaveBeenCalledOnce();
    const output = logSpy.mock.calls[0][0] as string;
    expect(output).toContain("Welcome to the Pokedex!");
    expect(output).toContain("Usage:");
    expect(output).toContain("exit: Exit the Pokedex");
    expect(output).toContain("help: Print help message");
  });

  test("prints only the welcome message and usage header when there are no commands", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    commandHelp(makeState({}));

    expect(logSpy).toHaveBeenCalledOnce();
    expect(logSpy).toHaveBeenCalledWith("Welcome to the Pokedex!\nUsage:\n\n");
  });
});
