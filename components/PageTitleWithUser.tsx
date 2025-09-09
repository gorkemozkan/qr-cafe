"use client";

import { useTranslations } from "next-intl";
import UserDropdown from "@/components/auth/UserDropdown";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import PageTitle from "@/components/PageTitle";
import QuickActionsButton from "@/components/QuickActionsButton";
import ThemeToggle from "@/components/ThemeToggle";

const PageTitleWithUser = () => {
  const t = useTranslations();

  return (
    <PageTitle
      subtitle={t("dashboard.subtitle")}
      title={`${t("dashboard.welcome")}`}
      actions={
        <div className="flex items-center gap-2">
          <QuickActionsButton />
          <LanguageSwitcher />
          <ThemeToggle />
          <UserDropdown />
        </div>
      }
    />
  );
};

export default PageTitleWithUser;
