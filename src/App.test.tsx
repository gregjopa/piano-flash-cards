import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

// mock <StaveNote /> since Vexflow fails to render with JSDOM
jest.mock("./components/StaveNote", () => ({
  StaveNote: () => {
    return <div data-testid="mock-stave-note" />;
  },
}));

// mock google analytics
global.gtag = jest.fn();

test("initial score is zero", () => {
  render(<App />);
  const score = screen.getByText(/Score: 0/i);
  expect(score).toBeInTheDocument();
});

test("score increases after a correct guess", () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText("What note is it?"), {
    target: { value: "C" },
  });
  const alert = screen.getByRole("alert");
  expect(alert).toHaveTextContent("Correct!");
  const updatedScore = screen.getByText(/Score: 1/i);
  expect(updatedScore).toBeInTheDocument();
});

test("start over button dislays after an incorrect guess", () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText("What note is it?"), {
    target: { value: "D" },
  });
  const alert = screen.getByRole("alert");
  expect(alert).toHaveTextContent("Incorrect");
  const startOverButton = screen.getByText(/Start Over/i);
  expect(startOverButton).toBeInTheDocument();
});
