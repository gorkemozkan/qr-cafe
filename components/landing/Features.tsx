"use client";

import { FC } from "react";
import { Badge } from "@/components/ui/badge";
import { FolderTree, Globe, Image, QrCode, RefreshCw, Smartphone } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: QrCode,
    key: "qrGeneration",
    label: "QR Code Generation",
    description:
      "Generate QR codes for each cafe with preview and PDF export capabilities. Share your digital menu instantly.",
    comingSoon: false,
  },
  {
    icon: FolderTree,
    key: "menuManagement",
    label: "Complete Menu Management",
    description:
      "Create, edit, and manage your entire menu structure effortlessly. Add cafes, organize categories, and showcase products with intuitive drag-and-drop organization.",
    comingSoon: false,
  },
  {
    icon: RefreshCw,
    key: "realTimeUpdates",
    label: "Real-time Updates",
    description:
      "Push menu changes instantly to all customer devices. No more outdated menus or manual updates - changes appear immediately when you save them.",
    comingSoon: false,
  },
  {
    icon: Image,
    key: "mediaManagement",
    label: "Media Management",
    description:
      "Upload and manage cafe logos and product images with secure cloud storage. Show off your dishes with high-quality visuals.",
    comingSoon: false,
  },
  {
    icon: Smartphone,
    key: "mobileFirst",
    label: "Mobile-First Experience",
    description:
      "Responsive design optimized for mobile devices. Your customers get a seamless experience on any screen size.",
    comingSoon: false,
  },
  {
    icon: Globe,
    key: "multiCurrency",
    label: "Multi-Currency Support",
    description: "Support for different currencies across cafes. Perfect for international businesses or franchises.",
    comingSoon: false,
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
            Transform your cafe with our all-in-one platform. Generate QR codes instantly, manage your entire menu
            effortlessly, and push updates in real-time. Everything you need to go digital, <strong>simplified</strong>.
          </p>
        </header>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            return (
              <Card key={feature.key} className="bg-background">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <feature.icon className="h-12 w-12 text-orange-600 mb-4 " aria-hidden="true" />
                    {feature.comingSoon && (
                      <Badge variant="secondary" className="text-xs">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                  <CardTitle>{feature.label}</CardTitle>
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
