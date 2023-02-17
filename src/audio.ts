import { Music } from "vexflow";

import { NoteName, Octave } from "./constants";

class AudioPlayer {
  hasAudioSupport: boolean;
  audioContext: AudioContext;
  vexflowMusic: Music;
  samples?: {
    C2: AudioBuffer;
    C3: AudioBuffer;
    C4: AudioBuffer;
    C5: AudioBuffer;
    C6: AudioBuffer;
    C7: AudioBuffer;
  };

  constructor() {
    this.audioContext = this.getCrossBrowserAudioContext();
    this.vexflowMusic = new Music();

    const audioExtension = this.getSupportedAudioExtension();

    if (audioExtension === null) {
      this.hasAudioSupport = false;
      return;
    }

    this.hasAudioSupport = true;

    this.applyDecodeAudioDataPolyfill();

    const fileNames = ["C2v10", "C3v10", "C4v10", "C5v10", "C6v10", "C7v10"];

    Promise.all(
      fileNames.map((fileName) =>
        this.loadSample(
          `${process.env.PUBLIC_URL}/audio/${fileName}.${audioExtension}`
        )
      )
    ).then((audioBuffers) => {
      const [C2, C3, C4, C5, C6, C7] = audioBuffers;
      this.samples = { C2, C3, C4, C5, C6, C7 };
    });
  }

  getCrossBrowserAudioContext(): AudioContext {
    const AudioContextCrossBrowser =
      window.AudioContext ||
      ((window as any).webkitAudioContext as AudioContext);

    return new AudioContextCrossBrowser();
  }

  getSupportedAudioExtension(): "mp3" | "ogg" | null {
    const audioElement = document.createElement("audio");

    if (audioElement.canPlayType("audio/mpeg")) {
      return "mp3";
    }

    if (audioElement.canPlayType("audio/ogg")) {
      return "ogg";
    }

    return null;
  }

  applyDecodeAudioDataPolyfill() {
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

  loadSample(url: string): Promise<AudioBuffer> {
    return fetch(url)
      .then((response) => response.arrayBuffer())
      .then((buffer) => this.audioContext.decodeAudioData(buffer));
  }

  playNote(noteName: NoteName, octave: Omit<Octave, 1 | 7>) {
    if (!this.hasAudioSupport || !this.samples) {
      return;
    }

    const source = this.audioContext.createBufferSource();

    // noteValue in semitones where C is zero
    let noteValue = this.vexflowMusic.getNoteValue(noteName.toLowerCase());
    let sampleName = `C${octave}`;

    if (noteValue > 6) {
      sampleName = `C${(octave as number) + 1}`;
      noteValue = noteValue - 12;
    }

    type SampleName = keyof typeof this.samples;
    source.buffer = this.samples[sampleName as SampleName];

    source.playbackRate.value = 2 ** (noteValue / 12);
    source.connect(this.audioContext.destination);

    this.audioContext.resume().then(() => {
      source.start(0);
    });
  }
}

const audioPlayer = new AudioPlayer();

export const playNote = audioPlayer.playNote.bind(audioPlayer);
