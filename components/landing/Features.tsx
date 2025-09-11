"use client";

import { Coffee, FolderTree, Globe, Image, QrCode, Smartphone } from "lucide-react";
import { FC } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const getFeatures = () => [
  {
    icon: QrCode,
    key: "qrGeneration",
    comingSoon: false,
  },
  {
    icon: FolderTree,
    key: "menuManagement",
    comingSoon: false,
  },
  {
    icon: Image,
    key: "mediaManagement",
    comingSoon: false,
  },
  {
    icon: Smartphone,
    key: "mobileFirst",
    comingSoon: false,
  },
  {
    icon: Globe,
    key: "multiCurrency",
    comingSoon: false,
  },
  {
    icon: Coffee,
    key: "cafeFocused",
    comingSoon: false,
  },
];

const Features: FC = () => {
  const features = getFeatures();

  return (
    <section id="features" className="py-20 px-4" aria-labelledby="features-heading">
      <div className="container mx-auto">
        <header className="text-center mb-16">
          <h2 id="features-heading" className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Modern Cafes
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your cafe with our all-in-one platform. Generate QR codes instantly, manage your entire menu effortlessly, and push updates in
            real-time. Everything you need to go digital, <strong>simplified</strong>.
          </p>
        </header>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card key={feature.key} className="bg-background">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <IconComponent className="h-12 w-12 text-orange-600 mb-4 " aria-hidden="true" />
                    {feature.comingSoon && (
                      <Badge variant="secondary" className="text-xs">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                  <CardTitle>
                    {feature.key === "qrGeneration" && "QR Code Generation"}
                    {feature.key === "menuManagement" && "Complete Menu Management"}
                    {feature.key === "mediaManagement" && "Media Management"}
                    {feature.key === "mobileFirst" && "Mobile-First Experience"}
                    {feature.key === "multiCurrency" && "Multi-Currency Support"}
                    {feature.key === "cafeFocused" && "Cafe-Focused Features"}
                  </CardTitle>
                  <CardDescription>
                    {feature.key === "qrGeneration" &&
                      "Generate QR codes for each cafe with preview and PDF export capabilities. Share your digital menu instantly."}
                    {feature.key === "menuManagement" &&
                      "Create, edit, and manage your entire menu structure effortlessly. Add cafes, organize categories, and showcase products with intuitive drag-and-drop organization."}
                    {feature.key === "mediaManagement" &&
                      "Upload and manage cafe logos and product images with secure cloud storage. Show off your dishes with high-quality visuals."}
                    {feature.key === "mobileFirst" &&
                      "Responsive design optimized for mobile devices. Your customers get a seamless experience on any screen size."}
                    {feature.key === "multiCurrency" &&
                      "Support for different currencies across cafes. Perfect for international businesses or franchises."}
                    {feature.key === "cafeFocused" &&
                      "Designed specifically for cafes and restaurants with industry-specific workflows and optimizations."}
                  </CardDescription>
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
