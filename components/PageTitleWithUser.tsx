"use client";

import PageTitle from "@/components/PageTitle";
import { useUser } from "@/hooks/use-user";
import ThemeToggle from "@/components/ThemeToggle";
import UserDropdown from "@/components/auth/UserDropdown";

const PageTitleWithUser = () => {
  const { user } = useUser();

  return (
    <PageTitle
      subtitle="You can manage your cafes and categories here. "
      title={`Welcome to Dashboard, ${user?.email}`}
      actions={
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserDropdown />
        </div>
      }
    />
  );
};

export default PageTitleWithUser;
