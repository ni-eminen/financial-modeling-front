import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button } from "@mui/material";
import ProbablyApp from "./components/TwoColumnLayout";

export function ButtonUsage() {
  return <Button variant="contained">Hello world</Button>;
}

function App() {
  return (
    <div className="App">
      <ProbablyApp />
    </div>
  );
}

export default ProbablyApp;
