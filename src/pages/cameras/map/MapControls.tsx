import { Box } from '@mui/material'
import React from 'react'
import MapSearch from 'src/@core/components/map/MapSearch'
import { IViewType } from 'src/context/CamerasContext'
import { EMenuType, YN } from 'src/enum/commonEnum'
import { useAuth } from 'src/hooks/useAuth'
import { useCameras } from 'src/hooks/useCameras'
import IconCustom from 'src/layouts/components/IconCustom'
import { getAuthMenu } from 'src/utils/CommonUtil'

interface IMapControls {
  viewType: IViewType
  setViewType: (viewType: { type: 'map' | 'image' | 'newImage'; size: 'full' | 'half' }) => void
  newImageAddMode: boolean
  newImageAddModeFn: () => void
  imageUpdateFn: () => void
}

const MapControls: React.FC<IMapControls> = ({
  viewType,
  setViewType,
  newImageAddMode,
  newImageAddModeFn,
  imageUpdateFn
}) => {
  const { user } = useAuth()
  const { cameraPage } = useCameras()

  return (
    <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
      {viewType.type === 'map' && viewType.size === 'full' ? (
        <Box
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          onClick={() => setViewType({ type: 'map', size: 'half' })}
        >
          <IconCustom isCommon path='camera' icon='map-mode-half' hoverIcon='map-mode-half-hovering' />
        </Box>
      ) : (
        <Box
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          onClick={() => setViewType({ type: 'map', size: 'half' })}
        >
          <IconCustom
            isCommon
            path='camera'
            icon={viewType.type === 'image' ? 'map-mode-full-disable' : 'map-mode-full'}
            hoverIcon={viewType.type === 'image' ? 'map-mode-full-hovering-disable' : 'map-mode-full-hovering'}
          />
        </Box>
      )}

      {newImageAddMode ? (
        <>
          {cameraPage !== 'user-setting' &&
            getAuthMenu(user?.userInfo?.authMenuList ?? [], EMenuType['카메라위치등록'])?.createYn === YN.Y && (
              <Box
                sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                onClick={() => newImageAddModeFn()}
              >
                <IconCustom isCommon path='camera' icon='image-add-mode' hoverIcon='image-add-mode-hovering' />
              </Box>
            )}
        </>
      ) : (
        <Box
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          onClick={() => {
            setViewType({
              type: 'image',
              size: 'half'
            })
          }}
        >
          <IconCustom
            isCommon
            path='camera'
            icon={viewType.type === 'map' ? 'image-mode-disable' : 'image-mode'}
            hoverIcon={viewType.type === 'map' ? 'image-mode-hovering-disable' : 'image-mode-hovering'}
          />
        </Box>
      )}

      <Box sx={{ flex: 0.7 }}>
        <MapSearch useSearchButton textFieldColor='#fff' />
      </Box>
    </Box>
  )
}

export default MapControls
