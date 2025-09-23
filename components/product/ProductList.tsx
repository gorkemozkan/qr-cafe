"use client";

import { FC, useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import DataTable from "@/components/common/DataTable";
import DateView from "@/components/common/DateView";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import QuestionDialog from "@/components/common/QuestionDialog";
import TableActions from "@/components/common/TableActions";
import ProductCreateSheet from "@/components/product/ProductCreateSheet";
import ProductEditSheet from "@/components/product/ProductEditSheet";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRequest } from "@/hooks/useRequest";
import QueryKeys from "@/lib/query";
import { productRepository } from "@/lib/repositories/product-repository";
import { Tables } from "@/types/db";

interface Props {
  cafeId: number;
  categoryId: number;
}

const ProductList: FC<Props> = (props) => {
  const t = useTranslations();
  const tProduct = useTranslations("product");

  //#region States

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [productToDelete, setProductToDelete] = useState<Tables<"products"> | null>(null);

  const [productToEdit, setProductToEdit] = useState<Tables<"products"> | null>(null);

  //#endregion

  //#region Hooks

  const { isLoading: isDeleting, execute: deleteProduct } = useRequest({
    mutationFn: async (id: number) => {
      return await productRepository.remove(id);
    },
    onSuccess: () => {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    },
    successMessage: tProduct("productDeleted"),
    invalidateQueries: [
      QueryKeys.productsByCafe(props.cafeId.toString()),
      QueryKeys.stats,
      ...(props.categoryId ? [QueryKeys.productsByCategory(props.categoryId.toString())] : []),
    ],
  });

  const handleDeleteClick = (product: Tables<"products">) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  //#endregion

  //#region Handlers

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.id);
    }
  };

  //#endregion

  const columns = [
    {
      key: "image",
      header: tProduct("table.image"),
      cell: (_: any, row: Tables<"products">) => (
        <OptimizedImage
          fill
          width={40}
          height={40}
          src={row.image_url}
          sizes="40px"
          showSkeleton={true}
          alt={`${row.name} image`}
          className="rounded border border-border"
        />
      ),
    },
    {
      key: "name",
      header: tProduct("table.name"),
      cell: (value: any) => <span className="font-mono text-sm block truncate ">{value}</span>,
    },
    {
      key: "description",
      header: tProduct("table.description"),
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
      header: tProduct("table.price"),
      cell: (value: any) => <span className="font-mono">{value ? `${parseFloat(value).toFixed(2)}` : "-"}</span>,
    },
    {
      key: "calory",
      header: tProduct("table.calory"),
      cell: (value: any) => <span className="font-mono">{value ? `${value} kcal` : "-"}</span>,
    },
    {
      key: "preparation_time",
      header: tProduct("table.preparation_time"),
      cell: (value: any) => <span className="font-mono">{value ? `${value} min` : "-"}</span>,
    },
    {
      key: "is_available",
      header: tProduct("table.status"),
      cell: (value: any) => (
        <Badge variant={value ? "active" : "inactive"}>
          {value ? tProduct("table.available") : tProduct("table.unavailable")}
        </Badge>
      ),
    },
    {
      key: "created_at",
      header: tProduct("table.created"),
      cell: (value: any) => <DateView date={value} format="relative" />,
    },
    {
      key: "actions",
      header: tProduct("table.actions"),
      className: "flex justify-end",
      cell: (_: any, row: Tables<"products">) => (
        <TableActions onEdit={() => setProductToEdit(row)} onDelete={() => handleDeleteClick(row)} />
      ),
    },
  ];

  const queryKey = props.categoryId
    ? QueryKeys.productsByCategory(props.categoryId.toString())
    : QueryKeys.productsByCafe(props.cafeId.toString());

  const queryFn = useCallback(async () => {
    if (props.categoryId) {
      return await productRepository.listByCategory(props.categoryId);
    } else {
      return await productRepository.listByCafe(props.cafeId);
    }
  }, [props.categoryId, props.cafeId]);

  //#endregion

  return (
    <div className="space-y-4">
      <DataTable
        actions={<ProductCreateSheet cafeId={props.cafeId} categoryId={props.categoryId} />}
        columns={columns}
        queryKey={queryKey}
        queryFn={queryFn}
      />
      {productToEdit && (
        <ProductEditSheet
          categoryId={productToEdit.category_id}
          product={productToEdit}
          cafeId={props.cafeId}
          onSuccess={() => setProductToEdit(null)}
          onClose={() => setProductToEdit(null)}
        />
      )}
      <QuestionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={tProduct("deleteProduct")}
        description={t("product.deleteDialog.description", { name: productToDelete?.name || "" })}
        confirmText={tProduct("deleteProduct")}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ProductList;
