import { IconSortAscending, IconSortDescending, IconDots } from '@tabler/icons-solidjs'
import { createSolidTable, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel } from '@tanstack/solid-table'
import type { ColumnDef, ColumnFilter, ColumnSort, RowSelectionState, Row as TanstackRow } from '@tanstack/solid-table'
import { useAtom } from 'solid-jotai'
import { For, Show, createSignal, mergeProps, onCleanup, type Component } from 'solid-js'

import { checkedAppNamesAtom } from '../store/atoms'
import { checkedAppNamesStore } from '../store/stores'

/** Source: https://stackoverflow.com/a/77891659 */
const Table: Component<{
  columnData: Record<string, unknown>[]
  columns: ColumnDef<Record<string, unknown>, any>[]
  item: string
}> = (props) => {
  const merged = mergeProps({
    // TODO check if _row is correct
    // https://tanstack.com/table/latest/docs/api/features/row-selection#enablerowselection
    enableRowSelection: (_row: TanstackRow<Record<string, unknown>>) => true
  }, props)

  const [sorting, sortingSet] = createSignal<ColumnSort[]>()
  const [rowSelection, setRowSelection] = createSignal<RowSelectionState>()
  const [columnFilters, setColumnFilters] = createSignal<ColumnFilter[]>()
  const [checkedAppNames, setCheckedAppNames] = useAtom(checkedAppNamesAtom, { store: checkedAppNamesStore })

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
    onRowSelectionChange: (row) => {
      setRowSelection(row as RowSelectionState)
      const v = Object.keys(rowSelection()!)
      const o = v.length === 0
        ? (({
          // remove category
          [props.item as Category]: _,
          ...rest
        }) => rest)(checkedAppNames())
        : {
          ...checkedAppNames(),
          [props.item as Category]: v.map((rs) => merged.columnData[Number.parseInt(rs, 10)].appName)
        }
      setCheckedAppNames(o as CheckedAppNames)
    }
  })

  onCleanup(() => {
    setCheckedAppNames((({
      [props.item as Category]: _,
      ...rest
    }) => rest)(checkedAppNames()) as CheckedAppNames)
  })

  return (
    // <section class="no-scrollbar table-rounded-md max-w-xl7 w-full overflow-auto rounded-md border border-gray-200 bg-white drop-shadow-sm">
    <section class="w-full overflow-auto rounded-md border">
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
                        desc: <IconSortDescending />
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
            <tr id={row.id} class="hover:bg-gray-600">
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