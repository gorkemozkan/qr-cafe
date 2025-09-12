"use client";

import { FC, useRef, useEffect } from "react";
import { PublicCategory } from "@/lib/repositories/public-menu-repository";

interface Props {
  categories: PublicCategory[];
  selectedCategoryId?: number | null;
  isAutoActivation?: boolean;
  onCategoryChange?: (categoryId: number | null) => void;
}

const SimpleMenuStickyTabs: FC<Props> = ({
  categories,
  selectedCategoryId: externalSelectedCategoryId,
  isAutoActivation = false,
  onCategoryChange,
}) => {
  const activeCategories = categories.filter((category) => category.products.length > 0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<number | string, HTMLButtonElement>>(new Map());

  const handleTabChange = (value: string) => {
    const categoryId = value === "all" ? null : parseInt(value);
    onCategoryChange?.(categoryId);
  };

  // Scroll active tab into view when it changes due to auto-activation
  useEffect(() => {
    if (!isAutoActivation || !scrollContainerRef.current) return;

    const activeTabKey = externalSelectedCategoryId === null ? "all" : externalSelectedCategoryId;
    const activeTab = tabRefs.current.get(activeTabKey as string | number);

    if (activeTab && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const tabRect = activeTab.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const tabLeft = tabRect.left - containerRect.left + container.scrollLeft;
      const tabRight = tabLeft + tabRect.width;
      const containerWidth = containerRect.width;

      if (tabLeft < container.scrollLeft || tabRight > container.scrollLeft + containerWidth) {
        const scrollTo = tabLeft - containerWidth / 2 + tabRect.width / 2;
        container.scrollTo({
          left: Math.max(0, scrollTo),
          behavior: "smooth",
        });
      }
    }
  }, [externalSelectedCategoryId, isAutoActivation]);

  if (activeCategories.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-2xl mx-auto px-2 py-2">
        <div ref={scrollContainerRef} className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-1 pb-1">
            <button
              ref={(el) => {
                if (el) tabRefs.current.set("all", el);
              }}
              type="button"
              onClick={() => handleTabChange("all")}
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                externalSelectedCategoryId === null ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Tümü
            </button>
            {activeCategories.map((category) => (
              <button
                key={category.id}
                ref={(el) => {
                  if (el) tabRefs.current.set(category.id, el);
                }}
                type="button"
                onClick={() => handleTabChange(category.id.toString())}
                className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                  externalSelectedCategoryId === category.id ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMenuStickyTabs;
