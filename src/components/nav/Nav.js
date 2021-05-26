import React from "react";
import { useSelector } from "react-redux";
import { selectBoard, updateGrid } from "../grid/boardSlice";

export const Nav = ({ slider, setSlider }) => {
  const { board } = useSelector(selectBoard);
  const handleClick = async () => {
    board.solved = false;
    board.runDijkstra();
  };
  const handleClear = () => {
    board.solved = false;
    board.clearBoard(true);
  };
  const handleChange = (e) => {
    board.manufactureGrid(e.target.value);
    setSlider(e.target.value);
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
        <label for="slider">{slider} rows</label>
        <input
          onChange={handleChange}
          type="range"
          value={slider}
          id="slider"
          name="volume"
          min="5"
          max="20"
        ></input>
      </div>
    </div>
  );
};
