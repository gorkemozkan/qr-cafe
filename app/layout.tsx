import type { Metadata } from "next";

import "./globals.css";
import { type FC, type ReactNode } from "react";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/context/ThemeContext";
import { nextPublicBaseUrl } from "@/lib/env";
import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: {
    template: "%s | Only Menu",
    default: "Only Menu - Smart QR Menu Solutions for Cafes & Restaurants",
  },
  category: "Technology",
  description:
    "Create interactive digital menus with QR codes. Transform your cafe or restaurant with smart menu solutions that enhance customer experience and streamline operations.",
  keywords: [
    "QR menu",
    "digital menu",
    "cafe technology",
    "restaurant menu",
    "QR code",
    "cafe management",
    "contactless dining",
    "mobile-first menu",
    "restaurant digitization",
  ],
  authors: [{ name: "Only Menu Team" }],
  creator: "Only Menu",
  publisher: "Only Menu",
  openGraph: {
    title: "Only Menu - Smart QR Menu Solutions for Cafes & Restaurants",
    description:
      "Create interactive digital menus with QR codes. Transform your cafe or restaurant with smart menu solutions that enhance customer experience and streamline operations.",
    url: nextPublicBaseUrl,
    siteName: "Only Menu",
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
    canonical: nextPublicBaseUrl,
  },
};

const getStructuredData = (baseUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Only Menu",
  description: "Smart QR menu solutions for cafes and restaurants. Create interactive digital menus with QR codes.",
  url: baseUrl,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "developer@ozgorkem.com",
  },
  founder: {
    "@type": "Person",
    name: "Only Menu Team",
  },
  industry: "Technology",
  serviceArea: "Global",
  offers: {
    "@type": "Service",
    name: "QR Menu Solutions",
    description: "Digital menu creation and management for cafes and restaurants",
  },
});

interface Props {
  children: ReactNode;
}

const RootLayout: FC<Props> = async (props) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        <Script id="structured-data" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(getStructuredData(nextPublicBaseUrl || "/"))}
        </Script>
      </head>
      <GoogleTagManager gtmId="GTM-TJ2XX28D" />
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>{props.children}</QueryProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
