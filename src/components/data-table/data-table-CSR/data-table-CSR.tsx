import React, { useEffect, useRef } from "react";
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
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
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "../data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  noResults?: React.ReactNode;
  onSelectedItems?: (rows: any) => void;
  // Props mới 
  isLoading?: boolean;
  onReload?: () => void;
  onRowClick?: (data: TData) => void;
  searchPlaceholder?: string;
  hiddenSearch?: boolean;
  titleTable?: string;
  descripTable?: string;
  enableSorting?: boolean;
  customActions?: React.ReactNode;
  className?: string;
  tableClassName?: string;
  // Filter toolbar
  filterToolbar?: React.ReactNode;
  // Checkbox selection
  enableCheckbox?: boolean;
  // Delete multiple rows
  onDeleteMultiple?: (selectedRows: any[]) => void;
}

function TableSkeleton({ columns }: { columns: number }) {
  return (
    <TableRow className="hover:bg-transparent">
      {Array.from({ length: columns }).map((_, i) => (
        <TableCell key={i}>
          <Skeleton className="w-full h-6" />
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTableCSR<TData, TValue>({
  columns,
  data,
  noResults,
  onSelectedItems,
  isLoading,
  onReload,
  onRowClick,
  searchPlaceholder = "Tìm kiếm...",
  hiddenSearch = false,
  titleTable,
  descripTable,
  enableSorting = true,
  customActions,
  className,
  tableClassName,
  filterToolbar,
  enableCheckbox = false,
  onDeleteMultiple,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const onSelectedItemsRef = useRef(onSelectedItems);

  // Cập nhật ref khi onSelectedItems thay đổi
  useEffect(() => {
    onSelectedItemsRef.current = onSelectedItems;
  }, [onSelectedItems]);

  // Tự động thêm checkbox column nếu enableCheckbox là true
  const columnsWithCheckbox = React.useMemo(() => {
    if (!enableCheckbox) return columns;

    // Kiểm tra xem đã có checkbox column chưa
    const hasCheckboxColumn = columns.some((col) => col.id === "select");
    if (hasCheckboxColumn) return columns;

    // Thêm checkbox column vào đầu
    const checkboxColumn: ColumnDef<TData, TValue> = {
      id: "select",
      header: ({ table }) => {
        const isAllSelected = table.getIsAllPageRowsSelected();
        const isSomeSelected = table.getIsSomePageRowsSelected();

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={isAllSelected || (isSomeSelected ? "indeterminate" : false)}
              onCheckedChange={(checked) => table.toggleAllPageRowsSelected(!!checked)}
              aria-label="Select all"
            />
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={row.getIsSelected() || false}
              onCheckedChange={(checked) => row.toggleSelected(!!checked)}
              aria-label="Select row"
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    };

    return [checkboxColumn, ...columns];
  }, [columns, enableCheckbox]);

  const table = useReactTable({
    data,
    columns: columnsWithCheckbox,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: enableCheckbox || !!onSelectedItems,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  useEffect(() => {
    if (onSelectedItemsRef.current) {
      const selectedRows = table.getFilteredSelectedRowModel().rows;
      onSelectedItemsRef.current(selectedRows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getFilteredSelectedRowModel().rows.length]);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const tableHtml = document.getElementById("data-table-csr")?.outerHTML;
    if (!tableHtml) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${titleTable || "Báo cáo dữ liệu"}</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .print-header { margin-bottom: 20px; }
            .print-footer { margin-top: 20px; text-align: right; font-size: 12px; color: #666; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h2>${titleTable || "Báo cáo dữ liệu"}</h2>
            <p>Ngày in: ${new Date().toLocaleDateString("vi-VN")} ${new Date().toLocaleTimeString("vi-VN")}</p>
          </div>
          ${tableHtml}
          <div class="print-footer">
            <p>Trang 1</p>
          </div>
          <div class="no-print">
            <button onclick="window.print()">In báo cáo</button>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      {(titleTable || descripTable || customActions) && (
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            {titleTable && <h2 className="text-2xl font-bold">{titleTable}</h2>}
            {descripTable && <p className="text-sm text-muted-foreground">{descripTable}</p>}
          </div>
          {customActions && <div className="flex items-center gap-2">{customActions}</div>}
        </div>
      )}

      <DataTableToolbar
        table={table}
        isLoading={isLoading}
        onReload={onReload}
        onPrint={handlePrint}
        dataLength={data.length}
        searchPlaceholder={searchPlaceholder}
        hiddenSearch={hiddenSearch}
        filterToolbar={filterToolbar}
        onDeleteMultiple={onDeleteMultiple}
        enableCheckbox={enableCheckbox}
      />

      {/* Table */}
      <div className={cn("rounded-md border overflow-x-auto overflow-y-hidden", tableClassName)}>
        <Table id="data-table-csr">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableSkeleton key={index} columns={columnsWithCheckbox.length} />
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    onRowClick && "cursor-pointer hover:bg-muted/50",
                    row.getIsSelected() && "bg-muted/50"
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="h-40">
                <TableCell
                  colSpan={columnsWithCheckbox.length}
                  className="h-24 text-center"
                >
                  {noResults ? noResults : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}