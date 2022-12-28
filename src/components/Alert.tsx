import React from "react";

export enum AlertType {
  Success = "Success",
  Danger = "Danger",
}

type AlertProps = {
  type: AlertType;
  title: string;
  children?: React.ReactNode;
};

function SuccessIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 mr-2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function DangerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6 mr-2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
      />
    </svg>
  );
}

export const Alert: React.FC<AlertProps> = ({ type, title, children }) => {
  const Icon = type === AlertType.Danger ? DangerIcon : SuccessIcon;

  return (
    <div
      role="alert"
      className={`${
        type === AlertType.Danger
          ? "bg-red-100 text-red-700"
          : "bg-green-100 text-green-700"
      } px-4 py-2 my-4`}
    >
      <div className="flex items-center">
        <Icon />
        <div className="font-bold">{title}</div>
      </div>
      <div className={`${children ? "mt-4" : ""}`}>{children}</div>
    </div>
  );
};
