import { AudioContext } from "standardized-audio-context-mock";
import { Music } from "vexflow";

import { AudioPlayer } from "./audio";
import { NoteName, Octave } from "./constants";

const mockedSamples = {
  C2: "C2",
  C3: "C3",
  C4: "C4",
  C5: "C5",
  C6: "C6",
  C7: "C7",
};

let audioPlayer: AudioPlayer;
const { getNoteValue } = new Music();
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
    audioPlayer.playNote(NoteName.C, Octave.Four);
    expect(mockedPlayTone.mock.calls[0]).toEqual([0, mockedSamples.C4]);
  });

  // B4 should use sample C5 for the best sound with pitch shifting
  test("B4", () => {
    audioPlayer.playNote(NoteName.B, Octave.Four);
    expect(mockedPlayTone.mock.calls[0]).toEqual([-1, mockedSamples.C5]);
  });

  // G6 should use sample C7 for the best sound with pitch shifting
  test("G6", () => {
    audioPlayer.playNote(NoteName["G"], Octave.Six);
    expect(mockedPlayTone.mock.calls[0]).toEqual([-5, mockedSamples.C7]);
  });
});

describe("playPowerChord()", () => {
  test("C4", () => {
    const root = {
      name: NoteName.C,
      octave: Octave.Four,
      sample: mockedSamples.C4,
      value: 0,
    };

    // the fifth is 7 semitones away from the root note
    // the fifth of C is G (0 => 7)
    // and the closest sample is the octave above (7 - 12 = -5)
    const fifth = {
      sample: mockedSamples.C5,
      value: -5,
    };

    const octaveFromRoot = {
      sample: mockedSamples.C5,
      value: root.value,
    };

    audioPlayer.playPowerChord(root.name, root.octave);

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
      octave: Octave.Two,
      sample: mockedSamples.C3,
      value: -3,
    };

    const fifth = {
      sample: mockedSamples.C3,
      value: 4,
    };

    const octaveFromRoot = {
      sample: mockedSamples.C4,
      value: root.value,
    };

    audioPlayer.playPowerChord(root.name, root.octave);

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
      octave: Octave.Two,
      sample: mockedSamples.C2,
      value: 2,
    };

    const fifth = {
      sample: mockedSamples.C3,
      value: -3,
    };

    const octaveFromRoot = {
      sample: mockedSamples.C3,
      value: root.value,
    };

    audioPlayer.playPowerChord(root.name, root.octave);

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
      octave: Octave.Six,
      sample: mockedSamples.C7,
      value: -5,
    };

    const fifth = {
      sample: mockedSamples.C7,
      value: 2,
    };

    const octaveFromRoot = {
      sample: mockedSamples.C6,
      value: root.value,
    };

    audioPlayer.playPowerChord(root.name, root.octave);

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
      octave: Octave.Six,
      sample: mockedSamples.C7,
      value: -1,
    };

    const fifth = {
      sample: mockedSamples.C7,
      value: 6,
    };

    const octaveFromRoot = {
      sample: mockedSamples.C6,
      value: root.value,
    };

    audioPlayer.playPowerChord(root.name, root.octave);

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
      octave: Octave.Four,
      sample: mockedSamples.C4,
      value: 0,
    };

    const minorThird = {
      sample: mockedSamples.C4,
      value: 3,
    };

    const diminishedFifth = {
      sample: mockedSamples.C4,
      value: 6,
    };

    audioPlayer.playDiminishedChord(root.name, root.octave);

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
      octave: Octave.Two,
      sample: mockedSamples.C3,
      value: -3,
    };

    const minorThird = {
      sample: mockedSamples.C3,
      value: 0,
    };

    const diminishedFifth = {
      sample: mockedSamples.C3,
      value: 3,
    };

    audioPlayer.playDiminishedChord(root.name, root.octave);

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
      octave: Octave.Two,
      sample: mockedSamples.C2,
      value: 2,
    };

    const minorThird = {
      sample: mockedSamples.C2,
      value: 5,
    };

    const diminishedFifth = {
      sample: mockedSamples.C3,
      value: -4,
    };

    audioPlayer.playDiminishedChord(root.name, root.octave);

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
      octave: Octave.Six,
      sample: mockedSamples.C7,
      value: -5,
    };

    const minorThird = {
      sample: mockedSamples.C7,
      value: -2,
    };

    const diminishedFifth = {
      sample: mockedSamples.C7,
      value: 1,
    };

    audioPlayer.playDiminishedChord(root.name, root.octave);

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
      octave: Octave.Six,
      sample: mockedSamples.C7,
      value: -1,
    };

    const minorThird = {
      sample: mockedSamples.C7,
      value: 2,
    };

    const diminishedFifth = {
      sample: mockedSamples.C7,
      value: 5,
    };

    audioPlayer.playDiminishedChord(root.name, root.octave);

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
