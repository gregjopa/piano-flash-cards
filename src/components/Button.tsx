import React from "react";

type ButtonProps = {
  text: string;
  onClick: () => void;
};

export const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <button
      className="w-full bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4"
      onClick={onClick}
    >
      {text}
    </button>
  );
};
