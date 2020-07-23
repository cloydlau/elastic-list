let sortable, editable, count, rowTemplate, elTableProps

export const init = (opts = {}) => {
  sortable = opts.sortable
  elTableProps = opts.elTableProps
  editable = opts.editable
  count = opts.count
  rowTemplate = opts.rowTemplate
}

export {
  sortable, elTableProps, editable, count, rowTemplate
}
