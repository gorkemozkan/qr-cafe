import { Metadata, NextPage } from "next";
import CafeList from "@/components/cafe/CafeList";
import PageTitleWithUser from "@/components/PageTitleWithUser";
import DashboardStatCards from "@/components/dashboard/DashboardStatCards";
import FancyBackground from "@/components/landing/FancyBackground";
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your dashboard for managing your cafes and categories",
};

const Page: NextPage = () => {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2 space-y-8">
      <PageTitleWithUser />
      <DashboardStatCards />
      <CafeList />
      <FancyBackground />
    </div>
  );
};

export default Page;
