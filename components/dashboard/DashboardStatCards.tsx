"use client";

import SectionCards from "@/components/SectionCards";
import { useQueryRequest } from "@/hooks/use-request";
import { apiClient } from "@/lib/api-client";
import QueryKeys from "@/constants/query-keys";
import type { DashboardStats } from "@/lib/repositories/stats-repository";

const DashboardStatCards = () => {
  const { data: stats, isLoading } = useQueryRequest<DashboardStats>({
    queryKey: QueryKeys.stats,
    queryFn: () => apiClient.get<DashboardStats>("/api/stats"),
  });

  if (isLoading) {
    const loadingItems = [
      {
        title: "Total Cafes",
        value: "...",
        description: "Active cafe locations across all regions",
      },
      {
        title: "Total Categories",
        value: "...",
        description: "Menu categories added",
      },
      {
        title: "Total Products",
        value: "...",
        description: "Individual menu items across all cafes",
      },
      {
        title: "Active Products",
        value: "...",
        description: "Available products ready for customers",
      },
    ];
    return <SectionCards items={loadingItems} />;
  }

  const items = [
    {
      title: "Total Cafes",
      value: (stats?.totalCafes || 0).toString(),
      description: "Active cafe locations across all regions",
    },
    {
      title: "Total Categories",
      value: (stats?.totalCategories || 0).toString(),
      description: "Menu categories added",
    },
    {
      title: "Total Products",
      value: (stats?.totalProducts || 0).toString(),
      description: "Individual menu items across all cafes",
    },
    {
      title: "Active Products",
      value: (stats?.activeProducts || 0).toString(),
      description: "Available products ready for customers",
    },
  ];

  return <SectionCards items={items} />;
};

export default DashboardStatCards;
