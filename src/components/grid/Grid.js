import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setGrid, selectGrid } from './gridSlice'
import { Gridrow } from './Gridrow';
import { graph} from '../../algorithms/dijkstras';

export const Grid = () => {
    const { grid } = useSelector(selectGrid);
    const dispatch = useDispatch();
    const [mouseDown, setMouseDown] = useState(false);
    const [node, setNode] = useState({target: null, bool: false});

    useEffect(() => {
        let rows = Math.floor((window.innerHeight - 25) / 28);
        let cols = Math.floor(window.innerWidth / 25)-6;
        graph.rows = rows;
        graph.cols = cols;
        const vertMiddle = Math.floor(rows / 2);
        const horzFirstThird = Math.floor(cols / 6);
        const horzLastThird = cols - Math.floor(cols / 6);
        graph.startNode = `${vertMiddle}-${horzFirstThird}`;
        graph.endNode = `${vertMiddle}-${horzLastThird}`;
        dispatch(setGrid({rows,cols}))
    },[dispatch])
    const handleMouseLeave = (e) => {
        setNode({...node, currentlyMoving: false, bool: false});
        setMouseDown(false);
    }
    const getRows = () => {
        return [...Array(grid.rows).keys()].map(row => <tr key={row} id={`row-${row}`}>
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