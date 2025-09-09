import { clsx, type ClassValue } from "clsx";
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

export const shareWhatsApp = (text: string) => {
  const message = `Check out this cafe menu: ${text}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
};

type SlugifyOptions = {
  delimiter?: string;
  lower?: boolean;
  strict?: boolean; // keep only [a-z0-9] plus delimiter (after normalization)
  trim?: boolean;
  locale?: string; // e.g. "tr", "en-US"
  preserve?: string[]; // extra allowed characters (e.g. ["_"])
  maxLength?: number; // 0 = unlimited
};

export function slugify(input: string, opts: SlugifyOptions = {}): string {
  const { delimiter = "-", lower = true, strict = true, trim = true, locale, preserve = [], maxLength = 0 } = opts;

  const escapeRegExp = (s: string) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

  let s = String(input ?? "");

  // 1) Lowercase
  s = lower ? (locale ? s.toLocaleLowerCase(locale) : s.toLowerCase()) : s;

  // 2) Normalize & strip diacritics
  s = s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");

  // 3) Common multi-char replacements
  const map: Record<string, string> = {
    ß: "ss",
    æ: "ae",
    œ: "oe",
    "&": " and ",
    "@": " at ",
    ı: "i", // Turkish special-case
  };
  s = s.replace(/ß|æ|œ|&|@|ı/g, (ch) => map[ch]);

  // 4) Collapse any non-alphanumeric into a delimiter
  s = s.replace(/[^a-z0-9]+/gi, delimiter);

  // 5) Remove duplicate delimiters
  s = s.replace(new RegExp(`${escapeRegExp(delimiter)}{2,}`, "g"), delimiter);

  // 6) Trim edge delimiters
  if (trim) {
    s = s.replace(new RegExp(`^${escapeRegExp(delimiter)}|${escapeRegExp(delimiter)}$`, "g"), "");
  }

  // 7) Strict mode filtering
  if (strict) {
    const allowed = escapeRegExp(delimiter) + (preserve.length ? escapeRegExp(preserve.join("")) : "");
    s = s.replace(new RegExp(`[^a-z0-9${allowed}]`, "g"), "");
  }

  // 8) Optional max length
  if (maxLength > 0 && s.length > maxLength) {
    s = s.slice(0, maxLength);
    s = s.replace(new RegExp(`${escapeRegExp(delimiter)}$`), "");
  }

  return s || (lower ? "n-a" : "N-A");
}

export function formatPrice(price: number, currency: string) {
  return `${price.toFixed(2)} ${currency}`;
}

export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_ENV === "production") {
    return process.env.NEXT_PUBLIC_BASE_URL_PROD;
  }

  if (process.env.NEXT_PUBLIC_ENV === "staging") {
    return process.env.NEXT_PUBLIC_BASE_URL_STAGING;
  }

  return process.env.NEXT_PUBLIC_BASE_URL;
};
