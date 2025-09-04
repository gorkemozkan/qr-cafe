import { Metadata, NextPage } from "next";
import PageTitle from "@/components/PageTitle";
import CafeList from "@/components/cafe/CafeList";
import DashboardStatCards from "@/components/dashboard/DashboardStatCards";
import UserDropdown from "@/components/auth/UserDropdown";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your dashboard for managing your cafes and categories",
};

const Page: NextPage = () => {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2 space-y-8">
      <PageTitle
        subtitle="You can manage your cafes and categories here. "
        title="Welcome to Dashboard."
        actions={
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserDropdown />
          </div>
        }
      />
      <DashboardStatCards />
      <CafeList />
    </div>
  );
};

export default Page;
