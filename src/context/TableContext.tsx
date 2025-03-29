import { ReactNode, createContext, useState } from 'react'

export type TableValuesType = {
  selectedRow: { [key: string]: any }
  setSelectedRow: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
  setSelectedRowFn: (tableId: string, row: any) => void
  clearSelection: (tableId: string) => void
  clearAllSelections: () => void
  isMergedSelection: boolean
}

const defaultProvider: TableValuesType = {
  selectedRow: {},
  setSelectedRow: () => null,
  setSelectedRowFn: () => null,
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
  const [selectedRow, setSelectedRow] = useState<{ [key: string]: any }>({})

  const setSelectedRowFn = (tableId: string, row: any) => {
    if (isMergedSelection) {
      setSelectedRow(prev => ({
        ...Object.fromEntries(Object.keys(prev).map(key => [key, row]))
      }))
    } else {
      setSelectedRow(prev => ({
        ...prev,
        [tableId]: row
      }))
    }
  }

  const clearSelection = (tableId: string) => {
    setSelectedRow(prev => {
      const newState = { ...prev }
      delete newState[tableId]

      return newState
    })
  }

  const clearAllSelections = () => {
    setSelectedRow({})
  }

  const values: TableValuesType = {
    selectedRow,
    setSelectedRow,
    setSelectedRowFn,
    clearSelection,
    clearAllSelections,
    isMergedSelection
  }

  return <TableContext.Provider value={values}>{children}</TableContext.Provider>
}
export { TableContext, TableProvider }
