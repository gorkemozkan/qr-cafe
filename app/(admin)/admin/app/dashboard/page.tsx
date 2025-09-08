import { Metadata, NextPage } from "next";
import CafeList from "@/components/cafe/CafeList";
import PageTitleWithUser from "@/components/PageTitleWithUser";
import DashboardStatCards from "@/components/dashboard/DashboardStatCards";
import FancyBackground from "@/components/landing/FancyBackground";
import QuickCreateProduct from "@/components/QuickCreateProduct";
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your dashboard for managing your cafes and categories",
};

const Page: NextPage = () => {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <PageTitleWithUser />
      <div className="mt-20 space-y-8">
        <DashboardStatCards />
        <CafeList />
        <FancyBackground />
      </div>

      <QuickCreateProduct />
    </div>
  );
};

export default Page;
