import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setBoard, selectBoard } from "./boardSlice";
import { Gridrow } from "./Gridrow";
import { Board } from "../../Classes/Board";

export const Grid = ({ numberOfRows }) => {
  const dispatch = useDispatch();
  const { board } = useSelector(selectBoard);
  const [mouseDown, setMouseDown] = useState(false);
  const [node, setNode] = useState({});

  useEffect(() => {
    const board = new Board();
    board.manufactureGrid();
    board.dom.assignGraphOfSize(numberOfRows);
    //window.addEventListener("resize", board.dom.onResize(numberOfRows));
    dispatch(setBoard(board));
    return () => {
      //window.removeEventListener("resize", board.dom.onResize);
    };
  }, [dispatch]);
  //
  const handleMouseLeave = (e) => {
    setNode({ ...node, currentlyMoving: false });
    setMouseDown(false);
  };
  if (!Object.keys(board).length) {
    return (
      <div className="loader">
        <h3>Loading Grid</h3>
      </div>
    );
  }
  const { innerHeight, offsetHeight } = board.getDimensions(numberOfRows);
  return (
    <div className="grid-container">
      <div className="grid">
        <table
          className="grid-table"
          id="grid-table"
          onMouseLeave={handleMouseLeave}
        >
          <tbody>
            {[...Array(innerHeight).keys()].map((row) => (
              <tr key={row} id={`row-${row}`}>
                <Gridrow
                  key={row}
                  currentRow={row + offsetHeight}
                  mouseDown={mouseDown}
                  setMouseDown={setMouseDown}
                  node={node}
                  setNode={setNode}
                  numberOfRows={numberOfRows}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
