import { dijkstra } from "./algorithms/dijkstras";

export class Board {
  constructor(start, end, width, height, grid, graph) {
    this.start = start;
    this.end = end;
    this.width = width;
    this.height = height;
    this.walls = [];
    this.grid = grid;
    this.graph = graph;
    this.solved = false;
  }
  isNode(id) {
    if (id === this.start || id === this.end) {
      return true;
    }
  }
  addRemoveWall(target) {
    if (target.className === "unvisited") {
      this.walls.push(target.id);
      target.className = "wall";
      this.grid[target.id].state = "wall";
    } else if (target.className === "wall") {
      this.walls.splice(this.walls.indexOf(target.id), 1);
      target.className = "unvisited";
      this.grid[target.id].state = "unvisited";
    }
  }
  placeNode(name, id) {
    if (name === "start-node") {
      this.grid[this.start].items.shift();
      this.grid[id].items.unshift("start-node");
      this.start = id;
    } else if (name === "end-node") {
      this.grid[this.end].items.shift();
      this.grid[id].items.unshift("end-node");
      this.end = id;
    }
  }
  async runDijkstra() {
    this.clearBoard(false);
    let result = await dijkstra();
    let i = 0,
      length = result.path.length;
    if (this.solved) {
      for (let i = 0; i < result.path.length; i++) {
        document.getElementById(result.path[i]).className = "path-immediate";
      }
    } else {
      this.solved = true;
      const interval = setInterval(() => {
        document.getElementById(result.path[i]).className = "path";
        i++;
        if (i === length) clearInterval(interval);
      }, 1);
    }
  }
  clearBoard(clearWalls) {
    for (let box in this.grid) {
      const el = document.getElementById(box);
      if (
        el.className === "visited" ||
        el.className === "path" ||
        el.className === "visited-immediate" ||
        el.className === "path-immediate"
      ) {
        el.className = "unvisited";
        this.grid[box].state = "unvisited";
      }
      if (this.walls.includes(box) && clearWalls) {
        el.className = "unvisited";
        this.grid[box].state = "unvisited";
        this.walls.splice(this.walls.indexOf(box), 1);
      }
    }
  }
}
