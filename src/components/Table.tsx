import { IconSortAscending, IconSortDescending, IconDots } from '@tabler/icons-solidjs'
import { createSolidTable, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel } from '@tanstack/solid-table'
import type { ColumnDef, ColumnFilter, ColumnSort, RowSelectionState, Row as TanstackRow } from '@tanstack/solid-table'
import { For, Show, createSignal, mergeProps, type Component } from 'solid-js'

const Table: Component<{ columnData: Record<string, unknown>[], columns: ColumnDef<Record<string, unknown>, any>[] }> = (props) => {
  const merged = mergeProps({
    enableRowSelection: () => true
  }, props)

  const [sorting, sortingSet] = createSignal<ColumnSort[]>()
  const [rowSelection, rowSelectionSet] = createSignal<RowSelectionState>()
  const [columnFilters, setColumnFilters] = createSignal<ColumnFilter[]>()

  const solidTable = createSolidTable({
    get data() {
      return merged.columnData ?? []
    },
    // eslint-disable-next-line solid/reactivity
    columns: merged.columns ?? [],
    state: {
      get rowSelection() {
        return rowSelection()
      },
      get sorting() {
        return sorting()
      },
      get columnFilters() {
        return columnFilters()
      }
    },
    enableRowSelection: (row: TanstackRow<Record<string, unknown>>) => merged.enableRowSelection(row),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: sortingSet,
    onRowSelectionChange: rowSelectionSet
  })

  return (
    // <section class="no-scrollbar table-rounded-md max-w-xl7 w-full overflow-auto rounded-md border border-gray-200 bg-white drop-shadow-sm">
    <section class="no-scrollbar table-rounded-md max-w-xl7 w-full overflow-auto rounded-md border">
      <table class="table w-full">
        <thead>
          <For each={solidTable.getHeaderGroups()}>{(headerGroup) => (
            // <tr class="items-center border-b border-b-gray-200 text-left font-semibold capitalize">
            <tr class="border-b font-semibold">
              <For each={headerGroup.headers}>{(header) => (
                <th colSpan={header.colSpan}>
                  <Show when={!header.isPlaceholder}>
                    <div
                      class={`${header.column.getCanSort() ? 'cursor-pointer select-none' : ''} flex items-center gap-x-2 p-4`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}

                      {{
                        asc: <IconSortAscending />,
                        desc: <IconSortDescending />,
                      }[header.column.getIsSorted() as string]
                        ?? (header.column.getCanSort() ? (
                          <IconDots />
                        ) : null)}
                    </div>
                  </Show>
                </th>
              )}</For>
            </tr>
          )}</For>
        </thead>

        <tbody>
          <For each={solidTable.getRowModel().rows}>{(row) => (
            // <tr class="border-b border-b-gray-200 hover:bg-gray-50">
            <tr class="hover:bg-gray-600">
              <For each={row.getVisibleCells()}>{(cell) => (
                <td class="p-4 text-right">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              )}</For>
            </tr>
          )}</For>
        </tbody>
      </table>
    </section>
  )
}

export default Table