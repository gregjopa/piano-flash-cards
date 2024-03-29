import { ErrorBoundary } from "react-error-boundary";
import React, { useState } from "react";

import { NoteName, GameState, DifficultyLevel } from "./constants";
import { AudioPlayer } from "./audio";
import {
  getBeginnerNotes,
  getIntermediateNotes,
  getAdvancedNotes,
  pickRandomItemFromArray,
  defaultNote,
  Note,
  NoteValue,
  Octave,
} from "./notes";

import { Header } from "./components/Header";
import { NoteSelector } from "./components/NoteSelector";
import { StaveNote } from "./components/StaveNote";
import { ResultsPage } from "./components/ResultsPage";
import { ErrorFallback } from "./components/ErrorFallback";
import { Footer } from "./components/Footer";

const { playNote, playPowerChord, playDiminishedChord, resumeAudioContext } =
  new AudioPlayer();

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

  function advanceToNextLevel() {
    let nextLevel;

    switch (difficultyLevel) {
      case DifficultyLevel.Beginner:
        nextLevel = DifficultyLevel.Intermediate;
        break;
      case DifficultyLevel.Intermediate:
        nextLevel = DifficultyLevel.Advanced;
        break;
      case DifficultyLevel.Advanced:
        setGameState(GameState.Finished);
        resetStateForDifficultyLevel();

        gtag("event", "level_end", {
          level_name: DifficultyLevel.Advanced,
          success: true,
        });

        gtag("event", "post_score", {
          score: countOfCorrectGuesses,
        });
        break;
    }

    if (nextLevel) {
      gtag("event", "level_end", {
        level_name: difficultyLevel,
        success: true,
      });
      gtag("event", "level_start", {
        level_name: nextLevel,
      });

      setDifficultyLevel(nextLevel);
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
      playPowerChord(actualNote.noteValue, actualNote.octave);

      gtag("event", "select_content", {
        content_type: GameState.CorrectGuess,
        item_id: userGuess,
      });

      if (remainingNotes[difficultyLevel].length === 0) {
        advanceToNextLevel();
      }
    } else {
      setGameState(GameState.IncorrectGuess);
      resetStateForDifficultyLevel();
      playDiminishedChord(actualNote.noteValue, actualNote.octave);

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
    const nextNote = getNextRandomNote();
    setActualNote(nextNote);
    playNote(nextNote.noteValue, nextNote.octave);
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

  function handleStaveNoteClick() {
    playNote(actualNote.noteValue, actualNote.octave);
  }

  function handleKeyboardClick({
    noteValue,
    octave,
  }: {
    noteValue: NoteValue;
    octave: Octave;
  }) {
    playNote(noteValue, octave);
  }

  const waitingForGuess =
    gameState === GameState.WaitingForGuess ||
    gameState === GameState.NotStarted;

  return (
    <>
      <div
        className="mx-auto h-[900px] max-w-2xl bg-slate-50 px-8 pb-8 text-lg text-slate-600 md:border-x md:border-b md:border-solid md:border-gray-500"
        onClick={resumeAudioContext}
      >
        <Header />
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onError={handleOnError}
          onReset={handleStartOver}
        >
          <NoteSelector
            selectedNote={guessedNoteName}
            onNoteNameChange={handleGuess}
            isDisabled={!waitingForGuess}
            shouldFocus={waitingForGuess}
          />
          <StaveNote
            note={actualNote}
            onClick={handleStaveNoteClick}
            shouldDisplayNoteName={!waitingForGuess}
          />
          <div>Score: {countOfCorrectGuesses}</div>

          <ResultsPage
            gameState={gameState}
            actualNote={actualNote}
            onNextNote={handleNextNote}
            onStartOver={handleStartOver}
            onKeyboardClick={handleKeyboardClick}
          />
        </ErrorBoundary>
      </div>
      <Footer />
    </>
  );
}

export default App;
