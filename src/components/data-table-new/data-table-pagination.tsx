import { type Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
  /**
   * Bắt buộc cho SSR để hiển thị đúng tổng số bản ghi.
   * Với CSR, mặc định lấy từ table.getFilteredRowModel().rows.length
   */
  totalItems?: number;
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 50, 100],
  totalItems,
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;

  // Với manualPagination, TanStack dùng pageCount truyền vào useReactTable.
  const pageCount = table.getPageCount();
  const safePageCount = Math.max(1, pageCount);
  const displayPage = Math.min(pageIndex + 1, safePageCount);
  const lastPageIndex = Math.max(0, safePageCount - 1);
  const isFirstPage = pageIndex <= 0;
  const isLastPage = pageIndex >= safePageCount - 1;

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalCount = totalItems ?? table.getFilteredRowModel().rows.length;

  return (
    <div className="flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Selected count */}
      <div className="flex-1 text-sm text-muted-foreground">
        Đã chọn {selectedCount} / {totalCount}
      </div>

      {/* Right: Controls */}
      <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-6 lg:gap-8">
        {/* Page size selector */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium whitespace-nowrap">Hiển thị</p>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
              table.setPageIndex(0);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page info */}
        <div className="flex items-center justify-center text-sm font-medium whitespace-nowrap min-w-[90px]">
          Trang {displayPage} / {safePageCount}
        </div>

        {/* Page navigation */}
        <div className="flex items-center space-x-2">
          <PaginationButton
            onClick={() => table.setPageIndex(0)}
            disabled={isFirstPage}
            className="hidden sm:flex"
            title="Trang đầu"
          >
            <ChevronsLeft className="h-4 w-4" />
          </PaginationButton>

          <PaginationButton
            onClick={() => table.previousPage()}
            disabled={isFirstPage}
            title="Trang trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </PaginationButton>

          <PaginationButton
            onClick={() => table.nextPage()}
            disabled={isLastPage}
            title="Trang sau"
          >
            <ChevronRight className="h-4 w-4" />
          </PaginationButton>

          <PaginationButton
            onClick={() => table.setPageIndex(lastPageIndex)}
            disabled={isLastPage}
            className="hidden sm:flex"
            title="Trang cuối"
          >
            <ChevronsRight className="h-4 w-4" />
          </PaginationButton>
        </div>
      </div>
    </div>
  );
}

function PaginationButton({
  onClick,
  disabled,
  children,
  className,
  title,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <Button
      variant="outline"
      className={cn("h-8 w-8 p-0", className)}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="sr-only">{title || "Nút phân trang"}</span>
      {children}
    </Button>
  );
}
