"use client";

import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import TooltipButton from "./TooltipButton";

const BuyMeCaffeeButton = () => {
  return (
    <TooltipButton onClick={() => window.open("https://buymeacoffee.com/twqsvs897st", "_blank")} tooltip="Buy Me a Coffee">
      <Button size="lg" className="bg-[#FFDD04] text-gray-900 hover:bg-[#FFDD04]/90  cursor-pointer">
        <Coffee className="h-5 w-5" />
      </Button>
    </TooltipButton>
  );
};

export default BuyMeCaffeeButton;
