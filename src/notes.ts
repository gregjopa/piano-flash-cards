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

export function getBeginnerNotes(): Note[] {
  const noteNames = Object.values(NoteName).filter((noteName) => {
    return noteName.includes("#") === false && noteName.includes("b") === false;
  });

  const octaves = [Octave.Four];
  let notes: Note[] = [];

  for (const octave of octaves) {
    for (const noteName of noteNames) {
      notes.push({
        noteName,
        octave,
        clef: Clef.Treble,
        keySignature: KeySignature.C,
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
  const noteNames = Object.values(NoteName);

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
