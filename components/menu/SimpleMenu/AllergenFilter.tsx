"use client";

import { FC, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, X } from "lucide-react";

interface AllergenFilterProps {
  availableAllergens: string[];
  selectedAllergens: string[];
  onToggleAllergen: (allergen: string) => void;
  onClearAll: () => void;
}

const AllergenFilter: FC<AllergenFilterProps> = ({
  availableAllergens,
  selectedAllergens,
  onToggleAllergen,
  onClearAll,
}) => {
  const t = useTranslations("menu.allergens");

  const [isOpen, setIsOpen] = useState(false);

  const hasFilters = selectedAllergens.length > 0;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {/* Matches the pill treatment of SimpleMenuStickyTabs so the filter reads
            as part of the same control row rather than a stray form button. */}
        <button
          type="button"
          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
            hasFilters
              ? "bg-[#8B1538] text-white"
              : "border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          {t("trigger")}
          {hasFilters && (
            <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs tabular-nums">
              {selectedAllergens.length}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent side="bottom" className="max-h-[70vh] overflow-y-auto rounded-t-2xl">
        <SheetHeader className="text-left">
          <SheetTitle className="text-lg font-medium">{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-8">
          <div className="flex flex-wrap gap-2">
            {availableAllergens.map((allergen) => {
              const isSelected = selectedAllergens.includes(allergen);

              return (
                <button
                  key={allergen}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onToggleAllergen(allergen)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    isSelected
                      ? "bg-[#8B1538] text-white"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {allergen}
                  {isSelected && <X className="h-3.5 w-3.5" />}
                </button>
              );
            })}
          </div>

          {hasFilters && (
            <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4">
              <p className="text-sm text-muted-foreground">{t("hiding", { list: selectedAllergens.join(", ") })}</p>
              <Button variant="ghost" size="sm" className="shrink-0" onClick={onClearAll}>
                {t("clear")}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AllergenFilter;
