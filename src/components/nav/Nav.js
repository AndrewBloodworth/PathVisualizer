import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectBoard } from "../grid/boardSlice";

export const Nav = ({ slider, setSlider }) => {
  const { board } = useSelector(selectBoard);

  const [speed, setSpeed] = useState(10);

  const handleClick = async () => {
    board.solved = false;
    board.runDijkstra();
  };
  const handleClear = () => {
    board.solved = false;
    board.clearBoard(true);
  };
  const handleChange = (e) => {
    console.log(board.graph);
    let body = document.getElementsByTagName("body")[0];
    body.className = "notransition";
    board.manufactureGrid(e.target.value);
    setSlider(e.target.value);
  };

  const handleMouseLeave = () => {
    let body = document.getElementsByTagName("body")[0];
    body.className = "";
  };

  const handleChangeSpeed = (e) => {
    setSpeed(e.target.value);
    board.speed = e.target.value;
  };
  return (
    <div className="nav" onMouseLeave={handleMouseLeave}>
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
      <div className="speed">
        <label for="speed">{speed} speed</label>
        <input
          onChange={handleChangeSpeed}
          type="range"
          value={speed}
          id="speed"
          name="speed"
          min="10"
          max="200"
        ></input>
      </div>
    </div>
  );
};
