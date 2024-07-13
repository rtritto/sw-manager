import { Row as TanstackRow, Table as TanstackTable } from '@tanstack/solid-table'
import { Show } from 'solid-js'
import type { Component, JSX } from 'solid-js'

const Checkbox: Component<JSX.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input type="checkbox" class="checkbox bg-slate-700" {...props} />
  )
}

const selectColumn = {
  id: "select",
  header: (props: { table: TanstackTable<Record<string, unknown>> }) => (
    <Checkbox
      {...{
        checked: props.table.getIsAllRowsSelected(),
        indeterminate: !props.table.getIsAllRowsSelected() && props.table.getIsSomeRowsSelected(),
        onChange: props.table.getToggleAllRowsSelectedHandler()
      }}
    />
  ),
  cell: (props: { row: TanstackRow<Record<string, unknown>> }) => (
    <Show when={props.row.getCanSelect()}>
      <div class="px-1">
        <Checkbox
          {...{
            checked: props.row.getIsSelected(),
            indeterminate: props.row.getIsSomeSelected(),
            onChange: props.row.getToggleSelectedHandler()
          }}
        />
      </div>
    </Show>
  ),
  enableSorting: false
}

export default selectColumn