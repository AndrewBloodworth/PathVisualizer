import React, { useState } from "react";
import { selectBoard } from "../grid/boardSlice";
import { useSelector } from "react-redux";

export const Settings = ({ numberOfRows, setNumberOfRows }) => {
  const { board } = useSelector(selectBoard);
  const [speed, setSpeed] = useState(100);
  const [checked, setChecked] = useState(true);
  const [active, setActive] = useState(false);

  const handleChange = (e) => {
    board.dom.setAnimations("off");
    board.removeVisited(numberOfRows);
    setNumberOfRows(board.manufactureGraph(e.target.value) || numberOfRows);
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
    <div className="settings-container">
      <div className="distance">
        <p style={{ paddingRight: 10 }}>Path Distance: </p>
        <p id="distance">Infinity</p>
      </div>
      <div className="settings-gear">
        <div
          className="gear"
          id={active ? "white" : "gray"}
          onMouseEnter={handleEnterGear}
        ></div>
        <div
          className="settings-menu"
          style={{ visibility: active ? "visible" : "hidden" }}
          onMouseLeave={handleMouseLeaveSettings}
        >
          <div className="settings">
            <div className="settings-title">
              <h2 style={{ margin: 0 }}>Settings</h2>
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
            <hr />
            <div className="view-distance">
              <label>
                <span style={{ fontSize: 20 }}>Distances: </span>
                {checked ? "Hidden" : "Shown"}
              </label>
              <div className="show-hide-distances">
                <p style={{ margin: 0 }}>Show</p>
                <input
                  type="checkbox"
                  value={checked}
                  onClick={handleViewDistance}
                  id="view-distance"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
