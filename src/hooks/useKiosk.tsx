import { useContext } from 'react'
import { KioskContext } from 'src/context/KioskContext'

export const useKiosk = () => useContext(KioskContext)
