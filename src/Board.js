export class Board {
    constructor(start, end, width, height) {
        this.start = start;
        this.end = end;
        this.width = width;
        this.height = height;
        this.walls = [];
        this.grid = {};
        this.graph = {};
        this.node = {};
        this.mouseDown = false;
    }
    addToGrid(id) {
        if (id === this.start) {
            this.grid[id] = 'start-node';
            return 'start-node'
        } else if (id === this.end) {
            this.grid[id] = 'end-node';
            return 'end-node'
        } else if (this.walls.includes(id)) {
            this.grid[id] = 'wall';
            return 'wall'
        } else {
            this.grid[id] = 'unvisited';
            return 'unvisited'
        }
    }
    addRemoveWall(target) {
        if (target.className === 'unvisited') {
            this.walls.push(target.id);
            target.className = 'wall';
        } else if (target.className === 'wall') {
            this.walls.splice(this.walls.indexOf(target.id),1);
            target.className = 'unvisited';
        }
    }
    placeNode(name, id) {
        if (name === 'start-node') {
            this.grid[this.start] = 'unvisited';
            this.grid[id] = 'start-node';
            this.start = id;
        } else if (name === 'end-node') {
            this.grid[this.end] = 'unvisited';
            this.grid[id] = 'end-node';
            this.end = id;
        }
    }
    buildGraph(start) {
        let split = start.split('-');
        let row = Number(split[0]);
        let col = Number(split[1]);
        let right = col+1 > this.width-1 ? null : `${row}-${col+1}`;
        let left = col-1 < 0 ? null : `${row}-${col-1}`;
        let up = row+1 > this.height-1 ? null : `${row+1}-${col}`;
        let down = row-1 < 0 ? null : `${row-1}-${col}`;
        this.graph[start] = { [right]: 1, [left]: 1, [up]: 1, [down]: 1 };
    }

}