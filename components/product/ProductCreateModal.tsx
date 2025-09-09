"use client";

import { Plus } from "lucide-react";
import { FC, useState } from "react";
import ProductForm from "@/components/product/ProductForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import useCafeData from "@/hooks/useCafeData";
import { useRequest } from "@/hooks/useRequest";
import QueryKeys from "@/lib/query";
import { productRepository } from "@/lib/repositories/product-repository";
import { type ProductSchema } from "@/lib/schema";

interface Props {
  cafeId: number;
  onSuccess?: () => void;
  categoryId: number;
}

const ProductCreateModal: FC<Props> = (props) => {
  //#region States

  const [open, setOpen] = useState(false);

  const { cafeSlug } = useCafeData(props.cafeId);

  //#endregion

  //#region Hooks

  const { execute: createProduct } = useRequest({
    mutationFn: async (data: ProductSchema) => {
      return await productRepository.create(props.cafeId, data);
    },
    onSuccess: () => {
      setOpen(false);
      props.onSuccess?.();
    },
    successMessage: "Product created successfully!",
    invalidateQueries: [
      QueryKeys.productsByCafe(props.cafeId.toString()),
      QueryKeys.productsByCategory(props.categoryId.toString()),
      QueryKeys.stats,
    ],
  });

  const handleSubmit = async (data: ProductSchema) => {
    await createProduct(data);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  //#endregion

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create new product</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
          <DialogDescription>Fill in the details below to create a new product.</DialogDescription>
        </DialogHeader>
        <ProductForm mode="create" cafeSlug={cafeSlug} onSubmit={handleSubmit} onCancel={handleCancel} categoryId={props.categoryId} />
      </DialogContent>
    </Dialog>
  );
};

export default ProductCreateModal;
