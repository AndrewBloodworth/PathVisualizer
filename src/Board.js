import { dijkstra } from "./algorithms/dijkstras";

class Node {
  constructor(key) {
    this.key = key;
    this.neighbors = [];
  }
  getNeighbors() {}
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
    if (slider == 0) {
      slider = 25;
    } else if (slider == 1) {
      slider = 30;
    } else {
      slider = 50;
    }
    console.log(slider);
    var r = document.querySelector(":root");
    r.style.setProperty("--size", `${slider}px`);
    this.manufactureGraph(slider);
  }
  manufactureGraph(size = 50) {
    this.height = Math.floor(window.innerHeight / size);
    this.width = Math.floor(window.innerWidth / size);
    console.log(this.height, this.width);
    const vertMiddle = Math.floor(this.height / 2);
    const horzFirstThird = Math.floor(this.width / 6);
    const horzLastThird = this.width - Math.floor(this.width / 6);
    this.start = `${vertMiddle}-${horzFirstThird}`;
    this.end = `${vertMiddle}-${horzLastThird}`;
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        let id = `${i}-${j}`;
        let neighbors = this.findNeighbors(i, j);
        if (id === this.start) {
          this.grid[id] = {
            neighbors,
            items: ["start-node"],
            state: "unvisited",
          };
        } else if (id === this.end) {
          this.grid[id] = {
            neighbors,
            items: ["end-node"],
            state: "unvisited",
          };
        } else {
          this.grid[id] = { neighbors, items: [], state: "unvisited" };
        }
      }
    }
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
