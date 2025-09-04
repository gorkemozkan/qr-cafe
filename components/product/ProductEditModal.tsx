"use client";

import { FC, useState } from "react";
import { Tables } from "@/types/db";
import { Edit } from "lucide-react";
import QueryKeys from "@/constants/query-keys";
import { Button } from "@/components/ui/button";
import { useRequest } from "@/hooks/use-request";
import { useCafeData } from "@/hooks/use-cafe-data";
import { productRepository } from "@/lib/repositories";
import ProductModal from "@/components/product/ProductModal";
import { type ProductSchema as ProductSchemaType } from "@/lib/schema";

interface Props {
  cafeId: number;
  onSuccess?: () => void;
  product: Tables<"products">;
  categories: Tables<"categories">[];
}

const ProductEditModal: FC<Props> = (props) => {
  //#region States
  const [open, setOpen] = useState(false);

  const { cafeSlug, isLoading: isLoadingCafe } = useCafeData(props.cafeId, open);

  //#endregion

  //#region Hooks

  const { isLoading, execute: updateProduct } = useRequest({
    mutationFn: async (data: ProductSchemaType) => {
      return await productRepository.update(props.product.id, data);
    },
    onSuccess: () => {
      setOpen(false);
      props.onSuccess?.();
    },
    successMessage: "Product updated successfully!",
    invalidateQueries: [QueryKeys.productsByCafe(props.cafeId.toString()), QueryKeys.stats],
  });

  const handleSubmit = async (data: ProductSchemaType) => {
    await updateProduct(data);
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
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      }
      title="Edit Product"
      cafeId={props.cafeId}
      cafeSlug={cafeSlug}
      categories={props.categories}
      product={props.product}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading || isLoadingCafe}
    />
  );
};

export default ProductEditModal;
