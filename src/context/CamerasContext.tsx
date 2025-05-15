import { ReactNode, createContext, useEffect, useRef, useState } from 'react'
import SimpleDialogModal, { INITIAL_DIALOG_PROPS } from 'src/@core/components/molecule/SimpleDialogModal'
import { SORT } from 'src/enum/commonEnum'
import { useAuth } from 'src/hooks/useAuth'
import { useLayout } from 'src/hooks/useLayout'
import {
  ICameraClientReq,
  MClientCameraList,
  MClientCameraListForSave,
  MClientGroupCameraList
} from 'src/model/cameras/CamerasModel'
import {
  useClientCameraAdditionalInfo,
  useClientCameraAdditionalInfoV2,
  useClientCameraList,
  useClientGroupCameraItemAdd,
  useClientGroupCameraItemDelete,
  useClientGroupCameraList,
  useClientGroupUpdate
} from 'src/service/cameras/camerasService'

export interface IViewType {
  type: 'map' | 'image' | 'newImage'
  size: 'full' | 'half'
}

export type CameraPageType = 'cameras' | 'user-setting' | undefined

export type CamerasValuesType = {
  clientCameraData: MClientCameraList[] | null
  setClientCameraData: React.Dispatch<React.SetStateAction<MClientCameraList[] | null>>

  clientCameraDataOrigin: MClientCameraList[] | null
  setClientCameraDataOrigin: React.Dispatch<React.SetStateAction<MClientCameraList[] | null>>

  clientGroupCameraData: MClientGroupCameraList[] | null
  setClientGroupCameraData: React.Dispatch<React.SetStateAction<MClientGroupCameraList[] | null>>

  clientGroupCameraDataOrigin: MClientGroupCameraList[] | null
  setClientGroupCameraDataOrigin: React.Dispatch<React.SetStateAction<MClientGroupCameraList[] | null>>

  clientListReq: ICameraClientReq
  setClientListReq: (clientListReq: ICameraClientReq) => void

  groupModifyId: number | null
  setGroupModifyId: React.Dispatch<React.SetStateAction<number | null>>

  isGroupModifyMode: boolean
  setIsGroupModifyMode: React.Dispatch<React.SetStateAction<boolean>>

  selectedCamera: MClientCameraList[] | null
  setSelectedCamera: React.Dispatch<React.SetStateAction<MClientCameraList[] | null>>

  mapModifyModCameraId: number | null
  setMapModifyModCameraId: React.Dispatch<React.SetStateAction<number | null>>

  viewType: IViewType
  setViewType: React.Dispatch<React.SetStateAction<IViewType>>

  clear: () => void

  updateClientCameraData: (cameraNo: number, updatedFields: Partial<MClientCameraList>) => void
  updateGroupCameraData: (
    groupId: number,
    cameraNo: number | undefined,
    updatedFields: Partial<MClientCameraList | MClientGroupCameraList>
  ) => void

  handleSaveClick: (cameraNo: number | undefined) => void
  handleCancelClick: (cameraNo: number | undefined) => void

  handleGroupSaveClick: (groupId: number | undefined) => void
  handleGroupCancelClick: (groupId: number | undefined) => void

  fetchData: () => void

  handleGroupCameraItemAdd: (groupId: number, cameraNo: number) => void
  handleGroupCameraItemDelete: (groupItem: number) => void
  removeDuplicateCameras: () => MClientCameraList[]

  addClientCamera: (newCamera: MClientCameraList) => void
  deleteClientCamera: (cameraNo: number) => void
  addGroupCamera: (groupId: number, newCamera: MClientCameraList) => void
  deleteGroupCamera: (groupId: number, cameraNo: number | undefined) => void

  cameraPage: CameraPageType
  setCameraPage: React.Dispatch<React.SetStateAction<CameraPageType>>
}

// ** Defaults
const defaultProvider: CamerasValuesType = {
  clientCameraData: null,
  setClientCameraData: () => null,

  clientCameraDataOrigin: null,
  setClientCameraDataOrigin: () => null,

  clientGroupCameraData: null,
  setClientGroupCameraData: () => null,

  clientGroupCameraDataOrigin: null,
  setClientGroupCameraDataOrigin: () => null,

  clientListReq: { sort: 'id', order: SORT.DESC },
  setClientListReq: () => null,

  groupModifyId: null,
  setGroupModifyId: () => null,

  isGroupModifyMode: false,
  setIsGroupModifyMode: () => null,

  selectedCamera: [],
  setSelectedCamera: () => null,

  mapModifyModCameraId: null,
  setMapModifyModCameraId: () => null,

  viewType: { type: 'map', size: 'half' },
  setViewType: () => null,

  clear: () => null,

  updateClientCameraData: () => null,
  updateGroupCameraData: () => null,

  handleSaveClick: () => null,
  handleCancelClick: () => null,

  handleGroupSaveClick: () => null,
  handleGroupCancelClick: () => null,

  fetchData: () => null,

  handleGroupCameraItemDelete: () => null,
  handleGroupCameraItemAdd: () => null,
  removeDuplicateCameras: () => [],

  addClientCamera: () => null,
  deleteClientCamera: () => null,
  addGroupCamera: () => null,
  deleteGroupCamera: () => null,

  cameraPage: undefined,
  setCameraPage: () => null
}

const CamerasContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const CamerasProvider = ({ children }: Props) => {
  const { companyNo } = useLayout()
  const { user } = useAuth()

  const { mutateAsync: getClientCameraList } = useClientCameraList()
  const { mutateAsync: getClientGroupCameraList } = useClientGroupCameraList()
  const { mutateAsync: clientGroupCameraItemDelete } = useClientGroupCameraItemDelete()
  const { mutateAsync: clientGroupCameraItemAdd } = useClientGroupCameraItemAdd()
  const { mutateAsync: clientCameraAdditionalInfo } = useClientCameraAdditionalInfo()
  const { mutateAsync: clientCameraAdditionalInfoV2 } = useClientCameraAdditionalInfoV2()
  const { mutateAsync: clientGroupUpdate } = useClientGroupUpdate()

  const [clientCameraData, setClientCameraData] = useState<MClientCameraList[] | null>(defaultProvider.clientCameraData)
  const [clientCameraDataOrigin, setClientCameraDataOrigin] = useState<MClientCameraList[] | null>(
    defaultProvider.clientCameraDataOrigin
  )

  const [clientGroupCameraData, setClientGroupCameraData] = useState<MClientGroupCameraList[] | null>(
    defaultProvider.clientGroupCameraData
  )
  const [clientGroupCameraDataOrigin, setClientGroupCameraDataOrigin] = useState<MClientGroupCameraList[] | null>(
    defaultProvider.clientGroupCameraDataOrigin
  )

  const [clientListReq, setClientListReq] = useState<ICameraClientReq>(defaultProvider.clientListReq)
  const [groupModifyId, setGroupModifyId] = useState<number | null>(defaultProvider.groupModifyId)
  const [isGroupModifyMode, setIsGroupModifyMode] = useState<boolean>(defaultProvider.isGroupModifyMode)

  const [selectedCamera, setSelectedCamera] = useState<MClientCameraList[] | null>(defaultProvider.selectedCamera)
  const [mapModifyModCameraId, setMapModifyModCameraId] = useState<number | null>(defaultProvider.mapModifyModCameraId)

  const [viewType, setViewType] = useState<IViewType>(defaultProvider.viewType)
  const [cameraPage, setCameraPage] = useState<CameraPageType>(defaultProvider.cameraPage)

  const [simpleDialogModalProps, setSimpleDialogModalProps] = useState(INITIAL_DIALOG_PROPS)

  const clientCameraDataRef = useRef(clientCameraData)
  useEffect(() => {
    clientCameraDataRef.current = clientCameraData
  }, [clientCameraData])

  const clientCameraDataOriginRef = useRef(clientCameraDataOrigin)
  useEffect(() => {
    clientCameraDataOriginRef.current = clientCameraDataOrigin
  }, [clientCameraDataOrigin])

  const clientGroupCameraDataRef = useRef(clientGroupCameraData)
  useEffect(() => {
    clientGroupCameraDataRef.current = clientGroupCameraData
  }, [clientGroupCameraData])

  const clientGroupCameraDataOriginRef = useRef(clientGroupCameraDataOrigin)
  useEffect(() => {
    clientGroupCameraDataOriginRef.current = clientGroupCameraDataOrigin
  }, [clientGroupCameraDataOrigin])

  const clear = () => {
    // setLayoutDisplay(defaultProvider.layoutDisplay)
  }

  const updateClientCameraData = (cameraNo: number, updatedFields: Partial<MClientCameraList>) => {
    setClientCameraData((prevData: MClientCameraList[] | null) => {
      if (!prevData) return prevData

      // 카메라 리스트 업데이트
      if (cameraNo !== undefined) {
        const existingIndex = prevData.findIndex((camera: MClientCameraList) => camera.cameraNo === cameraNo)

        if (existingIndex !== -1) {
          const updatedCameraList = [...prevData]
          const { ...restFields } = updatedFields
          updatedCameraList[existingIndex] = {
            ...updatedCameraList[existingIndex],
            ...restFields
          }

          return updatedCameraList
        }
      }

      // 기타 필드 업데이트
      return { ...prevData, ...updatedFields }
    })
  }

  const updateGroupCameraData = (
    groupId: number,
    cameraNo: number | undefined,
    updatedFields: Partial<MClientCameraList | MClientGroupCameraList>
  ) => {
    setClientGroupCameraData((prevData: MClientGroupCameraList[] | null) => {
      if (!prevData) return prevData

      const groupIndex = prevData.findIndex(group => group.groupId === groupId)
      if (groupIndex === -1) return prevData

      const updatedGroupList = [...prevData]
      const group = updatedGroupList[groupIndex]

      // cameraNo가 제공되지 않은 경우 그룹 정보만 업데이트
      if (cameraNo === undefined) {
        updatedGroupList[groupIndex] = {
          ...group,
          ...updatedFields
        }

        return updatedGroupList
      }

      // cameraNo가 제공된 경우 기존 로직대로 카메라 정보 업데이트
      const cameraIndex = group.groupItemList.findIndex(camera => camera.cameraNo === cameraNo)
      if (cameraIndex === -1) return prevData

      updatedGroupList[groupIndex] = {
        ...group,
        groupItemList: group.groupItemList.map((camera, idx) =>
          idx === cameraIndex ? { ...camera, ...updatedFields } : camera
        )
      }

      return updatedGroupList
    })
  }

  const handleSaveClick = async (cameraNo: number | undefined) => {
    if (!clientCameraDataRef.current) return

    // 전체 저장의 경우
    if (!cameraNo) {
      try {
        const filteredCameraData: MClientCameraListForSave[] = clientCameraDataRef.current
          .filter(camera => camera.isEdit)
          .map(camera => {
            const { lat, lon, flowPlanX, flowPlanY, ...rest } = camera

            return camera.flowPlanBindingYN === 'Y' ? { ...rest, flowPlanX, flowPlanY } : { ...rest, lat, lon }
          })

        const res = await clientCameraAdditionalInfoV2({ companyNo: companyNo, cameraList: filteredCameraData })
        console.log(res)
        fetchData()

        return
      } catch (error) {
        console.error('추가 정보 저장 오류:', error)

        return
      }
    }

    // 특정 카메라 저장의 경우
    try {
      const updatedCamera = clientCameraDataRef.current.find(
        (camera: MClientCameraList) => camera.cameraNo === cameraNo
      )
      if (!updatedCamera) return

      const { lat, lon, flowPlanX, flowPlanY, ...rest } = updatedCamera
      const filteredCamera: MClientCameraListForSave =
        updatedCamera.flowPlanBindingYN === 'Y' ? { ...rest, flowPlanX, flowPlanY } : { ...rest, lat, lon }

      const res = await clientCameraAdditionalInfoV2({
        companyNo: companyNo,
        cameraList: [filteredCamera]
      })

      console.log(res)

      setClientCameraDataOrigin(prevData => {
        if (!prevData) return clientCameraDataRef.current

        const existingIndex = prevData.findIndex((camera: MClientCameraList) => camera.cameraNo === cameraNo)
        if (existingIndex === -1) return prevData

        const updatedCameraList = [...prevData]
        updatedCameraList[existingIndex] = updatedCamera

        return updatedCameraList
      })
    } catch (error) {
      console.error('추가 정보 저장 오류:', error)

      return
    }
  }

  const handleCancelClick = (cameraNo: number | undefined) => {
    if (!clientCameraDataOriginRef.current) return

    if (!cameraNo) {
      // 전체 취소의 경우 origin 데이터로 복원
      setClientCameraData(clientCameraDataOriginRef.current)

      return
    }

    // 특정 카메라 취소의 경우
    setClientCameraData(prevData => {
      if (!prevData) return null

      // 현재 데이터에서 해당 카메라의 인덱스 찾기
      const existingIndex = prevData.findIndex((camera: MClientCameraList) => camera.cameraNo === cameraNo)
      if (existingIndex === -1) return prevData

      // origin 데이터에서 해당 카메라 찾기
      const originalCamera = clientCameraDataOriginRef.current?.find(
        (camera: MClientCameraList) => camera.cameraNo === cameraNo
      )
      if (!originalCamera) return prevData

      // 새로운 배열 생성 및 업데이트
      const updatedCameraList = prevData.map((camera: MClientCameraList) =>
        camera.cameraNo === cameraNo ? originalCamera : camera
      )

      return updatedCameraList
    })
  }

  const handleGroupSaveClick = async (groupId: number | undefined) => {
    if (!clientGroupCameraDataRef.current) return

    if (!groupId) {
      // 전체 저장의 경우 현재 데이터를 origin으로 저장
      const modifiedGroupList = clientGroupCameraDataRef.current.map(group => {
        const isExistingGroup = clientGroupCameraDataOriginRef.current?.some(
          originGroup => originGroup.groupId === group.groupId
        )

        return {
          ...group,
          groupId: isExistingGroup ? group.groupId : 0
        }
      })

      const res = await clientGroupUpdate({ companyNo: companyNo, groupList: modifiedGroupList })
      fetchData()

      return
    }

    // 특정 그룹 저장의 경우
    try {
      const updatedGroup = clientGroupCameraDataRef.current.find(
        (group: MClientGroupCameraList) => group.groupId === groupId
      )
      if (!updatedGroup) return

      const isExistingGroup = clientGroupCameraDataOriginRef.current?.some(
        originGroup => originGroup.groupId === groupId
      )
      const modifiedGroup = {
        ...updatedGroup,
        groupId: isExistingGroup ? updatedGroup.groupId : 0
      }

      const res = await clientGroupUpdate({ companyNo: companyNo, groupList: [modifiedGroup] })

      console.log(res)

      setClientGroupCameraDataOrigin(prevData => {
        if (!prevData) return clientGroupCameraDataRef.current

        const existingIndex = prevData.findIndex((group: MClientGroupCameraList) => group.groupId === groupId)
        if (existingIndex === -1) return prevData

        const updatedGroupList = [...prevData]
        updatedGroupList[existingIndex] = updatedGroup

        return updatedGroupList
      })
    } catch (error) {
      console.error('그룹 정보 저장 오류:', error)

      return
    }
  }

  const handleGroupCancelClick = (groupId: number | undefined) => {
    if (!clientGroupCameraDataOriginRef.current) return

    if (!groupId) {
      // 전체 취소
      setClientGroupCameraData(clientGroupCameraDataOriginRef.current)

      return
    }

    // 특정 그룹 취소의 경우
    setClientGroupCameraData(prevData => {
      if (!prevData) return null

      // origin 데이터에서 해당 그룹 찾기
      const originalGroup = clientGroupCameraDataOriginRef.current?.find(
        (group: MClientGroupCameraList) => group.groupId === groupId
      )

      // origin에 없는 그룹인 경우 해당 그룹을 제외
      if (!originalGroup) {
        return prevData.filter(group => group.groupId !== groupId)
      }

      // origin에 있는 그룹인 경우 원래 데이터로 복원
      const updatedGroupList = prevData.map((group: MClientGroupCameraList) =>
        group.groupId === groupId ? originalGroup : group
      )

      return updatedGroupList
    })
  }

  const fetchData = async () => {
    const clientGroupCameraList = await getClientGroupCameraList({ companyNo: companyNo })
    const clientCameraList = await getClientCameraList({ companyNo: companyNo })

    const clientGroupCameraListItems: MClientGroupCameraList[] = Array.isArray(clientGroupCameraList?.data)
      ? clientGroupCameraList.data.map(item => ({
          ...item,
          groupItemList: item.groupItemList.map(item => ({
            ...item,
            isEdit: false
          }))
        }))
      : []

    const clientCameraListItems: MClientCameraList[] = clientCameraList.data.map(item => ({
      ...item,
      isEdit: false
    }))

    // 각 카메라에 대해 groupId 설정
    const updatedClientCameraListItems = clientCameraListItems.map(camera => {
      let foundGroupId: number | undefined = undefined

      // 모든 그룹을 순회하면서 해당 카메라가 속한 그룹을 찾습니다
      for (const group of clientGroupCameraListItems) {
        const isInGroup = group.groupItemList.some(item => item.cameraNo === camera.cameraNo)
        if (isInGroup) {
          foundGroupId = group.groupId
          break
        }
      }

      return {
        ...camera,
        groupId: foundGroupId
      }
    })

    setClientCameraData(updatedClientCameraListItems)
    setClientCameraDataOrigin(updatedClientCameraListItems)
    setClientGroupCameraData(clientGroupCameraListItems)
    setClientGroupCameraDataOrigin(clientGroupCameraListItems)
  }

  const handleGroupCameraItemAdd = async (groupId: number, cameraNo: number) => {
    await clientGroupCameraItemAdd({ groupId, cameraNo })
    fetchData()
  }

  const handleGroupCameraItemDelete = async (groupItem: number) => {
    await clientGroupCameraItemDelete({ groupItem })
    fetchData()
  }

  const removeDuplicateCameras = (): MClientCameraList[] => {
    if (!groupModifyId) return clientCameraDataRef.current ?? []

    const groupCameraNos = new Set(
      clientGroupCameraDataRef.current
        ?.find(group => group.groupId === groupModifyId)
        ?.groupItemList.map(item => item.cameraNo) ?? []
    )

    return clientCameraDataRef.current?.filter(item => !groupCameraNos.has(item.cameraNo)) ?? []
  }

  const addClientCamera = (newCamera: MClientCameraList) => {
    setClientCameraData((prevData: MClientCameraList[] | null) => {
      if (!prevData) return [newCamera]

      return [...prevData, newCamera]
    })
  }

  const deleteClientCamera = (cameraNo: number) => {
    setClientCameraData((prevData: MClientCameraList[] | null) => {
      if (!prevData) return null

      return prevData.filter(camera => camera.cameraNo !== cameraNo)
    })
  }

  const addGroupCamera = (groupId: number, newCamera: MClientCameraList) => {
    setClientGroupCameraData((prevData: MClientGroupCameraList[] | null) => {
      if (!prevData) return null

      const groupIndex = prevData.findIndex(group => group.groupId === groupId)
      if (groupIndex === -1) return prevData

      const updatedGroupList = [...prevData]
      const group = updatedGroupList[groupIndex]

      // 그룹에 이미 카메라가 있는 경우
      if (group.groupItemList.length > 0) {
        // 기존 카메라들의 flowPlanBindingYN 상태 확인
        const existingFlowPlanBindingYN = group.groupItemList[0].flowPlanBindingYN

        // 새로 추가하려는 카메라의 flowPlanBindingYN이 기존과 다르면 추가하지 않음
        if (existingFlowPlanBindingYN !== newCamera.flowPlanBindingYN) {
          setSimpleDialogModalProps({
            open: true,
            title: '카메라 추가 오류',
            contents: '카메라는 그룹에는 한 종류의 카메라만 추가할 수 있습니다.'
          })

          return prevData
        }
      }

      updatedGroupList[groupIndex] = {
        ...group,
        groupItemList: [...group.groupItemList, newCamera]
      }

      return updatedGroupList
    })
  }

  const deleteGroupCamera = (groupId: number, cameraNo: number | undefined) => {
    setClientGroupCameraData((prevData: MClientGroupCameraList[] | null) => {
      if (!prevData) return null

      // cameraNo가 undefined인 경우 그룹 전체 삭제
      if (cameraNo === undefined) {
        return prevData.filter(group => group.groupId !== groupId)
      }

      // 특정 카메라만 삭제하는 기존 로직
      const groupIndex = prevData.findIndex(group => group.groupId === groupId)
      if (groupIndex === -1) return prevData

      const updatedGroupList = [...prevData]
      const group = updatedGroupList[groupIndex]

      updatedGroupList[groupIndex] = {
        ...group,
        groupItemList: group.groupItemList.filter(camera => camera.cameraNo !== cameraNo)
      }

      return updatedGroupList
    })
  }

  const values: CamerasValuesType = {
    clientCameraData,
    setClientCameraData,
    clientCameraDataOrigin,
    setClientCameraDataOrigin,
    clientGroupCameraData,
    setClientGroupCameraData,
    clientGroupCameraDataOrigin,
    setClientGroupCameraDataOrigin,
    clientListReq,
    setClientListReq,
    groupModifyId,
    setGroupModifyId,
    isGroupModifyMode,
    setIsGroupModifyMode,
    updateClientCameraData,
    selectedCamera,
    setSelectedCamera,
    mapModifyModCameraId,
    setMapModifyModCameraId,
    viewType,
    setViewType,
    clear,
    handleSaveClick,
    handleCancelClick,
    updateGroupCameraData,
    handleGroupSaveClick,
    handleGroupCancelClick,
    fetchData,
    handleGroupCameraItemDelete,
    handleGroupCameraItemAdd,
    removeDuplicateCameras,
    addClientCamera,
    deleteClientCamera,
    addGroupCamera,
    deleteGroupCamera,
    cameraPage,
    setCameraPage
  }

  return (
    <CamerasContext.Provider value={values}>
      <SimpleDialogModal
        open={simpleDialogModalProps.open}
        onClose={() => {
          setSimpleDialogModalProps(INITIAL_DIALOG_PROPS)
        }}
        title={simpleDialogModalProps.title}
        contents={simpleDialogModalProps.contents}
      />
      {children}
    </CamerasContext.Provider>
  )
}
export { CamerasContext, CamerasProvider }
