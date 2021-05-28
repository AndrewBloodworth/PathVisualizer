import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectBoard } from "./boardSlice";

export const Gridrow = ({
  mouseDown,
  setMouseDown,
  node,
  setNode,
  currentRow,
  slider,
  setSlider,
}) => {
  const { board } = useSelector(selectBoard);

  const handleMouseDown = (e) => {
    e.preventDefault();
    if (board.isNode(e.target.id))
      setNode({ currentlyMoving: true, type: e.target.className });
    board.addRemoveWall(e.target);
    setMouseDown(true);
  };
  const handleMouseUp = () => {
    setNode({ ...node, currentlyMoving: false });
    setMouseDown(false);
  };
  const handleMouseEnter = ({ target }) => {
    if (node.currentlyMoving) {
      board.placeNode(node.type, target.id);
      setNode({ ...node });
    } else if (mouseDown) board.addRemoveWall(target);
  };

  const dimensions = board.getDimensions(slider);
  return [...Array(dimensions.innerWidth).keys()].map((col) => {
    let id = `${currentRow}-${col + dimensions.offsetWidth}`;
    board.graph[id] = board.grid[id];
    let cName =
      board.grid[id].items.length > 0
        ? board.grid[id].items[0]
        : board.grid[id].state;
    return (
      <td
        key={col}
        id={id}
        className={cName}
        onMouseEnter={handleMouseEnter}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      ></td>
    );
  });
};
