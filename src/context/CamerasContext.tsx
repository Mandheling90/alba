import { ReactNode, createContext, useState } from 'react'
import { SORT } from 'src/enum/commonEnum'
import { ICameraClient, ICameraClientDetailReq, ICameraClientReq, ILocationState } from 'src/model/cameras/CamerasModel'

export type CamerasValuesType = {
  layoutDisplay: boolean
  setLayoutDisplay: (layoutDisplay: boolean) => void

  clientListReq: ICameraClientReq
  setClientListReq: (clientListReq: ICameraClientReq) => void

  clientCameraDetailListReq: ICameraClientDetailReq
  setClientCameraDetailListReq: (clientCameraDetailListReq: ICameraClientDetailReq) => void

  loading: boolean
  setLoading: (value: boolean) => void

  errors: Partial<Record<keyof ICameraClient, string>>
  setErrors: (errors: Partial<Record<keyof ICameraClient, string>>) => void

  selectedContent: Partial<ICameraClient>
  setSelectedContent: (selectedContent: Partial<ICameraClient>) => void

  selectedContentIds: number[]
  setSelectedContentIds: (selectedContentIds: number[]) => void

  mapLevel: number
  setMapLevel: (value: number) => void

  locationSelect: ILocationState
  setLocationSelect: (value: ILocationState, individual?: boolean) => void

  locationSelectIndividual: ILocationState

  mapDisplayMode: string
  setMapDisplayMode: (value: string) => void

  clear: () => void
}

// ** Defaults
const defaultProvider: CamerasValuesType = {
  layoutDisplay: true,
  setLayoutDisplay: () => null,

  clientListReq: { sort: 'id', order: SORT.DESC },
  setClientListReq: () => null,

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

  locationSelect: {} as ILocationState, // add this property
  setLocationSelect: () => null, // add this property

  locationSelectIndividual: {} as ILocationState, // add this property

  mapDisplayMode: '', // add this property
  setMapDisplayMode: () => null, // add this property

  clientCameraDetailListReq: { clientId: '' },
  setClientCameraDetailListReq: () => null,

  clear: () => null
}

const CamerasContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const CamerasProvider = ({ children }: Props) => {
  const [layoutDisplay, setLayoutDisplay] = useState(defaultProvider.layoutDisplay)
  const [selectedContent, setSelectedContent] = useState<Partial<ICameraClient>>(defaultProvider.selectedContent)
  const [clientListReq, setClientListReq] = useState<ICameraClientReq>(defaultProvider.clientListReq)
  const [selectedContentIds, setSelectedContentIds] = useState(defaultProvider.selectedContentIds)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [errors, setErrors] = useState<Partial<Record<keyof ICameraClient, string>>>({})
  const [mapLevel, setMapLevel] = useState(defaultProvider.mapLevel)
  const [mapDisplayMode, setMapDisplayMode] = useState(defaultProvider.mapDisplayMode)
  const [locationSelect, setLocationSelect] = useState(defaultProvider.locationSelect)
  const [locationSelectIndividual, setLocationSelectIndividual] = useState(defaultProvider.locationSelectIndividual)
  const [clientCameraDetailListReq, setClientCameraDetailListReq] = useState<ICameraClientDetailReq>(
    defaultProvider.clientCameraDetailListReq
  )

  const clear = () => {
    // setLayoutDisplay(defaultProvider.layoutDisplay)
  }

  const values: CamerasValuesType = {
    layoutDisplay,
    setLayoutDisplay,

    clientListReq: clientListReq,
    setClientListReq,

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
    setMapDisplayMode,

    clientCameraDetailListReq: clientCameraDetailListReq,
    setClientCameraDetailListReq,

    clear
  }

  return <CamerasContext.Provider value={values}>{children}</CamerasContext.Provider>
}
export { CamerasContext, CamerasProvider }
