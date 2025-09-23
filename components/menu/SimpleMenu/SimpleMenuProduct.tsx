"use client";

import { FC } from "react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Clock, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PublicProduct {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  is_available: boolean;
  calory: number | null;
  preparation_time: number | null;
  tags: string[] | null;
}

interface Props {
  product: PublicProduct;
  currency: string | null;
}

const SimpleMenuProduct: FC<Props> = ({ product, currency }) => {
  const getTagVariant = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "new":
        return "default";
      case "favorites":
        return "secondary";
      case "chef special":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getTagStyle = (tag: string) => {
    const predefinedTags = ["new", "favorites", "chef special"];
    const isPredefined = predefinedTags.includes(tag.toLowerCase());
    
    if (isPredefined) {
      return "";
    }
    
    // Custom tags get a special style
    return "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700";
  };

  return (
    <div
      key={product.id}
      className={`flex justify-between border-b py-6 border-gray-300/50 dark:border-gray-300/50 ${!product.is_available ? "opacity-60" : ""}`}
    >
      <div className="flex-1">
        <div
          className={`flex items-center ${!product.is_available ? "text-muted-foreground line-through" : "text-gray-800 "}`}
        >
          <div className="flex justify-between items-start w-full gap-4 ">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold flex-shrink-0">{product.name}</p>
                {product.tags && product.tags.length > 0 && (
                  <div className="flex gap-1">
                    {product.tags.map((tag) => {
                      const predefinedTags = ["new", "favorites", "chef special"];
                      const isPredefined = predefinedTags.includes(tag.toLowerCase());
                      
                      return (
                        <Badge
                          key={tag}
                          variant={isPredefined ? getTagVariant(tag) as any : "outline"}
                          className={`text-xs ${!isPredefined ? getTagStyle(tag) : ""}`}
                        >
                          {tag}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
              {product.description && (
                <p className="text-gray-500  text-xs mt-1 leading-relaxed font-normal italic">{product.description}</p>
              )}
              {!!product.price && product.price > 0 && currency && (
                <p className="text-md w-max flex-shrink-0  text-gray-800 font-black mt-1">
                  {formatPrice(product.price, currency)}
                </p>
              )}
              {(product.calory && product.calory > 0) || (product.preparation_time && product.preparation_time > 0) ? (
                <div className="flex items-center gap-3 mt-3">
                  {product.calory && product.calory > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 dark:bg-orange-950/20 rounded-full border border-orange-200/50 dark:border-orange-800/30 transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-sm">
                      <Flame className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400 transition-colors duration-200" />
                      <span className="text-xs font-medium text-orange-700 dark:text-orange-300 transition-colors duration-200">
                        {product.calory} kcal
                      </span>
                    </div>
                  )}

                  {product.preparation_time && product.preparation_time > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/20 rounded-full border border-blue-200/50 dark:border-blue-800/30 transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-sm">
                      <Clock className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 transition-colors duration-200" />
                      <span className="text-xs font-medium text-blue-700 dark:text-blue-300 transition-colors duration-200">
                        {product.preparation_time} dk
                      </span>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            {product.image_url && (
              <div className="h-32 w-32 bg-gray-100 rounded-lg my-6 overflow-hidden relative flex-shrink-0">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className={cn("object-cover rounded-lg transition-opacity duration-300")}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={false}
                  quality={100}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMenuProduct;
