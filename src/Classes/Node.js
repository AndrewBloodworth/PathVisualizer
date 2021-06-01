export class Node {
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
  isNotWall() {
    return this.state !== "wall";
  }
  getDistance() {
    return this.distance;
  }
  addWall() {
    this.state = "wall";
    this.setDistance("");
  }
  setDistance(distance) {
    this.distance = distance;
  }
  removeWall() {
    this.state = "unvisited";
  }
  shiftItems() {
    this.items.shift();
  }
  unShiftItems(item) {
    this.items.unshift(item);
  }
  clear() {
    this.state = "unvisited";
    this.setDistance("");
  }
  changeState(newState) {
    this.state = newState;
  }
}
