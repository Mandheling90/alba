import { Box, Grid } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import MapComponent from 'src/@core/components/map/MapComponent'
import FileUploader from 'src/@core/components/molecule/FileUploader'
import MapControlOverlay from 'src/@core/components/molecule/MapControlOverlay'

import ImageMap from 'src/@core/components/map/ImageMap'
import SimpleDialogModal from 'src/@core/components/molecule/SimpleDialogModal'
import { YN } from 'src/enum/commonEnum'
import { defaultMapInfo } from 'src/enum/mapEnum'
import { useCameras } from 'src/hooks/useCameras'
import { useLayout } from 'src/hooks/useLayout'
import { useMap } from 'src/hooks/useMap'
import { MClientCameraList, MFlowPlan } from 'src/model/cameras/CamerasModel'
import { useClientCameraList, useFlowPlan, useFlowPlanUpdate } from 'src/service/cameras/camerasService'
import CameraMapMarker from './CameraMapMarker'
import CameraSelecter from './CameraSelecter'
import FlowPlanMapMarker from './FlowPlanMapMarker'
import MapControls from './MapControls'

const INITIAL_DIALOG_PROPS = {
  open: false,
  title: '',
  contents: '',
  isSave: false,
  isImageUpdate: false
}

interface ICamerasMap {
  height?: string
}

const removeDuplicateCameras = (data: MClientCameraList[]): MClientCameraList[] => {
  const uniqueMap = new Map<number, MClientCameraList>()
  data.forEach(item => {
    if (!uniqueMap.has(item.cameraNo)) {
      uniqueMap.set(item.cameraNo, item)
    }
  })

  return Array.from(uniqueMap.values())
}

