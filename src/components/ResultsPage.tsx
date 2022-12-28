import React from "react";

import { Alert, AlertType } from "./Alert";
import { Button } from "./Button";
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
      <table className="border-collapse table-auto w-full my-8 text-center">
        <thead>
          <tr>
            <th className="border-b border-gray-300 font-medium p-4 pl-8 pt-0 pb-3">
              Note Name
            </th>
            <th className="border-b border-gray-300 font-medium p-4 pl-8 pt-0 pb-3">
              Octave
            </th>
            <th className="border-b border-gray-300 font-medium p-4 pl-8 pt-0 pb-3">
              Key Signature
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8">
              {noteName}
            </td>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8">
              {octave}
            </td>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8">
              {keySignature}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  switch (gameState) {
    case GameState.Finished:
      return (
        <>
          <Alert
            type={AlertType.Success}
            text="Congrats! You completed the game"
          />
          <DisplayActualNote />
          <Button onClick={onStartOver} text="Start Over" />
        </>
      );
    case GameState.CorrectGuess:
      return (
        <>
          <Alert type={AlertType.Success} text="Correct Guess!" />
          <DisplayActualNote />
          <Button onClick={onNextNote} text="Next Note" />
        </>
      );
    case GameState.IncorrectGuess:
      return (
        <>
          <Alert type={AlertType.Danger} text="Incorrect Guess" />
          <DisplayActualNote />
          <Button onClick={onStartOver} text="Start Over" />
        </>
      );
    default:
      return null;
  }
};
