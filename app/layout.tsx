import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/components/providers/QueryProvider";
import { type FC, type ReactNode } from "react";

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
};

interface Props {
  children: ReactNode;
}

const RootLayout: FC<Props> = (props) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={` antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>{props.children}</QueryProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
