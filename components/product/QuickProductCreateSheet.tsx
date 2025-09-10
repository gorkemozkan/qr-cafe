"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CafeListDropdown from "@/components/cafe/CafeListDropdown";
import CategoryListDropdown from "@/components/category/CategoryListDropdown";
import FormSheet from "@/components/common/FormSheet";
import InputErrorMessage from "@/components/common/InputErrorMessage";
import SubmitButton from "@/components/common/SubmitButton";
import FilePicker from "@/components/ui/file-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { BUCKET_NAMES } from "@/config";
import { cafeRepository } from "@/lib/repositories/cafe-repository";
import { productRepository } from "@/lib/repositories/product-repository";
import { storageRepository } from "@/lib/repositories/storage-repository";
import { type ProductSchema as ProductSchemaType, productSchema } from "@/lib/schema";

interface QuickProductCreateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuickProductCreateSheet = ({ open, onOpenChange }: QuickProductCreateSheetProps) => {
  const [selectedCafeId, setSelectedCafeId] = useState<number | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [uploadError, setUploadError] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const t = useTranslations("product");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<ProductSchemaType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: undefined,
      image_url: "",
      is_available: true,
      category_id: undefined,
    },
  });

  const isAvailable = watch("is_available");

  const selectedCategoryId = watch("category_id");

  const handleCafeChange = (cafeId: number | null) => {
    setSelectedCafeId(cafeId);
    setValue("category_id", undefined as any);
  };

  const handleCategoryChange = (categoryId: number | undefined) => {
    setValue("category_id", categoryId as any);
  };

  const handleImageUpload = (file: File | null) => {
    setImageFile(file);
    setUploadError(null);
  };

  const handleImageError = (error: string) => {
    setUploadError(error);
  };

  const onSubmit = async (data: ProductSchemaType) => {
    if (!selectedCafeId) return toast.error(t("quickCreate.selectCafe"));
    if (!data.category_id) return toast.error(t("quickCreate.selectCategory"));

    try {
      setIsUploading(true);
      setUploadError(null);

      let imageUrl = data.image_url || "";

      if (imageFile) {
        const cafe = await cafeRepository.getById(selectedCafeId);

        if (!cafe) throw new Error(t("quickCreate.cafeNotFound"));

        const uploadResult = await storageRepository.uploadFile(imageFile, cafe.slug, BUCKET_NAMES.PRODUCT_IMAGE);
        if (!uploadResult.success) {
          const errorMessage = `${t("quickCreate.uploadFailed")}: ${uploadResult.error?.message || t("quickCreate.unknownError")}`;
          setUploadError(errorMessage);
          toast.error(errorMessage);
          return;
        }
        imageUrl = uploadResult.data.url;
      }

      await productRepository.create(selectedCafeId, { ...data, image_url: imageUrl });

      toast.success(t("quickCreate.successMessage"));
      onOpenChange(false);
      reset();
      setSelectedCafeId(null);
      setImageFile(null);
      setUploadError(null);

      router.push(`/admin/app/cafe/${selectedCafeId}/categories/${data.category_id}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("quickCreate.failedMessage");
      toast.error(errorMessage);
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  if (!open) return null;

  return (
    <FormSheet
      title={t("quickCreate.title")}
      description={t("quickCreate.description")}
      onOpenChange={onOpenChange}
      footer={
        <SubmitButton
          type="submit"
          form="product-form"
          disabled={isSubmitting || isUploading}
          isLoading={isSubmitting || isUploading}
          text={t("quickCreate.createButton")}
          loadingText={t("quickCreate.creatingButton")}
        />
      }
    >
      <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <CafeListDropdown
          required
          id="cafe"
          label={t("form.labels.cafe")}
          placeholder={t("quickCreate.selectCafePlaceholder")}
          onValueChange={handleCafeChange}
          value={selectedCafeId || undefined}
        />
        <CategoryListDropdown
          id="category"
          label={t("form.labels.category")}
          value={selectedCategoryId || undefined}
          onValueChange={handleCategoryChange}
          cafeId={selectedCafeId}
          placeholder={t("placeholders.selectCategory")}
          error={errors.category_id?.message}
          required
        />
        <div className="space-y-2">
          <Label htmlFor="name">
            {t("form.labels.name")}
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input id="name" {...register("name")} placeholder={t("placeholders.productName")} className={errors.name ? "border-red-500" : ""} />
          <InputErrorMessage>{errors.name?.message}</InputErrorMessage>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">{t("form.labels.description")}</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder={t("placeholders.productDescription")}
            rows={3}
            className={errors.description ? "border-red-500" : ""}
          />
          <InputErrorMessage>{errors.description?.message}</InputErrorMessage>
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">{t("form.labels.price")}</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            {...register("price", {
              valueAsNumber: true,
              setValueAs: (value) => (value === "" ? undefined : parseFloat(value)),
            })}
            placeholder={t("placeholders.price")}
            className={errors.price ? "border-red-500" : ""}
          />
          <InputErrorMessage>{errors.price?.message}</InputErrorMessage>
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
          <InputErrorMessage>{uploadError}</InputErrorMessage>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="is_available" checked={isAvailable} onCheckedChange={(checked: boolean) => setValue("is_available", checked)} />
          <Label htmlFor="is_available">{isAvailable ? t("form.status.active") : t("form.status.inactive")}</Label>
          <p className="text-xs text-muted-foreground ml-2">
            {isAvailable ? t("form.status.activeDescription") : t("form.status.inactiveDescription")}
          </p>
        </div>
      </form>
    </FormSheet>
  );
};

export default QuickProductCreateSheet;
