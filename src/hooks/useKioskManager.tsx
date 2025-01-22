import { useContext } from 'react'
import { KioskManagerContext } from 'src/context/KioskManagerContext'

export const useKioskManager = () => useContext(KioskManagerContext)
