import { KeyManager, Music } from "vexflow";

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

type ScaleNote = {
  noteName: NoteName;
  tone: number;
};

export function getScaleNotesForKeySignature(
  keySignature: KeySignature
): ScaleNote[] {
  const music = new Music();
  const keyManager = new KeyManager(keySignature);

  const { root, accidental = "", type } = music.getKeyParts(keySignature);
  const rootNoteIndex = music.getNoteValue(`${root}${accidental}`);
  const scale = music.getScaleTones(rootNoteIndex, Music.scaleTypes[type]);

  const scaleNotes = scale.map((tone) => {
    const canonicalNoteName = music.getCanonicalNoteName(tone);
    const keyManagerNote = keyManager.selectNote(canonicalNoteName);
    const noteNameLowerCase = keyManagerNote.note;
    const noteName = (noteNameLowerCase[0].toUpperCase() +
      noteNameLowerCase.slice(1)) as NoteName;

    return { noteName, tone };
  });

  return scaleNotes;
}

export const keySignatureNotes = Object.values(KeySignature).reduce(
  (accumulator, keySignature) => {
    return {
      ...accumulator,
      ...{ [keySignature]: getScaleNotesForKeySignature(keySignature) },
    };
  },
  {} as { [key in keyof typeof KeySignature]: ScaleNote[] }
);

export function getBeginnerNotes(): Note[] {
  // use C for beginner notes
  const keySignature = KeySignature.C;
  const scaleNotes = keySignatureNotes[keySignature];

  const notes = [];

  for (const { noteName } of scaleNotes) {
    // filter out C4 since its the default first note
    if (noteName === defaultNote.noteName) {
      continue;
    }

    notes.push({
      noteName,
      keySignature,
      octave: Octave.Four,
      clef: Clef.Treble,
    });
  }

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
  const notes = [];

  for (const keySignature of keySignatures) {
    const scaleNotes = keySignatureNotes[keySignature];

    for (const { octave, clef } of octavesWithClef) {
      for (const { noteName } of scaleNotes) {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getNoteNamesForKeySignature(keySignature: KeySignature): NoteName[] {
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
