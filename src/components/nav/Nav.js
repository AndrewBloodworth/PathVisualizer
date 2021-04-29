import React from 'react';
import { dijkstra } from '../../algorithms/dijkstras';

export const Nav = () => {
    const handleClick = async () => {
        let result = await dijkstra();
        result.path.shift()
        result.path.pop()
        let i = 0
        let length = result.path.length;
        const interval = setInterval(() => {
            document.getElementById(result.path[i]).className = 'path'
            i++;
            if (i === length) {
                clearInterval(interval);
            }
        },1)
    }
    return (
        <div className='nav'>
            <button onClick={handleClick}></button>
        </div>
    )
}