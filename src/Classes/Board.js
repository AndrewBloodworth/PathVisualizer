import { dijkstra } from "../algorithms/dijkstras";
import { DOMController } from "./DOMController";
import { Node } from "./Node";

export class Board {
  constructor() {
    this.domController = {};
    this.start = "0-0";
    this.end = "0-0";
    this.width = 0;
    this.height = 0;
    this.walls = [];
    this.grid = {};
    this.graph = {};
    this.solved = false;
    this.speed = 100;
  }
  manufactureGrid(size = 20) {
    const { innerHeight, innerWidth } = this.getDimensions(size);
    this.height = innerHeight;
    this.width = innerWidth;

    this.assignNodes(this.width, this.height);

    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        const id = `${i}-${j}`;
        const neighbors = this.findNeighbors(i, j);
        this.grid[id] = new Node(id, neighbors, this.nodetype(id));
      }
    }
    this.domController = new DOMController(this);
  }
  manufactureGraph(numberOfRows) {
    const dom = this.domController;
    dom.clearStartStyle();
    if (
      this.nodeInBoundary(this.start, numberOfRows) &&
      this.nodeInBoundary(this.end, numberOfRows)
    ) {
      this.graph = {};
      dom.assignGraphOfSize(numberOfRows);
      return numberOfRows;
    }
  }
  addRemoveWall(target) {
    const classname = target.className;
    const node = this.grid[target.id];
    const dom = this.domController;
    if (
      classname === "unvisited" ||
      classname === "visited" ||
      classname === "path" ||
      classname === "visited-immediate" ||
      classname === "path-immediate" ||
      classname === "deepred"
    ) {
      this.walls.push(target.id);
      node.addWall();
      dom.addWall(target);
    } else if (target.className === "wall") {
      this.walls.splice(this.walls.indexOf(target.id), 1);
      node.removeWall();
      dom.removeWall(target);
    }
    this.autoSolve("wall", target.id);
  }
  placeNode(name, prevId, newId) {
    this.domController.clearTransform(prevId);
    const prevNode = this.grid[prevId];
    const newNode = this.grid[newId];
    prevNode.shiftItems();
    newNode.unShiftItems(name);
    if (name === "start-node") this.start = newId;
    else if (name === "end-node") this.end = newId;
    this.autoSolve("node");
  }

  autoSolve(type, id) {
    if (type === "wall") {
      if (this.solved && !this.isNode(id)) {
        this.runDijkstra();
      }
    } else {
      if (this.solved) {
        this.runDijkstra();
      }
    }
  }
  async runDijkstra() {
    const dom = this.domController;
    dom.disableInteraction(true);
    this.clearBoard(false);
    let result = await dijkstra();
    dom.updatePathDistance(result.distance);
    dom.disableInteraction(false);
    if (result.distance === Infinity) {
      const startNode = this.grid[this.start];
      if (startNode.isNotWall()) startNode.changeState("deepred");
      result.path.forEach((id) => {
        const node = this.grid[id];
        dom.noPathFound(id);
        node.changeState("deepred");
      });
      this.solved = false;
      return;
    }

    dom.pointToPath(result.path[0]);

    if (this.solved) {
      dom.printPath(result.path);
    } else {
      this.solved = true;
      dom.animatePath(result.path);
    }
  }
  clearBoard(clearWalls) {
    const dom = this.domController;
    dom.updatePathDistance("Infinity");
    for (let id in this.graph) {
      const node = this.grid[id];
      if (
        node.state === "visited" ||
        node.state === "path" ||
        node.state === "visited-immediate" ||
        node.state === "path-immediate" ||
        node.state === "deepred"
      ) {
        if (!node.hasItem()) {
          dom.makeUnvisited(id);
        }
        node.clear();
        dom.removeSpec(id);
      }
      if (this.walls.includes(id) && clearWalls) {
        dom.clearWalls(id);
        node.removeWall();
        this.walls.splice(this.walls.indexOf(id), 1);
      }
    }
  }
  removeVisited(numberOfRows) {
    for (let id in this.grid) {
      const node = this.grid[id];
      if (!this.nodeInBoundary(id, numberOfRows) && !this.walls.includes(id)) {
        node.clear();
      }
    }
  }
  updateSpeed(speedValue) {
    this.speed = speedValue;
    this.domController.updateAnimationSpeed();
  }
  assignNodes(width, height) {
    const vertMiddle = Math.floor(height / 2) - 1;
    const horzFirstThird = Math.floor(width / 2) - 3;
    const horzLastThird = width - Math.floor(width / 2) + 2;

    this.start = `${vertMiddle}-${horzFirstThird}`;
    this.end = `${vertMiddle}-${horzLastThird}`;
  }
  nodeInBoundary(node, numberOfRows) {
    const { innerHeight, offsetHeight, innerWidth, offsetWidth } =
      this.getDimensions(numberOfRows);
    const row = Number(node.split("-")[0]);
    const col = Number(node.split("-")[1]);
    const bottom = innerHeight - 1 + offsetHeight;
    const right = innerWidth - 1 + offsetWidth;
    const left = offsetWidth;
    const top = offsetHeight;

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
  findNeighbors(i, j) {
    const right = j + 1 > this.width - 1 ? null : `${i}-${j + 1}`;
    const left = j - 1 < 0 ? null : `${i}-${j - 1}`;
    const up = i + 1 > this.height - 1 ? null : `${i + 1}-${j}`;
    const down = i - 1 < 0 ? null : `${i - 1}-${j}`;
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
}
