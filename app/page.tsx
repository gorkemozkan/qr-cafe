import { NextPage } from "next";
import Hero from "@/components/landing/Hero";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import Features from "@/components/landing/Features";
import CTASection from "@/components/landing/CTASection";

const Page: NextPage = () => {
  return (
    <main id="main-content" className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Page;
