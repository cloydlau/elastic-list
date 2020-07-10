let isTable, editable, rowCount, rowTemplate, elTableProps

export const init = (opts = {}) => {
    isTable = opts.isTable
    elTableProps = opts.elTableProps
    editable = opts.editable
    rowCount = opts.rowCount
    rowTemplate = opts.rowTemplate
}

export {
    isTable, elTableProps, editable, rowCount, rowTemplate
}
