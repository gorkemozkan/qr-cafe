"use client";

import ScrollToTop from "@/components/common/ScrollToTop";
import { FC, useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import SimpleMenuHeader from "@/components/menu/SimpleMenu/SimpleMenuHeader";
import SimpleMenuSections from "@/components/menu/SimpleMenu/SimpleMenuSections";
import SimpleMenuStickyTabs from "@/components/menu/SimpleMenu/SimpleMenuStickyTabs";
import AllergenFilter from "@/components/menu/SimpleMenu/AllergenFilter";
import { PublicMenuData, PublicCategory } from "@/lib/repositories/public-menu-repository";

interface Params {
  menu: PublicMenuData;
}

const SimpleMenu: FC<Params> = (props) => {
  const t = useTranslations("menu.allergens");

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);

  const [isAutoActivation, setIsAutoActivation] = useState(false);

  const [hasUserScrolled, setHasUserScrolled] = useState(false);

  const isUserScrolling = useRef(false);

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const orderedCategories = props.menu.categories.sort((a, b) => a.sort_order - b.sort_order);

  // Extract all unique allergens from the menu
  const availableAllergens = useMemo(() => {
    const allergenSet = new Set<string>();
    orderedCategories.forEach((category) => {
      category.products.forEach((product) => {
        if (product.allergens) {
          product.allergens.forEach((allergen) => {
            allergenSet.add(allergen);
          });
        }
      });
    });
    return Array.from(allergenSet).sort();
  }, [orderedCategories]);

  // Filter categories and products based on selected allergens
  const filteredCategories = useMemo<PublicCategory[]>(() => {
    if (selectedAllergens.length === 0) {
      return orderedCategories;
    }

    return orderedCategories
      .map((category) => ({
        ...category,
        products: category.products.filter((product) => {
          if (!product.allergens || product.allergens.length === 0) {
            return true; // Show products with no allergens
          }
          // Hide product if it contains any of the selected allergens
          return !product.allergens.some((allergen) => selectedAllergens.includes(allergen));
        }),
      }))
      .filter((category) => category.products.length > 0); // Remove empty categories
  }, [orderedCategories, selectedAllergens]);

  const toggleAllergen = useCallback((allergen: string) => {
    setSelectedAllergens((prev) =>
      prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen],
    );
  }, []);

  const clearAllAllergens = useCallback(() => {
    setSelectedAllergens([]);
  }, []);

  const hasFilteredEverythingOut = selectedAllergens.length > 0 && filteredCategories.length === 0;

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
        {/* No allergens anywhere on the menu means nothing to filter by. */}
        {availableAllergens.length > 0 && (
          <div className="mb-2 flex justify-end">
            <AllergenFilter
              availableAllergens={availableAllergens}
              selectedAllergens={selectedAllergens}
              onToggleAllergen={toggleAllergen}
              onClearAll={clearAllAllergens}
            />
          </div>
        )}
        {hasFilteredEverythingOut ? (
          /* Without this the menu falls through to SimpleMenuNullCase, which says
             "Menu Coming Soon" - misleading when the viewer's own filter hid it. */
          <div className="py-16 text-center">
            <h3 className="mb-2 text-xl font-light text-[#8B1538] dark:text-[#A61E4D]">{t("emptyTitle")}</h3>
            <p className="mb-6 text-muted-foreground">{t("emptyDescription")}</p>
            <button
              type="button"
              onClick={clearAllAllergens}
              className="rounded-full bg-[#8B1538] px-4 py-2 text-sm font-medium text-white transition-opacity duration-200 hover:opacity-90"
            >
              {t("emptyAction")}
            </button>
          </div>
        ) : (
          <>
            <SimpleMenuStickyTabs
              categories={filteredCategories}
              selectedCategoryId={selectedCategoryId}
              isAutoActivation={isAutoActivation}
              onCategoryChange={handleCategoryChange}
            />
            <SimpleMenuSections
              categories={filteredCategories}
              currency={props.menu.cafe.currency}
              onCategoryInView={handleCategoryInView}
            />
          </>
        )}
      </div>
      <ScrollToTop />
    </div>
  );
};

export default SimpleMenu;
