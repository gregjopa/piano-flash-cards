import React, { Dispatch, MouseEvent } from "react";

import { keySignatureNotes, Note, NoteValue } from "../notes";
import { Octave } from "../constants";

type PianoKeyboardProps = {
  activeNote: Note;
  onClick: Dispatch<{ noteValue: NoteValue; octave: Octave }>;
};

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  activeNote,
  onClick,
}) => {
  const { noteName, noteValue, keySignature, octave } = activeNote;

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
    const scaleNote = scaleNotes.find(
      ({ noteValue }) => noteValue === noteIndex
    );
    const scaleNoteName = scaleNote ? scaleNote.noteName : null;
    const isActiveNote = noteName === scaleNoteName;

    return (
      <li
        className={`flex items-end justify-center rounded-b-sm border border-r-0 shadow-inner last:border-r ${
          color === "white"
            ? "h-24 basis-12 border-gray-500 bg-white active:shadow-[inset_2px_0_3px_rgba(96,96,96,0.1),_inset_-5px_5px_20px_rgba(96,96,96,0.3),_inset_0_0_3px_rgba(96,96,96,0.4)]"
            : "z-10 -ml-4 h-16 basis-8 border-r border-black bg-black text-white active:shadow-[inset_2px_0_3px_rgb(56,56,56),_inset_-5px_5px_20px_rgb(64,64,64),_inset_0_0_3px_rgb(72,72,72)]"
        }${offset === true ? " -ml-4" : ""} ${
          isActiveNote ? "bg-gray-300 font-bold text-slate-900" : ""
        }`}
        key={noteIndex}
        data-note-value={noteIndex}
      >
        {scaleNoteName}
      </li>
    );
  });

  function handleClick(event: MouseEvent) {
    const pianoKeyNoteValue =
      (event.target as HTMLLIElement).getAttribute("data-note-value") ??
      noteValue;

    onClick({
      noteValue: Number(pianoKeyNoteValue) as NoteValue,
      octave,
    });
  }

  return (
    <ul onClick={handleClick} className="flex flex-row justify-center">
      {keysWithNames}
    </ul>
  );
};
