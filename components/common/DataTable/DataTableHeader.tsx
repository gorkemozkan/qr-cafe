import { ReactNode } from "react";
import RefreshButton from "@/components/common/RefreshButton";

interface DataTableHeaderProps {
  title?: string;
  actions?: ReactNode;
  isRefetching: boolean;
  onRefetch: () => Promise<any>;
}

export function DataTableHeader({ title, actions, isRefetching, onRefetch }: DataTableHeaderProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      {title ? <h2 className="text-xl font-semibold">{title}</h2> : <div />}
      <div className="flex justify-end gap-2">
        <RefreshButton loading={isRefetching} refetch={onRefetch} maxAttempt={3} />
        {actions}
      </div>
    </div>
  );
}
