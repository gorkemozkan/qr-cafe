"use client";

import { FC, useState, useCallback } from "react";
import { Tables } from "@/types/db";
import { useRequest } from "@/hooks/use-request";
import { productRepository } from "@/lib/repositories";
import QueryKeys from "@/constants/query-keys";
import DataTable from "@/components/ui/data-table";
import QuestionDialog from "@/components/ui/question-dialog";
import ProductEditModal from "@/components/cafe/ProductEditModal";
import TableActions from "@/components/ui/table-actions";
import DateView from "@/components/ui/date-view";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface ProductListProps {
  cafeId: number;
  categoryId?: number;
  categories?: Tables<"categories">[];
}

const ProductList: FC<ProductListProps> = ({ cafeId, categoryId, categories = [] }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Tables<"products"> | null>(null);
  const [productToEdit, setProductToEdit] = useState<Tables<"products"> | null>(null);

  const { isLoading: isDeleting, execute: deleteProduct } = useRequest({
    mutationFn: async (id: number) => {
      return await productRepository.remove(id);
    },
    onSuccess: () => {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    },
    successMessage: "Product deleted successfully!",
    invalidateQueries: [QueryKeys.productsByCafe(cafeId.toString()), ...(categoryId ? [QueryKeys.productsByCategory(categoryId.toString())] : [])],
  });

  const handleDeleteClick = (product: Tables<"products">) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.id);
    }
  };

  const columns = [
    {
      key: "image",
      header: "Image",
      cell: (_: any, row: Tables<"products">) => (
        <div className="w-16 h-16">
          {row.image_url ? (
            <OptimizedImage src={row.image_url} alt={row.name} className="w-full h-full object-cover rounded-md" />
          ) : (
            <div className="w-full h-16 bg-muted rounded-md flex items-center justify-center">
              <span className="text-xs text-muted-foreground">No image</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: "Name",
      cell: (value: any) => <span className="font-medium">{value}</span>,
    },
    {
      key: "description",
      header: "Description",
      cell: (value: any) => (
        <div className="w-max max-w-xs">
          {value ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-mono text-sm bg-muted px-2 py-1 rounded block truncate">{value}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-mono max-w-xs">{value}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <span className="text-muted-foreground text-sm">-</span>
          )}
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      cell: (value: any) => <span className="font-mono">{value ? `$${parseFloat(value).toFixed(2)}` : "-"}</span>,
    },
    {
      key: "is_available",
      header: "Status",
      cell: (value: any) => <Badge variant={value ? "default" : "secondary"}>{value ? "Available" : "Unavailable"}</Badge>,
    },
    {
      key: "created_at",
      header: "Created",
      cell: (value: any) => <DateView date={value} format="short" />,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (_: any, row: Tables<"products">) => <TableActions onEdit={() => setProductToEdit(row)} onDelete={() => handleDeleteClick(row)} />,
    },
  ];

  const queryKey = categoryId ? QueryKeys.productsByCategory(categoryId.toString()) : QueryKeys.productsByCafe(cafeId.toString());

  const queryFn = useCallback(async () => {
    if (categoryId) {
      return await productRepository.listByCategory(categoryId);
    } else {
      return await productRepository.listByCafe(cafeId);
    }
  }, [categoryId, cafeId]);

  return (
    <div className="space-y-4">
      <DataTable columns={columns} queryKey={queryKey} queryFn={queryFn} emptyMessage="No products found" />
      {productToEdit && <ProductEditModal product={productToEdit} cafeId={cafeId} categories={categories} onSuccess={() => setProductToEdit(null)} />}
      <QuestionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Product"
        description={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ProductList;
