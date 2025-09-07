"use client";

import { FC } from "react";
import { QrCode } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Footer: FC = () => {
  const t = useTranslations("landing.footer");

  return (
    <footer className="border-t py-2 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 py-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <QrCode className="h-6 w-6 text-primary" aria-hidden="true" />
              <span className="text-xl font-bold">QR Cafe</span>
            </div>
            <p className="text-muted-foreground">{t("description")}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">{t("legal")}</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  {t("privacy")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("product")}</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/#features" className="hover:text-foreground transition-colors">
                  {t("features")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t py-4 flex flex-col md:flex-row justify-between items-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {t("copyright")}
          </p>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
