import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/data-table/data-table-CSR/data-table-view-options";
import { X, RefreshCcw, FileDown, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import _ from "lodash";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  // Props mới
  isLoading?: boolean;
  onReload?: () => void;
  onPrint?: () => void;
  dataLength?: number;
  searchPlaceholder?: string;
  hiddenSearch?: boolean;
  customActions?: React.ReactNode;
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
  customActions,
  filterToolbar,
  onDeleteMultiple,
  enableCheckbox = false,
}: DataTableToolbarProps<TData>) {
  const [valueSearchInput, setValueSearchInput] = useState<string>("");
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    !!table.getState().globalFilter;
  
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedRowsCount = selectedRows.length;

  const debouncedSearch = useCallback(
    _.debounce((value) => {
      table.setGlobalFilter(value);
    }, 500),
    []
  );

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueSearchInput(event.target.value);
    debouncedSearch(event.target.value);
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
        {/* Filter Toolbar - truyền vào thì hiện */}
        {filterToolbar}
      </div>

      <div className="flex items-center gap-2">
        {/* Delete multiple button - chỉ hiện khi có checkbox và có hàng được chọn */}
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

        {/* Print button */}
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

        {/* Reload button */}
        {onReload && (
          <Button
            variant="outline"
            size="icon"
            onClick={onReload}
            disabled={isLoading}
            title="Tải lại dữ liệu"
            className="h-8 w-8"
          >
            <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        )}

        <DataTableViewOptions table={table} />

        {/* Custom actions */}
        {customActions}
      </div>
    </div>
  );
}