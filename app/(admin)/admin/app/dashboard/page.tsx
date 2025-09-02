import DashboardStatCards from "@/components/dashboard/DashboardStatCards";
import CafeCreateModal from "@/components/cafe/CafeCreateModal";

const Page = () => {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
        <CafeCreateModal />
      </div>
      <DashboardStatCards />
    </div>
  );
};

export default Page;
