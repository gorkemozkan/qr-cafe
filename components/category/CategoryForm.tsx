"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import InputErrorMessage from "@/components/common/InputErrorMessage";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import FilePicker from "@/components/ui/file-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { BUCKET_NAMES } from "@/config";
import { storageRepository } from "@/lib/repositories/storage-repository";
import { CategorySchema, categorySchema } from "@/lib/schema";
import { Tables } from "@/types/db";

export interface CategoryFormRef {
  submitForm: () => void;
  cancelForm: () => void;
}

interface Props {
  mode: "create" | "edit";
  cafeSlug: string;
  category?: Tables<"categories">;
  onSubmit: (data: CategorySchema) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const CategoryForm = forwardRef<CategoryFormRef, Props>((props, ref) => {
  const t = useTranslations("category.form");

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [uploadError, setUploadError] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const [removeImage, setRemoveImage] = useState(false);

  const getDefaultValues = (): CategorySchema => {
    if (props.mode === "edit" && props.category) {
      return {
        name: props.category.name,
        description: props.category.description,
        image_url: props.category.image_url || "",
        is_active: props.category.is_active,
        sort_order: props.category.sort_order ?? "",
      };
    }

    return {
      name: "",
      description: "",
      image_url: "",
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

  const handleImageUpload = (file: File | null) => {
    setImageFile(file);
    setRemoveImage(false); // Reset remove state when a new file is selected
    setUploadError(null);
  };

  const handleImageError = (error: string) => {
    setUploadError(error);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setRemoveImage(true);
    setUploadError(null);
  };

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      handleSubmit(onSubmitForm)();
    },
    cancelForm: () => {
      props.onCancel?.();
    },
  }));

  const onSubmitForm = async (data: CategorySchema) => {
    try {
      let imageUrl = data.image_url;

      if (removeImage) {
        imageUrl = "";
      } else if (imageFile && props.cafeSlug) {
        setIsUploading(true);
        setUploadError(null);

        const uploadResult = await storageRepository.uploadFile(imageFile, props.cafeSlug, BUCKET_NAMES.CATEGORY_IMAGE);

        if (!uploadResult.success) {
          const errorMessage = `${t("uploadFailed")}: ${uploadResult.error?.message || t("operationFailed")}`;
          setUploadError(errorMessage);
          return;
        }

        imageUrl = uploadResult.data.url;
      }

      const processedData = {
        ...data,
        image_url: imageUrl,
        sort_order: data.sort_order === "" ? undefined : typeof data.sort_order === "string" ? Number(data.sort_order) : data.sort_order,
      };
      await props.onSubmit(processedData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("operationFailed");
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("name")} *</Label>
        <Input id="name" placeholder={t("namePlaceholder")} {...register("name")} className={errors.name ? "border-red-500" : ""} />
        <InputErrorMessage id="name-error">{errors.name?.message}</InputErrorMessage>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">{t("description")} *</Label>
        <Textarea
          id="description"
          placeholder={t("descriptionPlaceholder")}
          {...register("description")}
          rows={3}
          className={errors.description ? "border-red-500" : ""}
        />
        <InputErrorMessage id="description-error">{errors.description?.message}</InputErrorMessage>
      </div>
      <div className="space-y-2">
        <Label htmlFor="sort_order">{t("sortOrder")}</Label>
        <Input id="sort_order" type="number" placeholder="0" {...register("sort_order")} className={errors.sort_order ? "border-red-500" : ""} />
        <InputErrorMessage id="sort_order-error">{errors.sort_order?.message}</InputErrorMessage>
        <p className="text-xs text-muted-foreground">{t("optional")}</p>
      </div>
      <div className="space-y-2">
        <FilePicker
          id="image"
          label={t("categoryImage")}
          accept="image/*"
          maxSize={5 * 1024 * 1024} // 5MB
          value={imageFile}
          onChange={handleImageUpload}
          onError={handleImageError}
          disabled={isUploading}
        />
        <InputErrorMessage id="upload-error">{uploadError}</InputErrorMessage>
        {props.mode === "edit" && props.category?.image_url && !imageFile && !removeImage && (
          <div className="flex items-start space-x-2">
            <OptimizedImage
              src={props.category.image_url}
              alt={t("currentCategoryImage")}
              width={48}
              height={48}
              className="h-12 w-12 rounded object-cover"
              fallbackSrc="/placeholder-logo.svg"
              showSkeleton={false}
            />
            <div className="flex items-start">
              <p className="text-sm text-muted-foreground">{t("currentImageText")}</p>
              <Button type="button" variant="outline" size="sm" onClick={handleRemoveImage}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="is_active" checked={isActive} onCheckedChange={(checked: boolean) => setValue("is_active", checked)} />
        <Label htmlFor="is_active">{watch("is_active") ? t("isActive") : t("isInactive")}</Label>
        <p className="text-xs text-muted-foreground ml-2">{isActive ? t("activeDescription") : t("inactiveDescription")}</p>
      </div>
    </form>
  );
});

CategoryForm.displayName = "CategoryForm";

export default CategoryForm;
