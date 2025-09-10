import { FC, useState } from "react";
import Image from "next/image";
import { PublicCategory } from "@/lib/repositories/public-menu-repository";
import { cn } from "@/lib/utils";

interface Props {
  category: PublicCategory;
}

const SimpleMenuCategoryHeader: FC<Props> = ({ category }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const hasValidImage = category.image_url && !imageError;

  return (
    <div>
      <h2 className="text-xl font-black text-gray-800 ">{category.name.toLocaleUpperCase("tr-TR")}</h2>
      {category.description && <p className="text-gray-500 text-sm">{category.description}</p>}

      <div className="h-54 lg:h-80 w-full bg-gray-100 rounded-lg my-6 overflow-hidden relative">
        {hasValidImage ? (
          <>
            {!imageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />}
            {category.image_url && (
              <Image
                src={category.image_url}
                alt={category.name}
                fill
                className={cn("object-cover rounded-lg transition-opacity duration-300", imageLoaded ? "opacity-100" : "opacity-0")}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={false}
                quality={100}
              />
            )}
          </>
        ) : (
          <div className="h-full w-full bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-[8px] text-center text-muted-foreground">Kategori Görseli Buraya Gelecek</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleMenuCategoryHeader;
