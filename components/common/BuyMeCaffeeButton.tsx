"use client";

import { Coffee } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import TooltipButton from "./TooltipButton";

const BuyMeCaffeeButton = () => {
  const t = useTranslations("common");

  return (
    <TooltipButton onClick={() => window.open("https://buymeacoffee.com/twqsvs897st", "_blank")} tooltip={t("buyMeCoffee")}>
      <Button size="lg" className="bg-[#FFDD04] text-gray-900 hover:bg-[#FFDD04]/90  cursor-pointer">
        <Coffee className="h-5 w-5" />
      </Button>
    </TooltipButton>
  );
};

export default BuyMeCaffeeButton;
