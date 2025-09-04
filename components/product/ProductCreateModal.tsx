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
import ProductForm from "@/components/product/ProductForm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

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
      QueryKeys.stats
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
        <ProductForm cafeSlug={cafeSlug} onSubmit={handleSubmit} onCancel={handleCancel} categoryId={props.categoryId} />
      </DialogContent>
    </Dialog>
  );
};

export default ProductCreateModal;
