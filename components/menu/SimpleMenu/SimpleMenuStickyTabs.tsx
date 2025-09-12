"use client";

import { FC, useState } from "react";
import { PublicCategory } from "@/lib/repositories/public-menu-repository";

interface Props {
  categories: PublicCategory[];
  onCategoryChange?: (categoryId: number | null) => void;
}

const SimpleMenuStickyTabs: FC<Props> = ({ categories, onCategoryChange }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const activeCategories = categories.filter((category) => category.products.length > 0);

  const handleTabChange = (value: string) => {
    const categoryId = value === "all" ? null : parseInt(value);
    setSelectedCategoryId(categoryId);
    onCategoryChange?.(categoryId);
  };

  if (activeCategories.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-2xl mx-auto px-2 py-2">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-1 pb-1">
            <button
              type="button"
              onClick={() => handleTabChange("all")}
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                selectedCategoryId === null ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Tümü
            </button>
            {activeCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleTabChange(category.id.toString())}
                className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                  selectedCategoryId === category.id ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
