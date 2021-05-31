import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setBoard, selectBoard } from "./boardSlice";
import { Gridrow } from "./Gridrow";
import { Board } from "../../Classes/Board";

export const Grid = ({ slider, setSlider }) => {
  const { board } = useSelector(selectBoard);
  const dispatch = useDispatch();
  const [mouseDown, setMouseDown] = useState(false);
  const [node, setNode] = useState({ target: null, bool: false });

  useEffect(() => {
    let board = new Board();
    board.manufactureGrid();
    board.domController.assignGraphOfSize(slider);
    dispatch(setBoard(board));
  }, [dispatch]);
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
  const getRows = () => {
    const { innerHeight, offsetHeight } = board.getDimensions(slider);
    return [...Array(innerHeight).keys()].map((row) => (
      <tr key={row} id={`row-${row}`}>
        <Gridrow
          key={row}
          currentRow={row + offsetHeight}
          mouseDown={mouseDown}
          setMouseDown={setMouseDown}
          node={node}
          setNode={setNode}
          slider={slider}
          setSlider={setSlider}
        />
      </tr>
    ));
  };
  return (
    <div className="grid-container">
      <div className="grid">
        <table
          className="grid-table"
          id="grid-table"
          onMouseLeave={handleMouseLeave}
        >
          <tbody>{getRows()}</tbody>
        </table>
      </div>
    </div>
  );
};
