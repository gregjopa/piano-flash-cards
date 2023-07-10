import React from "react";
import { test, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PianoKeyboard } from "./PianoKeyboard";
import { NoteName, Clef, KeySignature } from "../constants";

const mockedClickHandler = vi.fn();

afterEach(() => {
  document.body.innerHTML = "";
  vi.clearAllMocks();
});

test("key of C Major with C as the active note", () => {
  render(
    <PianoKeyboard
      activeNote={{
        noteName: NoteName.C,
        octave: 4,
        clef: Clef.Treble,
        keySignature: KeySignature.C,
        noteValue: 0,
      }}
      onClick={mockedClickHandler}
    />
  );

  const pianoNotes = screen
    .getAllByRole("listitem")
    .map((item, index) => ({ noteName: item.innerHTML, tone: index }))
    .filter((note) => Boolean(note.noteName));

  expect(pianoNotes).toEqual([
    { noteName: "C", tone: 0 },
    { noteName: "D", tone: 2 },
    { noteName: "E", tone: 4 },
    { noteName: "F", tone: 5 },
    { noteName: "G", tone: 7 },
    { noteName: "A", tone: 9 },
    { noteName: "B", tone: 11 },
  ]);

  const activeNoteElement = screen.getByText(/C/i);
  expect(activeNoteElement.getAttribute("class")).toContain("font-bold");

  fireEvent.click(screen.getByText(/C/i));
  expect(mockedClickHandler.mock.calls[0][0]).toEqual({
    noteValue: 0,
    octave: 4,
  });
});

test("key of F Major with Bb as the active note", () => {
  render(
    <PianoKeyboard
      activeNote={{
        noteName: NoteName.Bb,
        octave: 4,
        clef: Clef.Treble,
        keySignature: KeySignature.F,
        noteValue: 10,
      }}
      onClick={mockedClickHandler}
    />
  );

  const pianoNotes = screen
    .getAllByRole("listitem")
    .map((item, index) => ({ noteName: item.innerHTML, tone: index }))
    .filter((note) => Boolean(note.noteName));

  expect(pianoNotes).toEqual([
    { noteName: "C", tone: 0 },
    { noteName: "D", tone: 2 },
    { noteName: "E", tone: 4 },
    { noteName: "F", tone: 5 },
    { noteName: "G", tone: 7 },
    { noteName: "A", tone: 9 },
    { noteName: "Bb", tone: 10 },
  ]);

  const activeNoteElement = screen.getByText(/Bb/i);
  expect(activeNoteElement.getAttribute("class")).toContain("font-bold");

  fireEvent.click(screen.getByText(/Bb/i));
  expect(mockedClickHandler.mock.calls[0][0]).toEqual({
    noteValue: 10,
    octave: 4,
  });
});

test("key of G Major with F# as the active note", () => {
  render(
    <PianoKeyboard
      activeNote={{
        noteName: NoteName["F#"],
        octave: 4,
        clef: Clef.Treble,
        keySignature: KeySignature.G,
        noteValue: 6,
      }}
      onClick={mockedClickHandler}
    />
  );

  const pianoNotes = screen
    .getAllByRole("listitem")
    .map((item, index) => ({ noteName: item.innerHTML, tone: index }))
    .filter((note) => Boolean(note.noteName));

  expect(pianoNotes).toEqual([
    { noteName: "C", tone: 0 },
    { noteName: "D", tone: 2 },
    { noteName: "E", tone: 4 },
    { noteName: "F#", tone: 6 },
    { noteName: "G", tone: 7 },
    { noteName: "A", tone: 9 },
    { noteName: "B", tone: 11 },
  ]);

  const activeNoteElement = screen.getByText(/F#/i);
  expect(activeNoteElement.getAttribute("class")).toContain("font-bold");

  fireEvent.click(screen.getByText(/F#/i));
  expect(mockedClickHandler.mock.calls[0][0]).toEqual({
    noteValue: 6,
    octave: 4,
  });
});

test("key of B Minor with B as the active note", () => {
  render(
    <PianoKeyboard
      activeNote={{
        noteName: NoteName.B,
        octave: 4,
        clef: Clef.Treble,
        keySignature: KeySignature.Bm,
        noteValue: 11,
      }}
      onClick={mockedClickHandler}
    />
  );

  const pianoNotes = screen
    .getAllByRole("listitem")
    .map((item, index) => ({ noteName: item.innerHTML, tone: index }))
    .filter((note) => Boolean(note.noteName));

  expect(pianoNotes).toEqual([
    { noteName: "C#", tone: 1 },
    { noteName: "D", tone: 2 },
    { noteName: "E", tone: 4 },
    { noteName: "F#", tone: 6 },
    { noteName: "G", tone: 7 },
    { noteName: "A", tone: 9 },
    { noteName: "B", tone: 11 },
  ]);

  const activeNoteElement = screen.getByText(/B/i);
  expect(activeNoteElement.getAttribute("class")).toContain("font-bold");

  fireEvent.click(screen.getByText(/B/i));
  expect(mockedClickHandler.mock.calls[0][0]).toEqual({
    noteValue: 11,
    octave: 4,
  });
});
