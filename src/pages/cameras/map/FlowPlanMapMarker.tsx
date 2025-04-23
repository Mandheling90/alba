import React, { useEffect, useRef, useState } from 'react'
import { MapMarker } from 'react-kakao-maps-sdk'
import MapOverlay from './MapOverlay'

import SimpleDialogModal from 'src/@core/components/molecule/SimpleDialogModal'
import { YN } from 'src/enum/commonEnum'
import { defaultMapInfo } from 'src/enum/mapEnum'
import { useCameras } from 'src/hooks/useCameras'
import { useMap } from 'src/hooks/useMap'
import { MFlowPlan } from 'src/model/cameras/CamerasModel'

const INITIAL_DIALOG_PROPS = {
  open: false,
  title: '',
  contents: '',
  isSave: false,
  isImageUpdate: false
}

const FlowPlanMapMarker: React.FC<{
  flowPlan?: MFlowPlan
  setFlowPlan: (flowPlan: MFlowPlan) => void
  flowPlanOriginal?: MFlowPlan
  setFlowPlanOriginal: (flowPlan: MFlowPlan) => void
  imageUpdateFn: () => void
  locationUpdateFn: (flowPlan: MFlowPlan) => void
}> = ({ flowPlan, setFlowPlan, flowPlanOriginal, setFlowPlanOriginal, imageUpdateFn, locationUpdateFn }) => {
  // const [flowPlan, setFlowPlan] = useState<MFlowPlan>()
  // const [flowPlanOriginal, setFlowPlanOriginal] = useState<MFlowPlan>()

  // useEffect(() => {
  //   setFlowPlan(flowPlanData)
  //   setFlowPlanOriginal(flowPlanData)
  // }, [flowPlanData])

  const { mapInfo, setMapInfo } = useMap()

  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const [newImageAddMode, setNewImageAddMode] = useState(false)
  const [flowPlanInfo, setFlowPlanInfo] = useState<{ cameraId: string; cameraName: string }>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { clientCameraData, selectedCamera } = useCameras()

  // 좌표값이 없을 시 이미지 추가 모드로 변경
  useEffect(() => {
    if (flowPlan?.flowPlanImgUrl) {
      setNewImageAddMode(false)
    } else {
      setMapInfo(defaultMapInfo)
      setNewImageAddMode(true)
    }
  }, [flowPlan])

  useEffect(() => {
    //setFlowPlanInfo

    if (clientCameraData?.find(c => c.flowPlanBindingYN === YN.Y)) {
      setFlowPlanInfo({
        cameraId: clientCameraData?.find(c => c.flowPlanBindingYN === YN.Y)?.cameraId ?? '',
        cameraName: clientCameraData?.find(c => c.flowPlanBindingYN === YN.Y)?.cameraName ?? ''
      })
    }
  }, [clientCameraData])

  const [simpleDialogModalProps, setSimpleDialogModalProps] = useState(INITIAL_DIALOG_PROPS)

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()

    // reader.onloadend = () => {
    //   setClientCameraData(prevData => {
    //     if (!prevData) return null

    //     return {
    //       ...prevData,
    //       floorPlan: {
    //         ...prevData.floorPlan,
    //         floorPlanImageUrl: reader.result as string
    //       }
    //     }
    //   })
    // }
    reader.readAsDataURL(file)
  }

  const handleConfirm = () => {
    if (simpleDialogModalProps.isSave && flowPlan?.flowPlanImgUrl) {
      // 이미지가 이미 있는 경우 위치만 업데이트
      // handleSaveClick(undefined)
      locationUpdateFn(flowPlan)
    } else if ((simpleDialogModalProps.isSave && !flowPlan?.flowPlanImgUrl) || simpleDialogModalProps.isImageUpdate) {
      // 새로운 이미지 업로드 모드
      // fileInputRef.current?.click()
      imageUpdateFn()
    } else if (!simpleDialogModalProps.isSave) {
      // 취소 버튼 클릭 시
      if (flowPlanOriginal) {
        setFlowPlan(flowPlanOriginal)
      }
    }

    setSimpleDialogModalProps(INITIAL_DIALOG_PROPS)
  }

  return (
    <>
      <SimpleDialogModal
        open={simpleDialogModalProps.open}
        onClose={() => {
          setSimpleDialogModalProps(INITIAL_DIALOG_PROPS)
        }}
        onConfirm={handleConfirm}
        title={simpleDialogModalProps.title}
        contents={simpleDialogModalProps.contents}
        isConfirm
      />

      {(isHovering || selectedCamera?.find(c => c.flowPlanBindingYN === YN.Y)) &&
        !isDragging &&
        flowPlan?.flowPlanImgUrl &&
        flowPlanInfo?.cameraId &&
        flowPlanInfo?.cameraName && (
          <MapOverlay
            title={`${flowPlanInfo?.cameraId} | ${flowPlanInfo?.cameraName}`}
            position={{
              lat: flowPlan?.lat ?? 0,
              lng: flowPlan?.lon ?? 0
            }}
          />
        )}

      {(isDragging || !flowPlan?.flowPlanImgUrl) && (
        <MapOverlay
          title={'평면도 위치 저장'}
          position={{
            lat: flowPlan?.lat ?? 0,
            lng: flowPlan?.lon ?? 0
          }}
          onCancel={() => {
            setSimpleDialogModalProps({
              ...simpleDialogModalProps,
              open: true,
              isSave: false,
              title: flowPlan?.flowPlanImgUrl ? '평면도 위치변경 취소' : '평면도 등록 취소',
              contents: flowPlan?.flowPlanImgUrl
                ? '평면도 위치 변경을 취소하시겠습니까?'
                : '평면도 등록을 취소하시겠습니까?'
            })

            setIsDragging(false)
          }}
          onSave={() => {
            setSimpleDialogModalProps({
              ...simpleDialogModalProps,
              open: true,
              isSave: true,
              title: flowPlan?.flowPlanImgUrl ? '평면도 위치 변경' : '평면도 위치 저장 및 평면도 이미지 선택',
              contents: flowPlan?.flowPlanImgUrl
                ? '평면도 위치가 변경되었습니다. \r\n 변경된 위치를 저장하시겠습니까?'
                : '평면도 위치가 지정되었습니다.  \r\n 아래 "확인" 버튼 클릭 후 지정된 위치에 등록할 평면도 이미지를 선택해 주세요. \r\n 평면도 이미지는 "F1" 으로 등록됩니다.'
            })

            setIsDragging(false)
          }}
        />
      )}

      <MapMarker
        position={{
          lat: flowPlan?.lat ?? 0,
          lng: flowPlan?.lon ?? 0
        }}
        draggable={true}
        onDragEnd={e => {
          setIsDragging(true)
          const lat = e.getPosition().getLat()
          const lng = e.getPosition().getLng()
          const newFlowPlan: MFlowPlan = flowPlan
            ? { ...flowPlan, lat, lon: lng }
            : { lat, lon: lng, cameraFlowPlanNo: 0, flowPlanImgUrl: '' }
          setFlowPlan(newFlowPlan)
        }}
        image={{ src: '/images/common/map/FlowPlan-map-point.svg', size: { width: 40, height: 40 } }}
        onMouseOver={() => {
          setIsHovering(true)
        }}
        onMouseOut={() => {
          setIsHovering(false)
        }}
      ></MapMarker>
    </>
  )
}

export default FlowPlanMapMarker
