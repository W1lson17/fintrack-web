import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTablePagination } from "./DataTablePagination";

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  isLoading?: boolean;
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  emptyMessage?: string;
}

/**
 * DataTable component
 *
 * Generic server-side paginated table built with TanStack Table + ShadCN.
 * Accepts typed column definitions and data — reusable across all features.
 * Shows skeleton rows while loading — preserves table structure during fetch.
 */
export const DataTable = <TData,>({
  columns,
  data,
  isLoading = false,
  pagination,
  onPageChange,
  onLimitChange,
  emptyMessage = "No records found.",
}: DataTableProps<TData>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Server-side pagination — we manage state externally
    manualPagination: true,
    pageCount: pagination.totalPages,
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {/* Loading state — skeleton rows matching column count */}
            {isLoading &&
              Array.from({ length: pagination.limit }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {/* Data rows */}
            {!isLoading &&
              table.getRowModel().rows.length > 0 &&
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {/* Empty state */}
            {!isLoading && table.getRowModel().rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-40 text-center text-sm"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        page={pagination.page}
        limit={pagination.limit}
        total={pagination.total}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </div>
  );
};
