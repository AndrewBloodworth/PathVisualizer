export class Algorithm {
  constructor(board) {
    this.board = board;
    this.distances = {};
    this.parents = {};
    this.processed = [];
  }
  init() {
    this.board.clearBoard(false);
    this.initParameters();
    this.initNeighbors();
  }
  initParameters() {
    this.distances = Object.assign(
      { end: Infinity },
      this.board.graph[this.board.start].neighbors
    );
    this.parents = { end: null };
    this.processed = [];
    this.filterWalls();
  }
  initNeighbors() {
    let neighbors = this.getNeighbors(this.board.start);
    for (let neighbor in neighbors) {
      if (
        this.board.graph[neighbor] &&
        !Object.keys(neighbors).includes(this.board.end) &&
        !this.board.walls.includes(neighbor) &&
        this.board.start !== this.board.end
      ) {
        this.board.graph[neighbor].setDistance(1);
      }
      this.parents[neighbor] = this.board.start;
    }
  }
  async getVisited() {
    return new Promise((resolve, reject) => {
      let visitedNodes = [];
      while (true) {
        let node = this.lowestCostNode();
        const nodeDistance = this.distance(node);
        const neighborDistances = this.getNeighbors(node);
        for (let neighbor in neighborDistances) {
          if (
            !this.board.walls.includes(neighbor) ||
            neighbor === this.board.end
          ) {
            const neighborDistance = nodeDistance + neighborDistances[neighbor];
            if (
              !this.distance(neighbor) ||
              this.distance(neighbor) > neighborDistance
            ) {
              this.distances[neighbor] = neighborDistance;
              this.parents[neighbor] = node;
            }
          }
        }
        if (
          this.board.graph[node] &&
          !this.board.isNode(node) &&
          !this.board.walls.includes(node)
        ) {
          visitedNodes.push(node);
          this.board.graph[node].setDistance(this.distance(node));
        }
        this.processed.push(node);
        if (node === this.board.end || this.lowestCostNode() === null) {
          break;
        }
      }
      if (this.board.solved) {
        this.board.dom.printVisited(visitedNodes, this.parents[this.board.end]);
        resolve(visitedNodes);
      } else {
        this.board.dom.animateVisited(visitedNodes, resolve);
      }
    });
  }
  async definePath() {
    this.board.dom.disableInteraction(true);
    this.board.dom.updatePathDistance("Searching...");
    let distance = 0,
      path = [];

    const visited = await this.getVisited();
    let parent = this.parents[this.board.end];
    if (this.board.start === this.board.end) {
    } else if (!parent) {
      distance = Infinity;
      path = visited;
    } else {
      while (parent !== this.board.start) {
        path.push(parent);
        parent = this.parents[parent];
      }
      path.reverse();
      distance = this.distance(this.board.end);
      this.board.dom.pointToPath(path[0]);
    }

    return () => {
      this.board.dom.disableInteraction(false);
      this.board.dom.updatePathDistance(distance);
      return {
        distance,
        path,
      };
    };
  }

  lowestCostNode() {
    return Object.keys(this.distances).reduce((lowest, node) => {
      if (lowest === null || this.distances[node] < this.distances[lowest]) {
        if (!this.processed.includes(node)) lowest = node;
      }
      return lowest;
    }, null);
  }
  filterWalls() {
    for (let wall of this.board.walls) {
      if (this.distances[wall]) {
        delete this.distances[wall];
      }
    }
  }
  getNeighbors(node) {
    return this.board.graph[node] ? this.board.graph[node].neighbors : {};
  }
  distance(node) {
    return this.distances[node];
  }
}
