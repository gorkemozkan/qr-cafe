"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tables } from "@/types/db";
import { CategorySchema, categorySchema } from "@/lib/schema";

interface CategoryFormProps {
  mode: "create" | "edit";
  category?: Tables<"categories">;
  onSubmit: (data: CategorySchema) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const CategoryForm = ({ mode, category, onSubmit, onCancel }: CategoryFormProps) => {
  const getDefaultValues = (): CategorySchema => {
    if (mode === "edit" && category) {
      return {
        name: category.name,
        description: category.description,
        is_active: category.is_active,
        sort_order: category.sort_order ?? "",
      };
    }

    return {
      name: "",
      description: "",
      is_active: true,
      sort_order: "",
    };
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: getDefaultValues(),
  });

  const isActive = watch("is_active");

  const onSubmitForm = async (data: CategorySchema) => {
    // Convert empty string to undefined for sort_order and ensure it's a number
    const processedData = {
      ...data,
      sort_order: data.sort_order === "" ? undefined : typeof data.sort_order === "string" ? Number(data.sort_order) : data.sort_order,
    };
    await onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div className="space-y-2 animate-in fade-in-0 slide-in-from-left-2 duration-300 delay-100">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" placeholder="Category name" {...register("name")} className={errors.name ? "border-red-500" : ""} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2 animate-in fade-in-0 slide-in-from-left-2 duration-300 delay-150">
        <Label htmlFor="description">Description *</Label>
        <Textarea id="description" placeholder="Describe this category..." {...register("description")} rows={3} className={errors.description ? "border-red-500" : ""} />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="space-y-2 animate-in fade-in-0 slide-in-from-left-2 duration-300 delay-175">
        <Label htmlFor="sort_order">Sort Order</Label>
        <Input id="sort_order" type="number" placeholder="0" {...register("sort_order")} className={errors.sort_order ? "border-red-500" : ""} />
        {errors.sort_order && <p className="text-sm text-red-500">{errors.sort_order.message}</p>}
        <p className="text-xs text-muted-foreground">Lower numbers appear first. Leave empty for default ordering.</p>
      </div>

      <div className="flex items-center space-x-2 animate-in fade-in-0 slide-in-from-left-2 duration-300 delay-200">
        <Switch id="is_active" checked={isActive} onCheckedChange={(checked: boolean) => setValue("is_active", checked)} />
        <Label htmlFor="is_active">Active</Label>
        <p className="text-xs text-muted-foreground ml-2">{isActive ? "Category is active and visible" : "Category is inactive and hidden"}</p>
      </div>

      <div className="flex justify-end space-x-2 pt-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-250">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="transition-all duration-200 hover:scale-105">
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="min-w-[100px] transition-all duration-200 hover:scale-105">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "create" ? "Creating..." : "Updating..."}
            </>
          ) : mode === "create" ? (
            "Create"
          ) : (
            "Update"
          )}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
