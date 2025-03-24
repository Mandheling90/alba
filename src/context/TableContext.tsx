import { ReactNode, createContext, useState } from 'react'

export type TableValuesType = {
  combineselectedRows: { [key: string]: any }
  setSelectedRow: (tableId: string, row: any) => void
  clearSelection: (tableId: string) => void
  clearAllSelections: () => void
  isMergedSelection: boolean
}

const defaultProvider: TableValuesType = {
  combineselectedRows: {},
  setSelectedRow: () => null,
  clearSelection: () => null,
  clearAllSelections: () => null,
  isMergedSelection: false
}

const TableContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
  isMergedSelection?: boolean
}

const TableProvider = ({ children, isMergedSelection = false }: Props) => {
  const [combineselectedRows, setCombineselectedRows] = useState<{ [key: string]: any }>({})

  const setSelectedRow = (tableId: string, row: any) => {
    if (isMergedSelection) {
      setCombineselectedRows(prev => ({
        ...Object.fromEntries(Object.keys(prev).map(key => [key, row]))
      }))
    } else {
      setCombineselectedRows(prev => ({
        ...prev,
        [tableId]: row
      }))
    }
  }

  const clearSelection = (tableId: string) => {
    setCombineselectedRows(prev => {
      const newState = { ...prev }
      delete newState[tableId]

      return newState
    })
  }

  const clearAllSelections = () => {
    setCombineselectedRows({})
  }

  const values: TableValuesType = {
    combineselectedRows,
    setSelectedRow,
    clearSelection,
    clearAllSelections,
    isMergedSelection
  }

  return <TableContext.Provider value={values}>{children}</TableContext.Provider>
}
export { TableContext, TableProvider }
