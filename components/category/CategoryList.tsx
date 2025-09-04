"use client";

import { FC, useState } from "react";
import { Tables } from "@/types/db";
import { useRequest } from "@/hooks/use-request";
import { categoryRepository } from "@/lib/repositories";
import QueryKeys from "@/constants/query-keys";
import DataTable from "@/components/ui/data-table";
import QuestionDialog from "@/components/ui/question-dialog";
import CategoryEditModal from "@/components/category/CategoryEditModal";
import TableActions from "@/components/ui/table-actions";
import DateView from "@/components/ui/date-view";
import { Badge } from "@/components/ui/badge";
import CategoryCreateModal from "@/components/category/CategoryCreateModal";
import { useRouter } from "next/navigation";

interface Props {
  cafeId: number;
}

const CategoryList: FC<Props> = (props) => {
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
        actions={<CategoryCreateModal cafeId={props.cafeId} />}
        queryKey={QueryKeys.categoriesByCafe(props.cafeId.toString())}
        queryFn={async () => await categoryRepository.listByCafe(props.cafeId)}
        emptyMessage="No categories found"
      />
      {categoryToEdit && <CategoryEditModal onClose={() => setCategoryToEdit(null)} category={categoryToEdit} onSuccess={() => setCategoryToEdit(null)} />}
      <QuestionDialog
        open={deleteDialogOpen}
        title="Delete Category"
        confirmText="Delete"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onOpenChange={setDeleteDialogOpen}
        description={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default CategoryList;
