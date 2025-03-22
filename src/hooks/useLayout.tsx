import { useContext } from 'react'
import { LayoutContext } from 'src/context/LayoutContext'

export const useLayout = () => useContext(LayoutContext)
