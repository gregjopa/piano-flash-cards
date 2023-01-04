import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="pt-4 pb-6 text-center sm:py-8 lg:py-10">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
        Piano Flash Cards
      </h1>
      <p className="mt-6 hidden text-lg sm:block">
        Practice memorizing notes with these treble and bass clef{" "}
        <span className="whitespace-nowrap">flash cards</span>.
      </p>
    </header>
  );
};
