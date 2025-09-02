import CafeTable from "@/components/cafe/CafeTable";
import DashboardStatCards from "@/components/dashboard/DashboardStatCards";

const Page = () => {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2 space-y-4">
      <DashboardStatCards />
      <CafeTable />
    </div>
  );
};

export default Page;
