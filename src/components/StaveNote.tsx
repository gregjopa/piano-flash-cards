import React, { useCallback } from "react";
import Vex from "vexflow";

import type { Note } from "../notes";

type StaveNoteProps = {
  note: Note;
};

export const StaveNote: React.FC<StaveNoteProps> = ({ note }) => {
  const vexflowRef = useCallback(
    (node: HTMLDivElement) => {
      if (node !== null) {
        const nodeWidth = node.getBoundingClientRect().width;
        const width = nodeWidth > 300 ? nodeWidth : 300;
        draw(node, { note, width, height: 300 });
      }
    },
    [note]
  );

  return (
    <div className="w-full overflow-x-auto">
      <div ref={vexflowRef} />
    </div>
  );
};

function draw(
  container: HTMLDivElement,
  { note, width, height }: { note: Note; width: number; height: number }
) {
  const VF = Vex.Flow;
  container.innerHTML = "";
  const renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG);

  renderer.resize(width, height);
  renderer.getContext().scale(2, 2);
  const context = renderer.getContext();

  const scaledWidth = width / 2;
  const stave = new VF.Stave(0, 10, scaledWidth - 1);

  const { clef, octave, keySignature, noteName } = note;

  stave.addClef(clef);
  stave.addKeySignature(keySignature);
  stave.setContext(context).draw();

  const notes = [
    new VF.StaveNote({
      clef,
      keys: [`${noteName}/${octave}`],
      duration: "4",
      auto_stem: true,
      align_center: true,
    }),
  ];

  const voice = new VF.Voice({ num_beats: 1, beat_value: 4 })
    .setStrict(false)
    .addTickables(notes);

  VF.Accidental.applyAccidentals([voice], keySignature);

  new VF.Formatter().joinVoices([voice]).format([voice], scaledWidth / 2);

  voice.draw(context, stave);
}
