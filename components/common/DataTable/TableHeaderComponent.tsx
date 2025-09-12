import { HelpCircle } from "lucide-react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Column, BaseEntity } from "./types";

interface TableHeaderComponentProps<T extends BaseEntity> {
  columns: Column<T>[];
  enableSorting?: boolean;
}

export function TableHeaderComponent<T extends BaseEntity>({ columns, enableSorting }: TableHeaderComponentProps<T>) {
  return (
    <TableHeader>
      <TableRow>
        {enableSorting && <TableHead className="w-8" />}
        {columns.map((column) => (
          <TableHead key={String(column.key)} className={column.className}>
            <div className="flex items-center gap-1">
              <span>{column.header}</span>
              {column.tooltipText && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3 w-3 cursor-help text-muted-foreground hover:text-foreground transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{column.tooltipText}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
