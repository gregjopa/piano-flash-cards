import React from "react";

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button
      className="w-full bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
