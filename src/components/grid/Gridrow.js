import React from 'react';
import { useSelector } from 'react-redux';
import { selectBoard } from './boardSlice';

export const Gridrow = ({ mouseDown, setMouseDown, node, setNode, currentRow }) => {
    const { board } = useSelector(selectBoard);
    const handleMouseDown = (e) => {
        e.preventDefault();
        if (board.isNode(e.target.id)) setNode({currentlyMoving: true, type: e.target.className});
        setMouseDown(true);
        board.addRemoveWall(e.target);
    }
    const handleMouseUp = ({ target }) => {
        setNode({...node, currentlyMoving: false});
        setMouseDown(false);
    }
    const handleMouseEnter = ({ target }) => {
        if (node.currentlyMoving) {
            board.placeNode(node.type, target.id);
            if (board.solved) board.runDijkstra();
            setNode({...node});
        } else if (mouseDown) board.addRemoveWall(target);
    }
    const getCols = () => {
        return [...Array(board.width).keys()].map(col => {
            let cName;
            if (Object.keys(board).length) {
                let id = `${currentRow}-${col}`;
                cName = board.grid[id].items.length > 0 ? board.grid[id].items[0] : board.grid[id].state;
                board.buildGraph(id);
            }
            return <td key={col} 
                        id={`${currentRow}-${col}`} 
                        className={cName} 
                        onMouseEnter={handleMouseEnter} 
                        onMouseDown={handleMouseDown} 
                        onMouseUp={handleMouseUp}></td>
        })
    }
    return getCols();
}