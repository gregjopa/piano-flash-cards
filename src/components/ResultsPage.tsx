import React from "react";

import { GameState } from "../constants";
import type { Note } from "../notes";

type ResultsPageProps = {
  gameState: GameState;
  actualNote: Note;
  onNextNote: () => void;
  onStartOver: () => void;
};

export const ResultsPage: React.FC<ResultsPageProps> = ({
  gameState,
  actualNote,
  onNextNote,
  onStartOver,
}) => {
  function DisplayActualNote() {
    const { noteName, octave, keySignature } = actualNote;
    return (
      <>
        <div>Note Name: {noteName}</div>
        <div>Octave: {octave}</div>
        <div>Key Signature: {keySignature}</div>
      </>
    );
  }

  switch (gameState) {
    case GameState.Finished:
      return (
        <>
          <div>Congrats! You completed the game</div>
          <DisplayActualNote />
          <button onClick={onStartOver}>Start Over</button>
        </>
      );
    case GameState.CorrectGuess:
      return (
        <>
          <div>Correct Guess!</div>
          <DisplayActualNote />
          <button onClick={onNextNote}>Next Note</button>
        </>
      );
    case GameState.IncorrectGuess:
      return (
        <>
          <div>Incorrect Guess</div>
          <DisplayActualNote />
          <button onClick={onStartOver}>Start Over</button>
        </>
      );
    default:
      return null;
  }
};
