import React from 'react';
import { useSelector } from 'react-redux';
import { selectBoard } from '../grid/boardSlice'

export const Nav = () => {
    const { board } = useSelector(selectBoard);
    const handleClick = async () => {
        board.solved = false;
        board.runDijkstra()
    }
    const handleClear = () => {
        board.solved = false;
        board.clearBoard(true);
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