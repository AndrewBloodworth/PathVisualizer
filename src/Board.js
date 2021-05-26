import { dijkstra } from "./algorithms/dijkstras";

class Node {
  constructor(neighbors, items = []) {
    this.neighbors = neighbors;
    this.items = items;
    this.state = "unvisited";
  }
  hasItem() {
    return this.items.length > 0;
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
    //TODO more elegant way of rotating start
    //document.getElementById(this.start).style = "";

    /*
    for (let wall of this.walls) {
      this.grid[wall].state = "unvisited";
    }
    this.walls = [];
    this.solved = false;
    */
    //this.manufactureGraph(slider);
    const gridSizer = this.assignGridOfSize(slider);
    gridSizer();
  }
  assignGridOfSize(numberOfRows = 20) {
    const navHeight = 50;
    const boarderPixelCount = 3;
    const conceptualPixelCount =
      (window.innerHeight - navHeight) / numberOfRows;
    const verticalPixelCount = conceptualPixelCount - boarderPixelCount;
    const numberOfColumns = window.innerWidth / conceptualPixelCount;

    this.height = Number(numberOfRows);
    this.width = Math.floor(numberOfColumns) - 1;

    return () => {
      const cssRoot = document.querySelector(":root");
      cssRoot.style.setProperty("--size", `${verticalPixelCount}px`);
    };
  }
  assignNodes() {
    const vertMiddle = Math.floor(this.height / 2);
    const horzFirstThird = Math.floor(this.width / 6);
    const horzLastThird = this.width - Math.floor(this.width / 6);

    this.start = `${vertMiddle}-${horzFirstThird}`;
    this.end = `${vertMiddle}-${horzLastThird}`;
  }
  manufactureGraph() {
    this.assignGridOfSize();
    this.assignNodes();

    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        const id = `${i}-${j}`;
        const neighbors = this.findNeighbors(i, j);
        this.grid[id] = new Node(neighbors, this.nodetype(id));
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
      //TODO more elegant way of rotating start
      let el = document.getElementById(this.start);
      if (el.style.transform) {
        el.style = "";
      }
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

    //TODO more elegant way of rotating start
    if (result.path[0]) {
      //start-node
      let st = document.getElementById(this.start);
      //2nd node in shortest path as x and y coordinates
      let [x, y] = result.path[0].split("-");
      //The Start of the Board as x and y coordinates
      let [xs, ys] = this.start.split("-");
      //Left
      if (Number(ys) - 1 === Number(y)) {
        st.style.transform = "rotate(180deg)";
      }
      //Right
      else if (Number(ys) + 1 === Number(y)) {
      }
      //Down
      else if (Number(xs) - 1 === Number(x)) {
        st.style.transform = "rotate(-90deg)";
      }
      //Up
      else if (Number(xs) + 1 === Number(x)) {
        st.style.transform = "rotate(90deg)";
      }
    }

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
        el.className === "path-immediate" ||
        el.className === "start-node" ||
        el.className === "end-node"
      ) {
        if (!this.grid[box].hasItem() && this.grid[box].state !== "wall") {
          el.className = "unvisited";
        }
        if (this.grid[box].state !== "wall") {
          this.grid[box].state = "unvisited";
        }
      }
      if (this.walls.includes(box) && clearWalls) {
        el.className = "unvisited";
        this.grid[box].state = "unvisited";
        this.walls.splice(this.walls.indexOf(box), 1);
      }
    }
  }
}
