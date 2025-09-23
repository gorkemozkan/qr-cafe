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
              <div className="flex items-start gap-2 mb-2">
                <p className="font-semibold flex-shrink-0 text-gray-900">{product.name}</p>
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-0.5">
                    {product.tags.map((tag) => {
                      return (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className={`text-xs px-2 py-0.5 rounded-full transition-all duration-200 hover:scale-105`}
                        >
                          {tag}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
              {product.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 leading-relaxed font-normal italic">
                  {product.description}
                </p>
              )}
              {!!product.price && product.price > 0 && currency && (
                <p className="text-md w-max flex-shrink-0  text-gray-800 font-black mt-1">
                  {formatPrice(product.price, currency)}
                </p>
              )}
              {(product.calory && product.calory > 0) || (product.preparation_time && product.preparation_time > 0) ? (
                <div className="flex items-center gap-2.5 mt-3">
                  {product.calory && product.calory > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5  rounded-full border border-orange-200/60 dark:border-orange-800/40 shadow-sm transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md hover:border-orange-300/70 dark:hover:border-orange-700/60">
                      <Flame className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400 transition-colors duration-200" />
                      <span className="text-xs font-semibold text-orange-700 dark:text-orange-300 transition-colors duration-200">
                        {product.calory} kcal
                      </span>
                    </div>
                  )}

                  {product.preparation_time && product.preparation_time > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-200/60 dark:border-blue-800/40 shadow-sm transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md hover:border-blue-300/70 dark:hover:border-blue-700/60">
                      <Clock className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 transition-colors duration-200" />
                      <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 transition-colors duration-200">
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