const CamerasMap: React.FC<ICamerasMap> = ({ height = '500px' }) => {
  const { companyNo } = useLayout()

  const { mutateAsync: getClientCameraList } = useClientCameraList()
  const { data: flowPlanData } = useFlowPlan({ companyNo: companyNo })
  const { mutateAsync: flowPlanUpdate } = useFlowPlanUpdate()

  const [flowPlan, setFlowPlan] = useState<MFlowPlan | undefined>()

  const { mapInfo, setMapInfo } = useMap()
  const layoutContext = useLayout()
  const { layoutDisplay } = layoutContext

  const mapContainerRef = useRef<any>()
  const [isDragging, setIsDragging] = useState(false)
  const [newImageAddMode, setNewImageAddMode] = useState(false)
  const [uniqueCameras, setUniqueCameras] = useState<MClientCameraList[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    clientCameraData,
    selectedCamera,
    mapModifyModCameraId,
    viewType,
    updateClientCameraData,
    setMapModifyModCameraId,
    setViewType,
    setClientCameraData,
    handleCancelClick,
    handleSaveClick
  } = useCameras()

  useEffect(() => {
    const uniqueCameras = removeDuplicateCameras(clientCameraData ?? [])
    setUniqueCameras(uniqueCameras)
  }, [clientCameraData])

  useEffect(() => {
    setTimeout(() => {
      const relayout = () => {
        mapContainerRef.current?.relayout()
      }

      relayout()
    }, 500)
  }, [height, layoutDisplay, isDragging])

  // 좌표값이 없을 시 이미지 추가 모드로 변경
  useEffect(() => {
    setFlowPlan(flowPlanData?.data ?? undefined)

    if (flowPlanData?.data?.flowPlanImgUrl) {
      setNewImageAddMode(false)
    } else {
      setMapInfo(defaultMapInfo)
      setNewImageAddMode(true)
    }
  }, [flowPlanData])

  useEffect(() => {
    if (selectedCamera && viewType.type === 'image') {
      // const markerPositions = selectedCamera.map(camera => {
      //   const lat = camera.zonePoints?.lat ?? defaultMapInfo.center.lat
      //   const lon = camera.zonePoints?.lon ?? defaultMapInfo.center.lon
      //   return {
      //     lat,
      //     lon
      //   }
      // })
      // setMapInfo({
      //   ...mapInfo,
      //   markerPositions: markerPositions
      // })
      // const map = mapContainerRef.current
      // if (map && markerPositions) {
      //   setTimeout(() => {
      //     const bounds = () => {
      //       const bounds = new kakao.maps.LatLngBounds()
      //       markerPositions.forEach(point => {
      //         bounds.extend(new kakao.maps.LatLng(point.lat, point.lon))
      //       })
      //       return bounds
      //     }
      //     map.setBounds(bounds())
      //   }, 100)
      // }
    } else {
      const markerPositions = selectedCamera?.map(camera => {
        const lat = camera.flowPlanBindingYN === YN.N ? camera.lat ?? defaultMapInfo.center.lat : flowPlan?.lat ?? 0
        const lon = camera.flowPlanBindingYN === YN.N ? camera.lon ?? defaultMapInfo.center.lon : flowPlan?.lon ?? 0

        return {
          lat,
          lon
        }
      })
      setMapInfo({
        ...mapInfo,
        markerPositions: markerPositions
      })
      const map = mapContainerRef.current
      if (map && markerPositions) {
        setTimeout(() => {
          const bounds = () => {
            const bounds = new kakao.maps.LatLngBounds()
            markerPositions.forEach(point => {
              bounds.extend(new kakao.maps.LatLng(point.lat, point.lon))
            })

            return bounds
          }
          map.setBounds(bounds())
        }, 100)
      }

      // setMapInfo({
      //   ...mapInfo,
      //   markerPositions: [
      //     {
      //       lat: flowPlanData?.data?.lat ?? 0,
      //       lon: flowPlanData?.data?.lon ?? 0
      //     }
      //   ],
      //   center: {
      //     lat: flowPlanData?.data?.lat ?? 0,
      //     lon: flowPlanData?.data?.lon ?? 0
      //   }
      // })
    }
  }, [selectedCamera])

  // const handleMapClick = (map: kakao.maps.Map, mouseEvent: kakao.maps.event.MouseEvent) => {
  //   if (mapModifyModCameraId) {
  //     const lat = mouseEvent.latLng.getLat()
  //     const lng = mouseEvent.latLng.getLng()

  //     updateClientCameraData(mapModifyModCameraId, {
  //       zonePoints: { lat, lon: lng }
  //     })

  //     setMapInfo({
  //       ...mapInfo,
  //       markerPositions: [
  //         {
  //           lat,
  //           lon: lng
  //         }
  //       ]
  //     })

  //     setMapModifyModCameraId(null)
  //   }
  // }

  const handleImageMapClick = (x: number, y: number) => {
    if (mapModifyModCameraId) {
      // updateClientCameraData(mapModifyModCameraId, {
      //   markers: { x, y }
      // })
      // setMapModifyModCameraId(null)
    }
  }

  const [simpleDialogModalProps, setSimpleDialogModalProps] = useState(INITIAL_DIALOG_PROPS)

  const handleFileUpload = async (file: File) => {
    try {
      // 파일 유효성 검사
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.')

        return
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB 제한 예시
        alert('파일 크기가 너무 큽니다.')

        return
      }

      await flowPlanUpdate({
        companyNo: companyNo,
        flowPlan: {
          lon: flowPlan?.lon ?? 0,
          lat: flowPlan?.lat ?? 0
        },
        file: file
      })

      // 성공 시 처리
      alert('파일이 성공적으로 업로드되었습니다.')
    } catch (error) {
      console.error('파일 업로드 실패:', error)
      alert('파일 업로드에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleConfirm = () => {
    if (simpleDialogModalProps.isSave && flowPlan?.flowPlanImgUrl) {
      // 이미지가 이미 있는 경우 위치만 업데이트
      handleSaveClick(undefined)
    } else if ((simpleDialogModalProps.isSave && !flowPlan?.flowPlanImgUrl) || simpleDialogModalProps.isImageUpdate) {
      // 새로운 이미지 업로드 모드
      fileInputRef.current?.click()
    } else if (!simpleDialogModalProps.isSave) {
      // 취소 버튼 클릭 시
      handleCancelClick(undefined)
    }

    setSimpleDialogModalProps(INITIAL_DIALOG_PROPS)
  }

  const resizeing = () => {
    setViewType({
      ...viewType,
      size: viewType.size === 'full' ? 'half' : 'full'
    })
  }

  const mapControlButtons = [
    {
      icon: viewType.size === 'half' ? 'zoomIn_default' : 'zoomOut_default',
      hoverIcon: viewType.size === 'half' ? 'zoomIn_hovering' : 'zoomOut_hovering',
      onClick: resizeing
    },
    {
      icon: 'zoomIn_map_default',
      hoverIcon: 'zoomIn_map_hovering',
      onClick: () => {
        setMapInfo({
          ...mapInfo,
          mapLevel: mapInfo.mapLevel - 1
        })
      }
    },
    {
      icon: 'zoomOut_map_default',
      hoverIcon: 'zoomOut_map_hovering',
      onClick: () => {
        setMapInfo({
          ...mapInfo,
          mapLevel: mapInfo.mapLevel + 1
        })
      }
    }
  ]

  return (
    <Grid container>
      <FileUploader ref={fileInputRef} onFileSelect={handleFileUpload} accept='image/*' style={{ display: 'none' }} />
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

      <Grid item xs={12}>
        <MapControls
          viewType={viewType}
          setViewType={setViewType}
          newImageAddMode={newImageAddMode}
          newImageAddModeFn={() => {
            setFlowPlan({
              lat: mapInfo.center.lat,
              lon: mapInfo.center.lon,
              flowPlanImgUrl: '',
              cameraFlowPlanNo: 0
            })

            setIsDragging(true)
            setViewType({ type: 'map', size: 'half' })
          }}
          imageUpdateFn={() => {
            fileInputRef.current?.click()
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Box style={{ width: '100%', height: height, position: 'relative' }}>
          {viewType.size === 'full' && <CameraSelecter />}

          {viewType.type === 'map' ? (
            <>
              <MapComponent
                mapContainerRef={mapContainerRef}

                // onClick={handleMapClick}
              >
                <FlowPlanMapMarker
                  flowPlanData={flowPlan}
                  imageUpdateFn={() => {
                    fileInputRef.current?.click()
                  }}
                />
                <CameraMapMarker />
              </MapComponent>

              <MapControlOverlay buttons={mapControlButtons} />
            </>
          ) : (
            <ImageMap
              flowPlanData={flowPlan}
              height={height}
              handleImageMapClick={handleImageMapClick}
              imageUpdateFn={() => {
                setSimpleDialogModalProps({
                  ...simpleDialogModalProps,
                  open: true,
                  isImageUpdate: true,
                  title: '평면도 이미지 파일 변경',
                  contents:
                    '현재 설정되어 있는 평면도 이미지가 대체됩니다. \r\n 계속 진행하시려면 아래 "확인" 버튼 클릭 후 대체하실 평면도 이미지를 선택하세요'
                })
              }}
              floorplanLocation={() => {
                setViewType({
                  type: 'map',
                  size: 'half'
                })
                setIsDragging(true)

                setTimeout(() => {
                  setMapInfo({
                    ...mapInfo,
                    center: {
                      lat: flowPlanData?.data?.lat ?? defaultMapInfo.center.lat,
                      lon: flowPlanData?.data?.lon ?? defaultMapInfo.center.lon
                    }
                  })
                }, 100)
              }}
              resizeing={resizeing}
            />
          )}
        </Box>
      </Grid>
    </Grid>
  )
}

export default CamerasMap
