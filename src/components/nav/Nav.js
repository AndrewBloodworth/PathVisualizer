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
      `${100 * 5}ms`
    );
  }, []);
  const handleClick = async () => {
    board.setAnimations("on");
    document.getElementById("distance").innerHTML = "Searching...";
    board.solved = false;
    board.runDijkstra();
  };
  const handleClear = () => {
    board.solved = false;
    board.clearBoard(true);
  };
  const handleChange = (e) => {
    board.setAnimations("off");
    board.removeVisited(slider);
    //If start or end node is out of window then hold slider value
    setSlider(board.manufactureGrid(e.target.value) || slider);
  };

  const handleMouseLeave = () => {
    board.setAnimations("on");
  };

  const handleChangeSpeed = ({ target }) => {
    setSpeed(target.value);
    board.updateSpeed(target.value);
  };
  return (
    <div className="nav" id="nav" onMouseLeave={handleMouseLeave}>
      <div className="nav-title">
        <h1>Path Visualizer</h1>
      </div>
      <div className="algo-button">
        <button onClick={handleClick} id="algo-button">
          Run Algorithm
        </button>
      </div>
      <div className="clear-button">
        <button onClick={handleClear} id="clear-button">
          Clear Board
        </button>
      </div>
      <div className="settings-container">
        <h2 style={{ margin: 0 }}>Settings:</h2>
        <div className="settings">
          <div className="slider">
            <label for="slider">Rows: {slider}</label>
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
          <div className="distance">
            <p style={{ paddingRight: 10 }}>Path Distance: </p>
            <p id="distance" style={{ color: "white" }}>
              Infinity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
