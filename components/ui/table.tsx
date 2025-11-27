import * as React from "react"
import { cn } from "@/lib/utils"

export const Table = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) => (
  <table
    className={cn("w-full border-collapse text-sm", className)}
    {...props}
  />
)

export const TableHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn("bg-muted/50", className)} {...props} />
)

export const TableBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn("", className)} {...props} />
)

export const TableFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tfoot className={cn("bg-muted/50 font-medium", className)} {...props} />
)

export const TableRow = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    className={cn(
      "border-b last:border-0 even:bg-muted/30 hover:bg-accent/30 transition-colors",
      className
    )}
    {...props}
  />
)

export const TableHead = ({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cn(
      "text-left px-4 py-2 font-medium text-muted-foreground align-middle",
      className
    )}
    {...props}
  />
)

export const TableCell = ({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td
    className={cn("px-4 py-2 align-top", className)}
    {...props}
  />
)

export const TableCaption = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCaptionElement>) =>
  React.createElement("caption", {
    className: cn("mt-2 text-xs text-muted-foreground", className),
    ...props,
  })

export default Table
