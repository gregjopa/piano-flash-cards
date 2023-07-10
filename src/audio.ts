import type { NoteValue, Octave } from "./notes";

export class AudioPlayer {
  audioContext?: AudioContext;
  samples?: {
    C2: AudioBuffer;
    C3: AudioBuffer;
    C4: AudioBuffer;
    C5: AudioBuffer;
    C6: AudioBuffer;
    C7: AudioBuffer;
  };

  constructor() {
    this.playNote = this.playNote.bind(this);
    this.playPowerChord = this.playPowerChord.bind(this);
    this.playDiminishedChord = this.playDiminishedChord.bind(this);
    this.resumeAudioContext = this.resumeAudioContext.bind(this);

    this.audioContext = this.getCrossBrowserAudioContext();
    const audioExtension = this.getSupportedAudioExtension();

    // check for support for the web audio api
    if (!this.audioContext || !audioExtension) {
      return;
    }

    this.applyDecodeAudioDataPolyfill();

    const fileNames = ["C2v10", "C3v10", "C4v10", "C5v10", "C6v10", "C7v10"];

    Promise.all(
      fileNames.map((fileName) =>
        this.loadSample(
          `${import.meta.env.BASE_URL}/audio/${fileName}.${audioExtension}`
        )
      )
    ).then((audioBuffers) => {
      const [C2, C3, C4, C5, C6, C7] = audioBuffers;
      this.samples = { C2, C3, C4, C5, C6, C7 };
    });
  }

  private getCrossBrowserAudioContext(): AudioContext | undefined {
    const AudioContextCrossBrowser =
      window.AudioContext ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).webkitAudioContext as AudioContext);

    if (!AudioContextCrossBrowser) {
      return;
    }

    return new AudioContextCrossBrowser();
  }

  private getSupportedAudioExtension(): "mp3" | "ogg" | undefined {
    const audioElement = document.createElement("audio");

    if (audioElement.canPlayType("audio/mpeg")) {
      return "mp3";
    }

    if (audioElement.canPlayType("audio/ogg")) {
      return "ogg";
    }
  }

  private applyDecodeAudioDataPolyfill() {
    if (!this.audioContext) {
      return;
    }
    // Polyfill for old callback-based syntax used in Safari
    if (this.audioContext.decodeAudioData.length !== 1) {
      const originalDecodeAudioData = this.audioContext.decodeAudioData.bind(
        this.audioContext
      );
      this.audioContext.decodeAudioData = (buffer) =>
        new Promise((resolve, reject) =>
          originalDecodeAudioData(buffer, resolve, reject)
        );
    }
  }

  private loadSample(url: string): Promise<AudioBuffer> {
    return (
      fetch(url)
        .then((response) => response.arrayBuffer())
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .then((buffer) => this.audioContext!.decodeAudioData(buffer))
    );
  }

  private playTone(noteValue: number, sample: AudioBuffer) {
    if (!this.audioContext) {
      return;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = sample;

    // first try to use the detune property for pitch shifting
    if (source.detune) {
      source.detune.value = noteValue * 100;
    } else {
      // fallback to using playbackRate for pitch shifting
      source.playbackRate.value = 2 ** (noteValue / 12);
    }

    source.connect(this.audioContext.destination);

    this.audioContext.resume().then(() => {
      source.start(0);
    });
  }

  private getBestSampleForNote(
    noteValue: number,
    octave: number
  ): [adjustedNoteValue: number, sample: AudioBuffer] {
    let adjustedNoteValue = noteValue;
    let adjustedOctave = octave;

    // use the closest sample to minimize pitch shifting
    if (noteValue > 6 && octave <= 7) {
      adjustedOctave = octave + 1;
      adjustedNoteValue = noteValue - 12;
    }

    type SampleName = keyof typeof this.samples;

    return [
      adjustedNoteValue,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.samples![`C${adjustedOctave}` as SampleName],
    ];
  }

  resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }

  playNote(noteValue: NoteValue, octave: Omit<Octave, 1 | 7>) {
    if (!this.audioContext || !this.samples) {
      return;
    }

    this.playTone(...this.getBestSampleForNote(noteValue, octave as number));
  }

  playPowerChord(noteValue: NoteValue, octave: Omit<Octave, 1 | 7>) {
    let fifthValue = noteValue + 7;
    let fifthOctave = octave as number;
    let octaveFromRoot = (octave as number) + 1;

    if (fifthValue >= 12) {
      fifthValue = noteValue + 7 - 12;
      fifthOctave = (octave as number) + 1;
    }

    if (octaveFromRoot === 7 && noteValue > 6) {
      octaveFromRoot = (octave as number) - 1;
    }

    this.playNote(noteValue, octave);
    this.playNote(fifthValue as NoteValue, fifthOctave);
    this.playNote(noteValue, octaveFromRoot);
  }

  playDiminishedChord(noteValue: NoteValue, octave: Omit<Octave, 1 | 7>) {
    let minorThirdValue = noteValue + 3;
    let minorThirdOctave = octave as number;
    let diminishedFifthValue = noteValue + 6;
    let diminishedFifthOctave = octave as number;

    if (minorThirdValue >= 12) {
      minorThirdValue = minorThirdValue - 12;
      minorThirdOctave = minorThirdOctave + 1;
    }

    if (diminishedFifthValue >= 12) {
      diminishedFifthValue = diminishedFifthValue - 12;
      diminishedFifthOctave = diminishedFifthOctave + 1;
    }

    this.playNote(noteValue, octave);
    this.playNote(minorThirdValue as NoteValue, minorThirdOctave);
    this.playNote(diminishedFifthValue as NoteValue, diminishedFifthOctave);
  }
}
