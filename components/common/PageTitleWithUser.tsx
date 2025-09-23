"use client";

import { useTranslations } from "next-intl";
import PageTitle from "@/components/common/PageTitle";
import UserDropdown from "@/components/auth/UserDropdown";
import ThemeToggle from "@/components/common/ThemeToggle";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

const PageTitleWithUser = () => {
  //#region Hooks

  const t = useTranslations("dashboard");

  //#endregion

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
