import { Box, Grid } from '@mui/material'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { MapMarker } from 'react-kakao-maps-sdk'
import MapComponent from 'src/@core/components/map/MapComponent'
import FileUploader from 'src/@core/components/molecule/FileUploader'
import MapOverlay from './MapOverlay'

import ImageMap from 'src/@core/components/map/ImageMap'
import SimpleDialogModal from 'src/@core/components/molecule/SimpleDialogModal'
import { CamerasContext } from 'src/context/CamerasContext'
import { defaultMapInfo } from 'src/enum/mapEnum'
import { useLayout } from 'src/hooks/useLayout'
import { useMap } from 'src/hooks/useMap'
import { MClientCameraList } from 'src/model/cameras/CamerasModel'
import CameraSelecter from './CameraSelecter'
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

const CamerasMap: React.FC<ICamerasMap> = ({ height = '500px' }) => {
  const { mapInfo, setMapInfo } = useMap()
  const layoutContext = useLayout()
  const { layoutDisplay } = layoutContext

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
  } = useContext(CamerasContext)

  const mapContainerRef = useRef<any>()
  const [isDragging, setIsDragging] = useState(false)
  const [newImageAddMode, setNewImageAddMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    if (clientCameraData?.floorPlan?.zonePoints) {
      setNewImageAddMode(false)
    } else {
      setMapInfo(defaultMapInfo)
      setNewImageAddMode(true)
    }
  }, [clientCameraData?.floorPlan?.zonePoints])

  useEffect(() => {
    if (selectedCamera && viewType.type === 'image') {
      const markerPositions = selectedCamera.map(camera => {
        const lat = camera.zonePoints?.lat ?? defaultMapInfo.center.lat
        const lon = camera.zonePoints?.lon ?? defaultMapInfo.center.lon

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
    } else {
      if (clientCameraData?.floorPlan?.zonePoints) {
        setMapInfo({
          ...mapInfo,
          markerPositions: [
            {
              lat: clientCameraData?.floorPlan?.zonePoints.lat ?? 0,
              lon: clientCameraData?.floorPlan?.zonePoints.lon ?? 0
            }
          ],
          center: {
            lat: clientCameraData?.floorPlan?.zonePoints.lat ?? 0,
            lon: clientCameraData?.floorPlan?.zonePoints.lon ?? 0
          }
        })
      }
    }
  }, [selectedCamera])

  const handleMapClick = (map: kakao.maps.Map, mouseEvent: kakao.maps.event.MouseEvent) => {
    if (mapModifyModCameraId) {
      const lat = mouseEvent.latLng.getLat()
      const lng = mouseEvent.latLng.getLng()

      updateClientCameraData(mapModifyModCameraId, {
        zonePoints: { lat, lon: lng }
      })

      setMapInfo({
        ...mapInfo,
        markerPositions: [
          {
            lat,
            lon: lng
          }
        ]
      })

      setMapModifyModCameraId(null)
    }
  }

  const handleImageMapClick = (x: number, y: number) => {
    if (mapModifyModCameraId) {
      updateClientCameraData(mapModifyModCameraId, {
        markers: { x, y }
      })

      setMapModifyModCameraId(null)
    }
  }

  const [simpleDialogModalProps, setSimpleDialogModalProps] = useState(INITIAL_DIALOG_PROPS)

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setClientCameraData(prevData => {
        if (!prevData) return null

        return {
          ...prevData,
          floorPlan: {
            ...prevData.floorPlan,
            floorPlanImageUrl: reader.result as string
          }
        }
      })
    }
    reader.readAsDataURL(file)
  }

  const handleConfirm = () => {
    if (simpleDialogModalProps.isSave && clientCameraData?.floorPlan?.floorPlanImageUrl) {
      // 이미지가 이미 있는 경우 위치만 업데이트
      handleSaveClick(undefined)
    } else if (
      (simpleDialogModalProps.isSave && !clientCameraData?.floorPlan?.floorPlanImageUrl) ||
      simpleDialogModalProps.isImageUpdate
    ) {
      // 새로운 이미지 업로드 모드
      fileInputRef.current?.click()
    } else if (!simpleDialogModalProps.isSave) {
      // 취소 버튼 클릭 시
      handleCancelClick(undefined)
    }

    setSimpleDialogModalProps(INITIAL_DIALOG_PROPS)
  }

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
            updateClientCameraData(undefined, {
              floorPlan: {
                floorPlanImageUrl: '',
                zonePoints: { lat: mapInfo.center.lat, lon: mapInfo.center.lon }
              } as MClientCameraList['floorPlan']
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
        <Box style={{ width: '100%', height: height }}>
          {viewType.size === 'full' && <CameraSelecter />}

          {viewType.type === 'map' ? (
            <MapComponent onClick={handleMapClick} mapContainerRef={mapContainerRef}>
              {clientCameraData?.floorPlan?.zonePoints && (
                <>
                  {isDragging && (
                    <MapOverlay
                      position={{
                        lat: clientCameraData?.floorPlan?.zonePoints?.lat ?? 0,
                        lng: clientCameraData?.floorPlan?.zonePoints?.lon ?? 0
                      }}
                      onCancel={() => {
                        setSimpleDialogModalProps({
                          ...simpleDialogModalProps,
                          open: true,
                          isSave: false,
                          title: clientCameraData?.floorPlan?.floorPlanImageUrl
                            ? '평면도 위치변경 취소'
                            : '평면도 등록 취소',
                          contents: clientCameraData?.floorPlan?.floorPlanImageUrl
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
                          title: clientCameraData?.floorPlan?.floorPlanImageUrl
                            ? '평면도 위치 변경'
                            : '평면도 위치 저장 및 평면도 이미지 선택',
                          contents: clientCameraData?.floorPlan?.floorPlanImageUrl
                            ? '평면도 위치가 변경되었습니다. \r\n 변경된 위치를 저장하시겠습니까?'
                            : '평면도 위치가 지정되었습니다.  \r\n 아래 "확인" 버튼 클릭 후 지정된 위치에 등록할 평면도 이미지를 선택해 주세요. \r\n 평면도 이미지는 "F1" 으로 등록됩니다.'
                        })

                        setIsDragging(false)
                      }}
                    />
                  )}

                  <MapMarker
                    position={{
                      lat: clientCameraData?.floorPlan?.zonePoints?.lat ?? 0,
                      lng: clientCameraData?.floorPlan?.zonePoints?.lon ?? 0
                    }}
                    draggable={viewType.type === 'map'}
                    onDragEnd={e => {
                      setIsDragging(true)
                      const lat = e.getPosition().getLat()
                      const lng = e.getPosition().getLng()

                      updateClientCameraData(undefined, {
                        floorPlan: {
                          ...clientCameraData.floorPlan,
                          floorPlanImageUrl: clientCameraData.floorPlan?.floorPlanImageUrl || '',
                          zonePoints: { lat, lon: lng }
                        }
                      })
                    }}
                    image={{ src: '/images/common/map/map-point.svg', size: { width: 40, height: 40 } }}
                  ></MapMarker>
                </>
              )}
            </MapComponent>
          ) : (
            <ImageMap
              height={height}
              handleImageMapClick={handleImageMapClick}
              imageUpdateFn={() => {
                setSimpleDialogModalProps({
                  ...simpleDialogModalProps,
                  open: true,
                  isImageUpdate: true,
                  title: '평면도 이미지 파일 변경',
                  contents:
                    '현재 설정되어 있는 평면도 이미지가 대체됩니다. \r\n 계속 진행하시려면 아래 “확인" 버튼 클릭 후 대체하실 평면도 이미지를 선택하세요'
                })
              }}
              floorplanLocation={() => {
                setViewType({
                  type: 'map',
                  size: 'half'
                })
                setIsDragging(true)
              }}
            />
          )}
        </Box>
      </Grid>
    </Grid>
  )
}

export default CamerasMap
