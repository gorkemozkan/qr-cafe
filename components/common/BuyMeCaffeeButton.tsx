import Link from "next/link";
import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

const BuyMeCaffeeButton = () => {
  return (
    <Button size="lg" asChild>
      <Link href="https://buymeacoffee.com/twqsvs897st" target="_blank" rel="noopener noreferrer">
        <Coffee className="h-5 w-5" />
      </Link>
    </Button>
  );
};

export default BuyMeCaffeeButton;
