"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FC, useState } from "react";
import CategoryCreateSheet from "@/components/category/CategoryCreateModal";
import CategoryEditSheet from "@/components/category/CategoryEditModal";
import DataTable from "@/components/DataTable";
import DateView from "@/components/DateView";
import QuestionDialog from "@/components/QuestionDialog";
import TableActions from "@/components/TableActions";
import { Badge } from "@/components/ui/badge";
import { useRequest } from "@/hooks/useRequest";
import QueryKeys from "@/lib/query";
import { categoryRepository } from "@/lib/repositories/category-repository";
import { Tables } from "@/types/db";

interface Props {
  cafeId: number;
}

const CategoryList: FC<Props> = (props) => {
  //#region Hooks

  const t = useTranslations("category");

  const tCommon = useTranslations("common");

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
    successMessage: t("delete.successMessage"),
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
      header: t("table.headers.name"),
      cell: (value: any) => <span className="font-medium">{value}</span>,
    },
    {
      key: "sort_order",
      header: t("table.headers.sortOrder"),
      cell: (value: any) => value || "-",
    },
    {
      key: "is_active",
      header: t("table.headers.status"),
      cell: (value: any) => <Badge variant={value ? "active" : "inactive"}>{value ? t("table.status.active") : t("table.status.inactive")}</Badge>,
    },
    {
      key: "created_at",
      header: t("table.headers.created"),
      cell: (value: any) => <DateView date={value} format="detailed" />,
    },
    {
      key: "actions",
      header: t("table.headers.actions"),
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
        emptyMessage={t("noCategories")}
      />
      {categoryToEdit && (
        <CategoryEditSheet onClose={() => setCategoryToEdit(null)} category={categoryToEdit} onSuccess={() => setCategoryToEdit(null)} />
      )}
      <QuestionDialog
        open={deleteDialogOpen}
        title={t("delete.title")}
        confirmText={tCommon("delete")}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onOpenChange={setDeleteDialogOpen}
        description={t("delete.confirmMessage", { name: categoryToDelete?.name || "" })}
      />
    </div>
  );
};

export default CategoryList;
