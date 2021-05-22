import React from 'react';
import { useSelector } from 'react-redux';
import { selectBoard } from './boardSlice';

export const Gridrow = ({ mouseDown, setMouseDown, node, setNode, currentRow }) => {
    const { board } = useSelector(selectBoard);
    const nodeSwitch = (type) => {
        return type === 'end-node' ? 'start-node' : 'end-node';
    }
    const handleMouseDown = (e) => {
        e.preventDefault()
        /* If the clicked box is a start or end node
        Set previous node to current node
        Set currentlyMoving to true and 
        Set the type of node to be the start or end node */
        if (e.target.className.includes('node')) setNode({previous: e.target, currentlyMoving: true, type: e.target.className});
        setMouseDown(true);
        board.addRemoveWall(e.target);
    }
    const handleMouseUp = ({ target }) => {
        //Set the start and end node in the graph
        board.placeNode(target.className, target.id);
        //Start or end node is no longer moving 
        setNode({...node, currentlyMoving: false});
        setMouseDown(false);
    }
    const handleMouseLeave = ({ target }) => {
        /* If the mouse leaves a box that is a wall and
        The start or end node is currently being moved,
        Set the previously visited box to a wall */
        if (board.walls.includes(target.id) && node.currentlyMoving) target.className = 'wall';
        if (node.type === 'start-node' && target.id === board.end) target.className = 'end-node';
        if (node.type === 'end-node' && target.id === board.start) target.className = 'start-node';
    }
    const handleMouseEnter = ({ target }) => {
        //If the start or end node is currently being moved
        if (node.currentlyMoving) {
            //Set the newly entered box to the start or end node
            target.className = node.type;
            //If the previously visited box is not a wall
            if (node.previous.className !== 'wall') {
                //If the previously visited box is not a start or end node
                if (target.className !== nodeSwitch(node.previous.className)) {
                    //Set previous box to unvisited
                    node.previous.className = 'unvisited';
                }
            }
            //Set the previous node to be the current box
            setNode({...node, previous: target});
        } else if (mouseDown) board.addRemoveWall(target);
    }
    const getCols = () => {
        return [...Array(board.width).keys()].map(col => {
            let cName;
            if (Object.keys(board).length) {
                let id = `${currentRow}-${col}`;
                cName = board.addToGrid(id);
                board.buildGraph(id);
            }
            return <td key={col} 
                        id={`${currentRow}-${col}`} 
                        className={cName} 
                        onMouseEnter={handleMouseEnter} 
                        onMouseDown={handleMouseDown} 
                        onMouseUp={handleMouseUp} 
                        onMouseLeave={handleMouseLeave}></td>
        })
    }
    return getCols();
}