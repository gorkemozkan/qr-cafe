"use client";

import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip } from "@/components/ui/tooltip";
import Link from "next/link";

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
        <Tooltip>
          <div className="flex items-center space-x-2">
            {props.additionalActions && props.additionalActions}
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg">
                <MoreHorizontal className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
          </div>
        </Tooltip>

        <DropdownMenuContent align="end">
          {props.to && (
            <DropdownMenuItem asChild>
              <Link href={props.to}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
          )}
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
