import React from "react";

import { Alert, AlertType } from "./Alert";
import { Button } from "./Button";
type FallbackProps = {
  error: Error;
  resetErrorBoundary: (...args: Array<unknown>) => void;
};

export const ErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <>
      <Alert type={AlertType.Danger} title="Something went wrong">
        {error.message}
      </Alert>
      <Button onClick={resetErrorBoundary} autoFocus={true}>
        Try Again
      </Button>
    </>
  );
};
