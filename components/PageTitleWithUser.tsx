"use client";

import { useTranslations } from "next-intl";
import PageTitle from "@/components/PageTitle";
import ThemeToggle from "@/components/ThemeToggle";
import UserDropdown from "@/components/auth/UserDropdown";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import QuickActionsButton from "@/components/QuickActionsButton";

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
