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

  const { walls, grid, start, end } = board;
  const costs = Object.assign({ end: Infinity }, grid[start].neighbors);
  const parents = { end: null };
  const processed = [];
  for (let wall of walls) {
    if (costs[wall]) {
      delete costs[wall];
    }
  }
  for (let child in grid[start].neighbors) {
    parents[child] = start;
  }

  let node = lowestCostNode(costs, processed);

  const myPromise = new Promise((resolve, reject) => {
    let visitedNodes = [];
    while (true) {
      let cost = costs[node];
      let children;
      if (grid[node]) {
        children = grid[node].neighbors;
      } else {
        children = {};
      }
      for (let n in children) {
        if (!walls.includes(n) || walls.includes(end)) {
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
      if (node === end) {
        break;
      }
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
  delete parents[start];

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
