import React, { Dispatch } from "react";

import { NoteName } from "../constants";

type NoteSelectorProps = {
  onNoteNameChange: Dispatch<NoteName>;
  isDisabled?: boolean;
  selectedNote?: NoteName | "";
};

export const NoteSelector: React.FC<NoteSelectorProps> = ({
  onNoteNameChange,
  selectedNote,
  isDisabled,
}) => {
  const noteNameOptions = Object.entries(NoteName).map(([key, value]) => {
    return (
      <option key={key} value={value}>
        {key}
      </option>
    );
  });

  const defaultOption = <option key={-1} value="" disabled></option>;

  function handleNoteNameChange(event: React.ChangeEvent<HTMLSelectElement>) {
    onNoteNameChange(event.currentTarget.value as NoteName);
  }

  return (
    <>
      <label htmlFor="notes">Guess the note: </label>
      <select
        id="notes"
        className="select"
        value={selectedNote}
        onChange={handleNoteNameChange}
        disabled={isDisabled}
      >
        {[defaultOption, ...noteNameOptions]}
      </select>
    </>
  );
};
