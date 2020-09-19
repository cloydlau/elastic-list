let sortable, disabled, count, rowTemplate, elTableProps

export const init = (opts = {}) => {
  sortable = opts.sortable
  elTableProps = opts.elTableProps
  disabled = opts.disabled
  count = opts.count
  rowTemplate = opts.rowTemplate
}

export {
  sortable, elTableProps, disabled, count, rowTemplate
}
