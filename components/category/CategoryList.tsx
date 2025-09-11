"use client";

import { FC, useState, useCallback } from "react";
import CategoryCreateSheet from "@/components/category/CategoryCreateModal";
import CategoryEditSheet from "@/components/category/CategoryEditModal";
import DataTable from "@/components/common/DataTable";
import DateView from "@/components/common/DateView";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import QuestionDialog from "@/components/common/QuestionDialog";
import TableActions from "@/components/common/TableActions";
import { Badge } from "@/components/ui/badge";
import { useRequest } from "@/hooks/useRequest";
import QueryKeys from "@/lib/query";
import { categoryRepository } from "@/lib/repositories/category-repository";
import { Tables } from "@/types/db";
import { useRouter } from "next/navigation";

interface Props {
  cafeId: number;
}

const CategoryList: FC<Props> = (props) => {
  const router = useRouter();
  //#endregion

  //#region States

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [categoryToDelete, setCategoryToDelete] = useState<Tables<"categories"> | null>(null);

  const [categoryToEdit, setCategoryToEdit] = useState<Tables<"categories"> | null>(null);

  //#endregion

  //#region Request

  const { isLoading: isDeleting, execute: deleteCategory } = useRequest({
    mutationFn: async (id: number) => {
      return await categoryRepository.remove(id);
    },
    onSuccess: () => {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    },
    successMessage: "Category deleted successfully!",
    invalidateQueries: [QueryKeys.categoriesByCafe(props.cafeId.toString()), QueryKeys.stats],
  });

  const { execute: updateSortOrder } = useRequest({
    mutationFn: async (categoryIds: number[]) => {
      return await categoryRepository.updateSortOrder(props.cafeId, categoryIds);
    },
    successMessage: "Categories reordered successfully!",

    invalidateQueries: [QueryKeys.categoriesByCafe(props.cafeId.toString())],
  });

  const handleSortOrderChange = useCallback(
    async (categories: Tables<"categories">[]) => {
      const categoryIds = categories.map((category) => category.id);
      await updateSortOrder(categoryIds);
    },
    [updateSortOrder],
  );

  const handleDeleteClick = (category: Tables<"categories">) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete.id);
    }
  };

  //#endregion

  const columns = [
    {
      key: "image",
      header: "Image",
      cell: (_: any, row: Tables<"categories">) => (
        <>
          {row.image_url ? (
            <OptimizedImage
              src={row.image_url}
              alt={`${row.name} image`}
              width={40}
              height={40}
              className="rounded-md border border-border w-10 h-10 "
              objectFit="cover"
              fallbackSrc="/placeholder-logo.svg"
              showSkeleton={true}
            />
          ) : (
            <div className="w-10 h-10 rounded-md border border-border flex items-center justify-center ">
              <span className="text-[8px] text-center text-muted-foreground">No Image</span>
            </div>
          )}
        </>
      ),
    },
    {
      key: "name",
      header: "Name",
      cell: (value: any) => <span className="font-medium">{value}</span>,
    },
    {
      key: "sort_order",
      header: "Order",
      cell: (value: any) => <span className="font-medium ">{value}</span>,
    },
    {
      key: "is_active",
      header: "Status",
      cell: (value: any) => <Badge variant={value ? "active" : "inactive"}>{value ? "Active" : "Inactive"}</Badge>,
    },
    {
      key: "created_at",
      header: "Created",
      cell: (value: any) => <DateView date={value} format="relative" />,
    },
    {
      key: "actions",
      header: "Actions",
      className: "flex justify-end",
      cell: (_: any, row: Tables<"categories">) => (
        <TableActions
          onEdit={() => setCategoryToEdit(row)}
          onDelete={() => handleDeleteClick(row)}
          to={`/admin/app/cafe/${props.cafeId}/categories/${row.id}`}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        enableSorting={true}
        onSortOrderChange={handleSortOrderChange}
        onRowClick={(row) => {
          router.push(`/admin/app/cafe/${props.cafeId}/categories/${row.id}`);
        }}
        columns={columns}
        actions={<CategoryCreateSheet cafeId={props.cafeId} />}
        queryKey={QueryKeys.categoriesByCafe(props.cafeId.toString())}
        queryFn={async () => await categoryRepository.listByCafe(props.cafeId)}
        emptyMessage="No categories found"
      />
      {categoryToEdit && (
        <CategoryEditSheet onClose={() => setCategoryToEdit(null)} category={categoryToEdit} onSuccess={() => setCategoryToEdit(null)} />
      )}
      <QuestionDialog
        confirmText="Delete"
        open={deleteDialogOpen}
        title="Delete Category"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onOpenChange={setDeleteDialogOpen}
        description={`Are you sure you want to delete "${categoryToDelete?.name || ""}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default CategoryList;
