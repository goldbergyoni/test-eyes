import { useState, memo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
import type { SortingState, ColumnDef, Header, Table, Row } from '@tanstack/react-table'

interface DataTableProps<T> {
  data: T[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<T, any>[]
  defaultSort?: SortingState[0]
}

function DataTableInner<T>({
  data,
  columns,
  defaultSort,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>(
    defaultSort ? [defaultSort] : []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  })

  return (
    <table className="w-full border-collapse">
      <TableHead table={table} />
      <TableBody table={table} />
    </table>
  )
}

export const DataTable = memo(DataTableInner) as typeof DataTableInner

// Sub-components

interface TableHeadProps<T> {
  table: Table<T>
}

function TableHead<T>({ table }: TableHeadProps<T>) {
  return (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr
          key={headerGroup.id}
          className="border-b border-gray-700"
        >
          {headerGroup.headers.map((header) => (
            <HeaderCell key={header.id} header={header} />
          ))}
        </tr>
      ))}
    </thead>
  )
}

interface HeaderCellProps<T> {
  header: Header<T, unknown>
}

function HeaderCell<T>({ header }: HeaderCellProps<T>) {
  const sorted = header.column.getIsSorted()
  const sortIndicator = sorted === 'asc' ? ' ↑' : sorted === 'desc' ? ' ↓' : ''

  return (
    <th
      className="text-left p-3 font-semibold cursor-pointer hover:bg-gray-800"
      onClick={header.column.getToggleSortingHandler()}
    >
      {flexRender(header.column.columnDef.header, header.getContext())}
      {sortIndicator}
    </th>
  )
}

interface TableBodyProps<T> {
  table: Table<T>
}

function TableBody<T>({ table }: TableBodyProps<T>) {
  return (
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <TableRow key={row.id} row={row} />
      ))}
    </tbody>
  )
}

interface TableRowProps<T> {
  row: Row<T>
}

function TableRow<T>({ row }: TableRowProps<T>) {
  return (
    <tr className="border-b border-gray-800 hover:bg-gray-800">
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="p-3">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  )
}
