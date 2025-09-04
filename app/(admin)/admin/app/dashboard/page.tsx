import { NextPage } from "next";
import PageTitle from "@/components/PageTitle";
import CafeList from "@/components/cafe/CafeList";
import CafeCreateModal from "@/components/cafe/CafeCreateModal";
import DashboardStatCards from "@/components/dashboard/DashboardStatCards";

const Page: NextPage = () => {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2 space-y-4">
      <PageTitle title="Welcome to Dashboard 👋🏻" actions={<CafeCreateModal />} />
      <DashboardStatCards />
      <CafeList />
    </div>
  );
};

export default Page;
