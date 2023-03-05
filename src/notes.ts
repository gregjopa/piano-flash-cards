import { KeyManager, Music } from "vexflow";

import { NoteName, Clef, KeySignature } from "./constants";

// 12 pitches
export type NoteValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

// 7 octaves for full sized piano with 88 keys
export type Octave = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Note = {
  noteName: NoteName;
  noteValue: NoteValue;
  octave: Octave;
  keySignature: KeySignature;
  clef: Clef;
};

export const defaultNote = {
  noteName: NoteName.C,
  noteValue: 0,
  octave: 4,
  clef: Clef.Treble,
  keySignature: KeySignature.C,
} as Note;

type ScaleNote = {
  noteName: NoteName;
  noteValue: NoteValue;
};

function getScaleNotesForKeySignature(keySignature: KeySignature): ScaleNote[] {
  const music = new Music();
  const keyManager = new KeyManager(keySignature);

  const { root, accidental = "", type } = music.getKeyParts(keySignature);
  const rootNoteIndex = music.getNoteValue(`${root}${accidental}`);
  const scale = music.getScaleTones(
    rootNoteIndex,
    Music.scaleTypes[type]
  ) as NoteValue[];

  const scaleNotes = scale.map((noteValue) => {
    const canonicalNoteName = music.getCanonicalNoteName(noteValue);
    const keyManagerNote = keyManager.selectNote(canonicalNoteName);
    const noteNameLowerCase = keyManagerNote.note;
    const noteName = (noteNameLowerCase[0].toUpperCase() +
      noteNameLowerCase.slice(1)) as NoteName;

    return { noteName, noteValue };
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

  const notes: Note[] = [];

  for (const { noteName, noteValue } of scaleNotes) {
    // filter out C4 since its the default first note
    if (noteName === defaultNote.noteName) {
      continue;
    }

    notes.push({
      noteName,
      keySignature,
      noteValue,
      octave: 4,
      clef: Clef.Treble,
    });
  }

  return notes;
}

export function getIntermediateNotes(): Note[] {
  // F Major has 1 flat and G Major has 1 sharp
  const { C, F, G } = KeySignature;
  const { Treble, Bass } = Clef;

  // avoid drawing notes that go off the stave (ex: treble clef octave 6)
  const cNotesPartialScale = keySignatureNotes[C].slice(0, 3);
  type NoteConfig = {
    key: KeySignature;
    octave: Octave;
    clef: Clef;
    notes: ScaleNote[];
  }[];

  const noteConfig: NoteConfig = [
    { key: C, octave: 2, clef: Bass, notes: keySignatureNotes[C] },
    { key: F, octave: 2, clef: Bass, notes: keySignatureNotes[F] },
    { key: G, octave: 2, clef: Bass, notes: keySignatureNotes[G] },
    { key: F, octave: 3, clef: Bass, notes: keySignatureNotes[F] },
    { key: G, octave: 3, clef: Bass, notes: keySignatureNotes[G] },
    { key: C, octave: 4, clef: Bass, notes: cNotesPartialScale },
    { key: F, octave: 4, clef: Treble, notes: keySignatureNotes[F] },
    { key: G, octave: 4, clef: Treble, notes: keySignatureNotes[G] },
    { key: F, octave: 5, clef: Treble, notes: keySignatureNotes[F] },
    { key: G, octave: 5, clef: Treble, notes: keySignatureNotes[G] },
    { key: C, octave: 6, clef: Treble, notes: cNotesPartialScale },
  ];

  const uniqueNotes = new Set<String>();
  const intermediateNotes = [];

  for (const { key, octave, clef, notes } of noteConfig) {
    for (const { noteName, noteValue } of notes) {
      const uniqueNoteKey = `${clef}${noteName}${octave}`;

      // avoid duplicating notes with the same name, octave, and clef
      if (uniqueNotes.has(uniqueNoteKey)) {
        continue;
      }

      uniqueNotes.add(uniqueNoteKey);

      intermediateNotes.push({
        noteName,
        octave,
        clef,
        noteValue,
        keySignature: key,
      });
    }
  }

  return intermediateNotes;
}

export function getAdvancedNotes(): Note[] {
  const advancedKeys = [
    KeySignature.D,
    KeySignature.A,
    KeySignature.E,
    KeySignature.B,
    KeySignature.Bb,
    KeySignature.Eb,
    KeySignature.Db,
    KeySignature.Gb,
  ];
  const octaves: Octave[] = [3, 4, 5];

  const uniqueNotes = new Set<String>();
  const advancedNotes = [];

  for (const key of advancedKeys) {
    for (const octave of octaves) {
      for (const { noteName, noteValue } of keySignatureNotes[key]) {
        const clef = octave === 3 ? Clef.Bass : Clef.Treble;
        const uniqueNoteKey = `${clef}${noteName}${octave}`;

        // avoid duplicating notes with the same name, octave, and clef
        if (uniqueNotes.has(uniqueNoteKey)) {
          continue;
        }

        uniqueNotes.add(uniqueNoteKey);

        advancedNotes.push({
          noteName,
          octave,
          clef,
          noteValue,
          keySignature: key,
        });
      }
    }
  }

  return advancedNotes;
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
