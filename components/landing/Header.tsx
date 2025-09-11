"use client";

import { QrCode } from "lucide-react";
import { FC } from "react";
import { scrollToSection } from "@/lib/dom";
import BuyMeCaffeeButton from "@/components/common/BuyMeCaffeeButton";
import SignInButton from "@/components/common/SignInButton";

const Header: FC = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between" aria-label="Main navigation">
          <button
            type="button"
            aria-label="Go to top"
            onClick={() => scrollToSection("main-content")}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <QrCode className="h-6 w-6 text-primary" aria-hidden="true" />
            <span className="text-2xl font-bold">Only Menu</span>
          </button>
          <div className="flex items-center space-x-4">
            <BuyMeCaffeeButton />
            <SignInButton />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
