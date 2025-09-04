"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Tables } from "@/types/db";
import { productSchema, type ProductSchema as ProductSchemaType } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { storageRepository } from "@/lib/repositories";
import FilePicker from "@/components/ui/file-picker";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { BUCKET_NAMES } from "@/config";

interface Props {
  mode: "create" | "edit";
  cafeSlug: string;
  product?: Tables<"products">;
  categoryId: number;
  onSubmit: (data: ProductSchemaType) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const ProductForm: FC<Props> = (props) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ProductSchemaType>({
    resolver: zodResolver(productSchema),
    defaultValues: getDefaultValues(),
  });

  const isAvailable = watch("is_available");

  const handleImageUpload = (file: File | null) => {
    setImageFile(file);
    setUploadError(null);
  };

  const handleImageError = (error: string) => {
    setUploadError(error);
  };

  const onSubmitForm = async (data: ProductSchemaType) => {
    try {
      let imageUrl = data.image_url;

      if (imageFile && props.cafeSlug) {
        setIsUploading(true);
        setUploadError(null);

        const uploadResult = await storageRepository.uploadFile(imageFile, props.cafeSlug, BUCKET_NAMES.PRODUCT_IMAGE);

        if (!uploadResult.success) {
          const errorMessage = `Upload failed: ${uploadResult.error?.message || "Unknown error"}`;
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
      const errorMessage = error instanceof Error ? error.message : "Operation failed";
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input id="name" {...register("name")} placeholder="Enter product name" className={errors.name ? "border-red-500" : ""} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} placeholder="Describe your product..." rows={3} className={errors.description ? "border-red-500" : ""} />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input id="price" type="number" step="0.01" min="0" {...register("price", { valueAsNumber: true })} placeholder="0.00" className={errors.price ? "border-red-500" : ""} />
        {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
      </div>

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
        {props.mode === "edit" && props.product?.image_url && !imageFile && (
          <div className="flex items-center space-x-2">
            <OptimizedImage
              src={props.product.image_url}
              alt="Current product image"
              width={48}
              height={48}
              className="h-12 w-12 rounded object-cover"
              fallbackSrc="/placeholder-logo.svg"
              showSkeleton={false}
            />
            <p className="text-sm text-muted-foreground">Current image will be replaced if you select a new file</p>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="is_available" checked={isAvailable} onCheckedChange={(checked: boolean) => setValue("is_available", checked)} />
        <Label htmlFor="is_available">Available</Label>
        <p className="text-xs text-muted-foreground ml-2">{isAvailable ? "Product is available for purchase" : "Product is not available for purchase"}</p>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {props.onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={props.onCancel}
            disabled={isSubmitting || isUploading || props.isLoading}
            className="transition-all duration-200 hover:scale-105"
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || isUploading || props.isLoading} className="min-w-[100px] transition-all duration-200 hover:scale-105">
          {isSubmitting || isUploading || props.isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {props.mode === "create" ? "Creating..." : "Updating..."}
            </>
          ) : props.mode === "create" ? (
            "Create"
          ) : (
            "Update"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
