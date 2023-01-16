import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

// mock <StaveNote /> since Vexflow fails to render with JSDOM
jest.mock("./components/StaveNote", () => ({
  StaveNote: () => {
    return <div data-testid="mock-stave-note" />;
  },
}));

jest.mock("./notes", () => {
  const originalModule = jest.requireActual("./notes");

  return {
    ...originalModule,
    defaultNote: {
      noteName: "D",
      octave: 4,
      clef: "treble",
      keySignature: "C",
    },
    getBeginnerNotes() {
      return [
        {
          noteName: "E",
          octave: 4,
          clef: "treble",
          keySignature: "C",
        },
      ];
    },
    getIntermediateNotes() {
      return [
        {
          noteName: "F",
          octave: 4,
          clef: "treble",
          keySignature: "C",
        },
      ];
    },
    getAdvancedNotes() {
      return [
        {
          noteName: "G",
          octave: 4,
          clef: "treble",
          keySignature: "C",
        },
      ];
    },
  };
});

// mock google analytics
global.gtag = jest.fn();

test("initial score is zero", () => {
  render(<App />);
  expect(screen.getByText(/Score: 0/i)).toBeInTheDocument();
});

test("score increases after a correct guess", () => {
  render(<App />);
  const noteSelectorElement = screen.getByLabelText("What note is it?");
  fireEvent.change(noteSelectorElement, { target: { value: "D" } });
  expect(screen.getByRole("alert")).toHaveTextContent("Correct!");
  expect(noteSelectorElement).toBeDisabled();
  expect(screen.getByText(/Score: 1/i)).toBeInTheDocument();
});

test("start over button dislays after an incorrect guess", () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText("What note is it?"), {
    // wrong note
    target: { value: "A" },
  });
  expect(screen.getByRole("alert")).toHaveTextContent("Incorrect");
  expect(screen.getByText(/Start Over/i)).toBeInTheDocument();
});

test("start over button click resets the score back to zero", () => {
  render(<App />);
  const noteSelectorElement = screen.getByLabelText("What note is it?");
  fireEvent.change(noteSelectorElement, { target: { value: "D" } });
  fireEvent.click(screen.getByText(/Next Note/i));
  expect(screen.getByText(/Score: 1/i)).toBeInTheDocument();

  fireEvent.change(noteSelectorElement, {
    // wrong note
    target: { value: "A" },
  });
  fireEvent.click(screen.getByText(/Start Over/i));
  expect(screen.getByText(/Score: 0/i)).toBeInTheDocument();
});

test("complete the game after guessing all the notes", () => {
  render(<App />);
  const noteSelectorElement = screen.getByLabelText("What note is it?");
  fireEvent.change(noteSelectorElement, { target: { value: "D" } });
  fireEvent.click(screen.getByText(/Next Note/i));
  fireEvent.change(noteSelectorElement, { target: { value: "E" } });
  fireEvent.click(screen.getByText(/Next Note/i));
  fireEvent.change(noteSelectorElement, { target: { value: "F" } });
  fireEvent.click(screen.getByText(/Next Note/i));
  fireEvent.change(noteSelectorElement, { target: { value: "G" } });

  expect(
    screen.getByText(/Congrats! You completed the game/i)
  ).toBeInTheDocument();
  expect(screen.getByText(/Play Again/i)).toBeInTheDocument();
});
