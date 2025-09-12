"use client";

import { FC } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

  const actionCount = [hasEdit, hasDelete].filter(Boolean).length;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onEdit?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onDelete?.();
  };

  if (actionCount > 1) {
    return (
      <div className="flex items-center gap-2">
        {props.additionalActions}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()} className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {props.to && (
              <DropdownMenuItem asChild>
                <Link href={props.to} onClick={(e) => e.stopPropagation()}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </DropdownMenuItem>
            )}
            {hasEdit && (
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            {hasDelete && (
              <DropdownMenuItem onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return null;
};

export default TableActions;
