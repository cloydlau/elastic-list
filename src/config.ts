let sortable, disabled, count, rowTemplate, elTableProps, watchValue, animate, sortablejsProps

export const init = (opts: {
  sortable?: boolean
  elTableProps?: object
  sortablejsProps?: object
  disabled?: boolean
  watchValue?: boolean
  count?: number | [number, number]
  rowTemplate?: any
  animate?: string
} = {}) => {
  sortable = opts.sortable
  elTableProps = opts.elTableProps
  sortablejsProps = opts.sortablejsProps
  disabled = opts.disabled
  watchValue = opts.watchValue
  count = opts.count
  rowTemplate = opts.rowTemplate
  animate = opts.animate
}

export {
  sortable, elTableProps, disabled, count, rowTemplate, watchValue, animate, sortablejsProps
}
