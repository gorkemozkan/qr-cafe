import type { Metadata } from "next";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "./globals.css";
import { type FC, type ReactNode } from "react";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/context/ThemeContext";
import { defaultLocale } from "@/i18n";
import { nextPublicBaseUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: {
    template: "%s | QR Cafe",
    default: "QR Cafe - Smart QR Menu Solutions for Cafes & Restaurants",
  },
  description:
    "Create interactive digital menus with QR codes. Transform your cafe or restaurant with smart menu solutions that enhance customer experience and streamline operations.",
  keywords: ["QR menu", "digital menu", "cafe technology", "restaurant menu", "QR code", "cafe management", "contactless menu", "mobile menu"],
  authors: [{ name: "QR Cafe Team" }],
  creator: "QR Cafe",
  publisher: "QR Cafe",
  openGraph: {
    title: "QR Cafe - Smart QR Menu Solutions for Cafes & Restaurants",
    description:
      "Create interactive digital menus with QR codes. Transform your cafe or restaurant with smart menu solutions that enhance customer experience and streamline operations.",
    url: nextPublicBaseUrl,
    siteName: "QR Cafe",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

interface Props {
  children: ReactNode;
}

const RootLayout: FC<Props> = async (props) => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || defaultLocale;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
      </head>
      <body className={` antialiased`}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <QueryProvider>{props.children}</QueryProvider>
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
