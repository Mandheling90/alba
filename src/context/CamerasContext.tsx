import { ReactNode, createContext, useState } from 'react'
import { SORT } from 'src/enum/commonEnum'
import { MLocationState } from 'src/model/cameras/CamerasModel'
import { MContent, MContentReq } from 'src/model/contents/contentsModel'

export type CamerasValuesType = {
  contentListReqPram: MContentReq
  setContentListReqPram: (contentListReqPram: MContentReq) => void

  loading: boolean
  setLoading: (value: boolean) => void

  errors: Partial<Record<keyof MContent, string>>
  setErrors: (errors: Partial<Record<keyof MContent, string>>) => void

  selectedContent: Partial<MContent>
  setSelectedContent: (selectedContent: Partial<MContent>) => void

  selectedContentIds: number[]
  setSelectedContentIds: (selectedContentIds: number[]) => void

  mapLevel: number
  setMapLevel: (value: number) => void

  locationSelect: MLocationState
  setLocationSelect: (value: MLocationState, individual?: boolean) => void

  locationSelectIndividual: MLocationState

  mapDisplayMode: string
  setMapDisplayMode: (value: string) => void
}

// ** Defaults
const defaultProvider: CamerasValuesType = {
  contentListReqPram: { sort: 'id', order: SORT.DESC },
  setContentListReqPram: () => null,

  loading: true,
  setLoading: () => Boolean,

  errors: {},
  setErrors: () => null,

  selectedContent: {},
  setSelectedContent: () => null,

  selectedContentIds: [],
  setSelectedContentIds: () => null,

  mapLevel: 0, // add this property
  setMapLevel: () => null, // add this property

  locationSelect: {} as MLocationState, // add this property
  setLocationSelect: () => null, // add this property

  locationSelectIndividual: {} as MLocationState, // add this property

  mapDisplayMode: '', // add this property
  setMapDisplayMode: () => null // add this property
}

const CamerasContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const CamerasProvider = ({ children }: Props) => {
  // ** States
  const [selectedContent, setSelectedContent] = useState<Partial<MContent>>(defaultProvider.selectedContent)
  const [contentListReqPram, setContentListReqPram] = useState<MContentReq>(defaultProvider.contentListReqPram)
  const [selectedContentIds, setSelectedContentIds] = useState(defaultProvider.selectedContentIds)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [errors, setErrors] = useState<Partial<Record<keyof MContent, string>>>({})
  const [mapLevel, setMapLevel] = useState(defaultProvider.mapLevel)
  const [mapDisplayMode, setMapDisplayMode] = useState(defaultProvider.mapDisplayMode)
  const [locationSelect, setLocationSelect] = useState(defaultProvider.locationSelect)
  const [locationSelectIndividual, setLocationSelectIndividual] = useState(defaultProvider.locationSelectIndividual)

  const values: CamerasValuesType = {
    contentListReqPram,
    setContentListReqPram,
    loading,
    setLoading,
    errors,
    setErrors,
    selectedContent,
    setSelectedContent,
    selectedContentIds,
    setSelectedContentIds,
    mapLevel,
    setMapLevel,
    locationSelect,
    locationSelectIndividual,
    setLocationSelect,
    mapDisplayMode,
    setMapDisplayMode
  }

  return <CamerasContext.Provider value={values}>{children}</CamerasContext.Provider>
}
export { CamerasContext, CamerasProvider }
