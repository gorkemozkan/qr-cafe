import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Must stay in sync with messages/*.json - a locale without a message file
// makes getRequestConfig throw at runtime (HTTP 500).
export const locales = ["en", "tr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || defaultLocale;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
