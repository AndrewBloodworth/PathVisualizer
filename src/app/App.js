import React, { useState } from "react";
import { Nav } from "../components/nav/Nav";
import { Grid } from "../components/grid/Grid";
import "./index.css";

export const App = () => {
  const [slider, setSlider] = useState(5);
  return (
    <main className="App">
      <Nav slider={slider} setSlider={setSlider} />
      <Grid slider={slider} setSlider={setSlider} />
    </main>
  );
};
