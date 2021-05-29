let assert = require("assert");
describe("Board", () => {
  it("has 2 Dimentions", () => {
    let width = 5;
    let height = 4;
    const graph = Array(height)
      .fill(0)
      .map((node) => Array(width).fill(0));
    assert.strictEqual(graph.length * graph[0].length, 20);
  });
});
