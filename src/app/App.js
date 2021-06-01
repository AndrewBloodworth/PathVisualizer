import React, { useState } from "react";
import { Nav } from "../components/nav/Nav";
import { Grid } from "../components/grid/Grid";
import "./index.css";

export const App = () => {
  const [numberOfRows, setNumberOfRows] = useState(5);
  return (
    <main className="App">
      <Nav numberOfRows={numberOfRows} setNumberOfRows={setNumberOfRows} />
      <Grid numberOfRows={numberOfRows} />
    </main>
  );
};
