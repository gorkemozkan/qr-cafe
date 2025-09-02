import SectionCards from "@/components/section-cards";

const DashboardStatCards = () => {
  const items = [
    {
      title: "Total Cafes",
      value: "10",
      percentage: "+10%",
      description: "Active cafe locations across all regions",
    },
    {
      title: "Total Categories",
      value: "100",
      percentage: "10%",
      description: "Menu categories available for cafe products",
    },
    {
      title: "Total Products",
      value: "100",
      percentage: "10%",
      description: "Individual menu items across all cafes",
    },
    {
      title: "Active Products",
      value: "100",
      percentage: "10%",
      description: "Active products across all cafes",
    },
  ];

  return <SectionCards items={items} />;
};

export default DashboardStatCards;
