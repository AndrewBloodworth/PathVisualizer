import React from "react";
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
    board.domController.grabNode("grabbing");
    if (board.isNode(e.target.id))
      setNode({ currentlyMoving: true, type: e.target });
    board.addRemoveWall(e.target);
    setMouseDown(true);
  };
  const handleMouseUp = () => {
    board.domController.grabNode("grab");
    setNode({ ...node, currentlyMoving: false });
    setMouseDown(false);
  };
  const handleMouseEnter = ({ target }) => {
    if (node.currentlyMoving) {
      board.placeNode(node.type.className, node.type.id, target.id);
      setNode({ ...node, type: target });
    } else if (mouseDown) board.addRemoveWall(target);
  };

  const { innerWidth, offsetWidth } = board.getDimensions(slider);
  return [...Array(innerWidth).keys()].map((col) => {
    let id = `${currentRow}-${col + offsetWidth}`;
    board.graph[id] = board.grid[id];
    let cName = board.grid[id].hasItem()
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
      >
        <div className="specs" id={`specs-${id}`}>
          {board.grid[id].getSpecs()}
        </div>
      </td>
    );
  });
};
