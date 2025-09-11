"use client";

import SectionCards from "@/components/common/SectionCards";
import { useQueryRequest } from "@/hooks/useRequest";
import { apiClient } from "@/lib/api-client";
import QueryKeys from "@/lib/query";
import type { DashboardStats } from "@/lib/repositories/stats-repository";

const DashboardStatCards = () => {
  const { data: stats, isLoading } = useQueryRequest<DashboardStats>({
    queryKey: QueryKeys.stats,
    queryFn: () => apiClient.get<DashboardStats>("/api/stats"),
  });

  const statConfigs = [
    {
      title: "Total Cafes",
      key: "totalCafes" as keyof DashboardStats,
      description: "Active cafe locations across all regions",
    },
    {
      title: "Total Categories",
      key: "totalCategories" as keyof DashboardStats,
      description: "Menu categories added",
    },
    {
      title: "Total Products",
      key: "totalProducts" as keyof DashboardStats,
      description: "Individual menu items across all cafes",
    },
    {
      title: "Active Products",
      key: "activeProducts" as keyof DashboardStats,
      description: "Available products ready for customers",
    },
  ];

  const items = statConfigs.map((item) => ({
    title: item.title,
    value: isLoading ? "..." : (stats?.[item.key] || 0).toString(),
    description: item.description,
  }));

  return <SectionCards items={items} />;
};

export default DashboardStatCards;
