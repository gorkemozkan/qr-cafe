"use client";

import { FC, useState } from "react";
import { Tables } from "@/types/db";
import { Edit } from "lucide-react";
import QueryKeys from "@/constants/query-keys";
import { Button } from "@/components/ui/button";
import { useRequest } from "@/hooks/use-request";
import { useCafeData } from "@/hooks/use-cafe-data";
import { productRepository } from "@/lib/repositories";
import ProductForm from "@/components/product/ProductForm";
import { type ProductSchema as ProductSchemaType } from "@/lib/schema";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

  const { execute: updateProduct } = useRequest({
    mutationFn: async (data: ProductSchemaType) => {
      return await productRepository.update(props.product.id, data);
    },
    onSuccess: () => {
      props.onClose();
      props.onSuccess?.();
    },
    successMessage: "Product updated successfully!",
    invalidateQueries: [QueryKeys.productsByCafe(props.cafeId.toString()), QueryKeys.productsByCategory(props.categoryId.toString()), QueryKeys.stats],
  });

  const handleSubmit = async (data: ProductSchemaType) => {
    await updateProduct(data);
  };

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
        <ProductForm cafeSlug={cafeSlug} product={props.product} categoryId={props.categoryId} onSubmit={handleSubmit} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditModal;
