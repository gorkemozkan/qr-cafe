"use client";

import { FC } from "react";
import { Tables } from "@/types/db";
import QueryKeys from "@/constants/query-keys";
import { useRequest } from "@/hooks/use-request";
import { useCafeData } from "@/hooks/use-cafe-data";
import { productRepository } from "@/lib/repositories";
import ProductForm from "@/components/product/ProductForm";
import { type ProductSchema } from "@/lib/schema";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
  cafeId: number;
  onSuccess?: () => void;
  product: Tables<"products">;
  categoryId: number;
  onClose: () => void;
}

const ProductEditModal: FC<Props> = (props) => {
  //#region States

  const { cafeSlug } = useCafeData(props.cafeId);

  //#endregion

  //#region Hooks

  const { execute } = useRequest({
    mutationFn: async (payload: ProductSchema) => {
      return await productRepository.update(props.product.id, payload);
    },
    onSuccess: () => {
      props.onClose();
      props.onSuccess?.();
    },
    successMessage: "Product updated successfully!",
    invalidateQueries: [
      QueryKeys.productsByCafe(props.cafeId.toString()),
      QueryKeys.productsByCategory(props.categoryId.toString()),
      QueryKeys.stats,
    ],
  });

  const handleCancel = () => {
    props.onClose();
  };

  //#endregion

  return (
    <Dialog open onOpenChange={props.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Update the product details below.</DialogDescription>
        </DialogHeader>
        <ProductForm
          mode="edit"
          cafeSlug={cafeSlug}
          product={props.product}
          categoryId={props.categoryId}
          onSubmit={async (data) => {
            await execute(data);
          }}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditModal;
