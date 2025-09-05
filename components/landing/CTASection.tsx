import { FC } from "react";
import NextLink from "next/link";
import { QrCode, ArrowRight, Sparkles, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection: FC = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden" aria-labelledby="cta-heading">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-10 to-orange-50 dark:from-orange-950/20 dark:to-orange-900/20" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,165,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,165,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse" />
        <div
          className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <div
          className="absolute top-32 right-20 w-16 h-16 bg-gradient-to-br from-orange-500/20 to-orange-700/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-br from-orange-300/20 to-orange-500/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        />
      </div>

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
            Ready to <span className="bg-gradient-to-r from-orange-400 via-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">Transform</span> Your Cafe?
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of cafes already using QR Cafe to create beautiful digital menus.
            <strong className="text-foreground"> Start your free trial today</strong> and see the difference in minutes.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 rounded-full px-4 py-2 backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>No Setup Fees</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 rounded-full px-4 py-2 backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Instant QR Codes</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 rounded-full px-4 py-2 backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Mobile Optimized</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="group relative overflow-hidden text-lg px-8 py-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-orange-500/25"
            >
              <NextLink href="/admin/auth/signup" target="_blank">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Rocket className="mr-2 h-5 w-5 group-hover:animate-bounce" aria-hidden="true" />
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
              </NextLink>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="group text-lg px-8 py-6 border-2 border-orange-300 hover:border-orange-500 text-orange-700 hover:text-orange-800 dark:text-orange-300 dark:hover:text-orange-200 bg-white/50 hover:bg-orange-50 dark:bg-gray-900/50 dark:hover:bg-orange-950/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <NextLink href="/admin/auth/login" target="_blank">
                <QrCode className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" aria-hidden="true" />
                Sign In
              </NextLink>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
