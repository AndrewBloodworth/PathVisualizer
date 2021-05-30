# Path Visualizer

[Visualize](https://andrewbloodworth.github.io/PathVisualizer/) path finding algorithms.

## Algorithms (more to come)

- [Dijkstras](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)

## Description

The Path Visualizer is a tool that empowers it's user with an intuitive understanding of how path finding algoritms search for the shortest distance between two points (or lack thereof).

## Guide

### Basics

- **The Board**
  - Height (Rows) : 5-20
  - Width (Columns) : 8-40
- **Start and End**
  - Start: <img src="./src/app/Images/arrow-icon--myiconfinder-23.png" alt="arrow" width="20px"/>
  - End: <img src="./src/app/Images/realtarget.png" alt="arrow" width="20px"/>
  - Note: Move the start or end nodes by clicking and dragging.
- **Walls**
  - Add a single wall by clicking on an empty box in the Board.
  - Add/Remove multiple walls by clicking and dragging.
- **Navigation Bar**
  - Run Algorithm: starts visualization.
  - Clear Board: removes all items from the Board except for the start and end nodes

### Settings

- **Size**
  - Description: Adjust to increase or decrease the number of rows in the Board.
  - Default: 5 Rows
  - Range: (5 <= Rows <= 20)
  - Note: Columns are calculated based on window size and will be within the range (8 <= Columns <= 40)
- **Speed**
  - Description: Adjust to increase or decrease the time it takes to visit each node while searching for the shortest path.
  - Default: 100ms
  - Range: (10ms <= Speed <= 300ms)
  - Note: A full sized Board (20 Rows x 40 Columns = 800 Nodes) and the slowest speed (300ms) will take about 4 minutes to solve. Please reload the page to terminate the search.
- **Path Distance**
  - Description: Displays the current path distance.
  - Default: Infinity
  - Note: Path Distance will be a positive integer when a path exists and Infinity otherwise.

### Solved

- Default: unsolved
- The Board will become solved after a path is found.
- Once the Board is solved
  - Move the start or end node to instantly calculate the shortest path.
  - Add or remove walls to see how the shortest path changes.
- If the Board is cleared or there is no path, the Board will become unsolved.

Enjoy :) This was a very fun project to put together.
