import { ReactNode } from "react";

// HTTP methods for sorting API
export type HttpMethod = "POST" | "PUT" | "PATCH";

// Column priority levels
export type ColumnPriority = "high" | "medium" | "low";

// Base entity interface
export interface BaseEntity {
  id?: number | string;
}

// Column configuration with improved type safety
export interface Column<T extends BaseEntity = BaseEntity> {
  key: keyof T | string;
  header: string;
  cell?: (value: T[keyof T], row: T) => ReactNode;
  className?: string;
  tooltipText?: string;
  hideOnMobile?: boolean;
  priority?: ColumnPriority;
}

// Sorting configuration with better type safety
export interface SortConfig<T extends BaseEntity = BaseEntity> {
  apiUrl?: string;
  method?: HttpMethod;
  getIdsFromItems?: (items: T[]) => (number | string)[];
  additionalParams?: {
    idsKey?: string;
    [key: string]: unknown;
  };
}

// DataTable component props with improved type safety
export interface DataTableProps<T extends BaseEntity = BaseEntity> {
  columns: Column<T>[];
  queryKey: string[];
  queryFn: () => Promise<T[]>;
  emptyMessage?: string;
  staleTime?: number;
  gcTime?: number;
  actions?: ReactNode;
  title?: string;
  mobileBreakpoint?: number;
  onRowClick?: (row: T) => void;
  enableSorting?: boolean;
  sortConfig?: SortConfig<T>;
  onSortOrderChange?: (items: T[]) => void; // Keep for backward compatibility
}

// Props for individual table row components
export interface TableRowProps<T extends BaseEntity = BaseEntity> {
  item: T;
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  enableSorting?: boolean;
}

// Keyboard event handler type
export type KeyboardEventHandler = (event: React.KeyboardEvent) => void;

// Mouse event handler type
export type MouseEventHandler = (event: React.MouseEvent) => void;

// Generic event handler for row interactions
export type RowEventHandler<T extends BaseEntity = BaseEntity> = (row: T) => void;
