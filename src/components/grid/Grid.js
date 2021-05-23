import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setBoard, selectBoard } from "./boardSlice";
import { Gridrow } from "./Gridrow";
import { Board } from "../../Board";

export const Grid = () => {
  const { board } = useSelector(selectBoard);
  const dispatch = useDispatch();
  const [mouseDown, setMouseDown] = useState(false);
  const [node, setNode] = useState({ target: null, bool: false });

  const makeGraph = (width, height) => {
    let graph = {};
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        let col = i,
          row = j;
        let id = `${j}-${i}`;
        let right = col + 1 > width - 1 ? null : `${row}-${col + 1}`;
        let left = col - 1 < 0 ? null : `${row}-${col - 1}`;
        let up = row + 1 > height - 1 ? null : `${row + 1}-${col}`;
        let down = row - 1 < 0 ? null : `${row - 1}-${col}`;
        graph[id] = { [right]: 1, [left]: 1, [up]: 1, [down]: 1 };
      }
    }
    return graph;
  };

  useEffect(() => {
    let rows = Math.floor((window.innerHeight - 25) / 28);
    let cols = Math.floor(window.innerWidth / 25) - 6;
    const vertMiddle = Math.floor(rows / 2);
    const horzFirstThird = Math.floor(cols / 6);
    const horzLastThird = cols - Math.floor(cols / 6);
    let start = `${vertMiddle}-${horzFirstThird}`;
    let end = `${vertMiddle}-${horzLastThird}`;
    let myGrid = {};
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let id = `${i}-${j}`;
        if (id === start) {
          myGrid[id] = { items: ["start-node"], state: "unvisited" };
        } else if (id === end) {
          myGrid[id] = { items: ["end-node"], state: "unvisited" };
        } else {
          myGrid[id] = { items: [], state: "unvisited" };
        }
      }
    }

    let myGraph = makeGraph(cols, rows);
    let board = new Board(start, end, cols, rows, myGrid, myGraph);
    dispatch(setBoard(board));
  }, [dispatch]);
  const handleMouseLeave = (e) => {
    setNode({ ...node, currentlyMoving: false });
    setMouseDown(false);
  };
  const getRows = () => {
    return [...Array(board.height).keys()].map((row) => (
      <tr key={row} id={`row-${row}`}>
        <Gridrow
          key={row}
          currentRow={row}
          mouseDown={mouseDown}
          setMouseDown={setMouseDown}
          node={node}
          setNode={setNode}
        />
      </tr>
    ));
  };
  return (
    <div className="grid-container" onMouseLeave={handleMouseLeave}>
      <div className="grid">
        <table className="grid-table">
          <tbody>{getRows()}</tbody>
        </table>
      </div>
    </div>
  );
};
