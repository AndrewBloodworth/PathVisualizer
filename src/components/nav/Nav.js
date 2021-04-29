import React from 'react';
import { dijkstra,boxes } from '../../algorithms/dijkstras';

export const Nav = () => {
    const handleClick = async () => {
        for( let box of boxes) {
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
        for( let box of boxes) {
            const el = document.getElementById(box);
            if (el.className === 'visited' || el.className === 'path' || el.className === 'wall') el.className = 'unvisited'
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