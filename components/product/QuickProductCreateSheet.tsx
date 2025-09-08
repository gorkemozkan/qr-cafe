"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { productSchema, type ProductSchema as ProductSchemaType } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import FormSheet from "@/components/FormSheet";

import { CategoryListDropdown } from "@/components/ui/category-list-dropdown";
import { productRepository } from "@/lib/repositories/product-repository";
import { storageRepository } from "@/lib/repositories";
import FilePicker from "@/components/ui/file-picker";
import { BUCKET_NAMES } from "@/config";
import { Tables } from "@/types/db";
import { toast } from "sonner";
import CafeListDropdown from "@/components/cafe/CafeListDropdown";
import SubmitButton from "@/components/SubmitButton";

interface QuickProductCreateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuickProductCreateSheet = ({ open, onOpenChange }: QuickProductCreateSheetProps) => {
  const [cafes, setCafes] = useState<Tables<"cafes">[]>([]);
  const [selectedCafeId, setSelectedCafeId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
      category_id: 0, // Start with 0, will be validated
    },
  });

  const isAvailable = watch("is_available");
  const currentCategoryId = watch("category_id");

  // Reset category selection when cafe changes
  useEffect(() => {
    if (selectedCafeId && currentCategoryId !== 0) {
      setValue("category_id", 0);
    }
  }, [selectedCafeId, currentCategoryId, setValue]);

  const handleImageUpload = (file: File | null) => {
    setImageFile(file);
    setUploadError(null);
  };

  const handleImageError = (error: string) => {
    setUploadError(error);
  };

  const onSubmit = async (data: ProductSchemaType) => {
    if (!selectedCafeId) {
      toast.error("Please select a cafe");
      return;
    }

    if (!data.category_id || data.category_id === 0) {
      toast.error("Please select a category");
      return;
    }

    try {
      let imageUrl = data.image_url;

      if (imageFile) {
        setIsUploading(true);
        setUploadError(null);

        const cafe = cafes.find((c) => c.id === selectedCafeId);
        if (!cafe) {
          throw new Error("Selected cafe not found");
        }

        const uploadResult = await storageRepository.uploadFile(imageFile, cafe.slug, BUCKET_NAMES.PRODUCT_IMAGE);

        if (!uploadResult.success) {
          const errorMessage = `Upload failed: ${uploadResult.error?.message || "Unknown error"}`;
          setUploadError(errorMessage);
          return;
        }

        imageUrl = uploadResult.data.url;
      }

      await productRepository.create(selectedCafeId, {
        ...data,
        image_url: imageUrl,
      });

      toast.success("Product created successfully");
      onOpenChange(false);
      reset();
      setSelectedCafeId(null);
      setImageFile(null);
      setUploadError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create product";
      toast.error(errorMessage);
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  if (!open) return null;

  return (
    <FormSheet
      title="Create New Product"
      description="Quickly create a new product for your cafe menu."
      onOpenChange={onOpenChange}
      footer={
        <SubmitButton
          onClick={() => handleSubmit(onSubmit)}
          disabled={isSubmitting || isUploading || !selectedCafeId}
          isLoading={isSubmitting || isUploading}
          text="Create"
          loadingText="Creating..."
        />
      }
    >
      <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <CafeListDropdown
          id="cafe"
          label="Cafe"
          value={selectedCafeId || undefined}
          onValueChange={setSelectedCafeId}
          placeholder="Select a cafe"
          error={!selectedCafeId ? "Please select a cafe" : undefined}
          required
        />
        <CategoryListDropdown
          id="category"
          label="Category"
          value={watch("category_id") && watch("category_id") !== 0 ? watch("category_id") : undefined}
          onValueChange={(value) => setValue("category_id", value)}
          cafeId={selectedCafeId}
          placeholder="Select a category"
          error={errors.category_id?.message}
          required
        />

        {/* Product Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Product Name
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Enter product name"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Describe your product..."
            rows={3}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            {...register("price", { valueAsNumber: true })}
            placeholder="0.00"
            className={errors.price ? "border-red-500" : ""}
          />
          {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <FilePicker
            id="image"
            label="Product Image"
            accept="image/*"
            maxSize={5 * 1024 * 1024} // 5MB
            value={imageFile}
            onChange={handleImageUpload}
            onError={handleImageError}
            disabled={isUploading}
          />
          {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
        </div>

        {/* Availability */}
        <div className="flex items-center space-x-2">
          <Switch
            id="is_available"
            checked={isAvailable}
            onCheckedChange={(checked: boolean) => setValue("is_available", checked)}
          />
          <Label htmlFor="is_available">Available</Label>
          <p className="text-xs text-muted-foreground ml-2">
            {isAvailable ? "Product is available for purchase" : "Product is not available for purchase"}
          </p>
        </div>
      </form>
    </FormSheet>
  );
};

export default QuickProductCreateSheet;
