import { dijkstra } from "./algorithms/dijkstras";

class Node {
  constructor(id, neighbors, items = []) {
    this.id = id;
    this.neighbors = neighbors;
    this.items = items;
    this.state = "unvisited";
    this.distance = "";
  }
  getSpecs() {
    return this.distance;
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
    this.speed = 100;
    this.algoQueue = [];
  }
  manufactureGrid(numberOfRows) {
    //TODO more elegant way of rotating start
    document.getElementById(this.start).style = "";
    if (
      this.nodeInBoundary(this.start, numberOfRows) &&
      this.nodeInBoundary(this.end, numberOfRows)
    ) {
      this.graph = {};
      this.assignGridOfSize(numberOfRows);
      return numberOfRows;
    }
  }
  assignGridOfSize(numberOfRows) {
    const { verticalPixelCount } = this.getDimensions(numberOfRows);

    const cssRoot = document.querySelector(":root");
    cssRoot.style.setProperty("--size", `${verticalPixelCount}px`);
  }
  nodeInBoundary(node, numberOfRows) {
    const dimensions = this.getDimensions(numberOfRows);
    let row = Number(node.split("-")[0]);
    let col = Number(node.split("-")[1]);
    let bottom = dimensions.innerHeight - 1 + dimensions.offsetHeight;
    let right = dimensions.innerWidth - 1 + dimensions.offsetWidth;
    let left = dimensions.offsetWidth;
    let top = dimensions.offsetHeight;

    return row <= bottom && row >= top && col <= right && col >= left;
  }
  getDimensions(numberOfRows) {
    const navHeight = 75;
    const boarderPixelCount = 3;
    const conceptualPixelCount =
      (window.innerHeight - navHeight) / numberOfRows;
    const verticalPixelCount = conceptualPixelCount - boarderPixelCount;
    const numberOfColumns = window.innerWidth / conceptualPixelCount;
    const innerHeight = Number(numberOfRows);

    let innerWidth = Math.floor(numberOfColumns) - 1;
    if (innerWidth > 40) innerWidth = 40;
    if (innerWidth < 8) innerWidth = 8;
    const offsetHeight = Math.floor((this.height - innerHeight) / 2);
    const offsetWidth = Math.floor((this.width - innerWidth) / 2);

    return {
      verticalPixelCount,
      innerHeight,
      offsetHeight,
      innerWidth,
      offsetWidth,
    };
  }
  assignNodes(width, height) {
    const vertMiddle = Math.floor(height / 2) - 1;
    const horzFirstThird = Math.floor(width / 2) - 3;
    const horzLastThird = width - Math.floor(width / 2) + 2;

    this.start = `${vertMiddle}-${horzFirstThird}`;
    this.end = `${vertMiddle}-${horzLastThird}`;
  }
  manufactureGraph(size = 20) {
    const dimensions = this.getDimensions(size);
    this.height = dimensions.innerHeight;
    this.width = dimensions.innerWidth;

    this.assignNodes(this.width, this.height);

    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        const id = `${i}-${j}`;
        const neighbors = this.findNeighbors(i, j);
        this.grid[id] = new Node(id, neighbors, this.nodetype(id));
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
  updateSpeed(speedValue) {
    this.speed = speedValue;
    document.body.style.setProperty("--visit-delay", `${this.speed}ms`);
    document.body.style.setProperty(
      "--animation-speed-visited",
      `${this.speed * 5}ms`
    );
  }
  setAnimations(keyword) {
    if (keyword === "on") {
      document.body.style.setProperty("--toggle", "1");
      document.body.style.setProperty("--playState", "idle");
    } else if (keyword === "off") {
      document.body.style.setProperty("--toggle", "0");
      document.body.style.setProperty("--playState", "finished");
    }
  }
  addRemoveWall(target) {
    let classname = target.className;
    const specEl = document.getElementById(`specs-${target.id}`);
    if (
      classname === "unvisited" ||
      classname === "visited" ||
      classname === "path" ||
      classname === "visited-immediate" ||
      classname === "path-immediate" ||
      classname === "deepred"
    ) {
      this.walls.push(target.id);
      target.className = "wall";
      specEl.innerHTML = "";
      this.grid[target.id].state = "wall";
    } else if (target.className === "wall") {
      this.walls.splice(this.walls.indexOf(target.id), 1);
      target.className = "unvisited";
      this.grid[target.id].state = "unvisited";
    }
    if (this.solved) {
      this.runDijkstra();
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
    if (this.solved) {
      this.runDijkstra();
    }
  }
  disableGridTable(disable) {
    const cssRoot = document.querySelector(":root");
    if (disable) {
      cssRoot.style.setProperty("--grid-interact", `none`);
    } else {
      cssRoot.style.setProperty("--grid-interact", `auto`);
    }
  }

  disableNavBar(disable) {
    const navItemIds = ["algo-button", "clear-button", "slider", "speed"];
    navItemIds.forEach(
      (id) => (document.getElementById(id).disabled = disable)
    );
  }
  async runDijkstra() {
    this.disableNavBar(true);
    this.disableGridTable(true);
    this.clearBoard(false);
    let result = await dijkstra();
    document.getElementById("distance").innerHTML = result.distance;
    this.disableNavBar(false);
    this.disableGridTable(false);
    if (result.distance === Infinity) {
      if (this.grid[this.start].state !== "wall") {
        this.grid[this.start].state = "deepred";
      }
      result.path.forEach((id) => {
        let el = document.getElementById(id);
        if (!this.isNode(id)) {
          el.className = "deepred";
        }
        this.grid[id].state = "deepred";
      });

      this.solved = false;
      return;
    }
    let i = 0,
      length = result.path.length;

    //TODO more elegant way of rotating start

    //start-node
    let st = document.getElementById(this.start);
    //2nd node in shortest path as x and y coordinates
    let x, y;
    if (!result.path[0]) {
      [x, y] = this.end.split("-");
    } else {
      [x, y] = result.path[0].split("-");
    }
    //let [x, y] = result.path[0].split("-");
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

    //Print the path

    if (this.solved) {
      result.path.forEach((id) => {
        let el = document.getElementById(id);
        if (el) {
          this.grid[id].state = "path-immediate";
          el.className = "path-immediate";
        }
      });
    } else {
      this.solved = true;
      const interval = setInterval(() => {
        let el = document.getElementById(result.path[i]);
        if (el) {
          this.grid[result.path[i]].state = "path";
          el.className = "path";
        }
        i++;
        if (i >= length) clearInterval(interval);
      }, this.speed);
    }
  }
  removeVisited(numberOfRows) {
    for (let box in this.grid) {
      let id = this.grid[box].id;
      if (!this.nodeInBoundary(id, numberOfRows) && !this.walls.includes(id)) {
        this.grid[box].state = "unvisited";
        this.grid[box].distance = "";
      }
    }
  }
  clearBoard(clearWalls) {
    for (let box in this.graph) {
      const el = document.getElementById(box);
      const specEl = document.getElementById(`specs-${box}`);
      if (
        el.className === "visited" ||
        el.className === "path" ||
        el.className === "visited-immediate" ||
        el.className === "path-immediate" ||
        el.className === "start-node" ||
        el.className === "end-node" ||
        el.className === "deepred"
      ) {
        if (!this.grid[box].hasItem() && this.grid[box].state !== "wall") {
          console.log("wtf");
          el.className = "unvisited";
        }
        if (this.grid[box].state !== "wall") {
          this.grid[box].state = "unvisited";
          this.grid[box].distance = "";
          specEl.innerHTML = "";
        }
      }
      if (this.walls.includes(box) && clearWalls) {
        if (!this.isNode(box)) {
          el.className = "unvisited";
        }
        this.grid[box].state = "unvisited";
        this.walls.splice(this.walls.indexOf(box), 1);
      }
    }
  }
}
