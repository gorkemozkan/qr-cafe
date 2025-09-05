"use client";

import { FC } from "react";
import { Tables } from "@/types/db";

interface PublicCategory extends Tables<"categories"> {
  products: Tables<"products">[];
}

interface Props {
  categories: PublicCategory[];
}

const MenuSections: FC<Props> = ({ categories }) => {
  // Filter out categories with no products
  const activeCategories = categories.filter((category) => category.products.length > 0);

  if (activeCategories.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 pb-8 mt-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4 text-[#8B1538]/20 dark:text-[#8B1538]/40">🍽️</div>
          <h3 className="text-2xl font-light text-[#8B1538] dark:text-[#A61E4D] mb-2">Menu Coming Soon</h3>
          <p className="text-muted-foreground">We're preparing something delicious for you!</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 pb-8 mt-8">
      <div className="space-y-12">
        {activeCategories.map((category, categoryIndex) => (
          <section
            key={category.id}
            className="animate-in fade-in-50 slide-in-from-bottom-3 duration-700"
            style={{
              animationDelay: `${categoryIndex * 200}ms`,
            }}
          >
            {/* Category Header */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-black text-[#8B1538] dark:text-[#A61E4D] uppercase tracking-wide border-b border-[#8B1538]/10 dark:border-[#A61E4D]/20 pb-3 mb-4">
                {category.name.toLocaleUpperCase("tr-TR")}
              </h2>
            </div>

            {/* Products List */}
            <div className="space-y-3">
              {category.products.map((product) => (
                <div
                  key={product.id}
                  className={`flex items-start justify-between py-2 border-b border-gray-200/50 dark:border-gray-700/50 last:border-b-0 ${!product.is_available ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center ">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className={`flex items-center ${!product.is_available ? "text-muted-foreground line-through" : "text-[#8B1538] dark:text-[#A61E4D]"}`}>
                          <p className="font-bold">{product.name}</p>
                        </div>
                        {product.description && <p className="text-[#8B1538]/50 dark:text-[#A61E4D]/70 text-xs mt-1 leading-relaxed font-medium italic">{product.description}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State for Category */}
            {category.products.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground italic">No items available in this category at the moment.</p>
              </div>
            )}
          </section>
        ))}
      </div>
    </main>
  );
};

export default MenuSections;
