"use client";

import { useTranslations } from "next-intl";
import SectionCards from "@/components/common/SectionCards";
import { useQueryRequest } from "@/hooks/useRequest";
import { apiClient } from "@/lib/api-client";
import QueryKeys from "@/lib/query";
import type { DashboardStats } from "@/lib/repositories/stats-repository";

const DashboardStatCards = () => {
  const t = useTranslations("dashboard.stats");
  const { data: stats, isLoading } = useQueryRequest<DashboardStats>({
    queryKey: QueryKeys.stats,
    queryFn: () => apiClient.get<DashboardStats>("/api/stats"),
  });

  const statConfigs = [
    {
      title: t("totalCafes"),
      key: "totalCafes" as keyof DashboardStats,
      description: t("totalCafesDescription"),
    },
    {
      title: t("totalCategories"),
      key: "totalCategories" as keyof DashboardStats,
      description: t("totalCategoriesDescription"),
    },
    {
      title: t("totalProducts"),
      key: "totalProducts" as keyof DashboardStats,
      description: t("totalProductsDescription"),
    },
    {
      title: t("activeProducts"),
      key: "activeProducts" as keyof DashboardStats,
      description: t("activeProductsDescription"),
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
