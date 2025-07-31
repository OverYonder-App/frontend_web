import { ReactNode } from "react";

interface UIErrorMessageProps {
  message: string | ReactNode;
  className?: string;
}

export function UIErrorMessage({
  message,
  className = "",
}: UIErrorMessageProps) {
  if (!message) return null;
  return (
    <div
      className={`text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-4 py-2 mb-4 ${className}`}
      role="alert"
    >
      {message}
    </div>
  );
}
