export const slugify = (input: string, options?: { delimiter?: string; maxLength?: number }): string => {
  if (!input) return "n-a";

  const { delimiter = "-", maxLength = 200 } = options || {};

  return (
    String(input)
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, delimiter)
      .replace(new RegExp(`${delimiter}+`, "g"), delimiter)
      .replace(new RegExp(`^${delimiter}|${delimiter}$`, "g"), "")
      .slice(0, maxLength) || "n-a"
  );
};

export function formatPrice(price: number, currency: string) {
  return `${price.toFixed(2)} ${currency}`;
}
