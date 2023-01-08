import React from "react";

import { Alert, AlertType } from "./Alert";
import { Button } from "./Button";
import { PianoKeyboard } from "./PianoKeyboard";
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
    const keySignatureWithLabel = keySignature.includes("m")
      ? `${keySignature.replace("m", "")} Minor`
      : `${keySignature} Major`;

    return (
      <table className="mt-4 mb-2 w-full table-auto border-collapse text-center">
        <thead>
          <tr>
            <th className="border-b border-gray-300 p-4 pl-8 pt-0 pb-2 font-medium">
              Note
            </th>
            <th className="border-b border-gray-300 p-4 pl-8 pt-0 pb-2 font-medium">
              Octave
            </th>
            <th className="border-b border-gray-300 p-4 pl-8 pt-0 pb-2 font-medium">
              Key
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 pl-8 pr-4 text-slate-900">{noteName}</td>
            <td className="py-2 pl-8 pr-4 text-slate-900">{octave}</td>
            <td className="py-2 pl-8 pr-4 text-slate-900">
              {keySignatureWithLabel}
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
            title="Congrats! You completed the game"
          />
          <Button onClick={onStartOver} autoFocus={true}>
            Play Again
          </Button>
        </>
      );
    case GameState.CorrectGuess:
      return (
        <>
          <Alert type={AlertType.Success} title="Correct!" />
          <Button onClick={onNextNote} autoFocus={true}>
            Next Note
          </Button>
          <DisplayActualNote />
          <PianoKeyboard activeNote={actualNote} />
        </>
      );
    case GameState.IncorrectGuess:
      return (
        <>
          <Alert type={AlertType.Danger} title="Incorrect" />
          <Button onClick={onStartOver} autoFocus={true}>
            Start Over
          </Button>
          <DisplayActualNote />
          <PianoKeyboard activeNote={actualNote} />
        </>
      );
    default:
      return null;
  }
};
