import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { X, RefreshCcw, FileDown, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  isLoading?: boolean;
  onReload?: () => void | Promise<unknown>;
  onPrint?: () => void;
  dataLength?: number;
  searchPlaceholder?: string;
  hiddenSearch?: boolean;
  // Filter toolbar
  filterToolbar?: React.ReactNode;
  // Delete multiple rows
  onDeleteMultiple?: (selectedRows: any[]) => void;
  enableCheckbox?: boolean;
}

export function DataTableToolbar<TData>({
  table,
  isLoading,
  onReload,
  onPrint,
  dataLength = 0,
  searchPlaceholder = "Tìm kiếm...",
  hiddenSearch = false,
  filterToolbar,
  onDeleteMultiple,
  enableCheckbox = false,
}: DataTableToolbarProps<TData>) {
  const [valueSearchInput, setValueSearchInput] = useState<string>("");
  const [isReloading, setIsReloading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isSpinning = Boolean(isLoading || isReloading);
  const isFiltered =
    table.getState().columnFilters.length > 0 || !!table.getState().globalFilter;

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedRowsCount = selectedRows.length;

  const handleReload = () => {
    if (!onReload || isReloading) return;
    setIsReloading(true);
    try {
      const result = onReload();
      if (result && typeof (result as PromiseLike<unknown>).then === "function") {
        void Promise.resolve(result).finally(() => setIsReloading(false));
        return;
      }
    } catch {
      setIsReloading(false);
      return;
    }
    setIsReloading(false);
  };

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValueSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      table.setGlobalFilter(value);
    }, 500);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {!hiddenSearch && (
          <Input
            type="search"
            placeholder={searchPlaceholder}
            className="m-1 pl-4 md:w-[300px] lg:w-[400px]"
            value={valueSearchInput}
            onChange={handleSearchInput}
            disabled={isLoading}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              table.setGlobalFilter("");
              setValueSearchInput("");
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
        {filterToolbar}
      </div>

      <div className="flex items-center gap-2">
        {enableCheckbox && onDeleteMultiple && selectedRowsCount > 0 && (
          <Button
            onClick={() => onDeleteMultiple(selectedRows)}
            disabled={isLoading}
            className="h-8 bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa ({selectedRowsCount})
          </Button>
        )}

        {onPrint && (
          <Button
            variant="outline"
            size="icon"
            onClick={onPrint}
            disabled={isLoading || dataLength === 0}
            title="In báo cáo"
            className="h-8 w-8"
          >
            <FileDown className="h-4 w-4" />
          </Button>
        )}

        {onReload && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleReload}
            disabled={isSpinning}
            title="Tải lại dữ liệu"
            className="h-8 w-8"
          >
            <RefreshCcw className={cn("h-4 w-4", isSpinning && "animate-spin")} />
          </Button>
        )}

        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
