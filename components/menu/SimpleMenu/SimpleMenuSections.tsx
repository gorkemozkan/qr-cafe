"use client";

import { FC } from "react";
import SimpleMenuProduct from "@/components/menu/SimpleMenu/SimpleMenuProduct";
import SimpleMenuNullCase from "@/components/menu/SimpleMenu/SimpleMenuNullCase";
import SimpleMenuCategoryHeader from "@/components/menu/SimpleMenu/SimpleMenuCategoryHeader";

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

const SimpleMenuSections: FC<Props> = ({ categories, currency }) => {
  const activeCategories = categories.filter((category) => category.products.length > 0);

  if (activeCategories.length === 0) {
    return <SimpleMenuNullCase />;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 pb-8 mt-8">
      <div className="space-y-12">
        {activeCategories.map((category) => (
          <section key={category.id}>
            <SimpleMenuCategoryHeader categorName={category.name} />
            <div className="space-y-3">
              {category.products.map((product) => (
                <SimpleMenuProduct key={product.id} product={product} currency={currency} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};

export default SimpleMenuSections;
