import React from 'react';
import { useSelector } from 'react-redux';
import { selectGrid } from './gridSlice'
import { graph, buildGraph, walls } from '../../algorithms/dijkstras';

export const Gridrow = ({ mouseDown, setMouseDown, node, setNode, currentRow }) => {
    const { grid } = useSelector(selectGrid);

    const handleMouseDown = (e) => {
        e.preventDefault()
        /* If the clicked box is a start or end node
        Set previous node to current node
        Set currentlyMoving to true and 
        Set the type of node to be the start or end node */
        if (e.target.className.includes('node')) setNode({previous: e.target, currentlyMoving: true, type: e.target.className})
        setMouseDown(true);
        addRemoveWalls(e.target);
    }
    const handleMouseUp = ({ target }) => {
        //Set the start and end node in the graph
        if (target.className === 'start-node') graph.startNode = target.id;
        else if (target.className === 'end-node') graph.endNode = target.id;
        //Start or end node is no longer moving 
        setNode({...node, currentlyMoving: false});
        setMouseDown(false);
    }
    const handleMouseLeave = ({ target }) => {
        /* If the mouse leaves a box that is a wall and
        The start or end node is currently being moved,
        Set the previously visited box to a wall */
        if (walls.includes(target.id) && node.currentlyMoving) target.className = 'wall';
        if (node.type === 'start-node' && target.id === graph.endNode) target.className = 'end-node';
        if (node.type === 'end-node' && target.id === graph.startNode) target.className = 'start-node';
    }
    const handleMouseEnter = ({ target }) => {
        //If the start or end node is currently being moved
        if (node.currentlyMoving) {
            //Set the newly entered box to the start or end node
            target.className = node.type;
            //If the previously visited box is not a wall, set it to unvisited
            if (node.previous.className !== 'wall') node.previous.className = 'unvisited';
            //Set the previous node to be the current box
            setNode({...node, previous: target});
        } else if (mouseDown) addRemoveWalls(target);
    }
    const addRemoveWalls = (target) => {
        switch (target.className) {
            case 'unvisited':
                //Add newly entered box to walls
                walls.push(target.id);
                //Change current box to a wall
                target.className = 'wall';
                break;
            case 'wall':
                //Remove current box from walls
                walls.splice(walls.indexOf(target.id),1);
                //Change current box to unvisited
                target.className = 'unvisited';
                break;
            default:
                break;
        }
    }
    const getRows = () => {
        return [...Array(grid.cols).keys()].map(col => {
            let cName;
            (graph.startNode === `${currentRow}-${col}`) ? cName = 'start-node' :
            (graph.endNode === `${currentRow}-${col}`) ? cName = 'end-node' :
            (walls.includes(`${currentRow}-${col}`)) ? cName = 'wall' : cName = 'unvisited';
            buildGraph(`${currentRow}-${col}`,cName);
            return <td key={col} 
                        id={`${currentRow}-${col}`} 
                        className={cName} 
                        onMouseEnter={handleMouseEnter} 
                        onMouseDown={handleMouseDown} 
                        onMouseUp={handleMouseUp} 
                        onMouseLeave={handleMouseLeave}></td>
        })
    }
    return getRows()
}