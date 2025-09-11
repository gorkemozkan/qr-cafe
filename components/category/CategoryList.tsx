"use client";

import { useRouter } from "next/navigation";
import { FC, useState } from "react";
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

interface Props {
  cafeId: number;
}

const CategoryList: FC<Props> = (props) => {
  //#endregion

  //#region States

  const router = useRouter();

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

  const handleDeleteClick = (category: Tables<"categories">) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete.id);
    }
  };

  const handleInspectClick = (category: Tables<"categories">) => {
    router.push(`/admin/app/cafe/${props.cafeId}/categories/${category.id}`);
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
      header: "Sort Order",
      cell: (value: any) => value || "-",
    },
    {
      key: "is_active",
      header: "Status",
      cell: (value: any) => <Badge variant={value ? "active" : "inactive"}>{value ? "Active" : "Inactive"}</Badge>,
    },
    {
      key: "created_at",
      header: "Created",
      cell: (value: any) => <DateView date={value} format="detailed" />,
    },
    {
      key: "actions",
      header: "Actions",
      className: "flex justify-end",
      cell: (_: any, row: Tables<"categories">) => (
        <TableActions onInspect={() => handleInspectClick(row)} onEdit={() => setCategoryToEdit(row)} onDelete={() => handleDeleteClick(row)} />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
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
        open={deleteDialogOpen}
        title="Delete Category"
        confirmText="Delete"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onOpenChange={setDeleteDialogOpen}
        description={`Are you sure you want to delete "${categoryToDelete?.name || ""}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default CategoryList;
