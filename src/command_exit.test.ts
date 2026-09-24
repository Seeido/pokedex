import type { Interface } from "node:readline";
import { commandExit } from "./command_exit.js";
import { State } from "./state.js";
import { describe, expect, test, vi, afterEach } from "vitest";

describe("commandExit", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("logs a goodbye message, closes readline, and exits with code 0", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);

    const close = vi.fn();
    const state: State = {
      readline: { close } as unknown as Interface,
      commands: {},
    };

    commandExit(state);

    expect(logSpy).toHaveBeenCalledOnce();
    expect(logSpy).toHaveBeenCalledWith("Closing the Pokedex... Goodbye!");
    expect(close).toHaveBeenCalledOnce();
    expect(exitSpy).toHaveBeenCalledOnce();
    expect(exitSpy).toHaveBeenCalledWith(0);
  });
});
