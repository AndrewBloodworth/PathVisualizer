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
  useEffect(() => {
    // document.body.style.setProperty("--toggle", "1");
    //document.body.style.setProperty("--playState", "running");
  });
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
      if (board.solved) board.runDijkstra(0);
      setNode({ ...node });
    } else if (mouseDown) board.addRemoveWall(target);
  };

  //Slider
  const dimensions = board.getDimensions(slider);
  let round = Math.floor((board.width - dimensions.innerWidth) / 2);
  return [...Array(dimensions.innerWidth).keys()].map((col) => {
    //debugger;
    let id = `${currentRow}-${col + round}`;
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
