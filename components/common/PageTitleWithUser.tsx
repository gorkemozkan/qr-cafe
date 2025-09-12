"use client";

import UserDropdown from "@/components/auth/UserDropdown";
import PageTitle from "@/components/common/PageTitle";
import ThemeToggle from "@/components/common/ThemeToggle";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useTranslations } from "next-intl";

const PageTitleWithUser = () => {
  const t = useTranslations("dashboard");

  return (
    <PageTitle
      subtitle={t("subtitle")}
      title={t("title")}
      actions={
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <UserDropdown />
        </div>
      }
    />
  );
};

export default PageTitleWithUser;
