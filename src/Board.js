import { dijkstra } from "./algorithms/dijkstras";

class Node {
  constructor(neighbors, items = []) {
    this.neighbors = neighbors;
    this.items = items;
    this.state = "unvisited";
  }
}

export class Board {
  constructor() {
    this.start = "0-0";
    this.end = "0-0";
    this.width = 0;
    this.height = 0;
    this.walls = [];
    this.grid = {};
    this.graph = {};
    this.solved = false;
  }
  manufactureGrid(slider) {
    this.manufactureGraph(slider);
  }
  manufactureGraph(n = 5) {
    let size = (window.innerHeight - 50) / n - 3;
    let m = window.innerWidth / ((window.innerHeight - 50) / n);
    console.log(size, (window.innerHeight - 50) / n, (n + 1) / n);
    this.height = Number(n);
    this.width = Math.floor(m) - 1;
    let r = document.querySelector(":root");
    r.style.setProperty("--size", `${size}px`);
    const vertMiddle = Math.floor(this.height / 2);
    const horzFirstThird = Math.floor(this.width / 6);
    const horzLastThird = this.width - Math.floor(this.width / 6);
    this.start = `${vertMiddle}-${horzFirstThird}`;
    this.end = `${vertMiddle}-${horzLastThird}`;
    let temp = {};
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        let id = `${i}-${j}`;
        let neighbors = this.findNeighbors(i, j);
        temp[id] = new Node(neighbors, this.nodetype(id));
      }
    }
    this.grid = temp;
  }
  findNeighbors(i, j) {
    let right = j + 1 > this.width - 1 ? null : `${i}-${j + 1}`;
    let left = j - 1 < 0 ? null : `${i}-${j - 1}`;
    let up = i + 1 > this.height - 1 ? null : `${i + 1}-${j}`;
    let down = i - 1 < 0 ? null : `${i - 1}-${j}`;
    return { [right]: 1, [left]: 1, [up]: 1, [down]: 1 };
  }
  isNode(id) {
    if (id === this.start || id === this.end) {
      return true;
    }
  }
  nodetype(id) {
    if (id === this.start) {
      return ["start-node"];
    } else if (id === this.end) {
      return ["end-node"];
    } else {
      return [];
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
        this.grid[result.path[i]].state = "path-immediate";
        document.getElementById(result.path[i]).className = "path-immediate";
      }
    } else {
      this.solved = true;
      const interval = setInterval(() => {
        this.grid[result.path[i]].state = "path";
        document.getElementById(result.path[i]).className = "path";
        i++;
        if (i === length) {
          clearInterval(interval);
        }
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
