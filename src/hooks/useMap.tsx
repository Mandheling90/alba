import { useContext } from 'react'
import { MapContext } from 'src/context/MapContext'

export const useMap = () => useContext(MapContext)
