import React from "react";

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  autoFocus?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  autoFocus = false,
}) => {
  return (
    <button
      className="w-full bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-4 text-white font-bold py-2 px-4"
      onClick={onClick}
      autoFocus={autoFocus}
    >
      {children}
    </button>
  );
};
