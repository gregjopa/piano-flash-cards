import React, { useCallback } from "react";
import Vex from "vexflow";

import type { Note } from "../notes";

type StaveNoteProps = {
  note: Note;
  onClick: () => void;
  shouldDisplayNoteName: boolean;
};

export const StaveNote: React.FC<StaveNoteProps> = ({
  note,
  onClick,
  shouldDisplayNoteName,
}) => {
  const vexflowRef = useCallback(
    (node: HTMLDivElement) => {
      if (node !== null) {
        const nodeWidth = node.getBoundingClientRect().width;
        const width = nodeWidth > 300 ? nodeWidth : 300;
        draw({
          container: node,
          note,
          width,
          height: 250,
          shouldDisplayNoteName,
        });
      }
    },
    [note, shouldDisplayNoteName]
  );

  return (
    <div className="w-full overflow-x-auto" onClick={onClick}>
      <div ref={vexflowRef} />
    </div>
  );
};

type DrawParams = {
  container: HTMLDivElement;
  note: Note;
  width: number;
  height: number;
  shouldDisplayNoteName: boolean;
};

function draw({
  container,
  note,
  width,
  height,
  shouldDisplayNoteName,
}: DrawParams) {
  const { Renderer, Stave, StaveNote, TextNote, Voice, Accidental, Formatter } =
    Vex.Flow;
  container.innerHTML = "";
  const renderer = new Renderer(container, Renderer.Backends.SVG);

  renderer.resize(width, height);
  renderer.getContext().scale(2, 2);
  const context = renderer.getContext();

  const scaledWidth = width / 2;
  const stave = new Stave(0, 0, scaledWidth - 1);

  const { clef, octave, keySignature, noteName } = note;

  stave.addClef(clef);
  stave.addKeySignature(keySignature);
  stave.setContext(context).draw();

  const staveNote = new StaveNote({
    clef,
    keys: [`${noteName}/${octave}`],
    duration: "4",
    auto_stem: true,
    align_center: true,
  });

  const textNote = new TextNote({
    text: noteName + octave,
    duration: "4",
    align_center: true,
  })
    .setContext(context)
    .setJustification(TextNote.Justification.CENTER)
    .setLine(11)
    .setFont(
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      10,
      400
    );

  const staveNoteVoice = new Voice({ num_beats: 1, beat_value: 4 })
    .setStrict(false)
    .addTickables([staveNote]);

  const textNoteVoice = new Voice({ num_beats: 1, beat_value: 4 })
    .setStrict(false)
    .addTickables([textNote]);

  Accidental.applyAccidentals([staveNoteVoice], keySignature);

  new Formatter()
    .joinVoices([staveNoteVoice, textNoteVoice])
    .format([staveNoteVoice, textNoteVoice], scaledWidth / 2);

  staveNoteVoice.draw(context, stave);
  if (shouldDisplayNoteName) {
    textNoteVoice.draw(context, stave);
  }
}
