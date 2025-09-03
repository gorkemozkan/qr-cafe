"use client";

import { FC, ReactNode } from "react";
import { Tables } from "@/types/db";
import { ProductSchema } from "@/lib/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProductForm from "./ProductForm";

interface BaseProductModalProps {
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

const BaseProductModal: FC<BaseProductModalProps> = ({
  open,
  onOpenChange,
  trigger,
  title,
  cafeId,
  cafeSlug,
  categories,
  product,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ProductForm
          cafeId={cafeId}
          cafeSlug={cafeSlug}
          categories={categories}
          product={product}
          onSubmit={onSubmit}
          onCancel={onCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BaseProductModal;
