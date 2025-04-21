import { Box, Typography } from '@mui/material'
import { CustomOverlayMap } from 'react-kakao-maps-sdk'
import CustomAddCancelButton from 'src/@core/components/molecule/CustomAddCancelButton'
import OverlayBox from 'src/@core/components/molecule/OverlayBox'

interface IMapOverlayProps {
  position: {
    lat: number
    lng: number
  }

  title: string

  onCancel?: () => void
  onSave?: () => void

  onHover?: () => void
  onLeave?: () => void
}

const MapOverlay: React.FC<IMapOverlayProps> = ({ position, title, onCancel, onSave, onHover, onLeave }) => {
  return (
    <CustomOverlayMap position={position}>
      <OverlayBox>
        <Typography sx={{ mr: 3 }}>{title}</Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {onCancel && onSave && <CustomAddCancelButton onCancelClick={onCancel} onSaveClick={onSave} />}
        </Box>
      </OverlayBox>
    </CustomOverlayMap>
  )
}

export default MapOverlay
