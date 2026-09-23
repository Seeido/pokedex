import { commandHelp } from "./command_help.js";
import { CLICommand } from "./command.js";
import { describe, expect, test, vi, afterEach } from "vitest";

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

    commandHelp(commands);

    expect(logSpy).toHaveBeenCalledOnce();
    const output = logSpy.mock.calls[0][0] as string;
    expect(output).toContain("Welcome to the Pokedex!");
    expect(output).toContain("Usage:");
    expect(output).toContain("exit: Exit the Pokedex");
    expect(output).toContain("help: Print help message");
  });

  test("prints only the welcome message and usage header when there are no commands", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    commandHelp({});

    expect(logSpy).toHaveBeenCalledOnce();
    expect(logSpy).toHaveBeenCalledWith("Welcome to the Pokedex!\nUsage:\n\n");
  });
});
