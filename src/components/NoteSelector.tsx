import React, { useRef, useEffect, Dispatch } from "react";

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
  const selectElement = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (selectElement.current === null) {
      return;
    }
    if (shouldFocus) {
      selectElement.current.focus();
    } else {
      selectElement.current.blur();
    }
  }, [shouldFocus]);

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
      <label htmlFor="notes" className="block mb-2">
        What note is it?
      </label>
      <select
        id="notes"
        className="form-select min-w-full mb-2 disabled:opacity-50"
        value={selectedNote}
        onChange={handleNoteNameChange}
        disabled={isDisabled}
        ref={selectElement}
      >
        {[defaultOption, ...noteNameOptions]}
      </select>
    </>
  );
};
