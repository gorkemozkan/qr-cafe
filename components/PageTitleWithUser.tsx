"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import PageTitle from "@/components/PageTitle";
import ThemeToggle from "@/components/ThemeToggle";
import UserDropdown from "@/components/auth/UserDropdown";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import QuickProductCreateSheet from "@/components/product/QuickProductCreateSheet";
import { Button } from "@/components/ui/button";

const PageTitleWithUser = () => {
  const t = useTranslations();
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

  return (
    <>
      <PageTitle
        subtitle={t("dashboard.subtitle")}
        title={`${t("dashboard.welcome")}`}
        actions={
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <UserDropdown />
          </div>
        }
      />

      <Button
        onClick={() => setIsQuickCreateOpen(true)}
        size="lg"
        className="fixed bottom-0 right-4 z-50 h-12 w-12 rounded-full bg-orange-500 hover:bg-orange-500/90"
        aria-label="Create Product Instantly"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <QuickProductCreateSheet open={isQuickCreateOpen} onOpenChange={setIsQuickCreateOpen} />
    </>
  );
};

export default PageTitleWithUser;
