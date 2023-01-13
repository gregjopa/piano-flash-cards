import { ErrorBoundary } from "react-error-boundary";
import React, { useState } from "react";

import { NoteName, GameState, DifficultyLevel } from "./constants";
import {
  getBeginnerNotes,
  getIntermediateNotes,
  getAdvancedNotes,
  pickRandomItemFromArray,
  defaultNote,
  Note,
} from "./notes";

import { Header } from "./components/Header";
import { NoteSelector } from "./components/NoteSelector";
import { StaveNote } from "./components/StaveNote";
import { ResultsPage } from "./components/ResultsPage";
import { ErrorFallback } from "./components/ErrorFallback";
import { Footer } from "./components/Footer";

import "./App.css";

function App() {
  const [actualNote, setActualNote] = useState<Note>(defaultNote);
  const [guessedNoteName, setGuessedNoteName] = useState<NoteName | "">("");
  const [countOfCorrectGuesses, setCountOfCorrectGuesses] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState(
    DifficultyLevel.Beginner
  );

  const [gameState, setGameState] = useState<GameState>(GameState.NotStarted);

  const [remainingNotes, setRemainingNotes] = useState({
    [DifficultyLevel.Beginner]: getBeginnerNotes(),
    [DifficultyLevel.Intermediate]: getIntermediateNotes(),
    [DifficultyLevel.Advanced]: getAdvancedNotes(),
  });

  function checkForRemainingNotes() {
    // check to see if its time to advance to the next difficulty level
    if (
      difficultyLevel === DifficultyLevel.Beginner &&
      remainingNotes[DifficultyLevel.Beginner].length === 0
    ) {
      setDifficultyLevel(DifficultyLevel.Intermediate);

      gtag("event", "level_end", {
        level_name: DifficultyLevel.Beginner,
        success: true,
      });
      gtag("event", "level_start", {
        level_name: DifficultyLevel.Intermediate,
      });
    } else if (
      difficultyLevel === DifficultyLevel.Intermediate &&
      remainingNotes[DifficultyLevel.Intermediate].length === 0
    ) {
      setDifficultyLevel(DifficultyLevel.Advanced);

      gtag("event", "level_end", {
        level_name: DifficultyLevel.Intermediate,
        success: true,
      });
      gtag("event", "level_start", {
        level_name: DifficultyLevel.Advanced,
      });
    }
  }

  function resetStateForDifficultyLevel() {
    setRemainingNotes({
      [DifficultyLevel.Beginner]: getBeginnerNotes(),
      [DifficultyLevel.Intermediate]: getIntermediateNotes(),
      [DifficultyLevel.Advanced]: getAdvancedNotes(),
    });

    setDifficultyLevel(DifficultyLevel.Beginner);
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
      resetStateForDifficultyLevel();

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
      setGameState(GameState.Finished);
      resetStateForDifficultyLevel();

      gtag("event", "level_end", {
        level_name: DifficultyLevel.Advanced,
        success: true,
      });

      gtag("event", "post_score", {
        score: countOfCorrectGuesses,
      });

      return;
    }
    setActualNote(newNote);
    setGameState(GameState.WaitingForGuess);
  }

  function getNextRandomNote(): Note {
    const currentRemainingNotes = remainingNotes[difficultyLevel];

    if (currentRemainingNotes.length === 0) {
      throw new Error("No notes left!");
    }

    const { value, index } = pickRandomItemFromArray(currentRemainingNotes);
    setRemainingNotes({
      ...remainingNotes,
      [difficultyLevel]: [
        ...currentRemainingNotes.slice(0, index),
        ...currentRemainingNotes.slice(index + 1, currentRemainingNotes.length),
      ],
    });
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
    <>
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
      <Footer />
    </>
  );
}

export default App;
