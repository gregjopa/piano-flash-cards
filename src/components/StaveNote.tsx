import React, { useCallback } from "react";
import Vex from "vexflow";

import type { Note } from "../notes";

type StaveNoteProps = {
  note: Note;
  width: number;
  height: number;
};

export const StaveNote: React.FC<StaveNoteProps> = ({
  note,
  width,
  height,
}) => {
  const vexflowRef = useCallback(
    (node: HTMLDivElement) => {
      if (node !== null) {
        draw(node, { note, width, height });
      }
    },
    [note, width, height]
  );

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <div
        style={{ backgroundColor: "whitesmoke", display: "inline-block" }}
        ref={vexflowRef}
      />
    </div>
  );
};

function draw(
  container: HTMLDivElement,
  { note, width, height }: StaveNoteProps
) {
  const VF = Vex.Flow;
  container.innerHTML = "";
  const renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG);

  renderer.resize(width, height);
  renderer.getContext().scale(2, 2);
  const context = renderer.getContext();

  const scaledWidth = width / 2;
  const stave = new VF.Stave(10, 10, scaledWidth - 20);

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
