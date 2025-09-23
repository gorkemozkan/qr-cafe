"use client";

import { FC } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";

interface Props {
  onEdit?: () => void;
  onDelete?: () => void;
  to?: string;
  rowData?: any;
  additionalActions?: React.ReactNode;
}

const TableActions: FC<Props> = (props) => {
  const hasEdit = !!props.onEdit;
  const hasDelete = !!props.onDelete;
  const hasView = !!props.to;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onEdit?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onDelete?.();
  };

  const hasAnyActions = hasEdit || hasDelete || hasView || props.additionalActions;

  if (!hasAnyActions) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {props.additionalActions}
      {hasView && props.to && (
        <Button asChild variant="outline" size="sm" className="h-8 w-8 p-0">
          <Link href={props.to} onClick={(e) => e.stopPropagation()}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      )}
      {hasEdit && (
        <Button variant="outline" size="sm" onClick={handleEdit} className="h-8 w-8 p-0">
          <Edit className="h-4 w-4" />
        </Button>
      )}
      {hasDelete && (
        <Button variant="outline" size="sm" onClick={handleDelete} className="h-8 w-8 p-0">
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default TableActions;
