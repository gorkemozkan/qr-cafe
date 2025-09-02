import { Metadata } from "next";
import { Header, Hero, Features, Footer } from "@/components/landing";

export const metadata: Metadata = {
  title: "QR Cafe - Transform Your Cafe with Smart QR Menus",
  description:
    "Create interactive digital menus, track orders in real-time, and enhance customer experience with our innovative QR code solution for cafes and restaurants.",
  keywords: [
    "QR menu",
    "digital menu",
    "cafe technology",
    "restaurant menu",
    "QR code",
    "cafe management",
  ],
  authors: [{ name: "QR Cafe Team" }],
  creator: "QR Cafe",
  publisher: "QR Cafe",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // metadataBase: new URL("https://qrcafe.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "QR Cafe - Transform Your Cafe with Smart QR Menus",
    description:
      "Create interactive digital menus, track orders in real-time, and enhance customer experience with our innovative QR code solution.",
    // url: "https://qrcafe.com",
    siteName: "QR Cafe",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Cafe - Transform Your Cafe with Smart QR Menus",
    description:
      "Create interactive digital menus, track orders in real-time, and enhance customer experience with our innovative QR code solution.",
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
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
