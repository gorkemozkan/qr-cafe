"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tables } from "@/types/db";
import { CategorySchema, categorySchema } from "@/lib/schema";

export interface CategoryFormRef {
  submitForm: () => void;
  cancelForm: () => void;
}

interface Props {
  mode: "create" | "edit";
  category?: Tables<"categories">;
  onSubmit: (data: CategorySchema) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const CategoryForm = forwardRef<CategoryFormRef, Props>((props, ref) => {
  const t = useTranslations("category");
  const tCommon = useTranslations("common");

  const getDefaultValues = (): CategorySchema => {
    if (props.mode === "edit" && props.category) {
      return {
        name: props.category.name,
        description: props.category.description,
        is_active: props.category.is_active,
        sort_order: props.category.sort_order ?? "",
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
    formState: { errors },
    setValue,
    watch,
  } = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: getDefaultValues(),
  });

  const isActive = watch("is_active");

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      handleSubmit(onSubmitForm)();
    },
    cancelForm: () => {
      props.onCancel?.();
    },
  }));

  const onSubmitForm = async (data: CategorySchema) => {
    // Convert empty string to undefined for sort_order and ensure it's a number
    const processedData = {
      ...data,
      sort_order:
        data.sort_order === ""
          ? undefined
          : typeof data.sort_order === "string"
            ? Number(data.sort_order)
            : data.sort_order,
    };
    await props.onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("form.labels.categoryName")} *</Label>
        <Input
          id="name"
          placeholder={t("form.placeholders.categoryName")}
          {...register("name")}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("form.labels.description")} *</Label>
        <Textarea
          id="description"
          placeholder={t("form.placeholders.description")}
          {...register("description")}
          rows={3}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sort_order">{t("form.labels.sortOrder")}</Label>
        <Input
          id="sort_order"
          type="number"
          placeholder="0"
          {...register("sort_order")}
          className={errors.sort_order ? "border-red-500" : ""}
        />
        {errors.sort_order && <p className="text-sm text-red-500">{errors.sort_order.message}</p>}
        <p className="text-xs text-muted-foreground">{tCommon("optional")}</p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={isActive}
          onCheckedChange={(checked: boolean) => setValue("is_active", checked)}
        />
        <Label htmlFor="is_active">{watch("is_active") ? t("form.status.active") : t("form.status.inactive")}</Label>
        <p className="text-xs text-muted-foreground ml-2">
          {isActive ? t("form.status.activeDescription") : t("form.status.inactiveDescription")}
        </p>
      </div>
    </form>
  );
});

CategoryForm.displayName = "CategoryForm";

export default CategoryForm;
