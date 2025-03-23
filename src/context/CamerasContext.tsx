import { ReactNode, createContext, useState } from 'react'
import { SORT } from 'src/enum/commonEnum'
import { ICameraClientReq, MCameraList, MClientCameraList } from 'src/model/cameras/CamerasModel'

export type CamerasValuesType = {
  clientCameraData: MClientCameraList | null
  setClientCameraData: React.Dispatch<React.SetStateAction<MClientCameraList | null>>

  clientListReq: ICameraClientReq
  setClientListReq: (clientListReq: ICameraClientReq) => void

  groupAddMod: boolean
  setGroupAddMod: React.Dispatch<React.SetStateAction<boolean>>

  cameraGroupLinkDisplay: boolean
  setCameraGroupLinkDisplay: React.Dispatch<React.SetStateAction<boolean>>

  tempClientCameraData: MClientCameraList | null
  setTempClientCameraData: React.Dispatch<React.SetStateAction<MClientCameraList | null>>

  clear: () => void

  updateClientCameraData: (id: number, updatedFields: Partial<MCameraList>) => void
  handleEditClick: (row: MCameraList) => void
  handleSaveClick: (id: number) => void
  handleCancelClick: (id: number) => void
}

// ** Defaults
const defaultProvider: CamerasValuesType = {
  clientCameraData: { cameraList: [], groupList: [] },
  setClientCameraData: () => null,

  clientListReq: { sort: 'id', order: SORT.DESC },
  setClientListReq: () => null,

  groupAddMod: false,
  setGroupAddMod: () => null,

  cameraGroupLinkDisplay: false,
  setCameraGroupLinkDisplay: () => null,

  tempClientCameraData: null,
  setTempClientCameraData: () => null,

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
  const [groupAddMod, setGroupAddMod] = useState<boolean>(defaultProvider.groupAddMod)
  const [cameraGroupLinkDisplay, setCameraGroupLinkDisplay] = useState<boolean>(defaultProvider.cameraGroupLinkDisplay)

  const [tempClientCameraData, setTempClientCameraData] = useState<MClientCameraList | null>(null)

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

  const handleSaveClick = (id: number) => {
    setTempClientCameraData(prevData => {
      if (!prevData) return null
      const updatedCameraList = prevData.cameraList.filter(camera => camera.id !== id)

      return { ...prevData, cameraList: updatedCameraList }
    })
  }

  const handleCancelClick = (id: number) => {
    if (!tempClientCameraData) return
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
    groupAddMod,
    setGroupAddMod,
    cameraGroupLinkDisplay,
    setCameraGroupLinkDisplay,
    tempClientCameraData,
    setTempClientCameraData,
    clear,
    updateClientCameraData,
    handleEditClick,
    handleSaveClick,
    handleCancelClick
  }

  return <CamerasContext.Provider value={values}>{children}</CamerasContext.Provider>
}
export { CamerasContext, CamerasProvider }
