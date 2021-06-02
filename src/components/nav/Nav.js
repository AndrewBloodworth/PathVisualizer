import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectBoard } from "../grid/boardSlice";

export const Nav = ({ numberOfRows, setNumberOfRows }) => {
  const { board } = useSelector(selectBoard);

  const [speed, setSpeed] = useState(100);
  const [checked, setChecked] = useState(true);
  const [active, setActive] = useState(false);

  const handleClick = async () => {
    board.dom.setAnimations("on");
    board.dom.updatePathDistance("Searching...");
    board.solved = false;
    board.runAlgorithm();
  };
  const handleClear = () => {
    board.solved = false;
    board.clearBoard(true);
  };
  const handleChange = (e) => {
    board.dom.setAnimations("off");
    board.removeVisited(numberOfRows);
    setNumberOfRows(board.manufactureGraph(e.target.value) || numberOfRows);
  };

  const handleMouseLeave = () => {
    try {
      board.dom.setAnimations("on");
    } catch (error) {}
  };
  const handleViewDistance = ({ target }) => {
    board.dom.toggleDistances(checked);
    setChecked(checked ? false : true);
  };

  const handleChangeSpeed = ({ target }) => {
    setSpeed(target.value);
    board.updateSpeed(target.value);
  };

  const handleEnterGear = ({ target }) => {
    setActive(true);
  };
  const handleMouseLeaveSettings = () => {
    setActive(false);
  };
  return (
    <div className="nav" id="nav" onMouseLeave={handleMouseLeave}>
      <div className="nav-title">
        <h1>Path Visualizer</h1>
      </div>
      <div className="controls">
        <div className="algo-button">
          <button onClick={handleClick} id="algo-button">
            <strong>Run</strong>
          </button>
        </div>
        <div className="clear-button">
          <button onClick={handleClear} id="clear-button">
            <strong>Clear</strong>
          </button>
        </div>
      </div>
      <div className="settings-container">
        <div className="settings-gear">
          <div
            className="gear"
            id={active ? "white" : "gray"}
            onMouseEnter={handleEnterGear}
          ></div>
          <div
            className="settings-menu"
            onMouseLeave={handleMouseLeaveSettings}
            style={{ visibility: active ? "visible" : "hidden" }}
          >
            <div className="settings">
              <div className="settings-title">
                <h2 style={{ margin: 0 }}>Settings</h2>

                <div className="view-distance">
                  <input
                    type="checkbox"
                    value={checked}
                    onClick={handleViewDistance}
                    id="view-distance"
                  />
                  <label>Show Distances</label>
                </div>
              </div>

              <hr />
              <div className="slider">
                <label for="slider">
                  <span style={{ fontSize: 20 }}>Rows: </span>
                  {numberOfRows}
                </label>
                <input
                  onChange={handleChange}
                  type="range"
                  value={numberOfRows}
                  id="slider"
                  min="5"
                  max="20"
                ></input>
              </div>
              <hr />
              <div className="speed">
                <label for="speed">
                  <span style={{ fontSize: 20 }}>Speed: </span>
                  {speed}ms
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
            </div>
          </div>
        </div>
        <div className="distance">
          <p style={{ paddingRight: 10 }}>Path Distance: </p>
          <p id="distance" style={{ width: 80, textAlign: "center" }}>
            Infinity
          </p>
        </div>
      </div>
    </div>
  );
};
