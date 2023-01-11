import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="my-2 text-center">
      Built with{" "}
      <a
        href="https://reactjs.org/"
        className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
      >
        React
      </a>{" "}
      and{" "}
      <a
        href="https://vexflow.com/"
        className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
      >
        Vexflow
      </a>
      .<br></br> Check out the{" "}
      <a
        className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
        href="https://github.com/gregjopa/piano-flash-cards"
      >
        source code on GitHub
      </a>
      .
    </footer>
  );
};
