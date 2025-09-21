"use client";

import QueryKeys from "@/lib/query";
import { useTranslations } from "next-intl";
import { apiClient } from "@/lib/api-client";
import { useQueryRequest } from "@/hooks/useRequest";
import SectionCards from "@/components/common/SectionCards";

const DashboardStatCards = () => {
  //#region Hooks

  const t = useTranslations("dashboard.stats");

  const { data: stats, isLoading } = useQueryRequest({
    queryKey: QueryKeys.stats,
    queryFn: () => apiClient.get("/api/stats"),
  });

  //#endregion

  const statConfigs = [
    {
      title: t("totalCafes"),
      key: "totalCafes",
      description: t("totalCafesDescription"),
    },
    {
      title: t("totalCategories"),
      key: "totalCategories",
      description: t("totalCategoriesDescription"),
    },
    {
      title: t("totalProducts"),
      key: "totalProducts",
      description: t("totalProductsDescription"),
    },
    {
      title: t("activeProducts"),
      key: "activeProducts",
      description: t("activeProductsDescription"),
    },
  ];

  const items = statConfigs.map((item) => ({
    title: item.title,
    value: isLoading ? "..." : (stats?.[item.key as keyof typeof stats] || 0).toString(),
    description: item.description,
  }));

  return <SectionCards items={items} />;
};

export default DashboardStatCards;
