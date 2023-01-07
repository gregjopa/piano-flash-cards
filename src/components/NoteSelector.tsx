import React, { Dispatch } from "react";

import { NoteName } from "../constants";

type NoteSelectorProps = {
  onNoteNameChange: Dispatch<NoteName>;
  shouldFocus: boolean;
  isDisabled?: boolean;
  selectedNote?: NoteName | "";
};

export const NoteSelector: React.FC<NoteSelectorProps> = ({
  onNoteNameChange,
  shouldFocus,
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
      <label htmlFor="notes" className="mb-2 block">
        What note is it?
      </label>
      <select
        id="notes"
        className={`form-select mb-1 min-w-full focus:border-blue-300 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 ${
          shouldFocus ? "border-blue-300 ring-4 ring-blue-300" : ""
        }`}
        value={selectedNote}
        onChange={handleNoteNameChange}
        disabled={isDisabled}
        autoFocus={shouldFocus}
      >
        {[defaultOption, ...noteNameOptions]}
      </select>
    </>
  );
};
