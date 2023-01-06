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

import { Header } from "./components/Header";
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
      gtag("event", "level_end", { level_name: DifficultyLevel.Beginner, success: true });
      gtag("event", "level_start", { level_name: DifficultyLevel.Intermediate });

      return setDifficultyLevel(DifficultyLevel.Intermediate);
    }

    if (gameState === GameState.GetNextNote) {
      setGuessedNoteName("");
      let newNote;
      try {
        newNote = getNextRandomNote();
      } catch (err) {
        gtag("event", "level_end", { level_name: DifficultyLevel.Intermediate, success: true });
        return setGameState(GameState.Finished);
      }
      setActualNote(newNote);
      setGameState(GameState.WaitingForGuess);
    }

    if (gameState === GameState.Finished) {
      gtag("event", "post_score", {
        score: countOfCorrectGuesses,
      });
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

    gtag("event", "select_content", {
      content_type:
        userGuess === actualNote.noteName
          ? GameState.CorrectGuess
          : GameState.IncorrectGuess,
      item_id: userGuess,
    });
  }

  function handleOnError(error: Error) {
    setGameState(GameState.Error);
    gtag("event", "exception", {
      description: error.message,
      fatal: true,
    });
  }

  return (
    <div className="mx-auto h-[900px] max-w-2xl bg-slate-50 px-8 pb-8 text-lg text-slate-600 md:border-x md:border-b md:border-solid md:border-gray-500">
      <Header />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={handleOnError}
        onReset={startOver}
      >
        <NoteSelector
          selectedNote={guessedNoteName}
          onNoteNameChange={handleGuess}
          isDisabled={Boolean(guessedNoteName)}
          shouldFocus={
            gameState === GameState.WaitingForGuess ||
            gameState === GameState.NotStarted
          }
        />
        <StaveNote note={actualNote} />
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
