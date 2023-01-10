import React from "react";

import { keySignatureNotes, Note } from "../notes";

type PianoKeyboardProps = {
  activeNote: Note;
};

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({ activeNote }) => {
  const { noteName, keySignature } = activeNote;

  const keysForOneOctave: {
    noteIndex: number;
    color: "white" | "black";
    offset: boolean;
  }[] = [
    { noteIndex: 0, color: "white", offset: false },
    { noteIndex: 1, color: "black", offset: false },
    { noteIndex: 2, color: "white", offset: true },
    { noteIndex: 3, color: "black", offset: false },
    { noteIndex: 4, color: "white", offset: true },
    { noteIndex: 5, color: "white", offset: false },
    { noteIndex: 6, color: "black", offset: false },
    { noteIndex: 7, color: "white", offset: true },
    { noteIndex: 8, color: "black", offset: false },
    { noteIndex: 9, color: "white", offset: true },
    { noteIndex: 10, color: "black", offset: false },
    { noteIndex: 11, color: "white", offset: true },
  ];

  const scaleNotes = keySignatureNotes[keySignature];

  const keysWithNames = keysForOneOctave.map(({ noteIndex, color, offset }) => {
    const scaleNote = scaleNotes.find(({ tone }) => tone === noteIndex);
    const scaleNoteName = scaleNote ? scaleNote.noteName : null;
    const isActiveNote = noteName === scaleNoteName;

    return (
      <li
        className={`flex items-end justify-center rounded-b-sm border border-r-0 last:border-r ${
          color === "white"
            ? "h-24 basis-12 border-gray-500 bg-white"
            : "z-10 -ml-4 h-16 basis-8 border-r border-black bg-black text-white"
        }${offset === true ? " -ml-4" : ""} ${
          isActiveNote ? "bg-gray-300 font-bold text-slate-900" : ""
        }`}
        key={noteIndex}
      >
        {scaleNoteName}
      </li>
    );
  });

  return <ul className="flex flex-row justify-center">{keysWithNames}</ul>;
};
