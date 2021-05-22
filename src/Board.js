import { dijkstra } from './algorithms/dijkstras';

export class Board {
    constructor(start, end, width, height, grid) {
        this.start = start;
        this.end = end;
        this.width = width;
        this.height = height;
        this.walls = [];
        this.grid = grid;
        this.graph = {};
        this.node = {};
        this.mouseDown = false;
        this.solved = false;
    }
    isNode(id) {
        if (id === this.start || id === this.end) {
            return true;
        }
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
            //this.grid[target.id] = 'wall'
            this.grid[target.id].state = 'wall';
        } else if (target.className === 'wall') {
            this.walls.splice(this.walls.indexOf(target.id),1);
            target.className = 'unvisited';
            //this.grid[target.id] = 'unvisited'
            this.grid[target.id].state = 'unvisited';
        }
    }
    placeNode(name, id) {
        if (name === 'start-node') {
            //this.grid[this.start] = 'unvisited';
            this.grid[this.start].items.shift();
            //this.grid[id] = 'start-node';
            this.grid[id].items.unshift('start-node');
            this.start = id;
        } else if (name === 'end-node') {
            //this.grid[this.end] = 'unvisited';
            this.grid[this.end].items.shift();
            //this.grid[id] = 'end-node';
            this.grid[id].items.unshift('end-node');
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

    async runDijkstra() {
        this.clearBoard(false)
        let result = await dijkstra();
        let i = 0, length = result.path.length;
        if (this.solved) {
            for (let i = 0; i < result.path.length; i++) {
                document.getElementById(result.path[i]).className = 'path-immediate';
            }
        } else {
            this.solved = true;
            const interval = setInterval(() => {
                document.getElementById(result.path[i]).className = 'path'
                i++;
                if (i === length) clearInterval(interval);
            },1)
        }
    }
    clearBoard(clearWalls) {
        for( let box in this.grid) {
            const el = document.getElementById(box);
            if (el.className === 'visited' || el.className === 'path' ||
                el.className === 'visited-immediate' || el.className === 'path-immediate') {
                el.className = 'unvisited';
                //this.grid[box] = 'unvisited';
                this.grid[box].state = 'unvisited';
            }
            if (this.walls.includes(box) && clearWalls) {
                el.className = 'unvisited';
                this.grid[box].state = 'unvisited';
                this.walls.splice(this.walls.indexOf(box),1);
            }
        }
    }

}