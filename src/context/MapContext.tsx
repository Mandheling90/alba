import { ReactNode, createContext, useState } from 'react'
import { defaultMapInfo } from 'src/enum/mapEnum'
import { MMapInfo } from 'src/model/map/MapModel'

export type MapValuesType = {
  mapInfo: MMapInfo
  setMapInfo: (value: MMapInfo) => void

  clear: () => void
}

// ** Defaults
const defaultProvider: MapValuesType = {
  mapInfo: defaultMapInfo,
  setMapInfo: () => null,

  clear: () => null
}

const MapContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const MapProvider = ({ children }: Props) => {
  const [mapInfo, setMapInfo] = useState(defaultProvider.mapInfo)

  const values: MapValuesType = {
    mapInfo: mapInfo,
    setMapInfo: setMapInfo,
    clear: defaultProvider.clear
  }

  return <MapContext.Provider value={values}>{children}</MapContext.Provider>
}

export { MapContext, MapProvider }
