const lowestCostNode = (costs, processed) => {
    return Object.keys(costs).reduce((lowest, node) => {
        if (lowest === null || costs[node] < costs[lowest]) {
            if (!processed.includes(node)) lowest = node;
        }
        return lowest;
    }, null);
  };

export const graph = {}
export const walls = [];
export let completed = false;
export const boxes = []

export const buildGraph = (start,cName) => {
    let index = start.indexOf('-');
    let row = Number(start.slice(0,index))
    let col = Number(start.slice(index+1,start.length))
    let right = col+1 > graph.cols-1 ? null : `${row}-${col+1}`;
    let left = col-1 < 0 ? null : `${row}-${col-1}`;
    let up = row+1 > graph.rows-1 ? null : `${row+1}-${col}`;
    let down = row-1 < 0 ? null : `${row-1}-${col}`;
    if (cName !== 'wall') graph[start] = { [right]: 1, [left]: 1, [up]: 1, [down]: 1 };
    boxes.push(start);
}

export const dijkstra = async () => {
    const costs = Object.assign({end: Infinity}, graph[graph.startNode]);
    const parents = {end: null};
    const processed = [];
    for (let wall of walls) if (costs[wall]) delete graph[wall]
    for (let child in graph[graph.startNode]) parents[child] = graph[graph.startNode];

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
            if (node === graph.endNode) {
                clearInterval(interval);
                resolve()
            }
            processed.push(node);
            node = lowestCostNode(costs, processed);
            if (!node) clearInterval(interval);
        }, 10)
    });
    
    await myPromise

    let optimalPath = [graph.endNode];
    let parent = parents[graph.endNode];

    while (parent) {
        optimalPath.push(parent);
        parent = parents[parent];
    }
      
    optimalPath.reverse();

    const results = {
    distance: costs[graph.endNode],
    path: optimalPath
    };
    completed = true;
    return results;
}
