"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Tables } from "@/types/db";
import { categoryRepository } from "@/lib/repositories/category-repository";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InputErrorMessage from "@/components/common/InputErrorMessage";
import { Button } from "@/components/ui/button";

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
  placeholder,
  disabled = false,
  error,
  className,
  required = false,
}: Props) => {
  const [categories, setCategories] = useState<Tables<"categories">[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("category");
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
        toast.error(t("messages.loadFailed"));
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [cafeId, t]);

  const isDisabled = disabled || !cafeId || isLoading;

  const displayPlaceholder = !cafeId
    ? t("dropdown.selectCafeFirst")
    : isLoading
      ? t("dropdown.loadingCategories")
      : placeholder || t("dropdown.selectCategory");

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
          {categories.length > 0 ? (
            categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-2 space-y-2">
              <p className="text-sm text-muted-foreground text-center">{t("noCategories")}</p>
              <Button asChild variant="secondary" size="sm" className="w-full">
                <Link href={`/admin/app/cafe/${cafeId}/categories`}>Create Category</Link>
              </Button>
            </div>
          )}
        </SelectContent>
      </Select>
      <InputErrorMessage>{error}</InputErrorMessage>
    </div>
  );
};

export default CategoryListDropdown;
