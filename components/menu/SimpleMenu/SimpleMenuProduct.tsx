"use client";

import { FC } from "react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface PublicProduct {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  is_available: boolean;
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
        <div className={`flex items-center ${!product.is_available ? "text-muted-foreground line-through" : "text-gray-800 "}`}>
          <div className="flex justify-between items-start w-full gap-4 ">
            <div>
              <p className="font-semibold flex-shrink-0">{product.name}</p>

              {product.description && <p className="text-gray-500  text-xs mt-1 leading-relaxed font-normal italic">{product.description}</p>}
              {!!product.price && product.price > 0 && currency && (
                <p className="text-md w-max flex-shrink-0  text-gray-800 font-black mt-1">{formatPrice(product.price, currency)}</p>
              )}
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
