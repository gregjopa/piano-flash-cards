import { AudioContext } from "standardized-audio-context-mock";

import { AudioPlayer } from "./audio";
import { NoteName } from "./constants";
import type { NoteValue } from "./notes";

const mockedSamples = {
  C2: "C2",
  C3: "C3",
  C4: "C4",
  C5: "C5",
  C6: "C6",
  C7: "C7",
};

let audioPlayer: AudioPlayer;
const mockedPlayTone = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  // @ts-ignore standardized-audio-context-mock is not a 100% match to spec
  window.AudioContext = AudioContext;
  window.HTMLMediaElement.prototype.canPlayType = () => "probably";
  audioPlayer = new AudioPlayer();

  // @ts-ignore mock sample values use type string instead of AudioBuffer
  audioPlayer.samples = mockedSamples;

  // @ts-ignore mock private playTone() function
  audioPlayer.playTone = mockedPlayTone;
});

describe("playNote()", () => {
  test("C4", () => {
    audioPlayer.playNote(0, 4);
    expect(mockedPlayTone.mock.calls[0]).toEqual([0, mockedSamples.C4]);
  });

  // B4 should use sample C5 for the best sound with pitch shifting
  test("B4", () => {
    audioPlayer.playNote(11, 4);
    expect(mockedPlayTone.mock.calls[0]).toEqual([-1, mockedSamples.C5]);
  });

  // G6 should use sample C7 for the best sound with pitch shifting
  test("G6", () => {
    audioPlayer.playNote(7, 6);
    expect(mockedPlayTone.mock.calls[0]).toEqual([-5, mockedSamples.C7]);
  });
});

describe("playPowerChord()", () => {
  test("C4", () => {
    const root = {
      name: NoteName.C,
      originalValue: 0,
      value: 0,
      octave: 4,
      sample: mockedSamples.C4,
    };

    // the fifth is 7 semitones away from the root note
    // the fifth of C is G (0 => 7)
    // and the closest sample is the octave above (7 - 12 = -5)
    const fifth = {
      value: -5,
      sample: mockedSamples.C5,
    };

    const octaveFromRoot = {
      value: root.value,
      sample: mockedSamples.C5,
    };

    audioPlayer.playPowerChord(root.originalValue as NoteValue, root.octave);

    expect(mockedPlayTone.mock.calls[0]).toEqual([root.value, root.sample]);
    expect(mockedPlayTone.mock.calls[1]).toEqual([fifth.value, fifth.sample]);
    expect(mockedPlayTone.mock.calls[2]).toEqual([
      octaveFromRoot.value,
      octaveFromRoot.sample,
    ]);
  });

  test("A2", () => {
    const root = {
      name: NoteName.A,
      originalValue: 9,
      value: -3,
      octave: 2,
      sample: mockedSamples.C3,
    };

    const fifth = {
      value: 4,
      sample: mockedSamples.C3,
    };

    const octaveFromRoot = {
      value: root.value,
      sample: mockedSamples.C4,
    };

    audioPlayer.playPowerChord(root.originalValue as NoteValue, root.octave);

    expect(mockedPlayTone.mock.calls[0]).toEqual([root.value, root.sample]);
    expect(mockedPlayTone.mock.calls[1]).toEqual([fifth.value, fifth.sample]);
    expect(mockedPlayTone.mock.calls[2]).toEqual([
      octaveFromRoot.value,
      octaveFromRoot.sample,
    ]);
  });

  test("D2", () => {
    const root = {
      name: NoteName.D,
      originalValue: 2,
      value: 2,
      octave: 2,
      sample: mockedSamples.C2,
    };

    const fifth = {
      value: -3,
      sample: mockedSamples.C3,
    };

    const octaveFromRoot = {
      value: root.value,
      sample: mockedSamples.C3,
    };

    audioPlayer.playPowerChord(root.originalValue as NoteValue, root.octave);

    expect(mockedPlayTone.mock.calls[0]).toEqual([root.value, root.sample]);
    expect(mockedPlayTone.mock.calls[1]).toEqual([fifth.value, fifth.sample]);
    expect(mockedPlayTone.mock.calls[2]).toEqual([
      octaveFromRoot.value,
      octaveFromRoot.sample,
    ]);
  });

  test("G6", () => {
    const root = {
      name: NoteName.G,
      originalValue: 7,
      value: -5,
      octave: 6,
      sample: mockedSamples.C7,
    };

    const fifth = {
      value: 2,
      sample: mockedSamples.C7,
    };

    const octaveFromRoot = {
      value: root.value,
      sample: mockedSamples.C6,
    };

    audioPlayer.playPowerChord(root.originalValue as NoteValue, root.octave);

    expect(mockedPlayTone.mock.calls[0]).toEqual([root.value, root.sample]);
    expect(mockedPlayTone.mock.calls[1]).toEqual([fifth.value, fifth.sample]);
    expect(mockedPlayTone.mock.calls[2]).toEqual([
      octaveFromRoot.value,
      octaveFromRoot.sample,
    ]);
  });

  test("B6", () => {
    const root = {
      name: NoteName.B,
      originalValue: 11,
      value: -1,
      octave: 6,
      sample: mockedSamples.C7,
    };

    const fifth = {
      value: 6,
      sample: mockedSamples.C7,
    };

    const octaveFromRoot = {
      value: root.value,
      sample: mockedSamples.C6,
    };

    audioPlayer.playPowerChord(root.originalValue as NoteValue, root.octave);

    expect(mockedPlayTone.mock.calls[0]).toEqual([root.value, root.sample]);
    expect(mockedPlayTone.mock.calls[1]).toEqual([fifth.value, fifth.sample]);
    expect(mockedPlayTone.mock.calls[2]).toEqual([
      octaveFromRoot.value,
      octaveFromRoot.sample,
    ]);
  });
});

