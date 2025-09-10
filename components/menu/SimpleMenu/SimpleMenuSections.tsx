"use client";

import { FC } from "react";
import SimpleMenuCategoryHeader from "@/components/menu/SimpleMenu/SimpleMenuCategoryHeader";
import SimpleMenuNullCase from "@/components/menu/SimpleMenu/SimpleMenuNullCase";
import SimpleMenuProduct from "@/components/menu/SimpleMenu/SimpleMenuProduct";

interface PublicProduct {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  is_available: boolean;
}

interface PublicCategory {
  id: number;
  name: string;
  description: string;
  sort_order: number | null;
  products: PublicProduct[];
}

interface Props {
  categories: PublicCategory[];
  currency: string | null;
}

const SimpleMenuSections: FC<Props> = (props = { categories: [], currency: null }) => {
  const activeCategories = props.categories.filter((category) => category.products.length > 0);

  if (activeCategories.length === 0) {
    return <SimpleMenuNullCase />;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 pb-8 mt-8">
      <div className="space-y-12">
        {activeCategories.map((category) => (
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
