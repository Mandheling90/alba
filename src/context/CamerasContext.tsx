import { ReactNode, createContext, useState } from 'react'
import { SORT } from 'src/enum/commonEnum'
import { ICameraClientReq, MCameraList, MClientCameraList } from 'src/model/cameras/CamerasModel'

export interface IViewType {
  type: 'map' | 'image'
  size: 'full' | 'half'
}

export type CamerasValuesType = {
  clientCameraData: MClientCameraList | null
  setClientCameraData: React.Dispatch<React.SetStateAction<MClientCameraList | null>>

  clientListReq: ICameraClientReq
  setClientListReq: (clientListReq: ICameraClientReq) => void

  groupModifyId: number | null
  setGroupModifyId: React.Dispatch<React.SetStateAction<number | null>>

  cameraGroupLinkDisplay: boolean
  setCameraGroupLinkDisplay: React.Dispatch<React.SetStateAction<boolean>>

  tempClientCameraData: MClientCameraList | null
  setTempClientCameraData: React.Dispatch<React.SetStateAction<MClientCameraList | null>>

  selectedCamera: MCameraList[] | null
  setSelectedCamera: React.Dispatch<React.SetStateAction<MCameraList[] | null>>

  mapModifyModCameraId: number | null
  setMapModifyModCameraId: React.Dispatch<React.SetStateAction<number | null>>

  viewType: IViewType
  setViewType: React.Dispatch<React.SetStateAction<IViewType>>

  clear: () => void

  updateClientCameraData: (id: number, updatedFields: Partial<MCameraList>) => void
  handleEditClick: (row: MCameraList) => void
  handleSaveClick: (id: number | undefined) => void
  handleCancelClick: (id: number | undefined) => void
}

// ** Defaults
const defaultProvider: CamerasValuesType = {
  clientCameraData: { cameraList: [], groupList: [] },
  setClientCameraData: () => null,

  clientListReq: { sort: 'id', order: SORT.DESC },
  setClientListReq: () => null,

  groupModifyId: null,
  setGroupModifyId: () => null,

  cameraGroupLinkDisplay: false,
  setCameraGroupLinkDisplay: () => null,

  tempClientCameraData: null,
  setTempClientCameraData: () => null,

  selectedCamera: [],
  setSelectedCamera: () => null,

  mapModifyModCameraId: null,
  setMapModifyModCameraId: () => null,

  viewType: { type: 'map', size: 'full' },
  setViewType: () => null,

  clear: () => null,

  updateClientCameraData: () => null,
  handleEditClick: () => null,
  handleSaveClick: () => null,
  handleCancelClick: () => null
}

const CamerasContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const CamerasProvider = ({ children }: Props) => {
  const [clientCameraData, setClientCameraData] = useState<MClientCameraList | null>(defaultProvider.clientCameraData)
  const [clientListReq, setClientListReq] = useState<ICameraClientReq>(defaultProvider.clientListReq)
  const [groupModifyId, setGroupModifyId] = useState<number | null>(defaultProvider.groupModifyId)
  const [cameraGroupLinkDisplay, setCameraGroupLinkDisplay] = useState<boolean>(defaultProvider.cameraGroupLinkDisplay)

  const [tempClientCameraData, setTempClientCameraData] = useState<MClientCameraList | null>(null)
  const [selectedCamera, setSelectedCamera] = useState<MCameraList[] | null>(null)
  const [mapModifyModCameraId, setMapModifyModCameraId] = useState<number | null>(defaultProvider.mapModifyModCameraId)

  const [viewType, setViewType] = useState<IViewType>(defaultProvider.viewType)

  const clear = () => {
    // setLayoutDisplay(defaultProvider.layoutDisplay)
  }

  const updateClientCameraData = (id: number, updatedFields: Partial<MCameraList>) => {
    setClientCameraData((prevData: MClientCameraList | null) => {
      if (!prevData || !prevData.cameraList) return prevData
      const existingIndex = prevData.cameraList.findIndex((camera: MCameraList) => camera.id === id)
      if (existingIndex !== -1) {
        const updatedCameraList = [...prevData.cameraList]
        updatedCameraList[existingIndex] = { ...updatedCameraList[existingIndex], ...updatedFields }

        return { ...prevData, cameraList: updatedCameraList }
      }

      return prevData
    })
  }

  const handleEditClick = (row: MCameraList) => {
    setTempClientCameraData(prevData => {
      if (!prevData) return { cameraList: [row], groupList: [] }
      const existingIndex = prevData.cameraList.findIndex(camera => camera.id === row.id)
      if (existingIndex !== -1) {
        const updatedCameraList = [...prevData.cameraList]
        updatedCameraList[existingIndex] = { ...updatedCameraList[existingIndex], ...row }

        return { ...prevData, cameraList: updatedCameraList }
      } else {
        return { ...prevData, cameraList: [...prevData.cameraList, row] }
      }
    })
  }

  const handleSaveClick = (id: number | undefined) => {
    setTempClientCameraData(prevData => {
      if (!prevData) return null
      const updatedCameraList = id ? prevData.cameraList.filter(camera => camera.id !== id) : []

      return { ...prevData, cameraList: updatedCameraList }
    })
  }

  const handleCancelClick = (id: number | undefined) => {
    if (!tempClientCameraData) return

    if (!id) {
      setClientCameraData(prevData => {
        if (!prevData) return null

        const updatedCameraList = prevData.cameraList.map(camera => {
          const tempCamera = tempClientCameraData.cameraList.find(temp => temp.id === camera.id)

          return tempCamera ? { ...camera, ...tempCamera } : camera
        })

        return {
          ...prevData,
          cameraList: updatedCameraList,
          groupList: prevData.groupList || []
        }
      })
      setTempClientCameraData(null)

      return
    }

    const cameraToCancel = tempClientCameraData.cameraList.find(camera => camera.id === id)
    if (!cameraToCancel) return
    setClientCameraData((prevData: MClientCameraList | null) => {
      if (!prevData || !prevData.cameraList) return prevData
      const updatedCameraList = prevData.cameraList.map((camera: MCameraList) =>
        camera.id === id ? { ...camera, ...cameraToCancel } : camera
      )

      return { ...prevData, cameraList: updatedCameraList }
    })
    setTempClientCameraData(prevData => {
      if (!prevData) return null
      const updatedCameraList = prevData.cameraList.filter(camera => camera.id !== id)

      return { ...prevData, cameraList: updatedCameraList }
    })
  }

  const values: CamerasValuesType = {
    clientCameraData,
    setClientCameraData,
    clientListReq,
    setClientListReq,
    groupModifyId,
    setGroupModifyId,
    cameraGroupLinkDisplay,
    setCameraGroupLinkDisplay,
    tempClientCameraData,
    setTempClientCameraData,
    updateClientCameraData,
    selectedCamera,
    setSelectedCamera,
    mapModifyModCameraId,
    setMapModifyModCameraId,
    viewType,
    setViewType,
    clear,
    handleEditClick,
    handleSaveClick,
    handleCancelClick
  }

  return <CamerasContext.Provider value={values}>{children}</CamerasContext.Provider>
}
export { CamerasContext, CamerasProvider }
