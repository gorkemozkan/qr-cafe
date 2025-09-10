"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import InputErrorMessage from "@/components/common/InputErrorMessage";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import FilePicker from "@/components/ui/file-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { BUCKET_NAMES } from "@/config";
import { storageRepository } from "@/lib/repositories/storage-repository";
import { type ProductSchema as ProductSchemaType, productSchema } from "@/lib/schema";
import { Tables } from "@/types/db";

export interface ProductFormRef {
  submitForm: () => void;
  cancelForm: () => void;
}

interface Props {
  mode: "create" | "edit";
  cafeSlug: string;
  product?: Tables<"products">;
  categoryId: number;
  onSubmit: (data: ProductSchemaType) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const ProductForm = forwardRef<ProductFormRef, Props>((props, ref) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const t = useTranslations("product");

  const getDefaultValues = (): ProductSchemaType => {
    if (props.mode === "edit" && props.product) {
      return {
        name: props.product.name,
        description: props.product.description || "",
        price: props.product.price || undefined,
        image_url: props.product.image_url || "",
        is_available: props.product.is_available,
        category_id: props.categoryId,
      };
    }

    return {
      name: "",
      description: "",
      price: undefined,
      image_url: "",
      is_available: true,
      category_id: props.categoryId,
    };
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductSchemaType>({
    resolver: zodResolver(productSchema),
    defaultValues: getDefaultValues(),
  });

  // Expose form methods via ref
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      handleSubmit(onSubmitForm)();
    },
    cancelForm: () => {
      props.onCancel?.();
    },
  }));

  const onSubmitForm = async (data: ProductSchemaType) => {
    try {
      let imageUrl = data.image_url;

      if (imageFile && props.cafeSlug) {
        setIsUploading(true);
        setUploadError(null);

        const uploadResult = await storageRepository.uploadFile(imageFile, props.cafeSlug, BUCKET_NAMES.PRODUCT_IMAGE);

        if (!uploadResult.success) {
          const errorMessage = `${t("image.uploadFailed")}: ${uploadResult.error?.message || t("image.operationFailed")}`;
          setUploadError(errorMessage);
          return;
        }

        imageUrl = uploadResult.data.url;
      }

      await props.onSubmit({
        ...data,
        image_url: imageUrl,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("image.operationFailed");
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const isAvailable = watch("is_available");

  const handleImageUpload = (file: File | null) => {
    setImageFile(file);
    setUploadError(null);
  };

  const handleImageError = (error: string) => {
    setUploadError(error);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("form.labels.name")} *</Label>
        <Input id="name" {...register("name")} placeholder={t("form.placeholders.productName")} className={errors.name ? "border-red-500" : ""} />
        <InputErrorMessage id="name-error">{errors.name?.message}</InputErrorMessage>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("form.labels.description")}</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder={t("form.placeholders.productDescription")}
          rows={3}
          className={errors.description ? "border-red-500" : ""}
        />
        <InputErrorMessage id="description-error">{errors.description?.message}</InputErrorMessage>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">{t("form.labels.price")}</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0"
          {...register("price", { valueAsNumber: true })}
          placeholder={t("form.placeholders.price")}
          className={errors.price ? "border-red-500" : ""}
        />
        <InputErrorMessage id="price-error">{errors.price?.message}</InputErrorMessage>
      </div>
      <div className="space-y-2">
        <FilePicker
          id="image"
          label={t("form.labels.image")}
          accept="image/*"
          maxSize={5 * 1024 * 1024} // 5MB
          value={imageFile}
          onChange={handleImageUpload}
          onError={handleImageError}
          disabled={isUploading}
        />
        <InputErrorMessage id="upload-error">{uploadError}</InputErrorMessage>
        {props.mode === "edit" && props.product?.image_url && !imageFile && (
          <div className="flex items-center space-x-2">
            <OptimizedImage
              src={props.product.image_url}
              alt={t("form.image.currentImageAlt")}
              width={48}
              height={48}
              className="h-12 w-12 rounded object-cover"
              fallbackSrc="/placeholder-logo.svg"
              showSkeleton={false}
            />
            <p className="text-sm text-muted-foreground">{t("form.image.currentImageNote")}</p>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="is_available" checked={isAvailable} onCheckedChange={(checked: boolean) => setValue("is_available", checked)} />
        <Label htmlFor="is_available">{t("form.labels.available")}</Label>
        <p className="text-xs text-muted-foreground ml-2">
          {isAvailable ? t("form.status.availableDescription") : t("form.status.unavailableDescription")}
        </p>
      </div>
    </form>
  );
});

ProductForm.displayName = "ProductForm";

export default ProductForm;
