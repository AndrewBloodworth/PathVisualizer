import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectBoard } from "../grid/boardSlice";

export const Nav = ({ slider, setSlider }) => {
  const { board } = useSelector(selectBoard);

  const [speed, setSpeed] = useState(100);

  useEffect(() => {
    document.body.style.setProperty("--visit-delay", `${100}ms`);
    document.body.style.setProperty(
      "--animation-speed-visited",
      `${100 * 10}ms`
    );
  }, []);
  const handleClick = async () => {
    board.solved = false;
    board.runDijkstra();
  };
  const handleClear = () => {
    board.solved = false;
    board.clearBoard(true);
  };
  const handleChange = (e) => {
    document.body.style.setProperty("--toggle", "0");
    document.body.style.setProperty("--playState", "finished");
    setSlider(board.manufactureGrid(e.target.value) || slider);
  };

  const handleMouseLeave = () => {
    document.body.className = "";
    document.body.style.setProperty("--toggle", "1");
    document.body.style.setProperty("--playState", "idle");
  };

  const handleChangeSpeed = ({ target }) => {
    setSpeed(target.value);
    board.updateSpeed(target.value);
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
      <div className="toggle">
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
          <label for="speed">Speed: {speed}ms</label>
          <input
            onChange={handleChangeSpeed}
            type="range"
            value={speed}
            id="speed"
            name="speed"
            min="10"
            max="300"
          ></input>
        </div>
      </div>
    </div>
  );
};
