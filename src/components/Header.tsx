import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="lg:py-10 sm:py-8 pt-4 pb-6 text-center">
      <h1 className="text-slate-900 font-extrabold text-2xl sm:text-4xl lg:text-5xl tracking-tight">
        Piano Flash Cards
      </h1>
      <p className="mt-6 text-lg hidden sm:block">
        Practice memorizing notes with these treble and bass clef{" "}
        <span className="whitespace-nowrap">flash cards</span>.
      </p>
    </header>
  );
};
