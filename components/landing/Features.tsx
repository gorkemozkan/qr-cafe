import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, Smartphone, Users, Zap, Shield, Coffee } from "lucide-react";

const features = [
  {
    icon: QrCode,
    title: "Instant QR Menus",
    description:
      "Generate beautiful digital menus with QR codes in seconds. No technical skills required.",
    comingSoon: false,
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description:
      "Optimized for mobile devices with responsive design that works on any screen size.",
    comingSoon: false,
  },
  {
    icon: Users,
    title: "Customer Analytics",
    description:
      "Track menu views, popular items, and customer preferences to optimize your offerings.",
    comingSoon: true,
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description:
      "Update menu items, prices, and availability instantly across all QR codes.",
    comingSoon: true,
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Enterprise-grade security with 99.9% uptime guarantee for your business.",
    comingSoon: false,
  },
  {
    icon: Coffee,
    title: "Cafe-Focused",
    description:
      "Built specifically for cafes and restaurants with industry-specific features.",
    comingSoon: false,
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="py-20 px-4"
      aria-labelledby="features-heading"
    >
      <div className="container mx-auto">
        <header className="text-center mb-16">
          <h2
            id="features-heading"
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Why Choose QR Cafe?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to modernize your cafe operations and delight
            your customers.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card key={feature.title} className="bg-background">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <IconComponent
                      className="h-12 w-12 text-orange-500 mb-4"
                      aria-hidden="true"
                    />
                    {feature.comingSoon && (
                      <Badge variant="secondary" className="text-xs">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
