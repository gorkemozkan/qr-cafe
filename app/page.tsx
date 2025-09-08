import Script from "next/script";
import { NextPage, Metadata } from "next";
import Hero from "@/components/landing/Hero";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import Features from "@/components/landing/Features";
import CTASection from "@/components/landing/CTASection";

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
    "contactless dining",
    "mobile-first menu",
    "restaurant digitization",
  ],
  authors: [{ name: "QR Cafe Team" }],
  creator: "QR Cafe",
  publisher: "QR Cafe",
  alternates: {
    canonical: "/",
  },
  category: "Technology",
};

const LandingPage: NextPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "QR Cafe",
    description: "Smart QR menu solutions for cafes and restaurants. Create interactive digital menus with QR codes.",
    url: "/",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "developer@ozgorkem.com",
    },
    founder: {
      "@type": "Person",
      name: "QR Cafe Team",
    },
    industry: "Technology",
    serviceArea: "Global",
    offers: {
      "@type": "Service",
      name: "QR Menu Solutions",
      description: "Digital menu creation and management for cafes and restaurants",
    },
  };

  return (
    <>
      <Script id="structured-data" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(structuredData)}
      </Script>
      <main id="main-content" className="min-h-screen bg-background">
        <Header />
        <Hero />
        <Features />
        <CTASection />
        <Footer />
      </main>
    </>
  );
};

export default LandingPage;
