"use client";

import { FC, useState } from "react";
import { Tables } from "@/types/db";
import { Plus } from "lucide-react";
import QueryKeys from "@/constants/query-keys";
import { Button } from "@/components/ui/button";
import { type ProductSchema } from "@/lib/schema";
import { useRequest } from "@/hooks/use-request";
import { useCafeData } from "@/hooks/use-cafe-data";
import { productRepository } from "@/lib/repositories";
import ProductModal from "@/components/product/ProductModal";

interface Props {
  cafeId: number;
  categories: Tables<"categories">[];
  onSuccess?: () => void;
}

const ProductCreateModal: FC<Props> = (props) => {
  //#region States

  const [open, setOpen] = useState(false);

  const { cafeSlug, isLoading: isLoadingCafe } = useCafeData(props.cafeId, open);

  //#endregion

  //#region Hooks

  const { isLoading, execute: createProduct } = useRequest({
    mutationFn: async (data: ProductSchema) => {
      return await productRepository.create(props.cafeId, data);
    },
    onSuccess: () => {
      setOpen(false);
      props.onSuccess?.();
    },
    successMessage: "Product created successfully!",
    invalidateQueries: [QueryKeys.productsByCafe(props.cafeId.toString())],
  });

  const handleSubmit = async (data: ProductSchema) => {
    await createProduct(data);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  //#endregion

  return (
    <ProductModal
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      }
      title="Create New Product"
      cafeId={props.cafeId}
      cafeSlug={cafeSlug}
      categories={props.categories}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading || isLoadingCafe}
    />
  );
};

export default ProductCreateModal;
