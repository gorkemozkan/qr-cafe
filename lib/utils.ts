import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseNumericId(id: string): number {
  const numericId = parseInt(id, 10);

  if (Number.isNaN(numericId) || numericId <= 0) {
    throw new Error(`Invalid ID`);
  }

  return numericId;
}
