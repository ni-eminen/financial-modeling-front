import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button, ThemeProvider, createTheme } from "@mui/material";
import ProbablyApp from "./components/TwoColumnLayout";

export function ButtonUsage() {
  return <Button variant="contained">Hello world</Button>;
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <ProbablyApp />
      </div>
    </ThemeProvider>
  );
}

export default ProbablyApp;
