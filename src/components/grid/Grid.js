import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setBoard, selectBoard } from './boardSlice'
import { Gridrow } from './Gridrow';
import { Board } from '../../Board';

export const Grid = () => {
    const { board } = useSelector(selectBoard);
    const dispatch = useDispatch();
    const [mouseDown, setMouseDown] = useState(false);
    const [node, setNode] = useState({target: null, bool: false});
    useEffect(() => {
        let rows = Math.floor((window.innerHeight - 25) / 28);
        let cols = Math.floor(window.innerWidth / 25)-6;
        const vertMiddle = Math.floor(rows / 2);
        const horzFirstThird = Math.floor(cols / 6);
        const horzLastThird = cols - Math.floor(cols / 6);
        let start = `${vertMiddle}-${horzFirstThird}`;
        let end = `${vertMiddle}-${horzLastThird}`;
        let myGrid = {};
        for(let i = 0; i < cols; i++) {
            for( let j = 0; j < rows; j++) {
                let id = `${j}-${i}`;
                if (id === start) {
                    myGrid[id] = {items: ['start-node'], state: 'unvisited'}
                } else if (id === end) {
                    myGrid[id] = {items: ['end-node'], state: 'unvisited'}
                } else {
                    myGrid[id] = {items: [], state: 'unvisited'}
                }
            }
        }
        console.log('grid construct')
        dispatch(setBoard(new Board(start,end,cols,rows,myGrid)))
    },[dispatch])
    const handleMouseLeave = (e) => {
        setNode({...node, currentlyMoving: false});
        setMouseDown(false);
    }
    const getRows = () => {
        return [...Array(board.height).keys()].map(row => <tr key={row} id={`row-${row}`}>
            <Gridrow key={row} 
                    currentRow={row}  
                    mouseDown={mouseDown} 
                    setMouseDown={setMouseDown}
                    node={node} 
                    setNode={setNode} /></tr>)
    }
    return (
        <div className='grid-container' onMouseLeave={handleMouseLeave}>
        <div className='grid'>
            <table className='grid-table'>
                <tbody>
                    {getRows()}
                </tbody>
            </table>
        </div>
        </div>
    )
}