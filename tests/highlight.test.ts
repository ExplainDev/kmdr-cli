import Highlight from "../src/highlight";

describe("Highlight", () => {
  test("an index position 2 is within the range [1, 3]", () => {
    const range = [1, 3];
    expect(Highlight.inRange(2, range)).toBeTruthy();
  });

  test("an index position 0 is not within the range [1,10]", () => {
    const range = [1, 10];
    expect(Highlight.inRange(0, range)).toBeFalsy();
  });

  test("an index position 3 is not within the range [0, 3]", () => {
    const range = [0, 3];
    expect(Highlight.inRange(3, range)).toBeFalsy();
  });
});
