"use client";

import { useUser } from "@/hooks/use-user";
import { useTranslations } from "next-intl";
import PageTitle from "@/components/PageTitle";
import ThemeToggle from "@/components/ThemeToggle";
import UserDropdown from "@/components/auth/UserDropdown";
import LanguageSwitcher from "./LanguageSwitcher";

const PageTitleWithUser = () => {
  const { user } = useUser();

  const t = useTranslations();

  return (
    <PageTitle
      subtitle={t("dashboard.subtitle")}
      title={`${t("dashboard.welcome")}, ${user?.email}`}
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
