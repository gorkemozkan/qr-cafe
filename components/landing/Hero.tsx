"use client";

import { ArrowRight, Coffee, QrCode, Smartphone, Sparkles } from "lucide-react";
import NextLink from "next/link";
import { FC } from "react";
import FancyBackground from "@/components/landing/FancyBackground";
import { Button } from "@/components/ui/button";

const Hero: FC = () => {
  return (
    <section
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800"
      aria-labelledby="hero-heading"
    >
      <FancyBackground />
      <div className="container mx-auto py-6 px-4 relative z-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 border border-orange-200/50 dark:border-orange-800/50 mb-8 animate-fade-in-up">
            <Sparkles className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Transform Your Cafe Today</span>
          </div>
          <div className="mb-8 animate-fade-in-up">
            <h1 id="hero-heading" className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.9] mb-6 tracking-tight space-y-3">
              <span className="inline-block">
                <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 bg-clip-text text-transparent">Digital QR Menu</span>
              </span>
              <br />
              <span className="inline-block">for Modern Cafes</span>
            </h1>
          </div>
          <div className="animate-fade-in-up">
            <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Create stunning digital menus with QR codes, organize products by categories, and deliver an exceptional mobile dining experience that
              your customers will love.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in-up">
            <Button
              asChild
              className="group text-lg  h-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-2xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 border-0"
            >
              <NextLink href="/admin/auth/login" target="_blank">
                <QrCode className="mr-2 h-5 w-50" aria-hidden="true" />
                Create Your QR Menu
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </NextLink>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto animate-fade-in-up">
            <div className="text-center group">
              <div className="w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <QrCode className="h-8 w-8 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">Instant</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">QR Generation</div>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Smartphone className="h-8 w-8 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mobile</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Optimized</div>
            </div>

            <div className="text-center group">
              <div className="w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-8 w-8 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">Real-time</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Updates</div>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Coffee className="h-8 w-8 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">Cafe</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Focused</div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
