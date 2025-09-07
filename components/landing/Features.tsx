"use client";

import { FC } from "react";
import { Badge } from "@/components/ui/badge";
import { QrCode, Smartphone, Coffee, FolderTree, Image, Globe } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("landing.features");
  const features = getFeatures();

  return (
    <section id="features" className="py-20 px-4" aria-labelledby="features-heading">
      <div className="container mx-auto">
        <header className="text-center mb-16">
          <h2 id="features-heading" className="text-3xl md:text-4xl font-bold mb-4">
            {t("title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t.rich("subtitle", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
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
                        {t("comingSoon")}
                      </Badge>
                    )}
                  </div>
                  <CardTitle>{t(`items.${feature.key}.title`)}</CardTitle>
                  <CardDescription>{t(`items.${feature.key}.description`)}</CardDescription>
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
