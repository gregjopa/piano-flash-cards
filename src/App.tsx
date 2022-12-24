import React, { useState } from "react";

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

import "./App.css";

function App() {
  const [actualNote, setActualNote] = useState<Note>(defaultNote);
  const [guessedNoteName, setGuessedNoteName] = useState<NoteName | "">("");
  const [countOfCorrectGuesses, setCountOfCorrectGuesses] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState(
    DifficultyLevel.Beginner
  );

  const [gameState, setGameState] = useState<GameState>(
    GameState.WaitingForGuess
  );
  const [remainingBeginnerNotes, setRemainingBeginnerNotes] = useState(
    getBeginnerNotes()
  );
  const [remainingIntermediateNotes, setRemainingIntermediateNotes] = useState(
    getIntermediateNotes()
  );

  function getNextRandomNote(): Note {
    let localDifficultyLevel = difficultyLevel;

    if (
      localDifficultyLevel === DifficultyLevel.Beginner &&
      remainingBeginnerNotes.length === 0
    ) {
      setDifficultyLevel(DifficultyLevel.Intermediate);
      localDifficultyLevel = DifficultyLevel.Intermediate;
    }

    const remainingNotes =
      localDifficultyLevel === DifficultyLevel.Beginner
        ? remainingBeginnerNotes
        : remainingIntermediateNotes;
    const setRemainingNotes =
      localDifficultyLevel === DifficultyLevel.Beginner
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

  function startOver() {
    setCountOfCorrectGuesses(0);
    setRemainingBeginnerNotes(getBeginnerNotes());
    setRemainingIntermediateNotes(getIntermediateNotes());
    setDifficultyLevel(DifficultyLevel.Beginner);
    getNextNote();
  }

  function getNextNote() {
    setGuessedNoteName("");
    setGameState(GameState.WaitingForGuess);
    let newNote;
    try {
      newNote = getNextRandomNote();
    } catch (err) {
      return setGameState(GameState.Finished);
    }
    setActualNote(newNote);
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
        onNextNote={getNextNote}
        onStartOver={startOver}
      />
    </div>
  );
}

export default App;
