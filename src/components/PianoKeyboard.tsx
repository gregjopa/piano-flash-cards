import React from "react";
import { Music, KeyManager } from "vexflow";

import { NoteName } from "../constants";
import type { Note } from "../notes";

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

  const music = new Music();
  const keyManager = new KeyManager(keySignature);

  const { root, accidental = '' } = music.getKeyParts(keySignature);
  const rootNoteIndex = music.getNoteValue(`${root}${accidental}`);

  const keysForOneOctaveWithRootFirst = [
    ...keysForOneOctave.slice(rootNoteIndex, keysForOneOctave.length),
    ...keysForOneOctave.slice(0, rootNoteIndex),
  ];

  const keysWithNames = keysForOneOctaveWithRootFirst.map(({ noteIndex, color, offset }) => {
    const canonicalNoteName = music.getCanonicalNoteName(noteIndex);
    const adjustedNoteNameLowerCase =
      keyManager.selectNote(canonicalNoteName).note;
    let adjustedNoteName = (adjustedNoteNameLowerCase[0].toUpperCase() +
      adjustedNoteNameLowerCase.slice(1)) as NoteName;

    const isActiveNote = noteName === adjustedNoteName;

    // TODO: figure out how to add both note names to the black keys

    return (
      <li
        className={`flex justify-center items-end border border-r-0 rounded-b-sm last:border-r ${
          color === "white"
            ? "h-24 basis-12 bg-white border-gray-500"
            : "h-16 basis-8 bg-black text-white border-black border-r z-10 -ml-4"
        } ${offset === true ? "-ml-4" : ""} ${
          isActiveNote ? "font-bold bg-gray-300 text-black" : ""
        }`}
        key={noteIndex}
      >
        {adjustedNoteName}
      </li>
    );
  });

  return <ul className="flex flex-row justify-center">{keysWithNames}</ul>;
};
