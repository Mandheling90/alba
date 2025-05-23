import { Box, IconButton } from '@mui/material'
import { FC } from 'react'
import { useCameras } from 'src/hooks/useCameras'
import IconCustom from 'src/layouts/components/IconCustom'
import CustomTextFieldState from './CustomTextFieldState'

interface LatLonInputProps {
  cameraNo: number
  groupId?: number
  lat: number | null
  lon: number | null
  isEditing: boolean
  onLatChange: (value: number | null) => void
  onLonChange: (value: number | null) => void
  onMapClick?: () => void
  isMapActive?: boolean
}

const formatLatLon = (value: number): string => {
  const decimalPart = value.toString().split('.')[1] || ''
  if (decimalPart.length <= 6) {
    return value.toString()
  }

  return value.toFixed(6)
}

const LatLonInput: FC<LatLonInputProps> = ({ cameraNo, groupId, lat, lon, isEditing, onLatChange, onLonChange }) => {
  const { mapModifyModCameraId, setMapModifyModCameraId, groupMapModifyId, setGroupMapModifyId } = useCameras()

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%'
      }}
    >
      {isEditing ? (
        <>
          <CustomTextFieldState
            size='small'
            value={lat ?? ''}
            onChange={e => {
              onLatChange(parseFloat(e.target.value))
            }}
          />
          <IconButton
            sx={{ color: 'text.secondary' }}
            onClick={e => {
              e.stopPropagation()
              setMapModifyModCameraId?.(mapModifyModCameraId === cameraNo ? null : cameraNo)

              groupId && setGroupMapModifyId?.(groupMapModifyId === groupId ? null : groupId)
            }}
          >
            <IconCustom
              isCommon
              path='camera'
              icon={`${cameraNo !== mapModifyModCameraId ? 'map-point-small' : 'map-mod'}`}
            />
          </IconButton>
          <CustomTextFieldState
            size='small'
            value={lon ?? ''}
            onChange={e => {
              onLonChange(parseFloat(e.target.value))
            }}
          />
        </>
      ) : (
        <>
          <span>{lat !== null ? formatLatLon(lat) : 'N/A'}</span>
          <span>|</span>
          <span>{lon !== null ? formatLatLon(lon) : 'N/A'}</span>
        </>
      )}
    </Box>
  )
}

export default LatLonInput
