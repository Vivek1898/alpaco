import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";

interface CryptoTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function CryptoTable<TData, TValue>({
  columns,
  data,
}: CryptoTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export const cryptoColumns = [
  {
    accessorKey: "rank",
    header: "Rank",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }: any) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.original.name}</span>
        <Badge variant="secondary">{row.original.symbol}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "quote.USD.price",
    header: "Price",
    cell: ({ row }: any) => (
      <span>${formatNumber(row.original.quote.USD.price)}</span>
    ),
  },
  {
    accessorKey: "quote.USD.percent_change_24h",
    header: "24h %",
    cell: ({ row }: any) => {
      const change = row.original.quote.USD.percent_change_24h;
      return (
        <span className={change >= 0 ? "text-green-500" : "text-red-500"}>
          {change.toFixed(2)}%
        </span>
      );
    },
  },
  {
    accessorKey: "quote.USD.market_cap",
    header: "Market Cap",
    cell: ({ row }: any) => (
      <span>${formatNumber(row.original.quote.USD.market_cap)}</span>
    ),
  },
  {
    accessorKey: "quote.USD.volume_24h",
    header: "Volume (24h)",
    cell: ({ row }: any) => (
      <span>${formatNumber(row.original.quote.USD.volume_24h)}</span>
    ),
  },
];