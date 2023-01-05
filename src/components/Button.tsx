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
      className="w-full bg-blue-600 py-2 px-4 font-bold text-white hover:bg-blue-800 focus:border focus:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
      onClick={onClick}
      autoFocus={autoFocus}
    >
      {children}
    </button>
  );
};
