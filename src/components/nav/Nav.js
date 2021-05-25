import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectBoard, updateGrid } from "../grid/boardSlice";

export const Nav = () => {
  const { board } = useSelector(selectBoard);
  const [reload, setReload] = useState("");
  const handleClick = async () => {
    board.solved = false;
    board.runDijkstra();
  };
  const handleClear = () => {
    board.solved = false;
    board.clearBoard(true);
  };
  const handleChange = (e) => {
    //board.manufactureGrid(e.target.value);
    //useDispatch(updateGrid(board.grid));
    setReload("");
  };
  return (
    <div className="nav">
      <div className="nav-title">
        <h1>Path Visualizer</h1>
      </div>
      <div className="algo-button">
        <button onClick={handleClick}>Run Algorithm</button>
      </div>
      <div className="clear-button">
        <button onClick={handleClear}>Clear Board</button>
      </div>
      <div className="slider">
        <input
          onChange={handleChange}
          type="range"
          id="volume"
          name="volume"
          min="0"
          max="2"
        ></input>
      </div>
    </div>
  );
};
