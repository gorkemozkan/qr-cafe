"use client";

import { FC } from "react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Clock, Flame, AlertTriangle, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DateView from "@/components/common/DateView";
import { useTranslations } from "next-intl";

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
  allergens: string[] | null;
  updated_at: string | null;
}

interface Props {
  product: PublicProduct;
  currency: string | null;
}

const SimpleMenuProduct: FC<Props> = ({ product, currency }) => {
  const t = useTranslations("common");

  // Handle edge cases for updated_at
  const hasValidUpdateDate = product.updated_at && product.updated_at !== "null" && product.updated_at !== "";

  return (
    <article
      key={product.id}
      className={`flex justify-between border-b py-6 border-gray-300/50 dark:border-gray-300/50 ${!product.is_available ? "opacity-60" : ""}`}
      itemScope
      itemType="https://schema.org/Product"
      aria-label={`${product.name}${product.description ? ` - ${product.description}` : ""}`}
    >
      <div className="flex-1">
        <div
          className={`flex items-center ${!product.is_available ? "text-muted-foreground line-through" : "text-gray-800 "}`}
        >
          <div className="flex justify-between items-start w-full gap-4 ">
            <div>
              <div className="flex items-start gap-2 mb-2">
                <h3 className="font-semibold flex-shrink-0 text-gray-900" itemProp="name">
                  {product.name}
                </h3>
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
                <p
                  className="text-gray-600 dark:text-gray-400 text-sm mt-2 leading-relaxed font-normal italic"
                  itemProp="description"
                >
                  {product.description}
                </p>
              )}
              {!!product.price && product.price > 0 && currency && (
                <div className="text-md w-max flex-shrink-0 text-gray-800 font-black mt-1">
                  <span itemProp="offers" itemScope itemType="https://schema.org/Offer" className="sr-only">
                    <span itemProp="price" content={product.price.toString()}></span>
                    <span itemProp="priceCurrency" content={currency}></span>
                    <span
                      itemProp="availability"
                      content={product.is_available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"}
                    ></span>
                  </span>
                  <span>{formatPrice(product.price, currency)}</span>
                </div>
              )}
              {(product.calory && product.calory > 0) || (product.preparation_time && product.preparation_time > 0) ? (
                <fieldset className="flex items-center gap-2.5 mt-3">
                  <legend className="sr-only">Product nutritional and preparation information</legend>
                  {product.calory && product.calory > 0 && (
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-orange-200/60 dark:border-orange-800/40 shadow-sm transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md hover:border-orange-300/70 dark:hover:border-orange-700/60"
                      role="img"
                      aria-label={`Calories: ${product.calory} kilocalories`}
                    >
                      <Flame
                        className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400 transition-colors duration-200"
                        aria-hidden="true"
                      />
                      <span className="text-xs font-semibold text-orange-700 dark:text-orange-300 transition-colors duration-200">
                        {product.calory} kcal
                      </span>
                    </div>
                  )}

                  {product.preparation_time && product.preparation_time > 0 && (
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-200/60 dark:border-blue-800/40 shadow-sm transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md hover:border-blue-300/70 dark:hover:border-blue-700/60"
                      role="img"
                      aria-label={`Preparation time: ${product.preparation_time} minutes`}
                    >
                      <Clock
                        className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 transition-colors duration-200"
                        aria-hidden="true"
                      />
                      <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 transition-colors duration-200">
                        {product.preparation_time} dk
                      </span>
                    </div>
                  )}
                </fieldset>
              ) : null}
              {product.allergens && product.allergens.length > 0 && (
                <div className="mt-3" role="alert" aria-live="polite">
                  <div className="flex items-start gap-2">
                    <AlertTriangle
                      className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                      role="img"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">
                        {t("containsAllergens")}:
                      </p>
                      <ul className="flex flex-wrap gap-1.5 list-none">
                        {product.allergens.map((allergen) => (
                          <li key={allergen}>
                            <Badge
                              variant="destructive"
                              className="text-xs px-2 py-0.5 rounded-full"
                              aria-label={`Allergen: ${allergen}`}
                            >
                              {allergen}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              {hasValidUpdateDate && (
                <div className="mt-3">
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200/60 dark:border-gray-700/40 shadow-sm transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md hover:border-gray-300/70 dark:hover:border-gray-600/60"
                    role="img"
                    aria-label={`Last updated: ${product.updated_at ? new Date(product.updated_at).toLocaleDateString() : "Unknown"}`}
                  >
                    <Calendar
                      className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 transition-colors duration-200"
                      aria-hidden="true"
                    />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 transition-colors duration-200">
                      {t("lastUpdated")}:{" "}
                      {product.updated_at && <DateView date={product.updated_at} format="relative" />}
                    </span>
                  </div>
                </div>
              )}
            </div>
            {product.image_url && (
              <div className="h-32 w-32 bg-gray-100 rounded-lg my-6 overflow-hidden relative flex-shrink-0">
                <Image
                  src={product.image_url}
                  alt={`${product.name} ${t("productImage")}`}
                  fill
                  className={cn("object-cover rounded-lg transition-opacity duration-300")}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={false}
                  quality={100}
                  itemProp="image"
                  onError={(e) => {
                    // Handle image loading errors gracefully
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default SimpleMenuProduct;
