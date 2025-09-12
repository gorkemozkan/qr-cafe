import { Metadata, NextPage } from "next";
import CafeList from "@/components/cafe/CafeList";
import PageTitleWithUser from "@/components/common/PageTitleWithUser";
import QuickCreateProduct from "@/components/common/QuickCreateProduct";
import DashboardStatCards from "@/components/dashboard/DashboardStatCards";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your dashboard for managing your cafes and categories",
};

// TODO: Add translations for metadata when next-intl supports metadata translation

const Page: NextPage = () => {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <PageTitleWithUser />
      <div className="mt-12 space-y-8">
        <DashboardStatCards />
        <CafeList />
      </div>
      <QuickCreateProduct />
    </div>
  );
};

export default Page;
