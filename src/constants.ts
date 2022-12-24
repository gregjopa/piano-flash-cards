export enum NoteName {
  Ab = "Ab",
  A = "A",
  "A#" = "A#",
  Bb = "Bb",
  B = "B",
  "B#" = "B#",
  Cb = "Cb",
  C = "C",
  "C#" = "C#",
  Db = "Db",
  D = "D",
  "D#" = "D#",
  Eb = "Eb",
  E = "E",
  "E#" = "E#",
  Fb = "Fb",
  F = "F",
  "F#" = "F#",
  Gb = "Gb",
  G = "G",
  "G#" = "G#",
}

export enum Clef {
  "Treble" = "treble",
  "Bass" = "bass",
}

export enum KeySignature {
  "C" = "C",
  "F" = "F",
  "Bb" = "Bb",
  "Eb" = "Eb",
  "Ab" = "Ab",
  "Db" = "Db",
  "Gb" = "Gb",
  "Cb" = "Cb",
  "G" = "G",
  "D" = "D",
  "A" = "A",
  "E" = "E",
  "B" = "B",
  "F#" = "F#",
  "C#" = "C#",
  "Am" = "Am",
  "Dm" = "Dm",
  "Gm" = "Gm",
  "Cm" = "Cm",
  "Fm" = "Fm",
  "Bbm" = "Bbm",
  "Ebm" = "Ebm",
  "Abm" = "Abm",
  "Em" = "Em",
  "Bm" = "Bm",
  "F#m" = "F#m",
  "C#m" = "C#m",
  "G#m" = "G#m",
  "D#m" = "D#m",
  "A#m" = "A#m",
}

// 7 octaves for full sized piano with 88 keys
export enum Octave {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
  Seven = 7,
}

export enum GameState {
  WaitingForGuess = "WaitingForGuess",
  CorrectGuess = "CorrectGuess",
  IncorrectGuess = "IncorrectGuess",
  Finished = "Finished",
}

export enum DifficultyLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
}
