import { FC } from "react";
import NextLink from "next/link";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero: FC = () => {
  return (
    <section className="py-32 px-4 relative overflow-hidden" aria-labelledby="hero-heading">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h1 id="hero-heading" className="text-4xl md:text-6xl font-black  leading-tight mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">Digital QR Menus</span> for{" "}
            <span className="bg-gradient-to-r from-orange-700 via-orange-600 via-orange-500 to-orange-400 bg-clip-text text-transparent">Modern Cafes</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create and manage digital menus with QR codes, organize your products by categories, and give your customers an easy mobile menu experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6 bg-primary text-primary-foreground">
              <NextLink href="/admin/auth/login">
                <QrCode className="mr-2 h-5 w-5" aria-hidden="true" />
                Let's Create QR Menu!
              </NextLink>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
