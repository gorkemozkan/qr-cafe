"use client";

import { FC, useState } from "react";
import ScrollToTop from "@/components/common/ScrollToTop";
import SimpleMenuHeader from "@/components/menu/SimpleMenu/SimpleMenuHeader";
import SimpleMenuSections from "@/components/menu/SimpleMenu/SimpleMenuSections";
import SimpleMenuStickyTabs from "@/components/menu/SimpleMenu/SimpleMenuStickyTabs";
import { PublicMenuData } from "@/lib/repositories/public-menu-repository";

interface Params {
  menu: PublicMenuData;
}

const SimpleMenu: FC<Params> = (props) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <div className="min-h-screen bg-white text-foreground">
      <div className="max-w-2xl mx-auto px-2 py-6">
        <SimpleMenuHeader logoUrl={props.menu.cafe.logo_url} />
        <SimpleMenuStickyTabs categories={props.menu.categories} onCategoryChange={handleCategoryChange} />
        <SimpleMenuSections categories={props.menu.categories} currency={props.menu.cafe.currency} selectedCategoryId={selectedCategoryId} />
      </div>
      <ScrollToTop />
    </div>
  );
};

export default SimpleMenu;
