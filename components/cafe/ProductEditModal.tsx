"use client";

import { FC, useState } from "react";
import { Tables } from "@/types/db";
import { ProductSchema, type ProductSchema as ProductSchemaType } from "@/lib/schema";
import { productRepository } from "@/lib/repositories";
import { useRequest } from "@/hooks/use-request";
import { useCafeData } from "@/hooks/use-cafe-data";
import QueryKeys from "@/constants/query-keys";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import BaseProductModal from "./BaseProductModal";

interface ProductEditModalProps {
  product: Tables<"products">;
  cafeId: number;
  categories: Tables<"categories">[];
  onSuccess?: () => void;
}

const ProductEditModal: FC<ProductEditModalProps> = ({ product, cafeId, categories, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const { cafeSlug, isLoading: isLoadingCafe } = useCafeData(cafeId, open);

  const { isLoading, execute: updateProduct } = useRequest({
    mutationFn: async (data: ProductSchemaType) => {
      return await productRepository.update(product.id, data);
    },
    onSuccess: () => {
      setOpen(false);
      onSuccess?.();
    },
    successMessage: "Product updated successfully!",
    invalidateQueries: [QueryKeys.productsByCafe(cafeId.toString())],
  });

  const handleSubmit = async (data: ProductSchemaType) => {
    await updateProduct(data);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <BaseProductModal
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      }
      title="Edit Product"
      cafeId={cafeId}
      cafeSlug={cafeSlug}
      categories={categories}
      product={product}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading || isLoadingCafe}
    />
  );
};

export default ProductEditModal;
