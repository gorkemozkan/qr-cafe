"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categoryRepository } from "@/lib/repositories/category-repository";
import { Tables } from "@/types/db";

interface Props {
  id?: string;
  label?: string;
  value?: number;
  onValueChange: (value: number) => void;
  cafeId?: number | null;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  required?: boolean;
}

const CategoryListDropdown = ({
  id,
  label,
  value,
  onValueChange,
  cafeId,
  placeholder = "Select a category",
  disabled = false,
  error,
  className,
  required = false,
}: Props) => {
  const [categories, setCategories] = useState<Tables<"categories">[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      if (!cafeId) {
        setCategories([]);
        return;
      }

      setIsLoading(true);
      try {
        const categoriesData = await categoryRepository.listByCafe(cafeId);
        setCategories(categoriesData);
      } catch (_error) {
        toast.error("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [cafeId]);

  const isDisabled = disabled || !cafeId || isLoading;
  const displayPlaceholder = !cafeId ? "Select a cafe first" : isLoading ? "Loading categories..." : placeholder;

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Select value={value?.toString()} onValueChange={(selectedValue) => onValueChange(Number(selectedValue))} disabled={isDisabled}>
        <SelectTrigger id={id} className={`${error ? "border-red-500" : ""} ${className || ""}`}>
          <SelectValue placeholder={displayPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id.toString()}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default CategoryListDropdown;
