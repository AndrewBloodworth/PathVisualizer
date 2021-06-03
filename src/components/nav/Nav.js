import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectBoard } from "../grid/boardSlice";
import { Settings } from "./Settings";

export const Nav = ({ numberOfRows, setNumberOfRows }) => {
  const { board } = useSelector(selectBoard);

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
  const handleMouseLeave = () => {
    try {
      board.dom.setAnimations("on");
    } catch (error) {}
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
      <Settings numberOfRows={numberOfRows} setNumberOfRows={setNumberOfRows} />
    </div>
  );
};
