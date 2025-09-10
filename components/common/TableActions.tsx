"use client";

import { Edit, Eye, Link, MoreHorizontal, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip } from "@/components/ui/tooltip";

interface Props {
  onEdit?: () => void;
  onDelete?: () => void;
  onInspect?: () => void;
  to?: string;
  rowData?: any;
  additionalActions?: React.ReactNode;
}

const TableActions: FC<Props> = (props) => {
  const tCommon = useTranslations("common");
  const hasEdit = !!props.onEdit;

  const hasDelete = !!props.onDelete;

  const hasInspect = !!props.onInspect;

  const actionCount = [hasEdit, hasDelete, hasInspect].filter(Boolean).length;

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

    if (props.to) {
      return (
        <Button asChild variant="outline" size="sm" className="h-8 w-8 p-0">
          <Link href={props.to}>
            <Eye className="h-4 w-4" />
          </Link>
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
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </div>
        </Tooltip>

        <DropdownMenuContent align="end">
          {hasEdit && (
            <DropdownMenuItem onClick={props.onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              {tCommon("edit")}
            </DropdownMenuItem>
          )}

          {hasInspect && (
            <DropdownMenuItem onClick={props.onInspect}>
              <Eye className="mr-2 h-4 w-4" />
              {tCommon("view")}
            </DropdownMenuItem>
          )}
          {hasDelete && (
            <DropdownMenuItem onClick={props.onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              {tCommon("delete")}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return null;
};

export default TableActions;
