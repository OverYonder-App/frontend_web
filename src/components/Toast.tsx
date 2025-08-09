// components/Toast.tsx
import { useEffect } from "react";

export function Toast({
  message,
  type = "success",
  onClose,
}: {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-5 right-5 z-50 px-4 py-2 rounded shadow-lg text-white text-sm ${
        type === "success" ? "bg-primary" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
}
