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
  const t = useTranslations("product.form");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);

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

      if (removeImage) {
        imageUrl = "";
      } else if (imageFile && props.cafeSlug) {
        setIsUploading(true);
        setUploadError(null);

        const uploadResult = await storageRepository.uploadFile(imageFile, props.cafeSlug, BUCKET_NAMES.PRODUCT_IMAGE);

        if (!uploadResult.success) {
          const errorMessage = `${t("uploadFailed")}: ${uploadResult.error?.message || t("operationFailed")}`;
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
      const errorMessage = error instanceof Error ? error.message : t("operationFailed");
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const isAvailable = watch("is_available");

  const handleImageUpload = (file: File | null) => {
    setImageFile(file);
    setRemoveImage(false);
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

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("name")} *</Label>
        <Input id="name" {...register("name")} placeholder={t("namePlaceholder")} className={errors.name ? "border-red-500" : ""} />
        <InputErrorMessage id="name-error">{errors.name?.message}</InputErrorMessage>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("description")}</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder={t("descriptionPlaceholder")}
          rows={3}
          className={errors.description ? "border-red-500" : ""}
        />
        <InputErrorMessage id="description-error">{errors.description?.message}</InputErrorMessage>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">{t("price")}</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0"
          {...register("price", { valueAsNumber: true })}
          placeholder="0.00"
          className={errors.price ? "border-red-500" : ""}
        />
        <InputErrorMessage id="price-error">{errors.price?.message}</InputErrorMessage>
      </div>
      <div className="space-y-2">
        <FilePicker
          id="image"
          label={t("productImage")}
          accept="image/*"
          maxSize={5 * 1024 * 1024} // 5MB
          value={imageFile}
          onChange={handleImageUpload}
          onError={handleImageError}
          disabled={isUploading}
        />
        <InputErrorMessage id="upload-error">{uploadError}</InputErrorMessage>
        {props.mode === "edit" && props.product?.image_url && !imageFile && !removeImage && (
          <div className="flex items-start space-x-2">
            <OptimizedImage
              src={props.product.image_url}
              alt={t("currentProductImage")}
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
        <Switch id="is_available" checked={isAvailable} onCheckedChange={(checked: boolean) => setValue("is_available", checked)} />
        <Label htmlFor="is_available">{t("isAvailable")}</Label>
        <p className="text-xs text-muted-foreground ml-2">{isAvailable ? t("availableDescription") : t("unavailableDescription")}</p>
      </div>
    </form>
  );
});

ProductForm.displayName = "ProductForm";

export default ProductForm;
