"use client";

import { Tables } from "@/types/db";
import { FC, ReactNode } from "react";
import { ProductSchema } from "@/lib/schema";
import ProductForm from "@/components/product/ProductForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
  title: string;
  cafeId: number;
  cafeSlug: string;
  categories: Tables<"categories">[];
  product?: Tables<"products">;
  onSubmit: (data: ProductSchema) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const ProductModal: FC<Props> = (props) => {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="animate-in fade-in-0 slide-in-from-top-2 duration-300 delay-100">{props.title}</DialogTitle>
        </DialogHeader>
        <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-200">
          <ProductForm
            cafeId={props.cafeId}
            cafeSlug={props.cafeSlug}
            categories={props.categories}
            product={props.product}
            onSubmit={props.onSubmit}
            onCancel={props.onCancel}
            isLoading={props.isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
