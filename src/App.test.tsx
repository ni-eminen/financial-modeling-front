import React from "react";
import { render, screen } from "@testing-library/react";
import ProbablyApp from "./App";

test("renders learn react link", () => {
  render(<ProbablyApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
