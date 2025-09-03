"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface TableActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  rowData?: any;
}

const TableActions: FC<TableActionsProps> = (props) => {
  const hasEdit = !!props.onEdit;
  const hasDelete = !!props.onDelete;
  const actionCount = [hasEdit, hasDelete].filter(Boolean).length;

  if (actionCount === 1) {
    if (hasEdit) {
      return (
        <Button variant="outline" size="sm" onClick={props.onEdit} className="h-8 w-8 p-0">
          <Edit className="h-4 w-4" />
        </Button>
      );
    }

    if (hasDelete) {
      return (
        <Button variant="outline" size="sm" onClick={props.onDelete} className="h-8 w-8 p-0 ">
          <Trash2 className="h-4 w-4" />
        </Button>
      );
    }
  }

  if (actionCount > 1) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {hasEdit && (
            <DropdownMenuItem onClick={props.onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          )}
          {hasDelete && (
            <DropdownMenuItem onClick={props.onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return null;
};

export default TableActions;
