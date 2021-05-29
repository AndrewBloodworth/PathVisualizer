# Path Visualizer

Visualize how path finding algorithms search and find target nodes.
Check it out: [Path Visualizer](https://andrewbloodworth.github.io/PathVisualizer/)

## Algorithms (more to come)

- Dijkstras

## Description

I wanted this project to give myself and the user a visual representation of what path finding algorithims are how and how they search a graph to find the shortest path.

## Guide

### Basics

- The start of the path will be the array icon on the left.
- The end of the path will be the target icon on the right.
- Move the start or end node to any place on the board by clicking and dragging.
- Run the algorithm by clicking the green 'Run Algorithm' button in the top left of the page.
- Clear the board by clicking the white 'Clear Board' button.
- Add a wall to the board by clicking on an empty space.
- Add multiple walls to the board by clicking and dragging.
- Remove walls by clicking and/or dragging on a wall.

### Settings

- Adjust the size of the board with the first slider in 'Settings'.
  - Size is equal to the number of rows the board contains.
  - By default, the size will be 5.
  - The largest size is 20 rows and will limit the number of columns to be a maximum of 40 or a minimum of 8.
  - Maximum amount of node will be 800 and the mimimum will be 40.
- Adjust the speed of the algoithm with the second slider in 'Settings'.
  - The speed will regulate how fast each node is visited while running the algorithm.
  - By default the speed is set to 100ms.
  - The fastest will be on the far left of the slider at 10ms.
  - The slowest will be on the far right of the slider at 300ms.
  - I dont recommend using the slower speeds on larger boards beacause it can take a long time to find the end node. (A full sized board (800 nodes) and a speed of 300ms per node visited will take about 4 minutes).
- View the shortest path distance
  - By default the path will be Infinity.
  - If a path is found it will update with the new path distance.
  - If no paths exist then the path distance will be Infinity.

### Solved

- The board will be unsolved by default
- Solve the board by running the algorithm.
- When the board has been solved, move the start or end nodes to instantly calculate the path.
- Add or remove walls to see how the path changes.
- If you clear the board or move the start or end node to a position on the board that does not have a path, the board will become unsolved.

Enjoy :) This was a very fun project to put together.
