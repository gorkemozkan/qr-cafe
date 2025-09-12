"use client";

import { FC } from "react";
import SignInButton from "@/components/common/SignInButton";
import BuyMeCaffeeButton from "@/components/common/BuyMeCaffeeButton";

const Header: FC = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-end" aria-label="Main navigation">
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
