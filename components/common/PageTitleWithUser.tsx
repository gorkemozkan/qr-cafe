"use client";

import UserDropdown from "@/components/auth/UserDropdown";
import PageTitle from "@/components/common/PageTitle";
import ThemeToggle from "@/components/common/ThemeToggle";

const PageTitleWithUser = () => {
  return (
    <PageTitle
      subtitle="You can manage your cafes and categories here."
      title="Welcome back!"
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
