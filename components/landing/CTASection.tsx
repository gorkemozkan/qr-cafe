"use client";

import { FC } from "react";
import NextLink from "next/link";
import { ArrowRight, Sparkles, Rocket } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import FancyBackground from "@/components/landing/FancyBackground";

const CTASection: FC = () => {
  const t = useTranslations("landing.cta");

  return (
    <section className="py-20 px-4 relative overflow-hidden" aria-labelledby="cta-heading">
      <FancyBackground />
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur-lg opacity-50 animate-pulse" />
              <div className="relative bg-white dark:bg-gray-900 rounded-full p-4 shadow-2xl">
                <Sparkles className="h-8 w-8 text-orange-600 animate-spin" style={{ animationDuration: "8s" }} />
              </div>
            </div>
          </div>
          <h2 id="cta-heading" className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            {t.rich("title", {
              span: (chunks) => <span className="bg-gradient-to-r from-orange-400 via-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">{chunks}</span>,
            })}
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            {t.rich("subtitle", {
              strong: (chunks) => <strong className="text-foreground">{chunks}</strong>,
            })}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 rounded-full px-4 py-2 backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>{t("features.instantQR")}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 rounded-full px-4 py-2 backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>{t("features.mobileOptimized")}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="group relative overflow-hidden text-lg px-8 py-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 shadow-2xl transform transition-all duration-300  hover:shadow-orange-500/25"
            >
              <NextLink href="/admin/auth/signup" target="_blank">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Rocket className="mr-2 h-5 w-5" aria-hidden="true" />
                {t("button")}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
              </NextLink>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
