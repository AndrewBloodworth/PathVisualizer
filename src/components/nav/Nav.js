import React from 'react';
import { dijkstra } from '../../algorithms/dijkstras';
import { useSelector } from 'react-redux';
import { selectBoard } from '../grid/boardSlice'

export const Nav = () => {
    const { board } = useSelector(selectBoard);
    const handleClick = async () => {
        for( let box of Object.keys(board.grid)) {
            const el = document.getElementById(box);
            if (el.className === 'visited' || el.className === 'path') el.className = 'unvisited'
        }
        let result = await dijkstra();
        result.path.shift()
        result.path.pop()
        let i = 0, length = result.path.length;
        const interval = setInterval(() => {
            document.getElementById(result.path[i]).className = 'path'
            i++;
            if (i === length) clearInterval(interval);
        },1)
    }
    const handleClear = () => {
        for( let box of Object.keys(board.grid)) {
            const el = document.getElementById(box);
            if (el.className === 'visited' || el.className === 'path' || el.className === 'wall') el.className = 'unvisited'
            if (board.walls.includes(box)) board.walls.splice(board.walls.indexOf(box),1);
        }
    }
    return (
        <div className='nav'>
            <div className='nav-title'>
                <h1>Path Visualizer</h1>
            </div>
            <div className='algo-button'>
                <button onClick={handleClick}>Run Algorithm</button>
            </div>
            <div className='clear-button'>
                <button onClick={handleClear}>Clear Board</button>
            </div>
        </div>
    )
}