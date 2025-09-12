"use client";

import { FC, useState, useRef, useCallback } from "react";
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
  const isUserScrolling = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCategoryChange = useCallback((categoryId: number | null) => {
    // Mark that this is a user-initiated change, not scroll-triggered
    isUserScrolling.current = true;
    setSelectedCategoryId(categoryId);

    // Clear the scroll flag after a short delay
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrolling.current = false;
    }, 1000); // 1 second delay to prevent immediate auto-activation
  }, []);

  const handleCategoryInView = useCallback(
    (categoryId: number) => {
      // Only auto-activate if user is not currently interacting with tabs
      if (!isUserScrolling.current && selectedCategoryId !== categoryId) {
        setSelectedCategoryId(categoryId);
      }
    },
    [selectedCategoryId],
  );

  return (
    <div className="min-h-screen bg-white text-foreground">
      <div className="max-w-2xl mx-auto px-2 py-6">
        <SimpleMenuHeader logoUrl={props.menu.cafe.logo_url} />
        <SimpleMenuStickyTabs categories={props.menu.categories} onCategoryChange={handleCategoryChange} />
        <SimpleMenuSections
          categories={props.menu.categories}
          currency={props.menu.cafe.currency}
          selectedCategoryId={selectedCategoryId}
          onCategoryInView={handleCategoryInView}
        />
      </div>
      <ScrollToTop />
    </div>
  );
};

export default SimpleMenu;
