import { ErrorBoundary } from "react-error-boundary";
import React, { useState } from "react";

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

  function checkForRemainingNotes() {
    // check to see if its time to advance to the next difficulty level
    if (
      difficultyLevel === DifficultyLevel.Beginner &&
      remainingBeginnerNotes.length === 0
    ) {
      setDifficultyLevel(DifficultyLevel.Intermediate);

      gtag("event", "level_end", {
        level_name: DifficultyLevel.Beginner,
        success: true,
      });
      gtag("event", "level_start", {
        level_name: DifficultyLevel.Intermediate,
      });
    }
  }

  function handleGuess(userGuess: NoteName) {
    setGuessedNoteName(userGuess);

    if (userGuess === actualNote.noteName) {
      setCountOfCorrectGuesses(countOfCorrectGuesses + 1);
      setGameState(GameState.CorrectGuess);
      checkForRemainingNotes();

      gtag("event", "select_content", {
        content_type: GameState.CorrectGuess,
        item_id: userGuess,
      });
    } else {
      setGameState(GameState.IncorrectGuess);

      setRemainingBeginnerNotes(getBeginnerNotes());
      setRemainingIntermediateNotes(getIntermediateNotes());
      setDifficultyLevel(DifficultyLevel.Beginner);

      gtag("event", "select_content", {
        content_type: GameState.IncorrectGuess,
        item_id: userGuess,
      });

      gtag("event", "post_score", {
        score: countOfCorrectGuesses,
      });
    }
  }

  function handleNextNote() {
    setGuessedNoteName("");
    let newNote;
    try {
      newNote = getNextRandomNote();
    } catch (err) {
      gtag("event", "level_end", {
        level_name: DifficultyLevel.Intermediate,
        success: true,
      });

      gtag("event", "post_score", {
        score: countOfCorrectGuesses,
      });

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

  function handleOnError(error: Error) {
    setGameState(GameState.Error);
    gtag("event", "exception", {
      description: error.message,
      fatal: true,
    });
  }

  function handleStartOver() {
    setCountOfCorrectGuesses(0);
    handleNextNote();
  }

  return (
    <div className="mx-auto h-[900px] max-w-2xl bg-slate-50 px-8 pb-8 text-lg text-slate-600 md:border-x md:border-b md:border-solid md:border-gray-500">
      <Header />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={handleOnError}
        onReset={handleStartOver}
      >
        <NoteSelector
          selectedNote={guessedNoteName}
          onNoteNameChange={handleGuess}
          isDisabled={
            gameState !== GameState.WaitingForGuess &&
            gameState !== GameState.NotStarted
          }
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
          onNextNote={handleNextNote}
          onStartOver={handleStartOver}
        />
      </ErrorBoundary>
    </div>
  );
}

export default App;
