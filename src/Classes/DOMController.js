export class DOMController {
  constructor(board) {
    this.board = board;
  }
  assignGraphOfSize(numberOfRows) {
    const { verticalPixelCount } = this.board.getDimensions(numberOfRows);
    const cssRoot = document.querySelector(":root");
    cssRoot.style.setProperty("--size", `${verticalPixelCount}px`);
  }
  disableInteraction(disable) {
    //Disable Grid Table
    const cssRoot = document.querySelector(":root");
    if (disable) {
      cssRoot.style.setProperty("--grid-cursor", `wait`);
      cssRoot.style.setProperty("--grid-interact", `none`);
    } else {
      cssRoot.style.setProperty("--grid-cursor", `pointer`);
      cssRoot.style.setProperty("--grid-interact", `auto`);
    }
    //Disable NavBar
    const navItemIds = ["algo-button", "clear-button", "slider", "speed"];
    navItemIds.forEach(
      (id) => (document.getElementById(id).disabled = disable)
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
  grabNode(styleName) {
    const cssRoot = document.querySelector(":root");
    cssRoot.style.setProperty("--node-cursor", styleName);
  }
  toggleDistances(checked) {
    const cssRoot = document.querySelector(":root");
    if (checked) {
      cssRoot.style.setProperty("--visibility", `visible`);
    } else {
      cssRoot.style.setProperty("--visibility", `hidden`);
    }
  }
  updateAnimationSpeed() {
    document.body.style.setProperty("--visit-delay", `${this.board.speed}ms`);
    document.body.style.setProperty(
      "--animation-speed-visited",
      `${this.board.speed * 5}ms`
    );
  }
  clearStartStyle() {
    document.getElementById(this.board.start).style = "";
  }
  addWall(target) {
    target.className = "wall";
    document.getElementById(`specs-${target.id}`).innerHTML = "";
  }
  removeWall(target) {
    target.className = "unvisited";
    document.getElementById(`specs-${target.id}`).innerHTML = "";
  }
  clearTransform(id) {
    let el = document.getElementById(id);
    if (el.style.transform) {
      el.style = "";
    }
  }
  updatePathDistance(distance) {
    document.getElementById("distance").innerHTML = distance;
  }
  noPathFound(id) {
    if (!this.board.isNode(id)) {
      document.getElementById(id).className = "deepred";
    }
  }
  pointToPath(node) {
    //TODO more elegant way of rotating start
    let st = document.getElementById(this.board.start);
    let x, y;
    if (!node) {
      [x, y] = this.board.end.split("-");
    } else {
      [x, y] = node.split("-");
    }
    let [xs, ys] = this.board.start.split("-");
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
  makePath(id, pathName) {
    let el = document.getElementById(id);
    if (el) {
      el.className = pathName;
    }
  }
  printPath(path) {
    path.forEach((id) => {
      const pathName = "path-immediate";
      const node = this.board.grid[id];
      this.makePath(id, pathName);
      node.changeState(pathName);
    });
  }
  animatePath(path) {
    let i = 0;
    const interval = setInterval(() => {
      if (path.length) {
        const id = path[i];
        const pathName = "path";
        const node = this.board.grid[id];
        this.makePath(id, pathName);
        node.changeState(pathName);
      }
      i++;
      if (i >= path.length) clearInterval(interval);
    }, this.board.speed);
  }
  printVisited(visited, hasPath) {
    const pathName = !hasPath ? "deepred" : "visited-immediate";
    visited.forEach((id) => {
      document.getElementById(`specs-${id}`).innerHTML =
        this.board.grid[id].getSpecs();
      document.getElementById(id).className = pathName;
      this.board.grid[id].changeState(pathName);
    });
  }
  animateVisited(visited, resolve) {
    let i = 0;
    const pathName = "visited";
    const interval = setInterval(() => {
      if (visited.length) {
        document.getElementById(visited[i]).className = "visited";
        document.getElementById(`specs-${visited[i]}`).innerHTML =
          this.board.grid[visited[i]].getSpecs();
        this.board.grid[visited[i]].changeState("visited");
      }
      i++;
      if (!visited[i]) {
        clearInterval(interval);
        resolve(visited);
      }
    }, this.board.speed);
  }
  makeUnvisited(id) {
    document.getElementById(id).className = "unvisited";
  }
  removeSpec(id) {
    document.getElementById(`specs-${id}`).innerHTML = "";
  }
  clearWalls(id) {
    if (!this.board.isNode(id)) {
      document.getElementById(id).className = "unvisited";
    }
  }
}
