"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto rounded-lg border border-border/50 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm shadow-lg shadow-black/5"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm min-w-[600px] md:min-w-0", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "[&_tr]:border-b border-border/60 bg-gradient-to-r from-primary/5 via-transparent to-primary/5",
        className,
      )}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 border-t border-border/60 font-semibold [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-gradient-to-r hover:from-primary/5 hover:via-transparent hover:to-primary/5 data-[state=selected]:bg-primary/10 border-b border-border/40 transition-all duration-200 ease-out hover:shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-12 px-3 sm:px-4 text-left align-middle font-semibold whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-xs sm:text-sm bg-gradient-to-r from-foreground/90 to-foreground bg-clip-text text-transparent",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-3 sm:p-4 align-middle [&:has([role=checkbox])]:pr-0 [&:has([role=checkbox])]:translate-y-[2px] text-xs sm:text-sm text-muted-foreground/90 transition-colors duration-200",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return (
    <caption data-slot="table-caption" className={cn("text-muted-foreground mt-4 text-sm", className)} {...props} />
  );
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
