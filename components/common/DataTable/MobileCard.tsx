import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Column } from "./types";
import { BaseEntity } from "./types";

interface MobileCardProps<T extends BaseEntity> {
  item: T;
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
}

export function MobileCard<T extends BaseEntity>({ item, columns, onRowClick }: MobileCardProps<T>) {
  const handleClick = () => onRowClick?.(item);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onRowClick?.(item);
    }
  };

  return (
    <div
      className={`bg-transparent border rounded-lg p-4 space-y-3 shadow-sm ${onRowClick ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}`}
      {...(onRowClick && {
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        tabIndex: 0,
        role: "button",
      })}
    >
      {columns.map((column) => {
        const value = item[column.key as keyof T];
        const displayValue = column.cell ? column.cell(value, item) : String(value ?? "-");

        if (!displayValue || displayValue === "-") return null;

        return (
          <div key={String(column.key)} className="flex justify-between items-start gap-2">
            <div className="text-sm font-medium text-muted-foreground flex items-center gap-1 min-w-0 flex-1">
              <span className="truncate">{column.header}</span>
              {column.tooltipText && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3 w-3 cursor-help text-muted-foreground hover:text-foreground transition-colors flex-shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{column.tooltipText}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <div className="text-sm text-foreground text-right min-w-0">{displayValue}</div>
          </div>
        );
      })}
    </div>
  );
}
