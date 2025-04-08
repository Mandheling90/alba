import { ReactNode, createContext, useState } from 'react'
import { SORT } from 'src/enum/commonEnum'
import { ICameraClientReq, MCameraList, MClientCameraList } from 'src/model/cameras/CamerasModel'

export interface IViewType {
  type: 'map' | 'image' | 'newImage'
  size: 'full' | 'half'
}

export type CamerasValuesType = {
  clientCameraData: MClientCameraList | null
  setClientCameraData: React.Dispatch<React.SetStateAction<MClientCameraList | null>>

  clientCameraDataOrigin: MClientCameraList | null
  setClientCameraDataOrigin: React.Dispatch<React.SetStateAction<MClientCameraList | null>>

  clientListReq: ICameraClientReq
  setClientListReq: (clientListReq: ICameraClientReq) => void

  groupModifyId: number | null
  setGroupModifyId: React.Dispatch<React.SetStateAction<number | null>>

  cameraGroupLinkDisplay: boolean
  setCameraGroupLinkDisplay: React.Dispatch<React.SetStateAction<boolean>>

  selectedCamera: MCameraList[] | null
  setSelectedCamera: React.Dispatch<React.SetStateAction<MCameraList[] | null>>

  mapModifyModCameraId: number | null
  setMapModifyModCameraId: React.Dispatch<React.SetStateAction<number | null>>

  viewType: IViewType
  setViewType: React.Dispatch<React.SetStateAction<IViewType>>

  clear: () => void

  updateClientCameraData: (
    id: number | undefined,
    updatedFields: Partial<MClientCameraList> | Partial<MCameraList>
  ) => void

  handleSaveClick: (id: number | undefined) => void
  handleCancelClick: (id: number | undefined) => void
}

// ** Defaults
const defaultProvider: CamerasValuesType = {
  clientCameraData: { cameraList: [], groupList: [] },
  setClientCameraData: () => null,

  clientCameraDataOrigin: { cameraList: [], groupList: [] },
  setClientCameraDataOrigin: () => null,

  clientListReq: { sort: 'id', order: SORT.DESC },
  setClientListReq: () => null,

  groupModifyId: null,
  setGroupModifyId: () => null,

  cameraGroupLinkDisplay: false,
  setCameraGroupLinkDisplay: () => null,

  selectedCamera: [],
  setSelectedCamera: () => null,

  mapModifyModCameraId: null,
  setMapModifyModCameraId: () => null,

  viewType: { type: 'map', size: 'full' },
  setViewType: () => null,

  clear: () => null,

  updateClientCameraData: () => null,

  // handleEditClick: () => null,
  handleSaveClick: () => null,
  handleCancelClick: () => null
}

const CamerasContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const CamerasProvider = ({ children }: Props) => {
  const [clientCameraData, setClientCameraData] = useState<MClientCameraList | null>(defaultProvider.clientCameraData)
  const [clientCameraDataOrigin, setClientCameraDataOrigin] = useState<MClientCameraList | null>(
    defaultProvider.clientCameraDataOrigin
  )

  const [clientListReq, setClientListReq] = useState<ICameraClientReq>(defaultProvider.clientListReq)
  const [groupModifyId, setGroupModifyId] = useState<number | null>(defaultProvider.groupModifyId)
  const [cameraGroupLinkDisplay, setCameraGroupLinkDisplay] = useState<boolean>(defaultProvider.cameraGroupLinkDisplay)

  const [selectedCamera, setSelectedCamera] = useState<MCameraList[] | null>(null)
  const [mapModifyModCameraId, setMapModifyModCameraId] = useState<number | null>(defaultProvider.mapModifyModCameraId)

  const [viewType, setViewType] = useState<IViewType>(defaultProvider.viewType)

  const clear = () => {
    // setLayoutDisplay(defaultProvider.layoutDisplay)
  }

  const updateClientCameraData = (
    id: number | undefined,
    updatedFields: Partial<MClientCameraList> | Partial<MCameraList>
  ) => {
    setClientCameraData((prevData: MClientCameraList | null) => {
      if (!prevData) return prevData

      // 카메라 리스트 업데이트
      if (id !== undefined) {
        const existingIndex = prevData.cameraList.findIndex((camera: MCameraList) => camera.id === id)
        if (existingIndex !== -1) {
          const updatedCameraList = [...prevData.cameraList]
          updatedCameraList[existingIndex] = { ...updatedCameraList[existingIndex], ...updatedFields }

          return { ...prevData, cameraList: updatedCameraList }
        }
      }

      // 그룹 리스트 업데이트
      if ('groupList' in updatedFields) {
        return { ...prevData, groupList: updatedFields.groupList || [] }
      }

      // floorPlan 업데이트
      if ('floorPlan' in updatedFields) {
        return { ...prevData, floorPlan: updatedFields.floorPlan }
      }

      // 기타 필드 업데이트
      return { ...prevData, ...updatedFields }
    })
  }

  const handleSaveClick = (id: number | undefined) => {
    if (!clientCameraData) return

    if (!id) {
      // 전체 저장의 경우 현재 데이터를 origin으로 저장
      setClientCameraDataOrigin(clientCameraData)

      return
    }

    // 특정 카메라 저장의 경우
    setClientCameraDataOrigin(prevData => {
      if (!prevData) return clientCameraData

      // 현재 데이터에서 해당 카메라 정보 가져오기
      const updatedCamera = clientCameraData.cameraList.find(camera => camera.id === id)
      if (!updatedCamera) return prevData

      // 카메라 리스트 업데이트
      const updatedCameraList = prevData.cameraList.map(camera => (camera.id === id ? updatedCamera : camera))

      return {
        ...prevData,
        cameraList: updatedCameraList,
        groupList: clientCameraData.groupList,
        floorPlan: clientCameraData.floorPlan
      }
    })
  }

  const handleCancelClick = (id: number | undefined) => {
    if (!clientCameraDataOrigin) return

    if (!id) {
      // 전체 취소의 경우 origin 데이터로 복원
      setClientCameraData(clientCameraDataOrigin)

      return
    }

    // 특정 카메라 취소의 경우
    setClientCameraData(prevData => {
      if (!prevData) return null

      // origin 데이터에서 해당 카메라 정보 가져오기
      const originalCamera = clientCameraDataOrigin.cameraList.find(camera => camera.id === id)
      if (!originalCamera) return prevData

      // 카메라 리스트 업데이트
      const updatedCameraList = prevData.cameraList.map(camera => (camera.id === id ? originalCamera : camera))

      // 그룹 리스트도 origin 데이터에서 가져오기
      const updatedGroupList = clientCameraDataOrigin.groupList

      return {
        ...prevData,
        cameraList: updatedCameraList,
        groupList: updatedGroupList,
        floorPlan: clientCameraDataOrigin.floorPlan
      }
    })
  }

  const values: CamerasValuesType = {
    clientCameraData,
    setClientCameraData,
    clientCameraDataOrigin,
    setClientCameraDataOrigin,
    clientListReq,
    setClientListReq,
    groupModifyId,
    setGroupModifyId,
    cameraGroupLinkDisplay,
    setCameraGroupLinkDisplay,
    updateClientCameraData,
    selectedCamera,
    setSelectedCamera,
    mapModifyModCameraId,
    setMapModifyModCameraId,
    viewType,
    setViewType,
    clear,
    handleSaveClick,
    handleCancelClick
  }

  return <CamerasContext.Provider value={values}>{children}</CamerasContext.Provider>
}
export { CamerasContext, CamerasProvider }
