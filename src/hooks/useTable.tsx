import { useContext } from 'react'
import { TableContext } from 'src/context/TableContext'

export const useTable = () => useContext(TableContext)
