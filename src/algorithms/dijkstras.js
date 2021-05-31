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

  const { walls, graph, start, end, speed } = board;
  if (start === end) {
    return {
      distance: 0,
      path: [],
    };
  }
  const costs = Object.assign({ end: Infinity }, graph[start].neighbors);
  const parents = { end: null };
  const processed = [];
  for (let wall of walls) {
    if (costs[wall]) {
      delete costs[wall];
    }
  }
  for (let child in graph[start].neighbors) {
    if (
      graph[child] &&
      !Object.keys(graph[start].neighbors).includes(end) &&
      !walls.includes(child)
    ) {
      graph[child].distance = 1;
    }
    parents[child] = start;
  }

  let node = lowestCostNode(costs, processed);

  const myPromise = new Promise((resolve, reject) => {
    let visitedNodes = [];

    while (true) {
      let cost = costs[node];
      let children;
      if (graph[node]) {
        children = graph[node].neighbors;
      } else {
        children = {};
      }
      for (let n in children) {
        if (!walls.includes(n) || n === end) {
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

      if (
        graph[node] &&
        !board.isNode(node) &&
        !board.isNode(node) &&
        !walls.includes(node)
      ) {
        visitedNodes.push(node);
        graph[node].distance = costs[node];
      }

      if (node === end) {
        break;
      }
      processed.push(node);
      node = lowestCostNode(costs, processed);
      if (node === null) {
        break;
      }
    }

    if (board.solved) {
      board.domController.printVisited(visitedNodes, parents[end]);
      resolve(visitedNodes);
    } else {
      board.domController.animateVisited(visitedNodes, resolve);
    }
  });

  let visited = await myPromise;

  let optimalPath = [end];
  let parent = parents[end];
  delete parents[start];

  if (!parent) {
    return {
      distance: Infinity,
      path: visited,
    };
  }

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
