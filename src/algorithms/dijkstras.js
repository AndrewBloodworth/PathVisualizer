import { store } from "../app/store";

const lowestCostNode = (costs, processed) => {
  return Object.keys(costs).reduce((lowest, node) => {
    if (lowest === null || costs[node] < costs[lowest]) {
      if (!processed.includes(node)) lowest = node;
    }
    return lowest;
  }, null);
};

export const dijkstra = async () => {
  const board = store.getState().board.board;
  console.log("d", board);

  const { walls, graph, start, end } = board;
  const costs = Object.assign({ end: Infinity }, graph[start]);
  const parents = { end: null };
  const processed = [];
  for (let wall of walls) if (costs[wall]) delete graph[wall];
  for (let child in graph[start]) parents[child] = graph[start];

  let node = lowestCostNode(costs, processed);

  const myPromise = new Promise((resolve, reject) => {
    let visitedNodes = [];
    while (true) {
      let cost = costs[node];
      let children = graph[node];
      for (let n in children) {
        if (!walls.includes(n)) {
          let newCost = cost + children[n];
          if (!costs[n]) {
            costs[n] = newCost;
            parents[n] = node;
          }
          if (costs[n] > newCost) {
            costs[n] = newCost;
            parents[n] = node;
          }
        }
      }
      const el = document.getElementById(node);
      if (
        el &&
        el.className !== "start-node" &&
        el.className !== "end-node" &&
        !walls.includes(node)
      )
        visitedNodes.push(node);
      if (node === end) break;
      processed.push(node);
      node = lowestCostNode(costs, processed);
    }

    if (board.solved) {
      for (let v of visitedNodes) {
        const el = document.getElementById(v);
        el.className = "visited-immediate";
        board.grid[v].state = "visited-immediate";
      }
      resolve();
    } else {
      let i = 0;
      let interval = setInterval(() => {
        const el = document.getElementById(visitedNodes[i]);
        el.className = "visited";
        board.grid[visitedNodes[i]].state = "visited";
        i++;
        if (!visitedNodes[i]) {
          clearInterval(interval);
          resolve();
        }
      }, 10);
    }
  });

  await myPromise;

  let optimalPath = [end];
  let parent = parents[end];

  while (parent) {
    optimalPath.push(parent);
    parent = parents[parent];
  }

  optimalPath.reverse();

  const results = {
    distance: costs[end],
    path: optimalPath,
  };
  results.path.shift();
  results.path.pop();
  return results;
};
