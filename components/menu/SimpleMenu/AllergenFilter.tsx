"use client";

import { FC, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter, X } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);

  const hasFilters = selectedAllergens.length > 0;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filter Allergens
          {hasFilters && (
            <span className="ml-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
              {selectedAllergens.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[400px]">
        <SheetHeader>
          <SheetTitle>Filter by Allergens</SheetTitle>
          <SheetDescription>
            Select allergens to exclude from your menu view. Products containing these allergens will be hidden.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {hasFilters && (
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Active Filters</p>
              <Button variant="ghost" size="sm" onClick={onClearAll}>
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
          )}

          {availableAllergens.length === 0 ? (
            <p className="text-sm text-muted-foreground">No allergens found in the menu.</p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Available Allergens:</p>
              <div className="flex flex-wrap gap-2">
                {availableAllergens.map((allergen) => {
                  const isSelected = selectedAllergens.includes(allergen);
                  return (
                    <Badge
                      key={allergen}
                      variant={isSelected ? "destructive" : "outline"}
                      className="cursor-pointer hover:opacity-80 transition-all duration-200 text-sm py-2 px-3"
                      onClick={() => onToggleAllergen(allergen)}
                    >
                      {allergen}
                      {isSelected && <X className="h-3 w-3 ml-1" />}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {hasFilters && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Hiding products containing: {selectedAllergens.join(", ")}
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AllergenFilter;
