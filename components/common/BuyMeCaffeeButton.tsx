"use client";

import { Coffee } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const BuyMeCaffeeButton = () => {
  return (
    <Button size="lg" className="bg-[#FFDD04] text-gray-900 hover:bg-[#FFDD04]/90 font-semibold" asChild>
      <Link href="https://buymeacoffee.com/twqsvs897st" target="_blank">
        <Coffee className="h-4 w-4" />
        Buy Me a Coffee
      </Link>
    </Button>
  );
};

export default BuyMeCaffeeButton;
