let isTable, editable, count, rowTemplate, elTableProps

export const init = (opts = {}) => {
    isTable = opts.isTable
    elTableProps = opts.elTableProps
    editable = opts.editable
    count = opts.count
    rowTemplate = opts.rowTemplate
}

export {
    isTable, elTableProps, editable, count, rowTemplate
}
