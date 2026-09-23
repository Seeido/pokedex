import { cleanInput, getCommands } from "./repl.js";
import { commandExit } from "./command_exit.js";
import { commandHelp } from "./command_help.js";
import { describe, expect, test } from "vitest";

describe.each([
  {
    input: " hello  world  ",
    expected: ["hello", "world"],
  },
  {
    input: "Helloo everynYAN  ",
    expected: ["helloo", "everynyan"],
  },
  {
    input: "         idk",
    expected: ["idk"],
  },
  {
    input: "YUmmers      .",
    expected: ["yummers", "."],
  },
  {
    input: "hello",
    expected: ["hello"],
  },
  {
    input: "  foo   bar  baz  ",
    expected: ["foo", "bar", "baz"],
  },
])("cleanInput($input)", ({ input, expected }) => {
  test(`Expected: ${expected}`, () => {
    const actual = cleanInput(input);
    expect(actual).toHaveLength(expected.length);
    for (const i in expected) {
      expect(actual[i]).toBe(expected[i]);
    }
  });
});

describe("getCommands", () => {
  test("returns an exit command wired to commandExit", () => {
    const commands = getCommands();
    expect(commands.exit).toEqual({
      name: "exit",
      description: "Exit the Pokedex",
      callback: commandExit,
    });
  });

  test("returns a help command wired to commandHelp", () => {
    const commands = getCommands();
    expect(commands.help).toEqual({
      name: "help",
      description: "Print help message",
      callback: commandHelp,
    });
  });

  test("returns only the exit and help commands", () => {
    const commands = getCommands();
    expect(Object.keys(commands).sort()).toEqual(["exit", "help"]);
  });
});
