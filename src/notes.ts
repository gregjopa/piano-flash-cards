import { KeyManager } from "vexflow";

import { NoteName, Clef, KeySignature, Octave } from "./constants";

export type Note = {
  noteName: NoteName;
  octave: Octave;
  keySignature: KeySignature;
  clef: Clef;
};

export const defaultNote = {
  noteName: NoteName.C,
  octave: Octave.Four,
  clef: Clef.Treble,
  keySignature: KeySignature.C,
} as Note;

// TODO: figure out how to limit to only 12 notes per octave/keySignature
export function getNoteNamesForKeySignature(keySignature: KeySignature): NoteName[] {
  // prevent duplicate note names
  const uniqueNoteNames = new Set<NoteName>();

  // get the correct note name using Vexflow's KeyManager class
  const keyManager = new KeyManager(keySignature);

  Object.values(NoteName).forEach((noteName) => {
    const adjustedNoteNameLowerCase = keyManager.selectNote(noteName).note;
    const adjustedNoteName = (adjustedNoteNameLowerCase[0].toUpperCase() +
      adjustedNoteNameLowerCase.slice(1)) as NoteName;
    uniqueNoteNames.add(adjustedNoteName);
  });

  return Array.from(uniqueNoteNames);
}

const keySignatureNotes = Object.values(KeySignature).reduce(
  (accumulator, keySignature) => {
    return {
      ...accumulator,
      ...{ [keySignature]: getNoteNamesForKeySignature(keySignature) },
    };
  },
  {} as { [key in keyof typeof KeySignature]: NoteName[] }
);

export function getBeginnerNotes(): Note[] {
  // use C for beginner notes
  const keySignature = KeySignature.C;

  const noteNames = keySignatureNotes[keySignature].filter((noteName) => {
    return noteName.includes("#") === false && noteName.includes("b") === false;
  });

  const octaves = [Octave.Four];
  let notes: Note[] = [];

  for (const octave of octaves) {
    for (const noteName of noteNames) {
      notes.push({
        noteName,
        octave,
        keySignature,
        clef: Clef.Treble,
      });
    }
  }

  // filter out C4 since its the default first note
  notes = notes.filter(({ noteName, octave }) => {
    return !(
      noteName === defaultNote.noteName && octave === defaultNote.octave
    );
  });

  return notes;
}

export function getIntermediateNotes(): Note[] {
  // F Major has 1 flat and G Major has 1 sharp
  const keySignatures = [KeySignature.C, KeySignature.F, KeySignature.G];
  const octavesWithClef = [
    {
      octave: Octave.Two,
      clef: Clef.Bass,
    },
    {
      octave: Octave.Three,
      clef: Clef.Bass,
    },
    {
      octave: Octave.Four,
      clef: Clef.Treble,
    },
    {
      octave: Octave.Five,
      clef: Clef.Treble,
    },
  ];
  const notes: Note[] = [];

  for (const keySignature of keySignatures) {
    const noteNames = keySignatureNotes[keySignature];

    for (const { octave, clef } of octavesWithClef) {
      for (const noteName of noteNames) {
        notes.push({
          noteName,
          octave,
          clef,
          keySignature,
        });
      }
    }
  }
  return notes;
}

export function pickRandomItemFromArray<Type>(array: Type[]): {
  value: Type;
  index: number;
} {
  const index = Math.floor(Math.random() * array.length);
  return {
    value: array[index],
    index,
  };
}

