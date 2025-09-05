import { Tables } from "@/types/db";
import { formatPrice } from "@/lib/utils";
import { FC } from "react";

interface Props {
  product: Tables<"products">;
  currency: string | null;
}

const SimpleMenuProduct: FC<Props> = ({ product, currency }) => {
  return (
    <div key={product.id} className={`flex  justify-between py-2 border-b border-gray-200/50 dark:border-gray-200/50 last:border-b-0 ${!product.is_available ? "opacity-60" : ""}`}>
      <div className="flex-1">
        <div className={`flex items-center ${!product.is_available ? "text-muted-foreground line-through" : "text-[#8B1538] dark:text-[#A61E4D]"}`}>
          <div className="flex justify-between items-center w-full">
            <p className="font-semibold flex-shrink-0">{product.name}</p>
            <div className="border-b border-dashed border-gray-200/50 dark:border-gray-200  w-full mx-12 py-1"></div>
            {!!product.price && product.price > 0 && <p className="flex-shrink-0 block">{formatPrice(product.price, currency!)}</p>}
          </div>
        </div>
        {product.description && <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 leading-relaxed font-normal italic">{product.description}</p>}
      </div>
    </div>
  );
};

export default SimpleMenuProduct;
