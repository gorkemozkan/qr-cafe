import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseNumericId(id: string, resourceName = "ID"): number {
  const numericId = parseInt(id, 10);

  if (Number.isNaN(numericId) || numericId <= 0) {
    throw new Error(`Invalid ${resourceName}`);
  }

  return numericId;
}

export const formatPrice = (price: number | null, currency: string | null): string => {
  if (!price) return "";

  const currencySymbols = {
    TRY: "₺",
    USD: "$",
    EUR: "€",
  };

  const symbol = currency && currency in currencySymbols ? currencySymbols[currency as keyof typeof currencySymbols] : "";

  return `${symbol}${price.toFixed(2)}`;
};

export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";
