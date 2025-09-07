import { FC } from "react";
import NextLink from "next/link";
import { Check, Zap, Crown, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PricingSection: FC = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden" aria-labelledby="pricing-heading">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-10 to-orange-50 dark:from-orange-950/20 dark:to-orange-900/20" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,165,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,165,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse" />
        <div
          className="absolute top-16 right-16 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-16 left-16 w-16 h-16 bg-gradient-to-br from-orange-500/20 to-orange-700/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "1.5s", animationDuration: "3.5s" }}
        />
        <div
          className="absolute top-1/3 left-1/4 w-24 h-24 bg-gradient-to-br from-orange-300/20 to-orange-500/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "3s", animationDuration: "5s" }}
        />
      </div>

      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur-lg opacity-50 animate-pulse" />
              <div className="relative bg-white dark:bg-gray-900 rounded-full p-4 shadow-2xl">
                <Crown className="h-8 w-8 text-orange-600 animate-pulse" />
              </div>
            </div>
          </div>

          <h2 id="pricing-heading" className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            Simple <span className="bg-gradient-to-r from-orange-400 via-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">Pricing</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Choose the perfect plan for your cafe. Start free and upgrade when you're ready to unlock more features.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-8 transition-transform duration-300 hover:scale-105 shadow-xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free</h3>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-black text-green-600">$0</span>
                      <span className="text-gray-500 ml-2">/forever</span>
                    </div>
                  </div>
                  <div className="relative">
                    <Zap className="h-8 w-8 text-green-500 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">1 Cafe location</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Basic QR code generation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Up to 5 categories</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Up to 25 products</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Mobile-friendly menus</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Basic menu design</span>
                  </div>
                </div>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full group text-lg py-6 border-2 border-green-300 hover:border-green-500 text-green-700 hover:text-green-800 dark:text-green-300 dark:hover:text-green-200 bg-white/50 hover:bg-green-50 dark:bg-gray-900/50 dark:hover:bg-green-950/30 transition-all duration-300"
                >
                  <NextLink href="/admin/auth/signup">
                    <Zap className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                    Get Started Free
                  </NextLink>
                </Button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/30 to-orange-600/30 rounded-2xl blur-xl opacity-100 animate-pulse" />
              <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-2 border-orange-300 dark:border-orange-600 rounded-2xl p-8 transition-transform duration-300 hover:scale-105 shadow-2xl">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1 animate-bounce">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>

                <div className="flex justify-between items-start mb-6 pt-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pro</h3>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-black bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">$19</span>
                      <span className="text-gray-500 ml-2">/month</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur-md opacity-50 animate-pulse" />
                    <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 rounded-full p-2">
                      <Sparkles className="h-6 w-6 text-white animate-spin" style={{ animationDuration: "6s" }} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Unlimited cafe locations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Custom QR code designs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Unlimited categories & products</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Advanced menu customization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Analytics & insights</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Priority support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Custom branding</span>
                  </div>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="w-full group text-lg py-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 shadow-2xl transition-all duration-300 hover:shadow-orange-500/25"
                >
                  <NextLink href="/admin/auth/signup">
                    <Crown className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                    Start Pro Trial
                  </NextLink>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">All plans include 24/7 support and a 30-day money-back guarantee</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
