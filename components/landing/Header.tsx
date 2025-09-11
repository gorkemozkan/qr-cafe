"use client";

import { QrCode } from "lucide-react";
import NextLink from "next/link";
import { useTranslations } from "next-intl";
import { FC } from "react";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { scrollToSection } from "@/lib/dom";

const Header: FC = () => {
  const t = useTranslations("navigation");

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
            <LanguageSwitcher />
            <NextLink href="/admin/auth/login" className="hidden md:inline-flex" target="_blank">
              <Button>{t("signIn")}</Button>
            </NextLink>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
