import { ErrorBoundary } from "react-error-boundary";
import React, { useState, useEffect } from "react";

import { NoteName, GameState, DifficultyLevel } from "./constants";
import {
  getBeginnerNotes,
  getIntermediateNotes,
  pickRandomItemFromArray,
  defaultNote,
  Note,
} from "./notes";
import { NoteSelector } from "./components/NoteSelector";
import { StaveNote } from "./components/StaveNote";
import { ResultsPage } from "./components/ResultsPage";
import { ErrorFallback } from "./components/ErrorFallback";

import "./App.css";

function App() {
  const [actualNote, setActualNote] = useState<Note>(defaultNote);
  const [guessedNoteName, setGuessedNoteName] = useState<NoteName | "">("");
  const [countOfCorrectGuesses, setCountOfCorrectGuesses] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState(
    DifficultyLevel.Beginner
  );

  const [gameState, setGameState] = useState<GameState>(GameState.NotStarted);
  const [remainingBeginnerNotes, setRemainingBeginnerNotes] = useState(
    getBeginnerNotes()
  );
  const [remainingIntermediateNotes, setRemainingIntermediateNotes] = useState(
    getIntermediateNotes()
  );

  useEffect(() => {
    // check to see if its time to advance to the next difficulty level
    if (
      difficultyLevel === DifficultyLevel.Beginner &&
      remainingBeginnerNotes.length === 0
    ) {
      return setDifficultyLevel(DifficultyLevel.Intermediate);
    }

    if (gameState === GameState.GetNextNote) {
      setGuessedNoteName("");
      let newNote;
      try {
        newNote = getNextRandomNote();
      } catch (err) {
        return setGameState(GameState.Finished);
      }
      setActualNote(newNote);
      setGameState(GameState.WaitingForGuess);
    }

    function getNextRandomNote(): Note {
      const remainingNotes =
        difficultyLevel === DifficultyLevel.Beginner
          ? remainingBeginnerNotes
          : remainingIntermediateNotes;
      const setRemainingNotes =
        difficultyLevel === DifficultyLevel.Beginner
          ? setRemainingBeginnerNotes
          : setRemainingIntermediateNotes;

      if (remainingNotes.length === 0) {
        throw new Error("No notes left!");
      }

      const { value, index } = pickRandomItemFromArray(remainingNotes);
      setRemainingNotes([
        ...remainingNotes.slice(0, index),
        ...remainingNotes.slice(index + 1, remainingNotes.length),
      ]);
      return value;
    }
  }, [
    gameState,
    difficultyLevel,
    remainingBeginnerNotes,
    remainingIntermediateNotes,
  ]);

  function startOver() {
    setCountOfCorrectGuesses(0);
    setRemainingBeginnerNotes(getBeginnerNotes());
    setRemainingIntermediateNotes(getIntermediateNotes());
    setDifficultyLevel(DifficultyLevel.Beginner);
    setGameState(GameState.GetNextNote);
  }

  function handleGuess(userGuess: NoteName) {
    if (userGuess === actualNote.noteName) {
      setCountOfCorrectGuesses(countOfCorrectGuesses + 1);
      setGameState(GameState.CorrectGuess);
    } else {
      setGameState(GameState.IncorrectGuess);
    }
    setGuessedNoteName(userGuess);
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>Piano Flash Cards</h1>
      </header>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={() => setGameState(GameState.Error)}
        onReset={startOver}
      >
        <NoteSelector
          selectedNote={guessedNoteName}
          onNoteNameChange={handleGuess}
          isDisabled={Boolean(guessedNoteName)}
        />
        <StaveNote note={actualNote} width={400} height={300} />
        <div>Score: {countOfCorrectGuesses}</div>

        <ResultsPage
          gameState={gameState}
          actualNote={actualNote}
          onNextNote={() => setGameState(GameState.GetNextNote)}
          onStartOver={startOver}
        />
      </ErrorBoundary>
    </div>
  );
}

export default App;