import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { parse } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export function parseDateTime(value: string): Date {
  let date = new Date(value);
  if (isNaN(date.getTime())) {
    const formats = ["M/d/yyyy h:mm a", "yyyy-MM-dd h:mm a"];
    for (const fmt of formats) {
      date = parse(value, fmt, new Date());
      if (!isNaN(date.getTime())) {
        break;
      }
    }
  }
  return date;
}
