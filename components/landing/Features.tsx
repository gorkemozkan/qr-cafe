import { FC } from "react";
import { Badge } from "@/components/ui/badge";
import { QrCode, Smartphone, Users, Zap, Shield, Coffee, FolderTree, Image, Globe } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: QrCode,
    title: "QR Code Generation",
    description: "Generate QR codes for each cafe with preview and PDF export capabilities. Share your digital menu instantly.",
    comingSoon: false,
  },
  {
    icon: FolderTree,
    title: "Complete Menu Management",
    description:
      "Create, edit, and manage your entire menu structure effortlessly. Add cafes, organize categories, and showcase products with intuitive drag-and-drop organization.",
    comingSoon: false,
  },
  {
    icon: Image,
    title: "Media Management",
    description: "Upload and manage cafe logos and product images with secure cloud storage. Show off your dishes with high-quality visuals.",
    comingSoon: false,
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Changes in your admin panel instantly reflect on customer-facing menus. Update prices and availability in real-time.",
    comingSoon: false,
  },
  {
    icon: Smartphone,
    title: "Mobile-First Experience",
    description: "Responsive design optimized for mobile devices. Your customers get a seamless experience on any screen size.",
    comingSoon: false,
  },
  {
    icon: Globe,
    title: "Multi-Currency Support",
    description: "Support for different currencies across cafes. Perfect for international businesses or franchises.",
    comingSoon: false,
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Built with enterprise-grade security including rate limiting, CSRF protection, and secure authentication.",
    comingSoon: false,
  },
  {
    icon: Coffee,
    title: "Cafe-Focused Features",
    description: "Designed specifically for cafes and restaurants with industry-specific workflows and optimizations.",
    comingSoon: false,
  },
  {
    icon: Users,
    title: "Customer Analytics",
    description: "Track menu views, popular items, and customer preferences to optimize your offerings and boost sales.",
    comingSoon: true,
  },
];

const Features: FC = () => {
  return (
    <section id="features" className="py-20 px-4" aria-labelledby="features-heading">
      <div className="container mx-auto">
        <header className="text-center mb-16">
          <h2 id="features-heading" className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Modern Cafes
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your cafe with our all-in-one platform. Generate <strong>QR codes instantly</strong>, manage your entire menu effortlessly, and push updates in real-time.
            Everything you need to go digital, simplified.
          </p>
        </header>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card key={feature.title} className="bg-background">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <IconComponent className="h-12 w-12 text-orange-600 mb-4 " aria-hidden="true" />
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
};

export default Features;
