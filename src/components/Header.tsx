import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="lg:py-16 py-8 text-center">
      <h1 className="text-slate-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight">
        Piano Flash Cards
      </h1>
      <p className="mt-6 text-lg text-slate-600 hidden sm:block">
        Practice memorizing notes with these treble and bass clef{" "}
        <span className="whitespace-nowrap">flash cards</span>.
      </p>
    </header>
  );
};
