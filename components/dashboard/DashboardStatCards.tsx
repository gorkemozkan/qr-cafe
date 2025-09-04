import SectionCards from "@/components/SectionCards";
import { statsRepository } from "@/lib/repositories/stats-repository";

const DashboardStatCards = async () => {
  const stats = await statsRepository.getDashboardStats();

  const items = [
    {
      title: "Total Cafes",
      value: (stats.totalCafes || 0).toString(),
      description: "Active cafe locations across all regions",
    },
    {
      title: "Total Categories",
      value: (stats.totalCategories || 0).toString(),
      description: "Menu categories added",
    },
    {
      title: "Total Products",
      value: (stats.totalProducts || 0).toString(),
      description: "Individual menu items across all cafes",
    },
    {
      title: "Active Products",
      value: (stats.activeProducts || 0).toString(),
      description: "Available products ready for customers",
    },
  ];

  return <SectionCards items={items} />;
};

export default DashboardStatCards;
