import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import {
  defaultNote,
  getBeginnerNotes,
  getIntermediateNotes,
  getAdvancedNotes,
  Note,
} from "./notes";
import { NoteName, Clef, KeySignature, Octave } from "./constants";
import { StaveNote } from "./components/StaveNote";

// mock <StaveNote /> since Vexflow fails to render with JSDOM
jest.mock("./components/StaveNote", () => ({
  StaveNote: jest.fn(() => {
    return <div data-testid="mock-stave-note" />;
  }),
}));

jest.mock("./notes", () => {
  const originalModule = jest.requireActual("./notes");

  return {
    ...originalModule,
    getBeginnerNotes: jest.fn(),
    getIntermediateNotes: jest.fn(),
    getAdvancedNotes: jest.fn(),
  };
});

const mockedGetBeginnerNotes = jest.mocked(getBeginnerNotes);
const mockedGetIntermediateNotes = jest.mocked(getIntermediateNotes);
const mockedGetAdvancedNotes = jest.mocked(getAdvancedNotes);
const MockedStaveNote = jest.mocked(StaveNote);

beforeEach(() => {
  jest.clearAllMocks();

  // mock google analytics
  global.gtag = jest.fn();

  mockedGetBeginnerNotes.mockReturnValue([]);
  mockedGetIntermediateNotes.mockReturnValue([]);
  mockedGetAdvancedNotes.mockReturnValue([]);
});

test("initial score is zero", () => {
  render(<App />);
  expect(screen.getByText(/Score: 0/i)).toBeInTheDocument();
});

test("score increases after a correct guess", () => {
  render(<App />);
  const noteSelectorElement = screen.getByLabelText("What note is it?");
  fireEvent.change(noteSelectorElement, {
    target: { value: defaultNote.noteName },
  });
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
  mockedGetBeginnerNotes.mockReturnValue([
    {
      noteName: NoteName.E,
      noteValue: 4,
      octave: Octave.Four,
      clef: Clef.Treble,
      keySignature: KeySignature.C,
    },
  ]);

  render(<App />);
  const noteSelectorElement = screen.getByLabelText("What note is it?");
  fireEvent.change(noteSelectorElement, {
    target: { value: defaultNote.noteName },
  });
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
  const mockNote = {
    noteName: NoteName.E,
    noteValue: 4,
    octave: Octave.Four,
    clef: Clef.Treble,
    keySignature: KeySignature.C,
  } as Note;

  mockedGetBeginnerNotes.mockReturnValue([mockNote]);

  mockedGetIntermediateNotes.mockReturnValue([
    {
      ...mockNote,
      ...{ noteName: NoteName.F },
    },
  ]);

  mockedGetAdvancedNotes.mockReturnValue([
    {
      ...mockNote,
      ...{ noteName: NoteName.G },
    },
  ]);

  render(<App />);
  const noteSelectorElement = screen.getByLabelText("What note is it?");
  fireEvent.change(noteSelectorElement, {
    target: { value: defaultNote.noteName },
  });
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

test("render error displays the error boundary fallback component", () => {
  const consoleError = jest.spyOn(console, "error");
  consoleError.mockImplementation(() => {});

  MockedStaveNote.mockImplementation(() => {
    throw new Error("failed to render the StaveNote component");
    // eslint-disable-next-line no-unreachable
    return <div data-testid="mock-stave-note" />;
  });

  render(<App />);

  expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  expect(
    screen.getByText(/failed to render the StaveNote component/i)
  ).toBeInTheDocument();

  consoleError.mockRestore();
});
