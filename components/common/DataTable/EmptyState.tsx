interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center h-32">
      <div className="text-muted-foreground">{message}</div>
    </div>
  );
}
