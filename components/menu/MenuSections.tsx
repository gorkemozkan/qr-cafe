import { FC } from "react";
import MenuSection from "@/components/menu/MenuSection";
import { Tables } from "@/types/db";

interface PublicCategory extends Tables<"categories"> {
  products: Tables<"products">[];
}

interface Props {
  categories: PublicCategory[];
}

const MenuSections: FC<Props> = (props) => {
  const { categories } = props;

  return (
    <main className="max-w-5xl mx-auto px-4 pb-6 sm:pb-8 mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {categories.map((category) => (
          <MenuSection key={category.id} title={category.name} items={category.products.map((product) => product.name)} />
        ))}
      </div>
    </main>
  );
};

export default MenuSections;
