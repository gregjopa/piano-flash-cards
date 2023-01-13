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

function getScaleNotesForKeySignature(keySignature: KeySignature): ScaleNote[] {
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
  const { C, F, G } = KeySignature;
  const { Two, Three, Four, Five, Six } = Octave;
  const { Treble, Bass } = Clef;

  // avoid drawing notes that go off the stave (ex: treble clef octave 6)
  const cNotesPartialScale = keySignatureNotes[C].slice(0, 3);

  const noteConfig = [
    { key: C, octave: Two, clef: Bass, notes: keySignatureNotes[C] },
    { key: F, octave: Two, clef: Bass, notes: keySignatureNotes[F] },
    { key: G, octave: Two, clef: Bass, notes: keySignatureNotes[G] },
    { key: F, octave: Three, clef: Bass, notes: keySignatureNotes[F] },
    { key: G, octave: Three, clef: Bass, notes: keySignatureNotes[G] },
    { key: C, octave: Four, clef: Bass, notes: cNotesPartialScale },
    { key: F, octave: Four, clef: Treble, notes: keySignatureNotes[F] },
    { key: G, octave: Four, clef: Treble, notes: keySignatureNotes[G] },
    { key: F, octave: Five, clef: Treble, notes: keySignatureNotes[F] },
    { key: G, octave: Five, clef: Treble, notes: keySignatureNotes[G] },
    { key: C, octave: Six, clef: Treble, notes: cNotesPartialScale },
  ];

  const uniqueNotes = new Set<String>();
  const intermediateNotes = [];

  for (const { key, octave, clef, notes } of noteConfig) {
    for (const { noteName } of notes) {
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
  const octaves = [Octave.Three, Octave.Four, Octave.Five];

  const uniqueNotes = new Set<String>();
  const advancedNotes = [];

  for (const key of advancedKeys) {
    for (const octave of octaves) {
      for (const { noteName } of keySignatureNotes[key]) {
        const clef = octave === Octave.Three ? Clef.Bass : Clef.Treble;
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