describe("playDiminishedChord()", () => {
  test("C4 dim", () => {
    const root = {
      name: NoteName.C,
      originalValue: 0,
      value: 0,
      octave: 4,
      sample: mockedSamples.C4,
    };

    const minorThird = {
      value: 3,
      sample: mockedSamples.C4,
    };

    const diminishedFifth = {
      value: 6,
      sample: mockedSamples.C4,
    };

    audioPlayer.playDiminishedChord(
      root.originalValue as NoteValue,
      root.octave
    );

    expect(mockedPlayTone.mock.calls[0]).toEqual([root.value, root.sample]);
    expect(mockedPlayTone.mock.calls[1]).toEqual([
      minorThird.value,
      minorThird.sample,
    ]);
    expect(mockedPlayTone.mock.calls[2]).toEqual([
      diminishedFifth.value,
      diminishedFifth.sample,
    ]);
  });

  test("A2 dim", () => {
    const root = {
      name: NoteName.A,
      originalValue: 9,
      value: -3,
      octave: 2,
      sample: mockedSamples.C3,
    };

    const minorThird = {
      value: 0,
      sample: mockedSamples.C3,
    };

    const diminishedFifth = {
      value: 3,
      sample: mockedSamples.C3,
    };

    audioPlayer.playDiminishedChord(
      root.originalValue as NoteValue,
      root.octave
    );

    expect(mockedPlayTone.mock.calls[0]).toEqual([root.value, root.sample]);
    expect(mockedPlayTone.mock.calls[1]).toEqual([
      minorThird.value,
      minorThird.sample,
    ]);
    expect(mockedPlayTone.mock.calls[2]).toEqual([
      diminishedFifth.value,
      diminishedFifth.sample,
    ]);
  });

  test("D2 dim", () => {
    const root = {
      name: NoteName.D,
      originalValue: 2,
      value: 2,
      octave: 2,
      sample: mockedSamples.C2,
    };

    const minorThird = {
      value: 5,
      sample: mockedSamples.C2,
    };

    const diminishedFifth = {
      value: -4,
      sample: mockedSamples.C3,
    };

    audioPlayer.playDiminishedChord(
      root.originalValue as NoteValue,
      root.octave
    );

    expect(mockedPlayTone.mock.calls[0]).toEqual([root.value, root.sample]);
    expect(mockedPlayTone.mock.calls[1]).toEqual([
      minorThird.value,
      minorThird.sample,
    ]);
    expect(mockedPlayTone.mock.calls[2]).toEqual([
      diminishedFifth.value,
      diminishedFifth.sample,
    ]);
  });

  test("G6 dim", () => {
    const root = {
      name: NoteName.G,
      originalValue: 7,
      value: -5,
      octave: 6,
      sample: mockedSamples.C7,
    };

    const minorThird = {
      value: -2,
      sample: mockedSamples.C7,
    };

    const diminishedFifth = {
      value: 1,
      sample: mockedSamples.C7,
    };

    audioPlayer.playDiminishedChord(
      root.originalValue as NoteValue,
      root.octave
    );

    expect(mockedPlayTone.mock.calls[0]).toEqual([root.value, root.sample]);
    expect(mockedPlayTone.mock.calls[1]).toEqual([
      minorThird.value,
      minorThird.sample,
    ]);
    expect(mockedPlayTone.mock.calls[2]).toEqual([
      diminishedFifth.value,
      diminishedFifth.sample,
    ]);
  });

  test("B6 dim", () => {
    const root = {
      name: NoteName.B,
      originalValue: 11,
      value: -1,
      octave: 6,
      sample: mockedSamples.C7,
    };

    const minorThird = {
      value: 2,
      sample: mockedSamples.C7,
    };

    const diminishedFifth = {
      value: 5,
      sample: mockedSamples.C7,
    };

    audioPlayer.playDiminishedChord(
      root.originalValue as NoteValue,
      root.octave
    );

    expect(mockedPlayTone.mock.calls[0]).toEqual([root.value, root.sample]);
    expect(mockedPlayTone.mock.calls[1]).toEqual([
      minorThird.value,
      minorThird.sample,
    ]);
    expect(mockedPlayTone.mock.calls[2]).toEqual([
      diminishedFifth.value,
      diminishedFifth.sample,
    ]);
  });
});
