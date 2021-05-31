import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectBoard } from "../grid/boardSlice";

export const Nav = ({ slider, setSlider }) => {
  const { board } = useSelector(selectBoard);

  const [speed, setSpeed] = useState(100);
  const [checked, setChecked] = useState(true);

  const handleClick = async () => {
    board.domController.setAnimations("on");
    board.domController.updatePathDistance("Searching...");
    board.solved = false;
    board.runDijkstra();
  };
  const handleClear = () => {
    board.solved = false;
    board.clearBoard(true);
  };
  const handleChange = (e) => {
    board.domController.setAnimations("off");
    board.removeVisited(slider);
    setSlider(board.manufactureGraph(e.target.value) || slider);
  };

  const handleMouseLeave = () => {
    try {
      board.domController.setAnimations("on");
    } catch (error) {}
  };
  const handleViewDistance = ({ target }) => {
    board.domController.toggleDistances(checked);
    setChecked(checked ? false : true);
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
      <div className="view-distance">
        <label>Show Distances</label>
        <input
          type="checkbox"
          value={checked}
          onClick={handleViewDistance}
          id="view-distance"
        />
      </div>
      <div className="settings-container">
        <h2 style={{ margin: 0 }}>Settings:</h2>
        <div className="settings">
          <div className="slider">
            <label for="slider" style={{ width: 61 }}>
              Rows: {slider}
            </label>
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
            <label for="speed" style={{ width: 95 }}>
              Speed: {speed}ms
            </label>
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
            <p id="distance" style={{ width: 80, textAlign: "center" }}>
              Infinity
            </p>
          </div>
        </div>
        <div className="explanation"></div>
      </div>
    </div>
  );
};
