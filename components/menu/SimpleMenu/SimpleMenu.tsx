"use client";

import ScrollToTop from "@/components/common/ScrollToTop";
import { FC, useState, useRef, useCallback, useEffect } from "react";
import SimpleMenuHeader from "@/components/menu/SimpleMenu/SimpleMenuHeader";
import SimpleMenuSections from "@/components/menu/SimpleMenu/SimpleMenuSections";
import SimpleMenuStickyTabs from "@/components/menu/SimpleMenu/SimpleMenuStickyTabs";
import { PublicMenuData } from "@/lib/repositories/public-menu-repository";

interface Params {
  menu: PublicMenuData;
}

const SimpleMenu: FC<Params> = (props) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const [isAutoActivation, setIsAutoActivation] = useState(false);

  const [hasUserScrolled, setHasUserScrolled] = useState(false);

  const isUserScrolling = useRef(false);

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const orderedCategories = props.menu.categories.sort((a, b) => a.sort_order - b.sort_order);

  const scrollToCategory = useCallback((categoryId: number | null) => {
    if (categoryId === null) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const categoryElement = document.querySelector(`[data-category-id="${categoryId}"]`);
    if (categoryElement) {
      const headerOffset = 120;
      const elementPosition = categoryElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, []);

  const handleCategoryChange = useCallback(
    (categoryId: number | null) => {
      isUserScrolling.current = true;
      setIsAutoActivation(false);
      setSelectedCategoryId(categoryId);

      if (!hasUserScrolled) {
        setHasUserScrolled(true);
      }

      scrollToCategory(categoryId);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrolling.current = false;
      }, 1000);
    },
    [hasUserScrolled, scrollToCategory],
  );

  const handleCategoryInView = useCallback(
    (categoryId: number) => {
      if (hasUserScrolled && !isUserScrolling.current && selectedCategoryId !== categoryId) {
        setIsAutoActivation(true);
        setSelectedCategoryId(categoryId);
      }
    },
    [selectedCategoryId, hasUserScrolled],
  );

  useEffect(() => {
    if (isAutoActivation) {
      const timeout = setTimeout(() => {
        setIsAutoActivation(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isAutoActivation]);

  useEffect(() => {
    const handleScroll = () => {
      if (!hasUserScrolled) {
        setHasUserScrolled(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasUserScrolled]);

  return (
    <div className="min-h-screen bg-white text-foreground">
      <div className="max-w-2xl mx-auto px-2 py-6">
        <SimpleMenuHeader logoUrl={props.menu.cafe.logo_url} />
        <SimpleMenuStickyTabs
          categories={orderedCategories}
          selectedCategoryId={selectedCategoryId}
          isAutoActivation={isAutoActivation}
          onCategoryChange={handleCategoryChange}
        />
        <SimpleMenuSections categories={orderedCategories} currency={props.menu.cafe.currency} onCategoryInView={handleCategoryInView} />
      </div>
      <ScrollToTop />
    </div>
  );
};

export default SimpleMenu;
