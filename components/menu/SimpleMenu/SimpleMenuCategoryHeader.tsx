import { FC } from "react";
import Image from "next/image";
import { PublicCategory } from "@/lib/repositories/public-menu-repository";
import { cn } from "@/lib/utils";

interface Props {
  category: PublicCategory;
}

const SimpleMenuCategoryHeader: FC<Props> = ({ category }) => {
  return (
    <div>
      <div className="border-b border-gray-300/50 dark:border-gray-300/50 pb-2">
        <h2 className="text-2xl font-black text-gray-800 ">{category.name.toLocaleUpperCase("tr-TR")}</h2>
        {category.description && <p className="text-gray-600 text-sm mt-0.5">{category.description}</p>}
      </div>
      {category.image_url && (
        <div className="h-54 lg:h-80 w-full bg-gray-100 rounded-lg my-6 overflow-hidden relative">
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            className={cn("object-cover rounded-lg transition-opacity duration-300")}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
            quality={100}
          />
        </div>
      )}
    </div>
  );
};

export default SimpleMenuCategoryHeader;
