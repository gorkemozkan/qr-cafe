"use client";

import { useTranslations } from "next-intl";
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

  const t = useTranslations();

  const statConfigs = [
    {
      title: t("dashboard.stats.totalCafes"),
      key: "totalCafes" as keyof DashboardStats,
      description: t("dashboard.stats.cafesDescription"),
    },
    {
      title: t("dashboard.stats.totalCategories"),
      key: "totalCategories" as keyof DashboardStats,
      description: t("dashboard.stats.categoriesDescription"),
    },
    {
      title: t("dashboard.stats.totalProducts"),
      key: "totalProducts" as keyof DashboardStats,
      description: t("dashboard.stats.productsDescription"),
    },
    {
      title: t("dashboard.stats.activeProducts"),
      key: "activeProducts" as keyof DashboardStats,
      description: t("dashboard.stats.activeProductsDescription"),
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
