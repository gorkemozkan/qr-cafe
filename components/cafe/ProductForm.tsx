"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tables } from "@/types/db";
import { productSchema, type ProductSchema as ProductSchemaType } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { storageRepository } from "@/lib/repositories";
import FilePicker from "@/components/ui/file-picker";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface ProductFormProps {
  cafeId: number;
  cafeSlug: string;
  categories: Tables<"categories">[];
  product?: Tables<"products">;
  onSubmit: (data: ProductSchemaType) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ProductForm: FC<ProductFormProps> = ({ cafeId, cafeSlug, categories, product, onSubmit, onCancel, isLoading = false }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url || null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductSchemaType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || undefined,
      image_url: product?.image_url || "",
      is_available: product?.is_available ?? true,
      category_id: product?.category_id || categories[0]?.id,
    },
  });

  const watchedValues = watch();

  const handleImageUpload = async (file: File | null) => {
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (data: ProductSchemaType) => {
    try {
      let imageUrl = data.image_url;

      if (imageFile && cafeSlug) {
        const uploadResult = await storageRepository.uploadFile(imageFile, cafeSlug, "products");
        if (uploadResult.success) {
          imageUrl = uploadResult.data.url;
        }
      }

      await onSubmit({
        ...data,
        image_url: imageUrl,
      });
    } catch (_error) {}
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input id="name" {...register("name")} placeholder="Enter product name" className={errors.name ? "border-red-500" : ""} />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={watchedValues.category_id?.toString()} onValueChange={(value) => setValue("category_id", parseInt(value, 10))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && <p className="text-sm text-red-500 mt-1">{errors.category_id.message}</p>}
          </div>

          <div>
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
            {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="is_available" checked={watchedValues.is_available} onCheckedChange={(checked) => setValue("is_available", checked)} />
            <Label htmlFor="is_available">Available for purchase</Label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} placeholder="Enter product description" rows={4} className={errors.description ? "border-red-500" : ""} />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <Label>Product Image</Label>
            <FilePicker onChange={handleImageUpload} accept="image/*" maxSize={5 * 1024 * 1024} className="w-full" />
            {imagePreview && (
              <div className="mt-2 relative w-32 h-32">
                <OptimizedImage src={imagePreview} alt="Product preview" fill className="object-cover rounded-md" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
