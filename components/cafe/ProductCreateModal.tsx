"use client";

import { FC, useState } from "react";
import { Tables } from "@/types/db";
import { type ProductSchema as ProductSchemaType } from "@/lib/schema";
import { productRepository } from "@/lib/repositories";
import { useRequest } from "@/hooks/use-request";
import { useCafeData } from "@/hooks/use-cafe-data";
import QueryKeys from "@/constants/query-keys";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BaseProductModal from "@/components/cafe/BaseProductModal";

interface ProductCreateModalProps {
  cafeId: number;
  categories: Tables<"categories">[];
  onSuccess?: () => void;
}

const ProductCreateModal: FC<ProductCreateModalProps> = ({ cafeId, categories, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const { cafeSlug, isLoading: isLoadingCafe } = useCafeData(cafeId, open);

  const { isLoading, execute: createProduct } = useRequest({
    mutationFn: async (data: ProductSchemaType) => {
      return await productRepository.create(cafeId, data);
    },
    onSuccess: () => {
      setOpen(false);
      onSuccess?.();
    },
    successMessage: "Product created successfully!",
    invalidateQueries: [QueryKeys.productsByCafe(cafeId.toString())],
  });

  const handleSubmit = async (data: ProductSchemaType) => {
    await createProduct(data);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <BaseProductModal
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      }
      title="Create New Product"
      cafeId={cafeId}
      cafeSlug={cafeSlug}
      categories={categories}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading || isLoadingCafe}
    />
  );
};

export default ProductCreateModal;
