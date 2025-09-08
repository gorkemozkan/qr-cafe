"use client";

import { apiClient } from "@/lib/api-client";
import QueryKeys from "@/constants/query-keys";
import SectionCards from "@/components/SectionCards";
import { useQueryRequest } from "@/hooks/use-request";
import { useTranslations } from "next-intl";
import type { DashboardStats } from "@/lib/repositories/stats-repository";

const DashboardStatCards = () => {
  const { data: stats, isLoading } = useQueryRequest<DashboardStats>({
    queryKey: QueryKeys.stats,
    queryFn: () => apiClient.get<DashboardStats>("/api/stats"),
  });

  const t = useTranslations();

  if (isLoading) {
    const loadingItems = [
      {
        title: t("dashboard.stats.totalCafes"),
        value: "...",
        description: t("dashboard.stats.cafesDescription"),
      },
      {
        title: t("dashboard.stats.totalCategories"),
        value: "...",
        description: t("dashboard.stats.categoriesDescription"),
      },
      {
        title: t("dashboard.stats.totalProducts"),
        value: "...",
        description: t("dashboard.stats.productsDescription"),
      },
      {
        title: t("dashboard.stats.activeProducts"),
        value: "...",
        description: t("dashboard.stats.activeProductsDescription"),
      },
    ];
    return <SectionCards items={loadingItems} />;
  }

  const items = [
    {
      title: t("dashboard.stats.totalCafes"),
      value: (stats?.totalCafes || 0).toString(),
      description: t("dashboard.stats.cafesDescription"),
    },
    {
      title: t("dashboard.stats.totalCategories"),
      value: (stats?.totalCategories || 0).toString(),
      description: t("dashboard.stats.categoriesDescription"),
    },
    {
      title: t("dashboard.stats.totalProducts"),
      value: (stats?.totalProducts || 0).toString(),
      description: t("dashboard.stats.productsDescription"),
    },
    {
      title: t("dashboard.stats.activeProducts"),
      value: (stats?.activeProducts || 0).toString(),
      description: t("dashboard.stats.activeProductsDescription"),
    },
  ];

  return <SectionCards items={items} />;
};

export default DashboardStatCards;
