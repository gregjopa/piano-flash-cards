import React, { useCallback } from "react";
import Vex from "vexflow";

import type { Note } from "../notes";

type StaveNoteProps = {
  note: Note;
  onClick: () => void;
};

export const StaveNote: React.FC<StaveNoteProps> = ({ note, onClick }) => {
  const vexflowRef = useCallback(
    (node: HTMLDivElement) => {
      if (node !== null) {
        const nodeWidth = node.getBoundingClientRect().width;
        const width = nodeWidth > 300 ? nodeWidth : 300;
        draw(node, { note, width, height: 250 });
      }
    },
    [note]
  );

  return (
    <div className="w-full overflow-x-auto" onClick={onClick}>
      <div ref={vexflowRef} />
    </div>
  );
};

function draw(
  container: HTMLDivElement,
  { note, width, height }: { note: Note; width: number; height: number }
) {
  const { Renderer, Stave, StaveNote, Voice, Accidental, Formatter } = Vex.Flow;
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

  const notes = [
    new StaveNote({
      clef,
      keys: [`${noteName}/${octave}`],
      duration: "4",
      auto_stem: true,
      align_center: true,
    }),
  ];

  const voice = new Voice({ num_beats: 1, beat_value: 4 })
    .setStrict(false)
    .addTickables(notes);

  Accidental.applyAccidentals([voice], keySignature);

  new Formatter().joinVoices([voice]).format([voice], scaledWidth / 2);

  voice.draw(context, stave);
}
