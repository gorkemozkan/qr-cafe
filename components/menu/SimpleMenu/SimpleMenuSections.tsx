"use client";

import { FC } from "react";
import SimpleMenuCategoryHeader from "@/components/menu/SimpleMenu/SimpleMenuCategoryHeader";
import SimpleMenuNullCase from "@/components/menu/SimpleMenu/SimpleMenuNullCase";
import SimpleMenuProduct from "@/components/menu/SimpleMenu/SimpleMenuProduct";

import { PublicCategory } from "@/lib/repositories/public-menu-repository";

interface Props {
  categories: PublicCategory[];
  currency: string | null;
  selectedCategoryId?: number | null;
}

const SimpleMenuSections: FC<Props> = (props = { categories: [], currency: null, selectedCategoryId: null }) => {
  const activeCategories = props.categories.filter((category) => category.products.length > 0);

  // Filter categories based on selected category
  const filteredCategories = props.selectedCategoryId
    ? activeCategories.filter((category) => category.id === props.selectedCategoryId)
    : activeCategories;

  if (filteredCategories.length === 0) {
    return <SimpleMenuNullCase />;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 pb-8 mt-8">
      <div className="space-y-6">
        {filteredCategories.map((category) => (
          <section key={category.id}>
            <SimpleMenuCategoryHeader category={category} />
            <div>
              {category.products.map((product) => (
                <SimpleMenuProduct key={product.id} product={product} currency={props.currency} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};

export default SimpleMenuSections;
