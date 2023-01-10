import React from "react";
import { render, screen } from "@testing-library/react";
import { PianoKeyboard } from "./PianoKeyboard";
import { NoteName, Clef, KeySignature, Octave } from "../constants";

test("key of C Major with C as the active note", () => {
  render(
    <PianoKeyboard
      activeNote={{
        noteName: NoteName.C,
        octave: Octave.Four,
        clef: Clef.Treble,
        keySignature: KeySignature.C,
      }}
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
});

test("key of F Major with Bb as the active note", () => {
  render(
    <PianoKeyboard
      activeNote={{
        noteName: NoteName.Bb,
        octave: Octave.Four,
        clef: Clef.Treble,
        keySignature: KeySignature.F,
      }}
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
});

test("key of G Major with F# as the active note", () => {
  render(
    <PianoKeyboard
      activeNote={{
        noteName: NoteName["F#"],
        octave: Octave.Four,
        clef: Clef.Treble,
        keySignature: KeySignature.G,
      }}
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
});

test("key of B Minor with B as the active note", () => {
  render(
    <PianoKeyboard
      activeNote={{
        noteName: NoteName.B,
        octave: Octave.Four,
        clef: Clef.Treble,
        keySignature: KeySignature.Bm,
      }}
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
});
