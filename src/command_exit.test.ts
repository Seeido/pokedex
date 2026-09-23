import { commandExit } from "./command_exit.js";
import { describe, expect, test, vi, afterEach } from "vitest";

describe("commandExit", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("logs a goodbye message and exits with code 0", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);

    commandExit();

    expect(logSpy).toHaveBeenCalledOnce();
    expect(logSpy).toHaveBeenCalledWith("Closing the Pokedex... Goodbye!");
    expect(exitSpy).toHaveBeenCalledOnce();
    expect(exitSpy).toHaveBeenCalledWith(0);
  });
});
