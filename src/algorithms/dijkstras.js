import { store } from '../app/store';

const lowestCostNode = (costs, processed) => {
    return Object.keys(costs).reduce((lowest, node) => {
        if (lowest === null || costs[node] < costs[lowest]) {
            if (!processed.includes(node)) lowest = node;
        }
        return lowest;
    }, null);
  };

export const dijkstra = async () => {
    const { walls, graph, start, end } = store.getState().board.board;
    const costs = Object.assign({end: Infinity}, graph[start]);
    const parents = {end: null};
    const processed = [];
    for (let wall of walls) if (costs[wall]) delete graph[wall]
    for (let child in graph[start]) parents[child] = graph[start];

    let node = lowestCostNode(costs, processed);

    const myPromise = new Promise((resolve, reject) => {
        let interval = setInterval(() => {
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
            if (el && el.className !== 'start-node' && el.className !== 'end-node' && !walls.includes(node)) el.className = 'visited';
            if (node === end) {
                clearInterval(interval);
                resolve()
            }
            processed.push(node);
            node = lowestCostNode(costs, processed);
            if (!node) clearInterval(interval);
        }, 10)
    });
    
    await myPromise

    let optimalPath = [end];
    let parent = parents[end];

    while (parent) {
        optimalPath.push(parent);
        parent = parents[parent];
    }
      
    optimalPath.reverse();

    const results = {
    distance: costs[end],
    path: optimalPath
    };
    return results;
}
