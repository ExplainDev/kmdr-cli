import Console from "../src/console";
import ExplainClient from "../src/explain/explainClient";

describe("Console", () => {
  const customConsole = new Console();

  beforeAll(() => {
    spyOn(console, "log");
  });

  test("log receives a string message", () => {
    customConsole.log("this is a test");

    expect(console.log).toHaveBeenCalledWith("this is a test");
  });

  test("prints a new empty line above a message", () => {
    customConsole.print("a message with new line above", { prependNewLine: true });
    expect(console.log).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("  a message with new line above");
  });

  test("prints a new empty line above and below a message", () => {
    customConsole.print("a message between new lines", {
      appendNewLine: true,
      prependNewLine: true,
    });
    expect(console.log).toHaveBeenCalledWith();
    expect(console.log).toHaveBeenCalledWith("  a message between new lines");
    expect(console.log).toHaveBeenCalled();
  });
});
