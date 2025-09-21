import { Metadata, NextPage } from "next";
import CafeList from "@/components/cafe/CafeList";
import PageTitleWithUser from "@/components/common/PageTitleWithUser";
import DashboardStatCards from "@/components/dashboard/DashboardStatCards";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your dashboard for managing your cafes and categories",
};

const Page: NextPage = () => {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <PageTitleWithUser />
      <div className="mt-12 space-y-8">
        <DashboardStatCards />
        <CafeList />
      </div>
    </div>
  );
};

export default Page;
