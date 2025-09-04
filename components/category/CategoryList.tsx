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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import CategoryCreateModal from "./CategoryCreateModal";

interface Props {
  cafeId: number;
}

const CategoryList: FC<Props> = (props) => {
  //#region States

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [categoryToDelete, setCategoryToDelete] = useState<Tables<"categories"> | null>(null);

  const [categoryToEdit, setCategoryToEdit] = useState<Tables<"categories"> | null>(null);

  //#endregion

  //#region Hooks

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

  const columns = [
    {
      key: "name",
      header: "Name",
      cell: (value: any) => <span className="font-medium">{value}</span>,
    },
    {
      key: "description",
      header: "Description",
      cell: (value: any) => (
        <div className="w-max">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="font-mono text-sm bg-muted px-2 py-1 rounded block truncate">{value}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-mono">{value}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
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
      cell: (_: any, row: Tables<"categories">) => (
        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/admin/app/cafe/${props.cafeId}/categories/${row.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-mono">View {row.name} details</p>
            </TooltipContent>
          </Tooltip>
          <TableActions onEdit={() => setCategoryToEdit(row)} onDelete={() => handleDeleteClick(row)} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        actions={<CategoryCreateModal cafeId={props.cafeId} />}
        columns={columns}
        queryKey={QueryKeys.categoriesByCafe(props.cafeId.toString())}
        queryFn={async () => await categoryRepository.listByCafe(props.cafeId)}
        emptyMessage="No categories found"
      />
      {categoryToEdit && <CategoryEditModal onClose={() => setCategoryToEdit(null)} category={categoryToEdit} onSuccess={() => setCategoryToEdit(null)} />}
      <QuestionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Category"
        description={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default CategoryList;
