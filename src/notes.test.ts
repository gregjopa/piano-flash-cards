import { getScaleNotesForKeySignature } from "./notes";
import { KeySignature } from "./constants";

test("key signature scales", () => {
  expect(getScaleNotesForKeySignature(KeySignature.C)).toEqual([
    { noteName: "C", tone: 0 },
    { noteName: "D", tone: 2 },
    { noteName: "E", tone: 4 },
    { noteName: "F", tone: 5 },
    { noteName: "G", tone: 7 },
    { noteName: "A", tone: 9 },
    { noteName: "B", tone: 11 },
  ]);

  expect(getScaleNotesForKeySignature(KeySignature.F)).toEqual([
    { noteName: "F", tone: 5 },
    { noteName: "G", tone: 7 },
    { noteName: "A", tone: 9 },
    { noteName: "Bb", tone: 10 },
    { noteName: "C", tone: 0 },
    { noteName: "D", tone: 2 },
    { noteName: "E", tone: 4 },
  ]);

  expect(getScaleNotesForKeySignature(KeySignature.G)).toEqual([
    { noteName: "G", tone: 7 },
    { noteName: "A", tone: 9 },
    { noteName: "B", tone: 11 },
    { noteName: "C", tone: 0 },
    { noteName: "D", tone: 2 },
    { noteName: "E", tone: 4 },
    { noteName: "F#", tone: 6 },
  ]);

  expect(getScaleNotesForKeySignature(KeySignature.Bm)).toEqual([
    { noteName: "B", tone: 11 },
    { noteName: "C#", tone: 1 },
    { noteName: "D", tone: 2 },
    { noteName: "E", tone: 4 },
    { noteName: "F#", tone: 6 },
    { noteName: "G", tone: 7 },
    { noteName: "A", tone: 9 },
  ]);
});
