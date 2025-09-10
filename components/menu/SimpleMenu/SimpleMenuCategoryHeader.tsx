import { FC } from "react";
import { PublicCategory } from "@/lib/repositories/public-menu-repository";

interface Props {
  category: PublicCategory;
}

const SimpleMenuCategoryHeader: FC<Props> = ({ category }) => {
  return (
    <div>
      <h2 className="text-xl font-black text-gray-800 dark:text-gray-400">{category.name.toLocaleUpperCase("tr-TR")}</h2>
      {category.description && <p className="text-gray-500 dark:text-gray-400 text-sm">{category.description}</p>}
      <div className="h-54 w-full bg-gray-100 rounded-lg my-6 flex items-center justify-center">Kategori Görseli Buraya Gelecek </div>
    </div>
  );
};

export default SimpleMenuCategoryHeader;
