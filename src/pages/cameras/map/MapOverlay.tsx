import { Box, Typography } from '@mui/material'
import { CustomOverlayMap } from 'react-kakao-maps-sdk'
import CustomAddCancelButton from 'src/@core/components/molecule/CustomAddCancelButton'

interface IMapOverlayProps {
  position: {
    lat: number
    lng: number
  }
  onCancel: () => void
  onSave: () => void
}

const MapOverlay: React.FC<IMapOverlayProps> = ({ position, onCancel, onSave }) => {
  return (
    <CustomOverlayMap position={position}>
      <Box
        sx={{
          width: '205px',
          position: 'relative',
          backgroundColor: 'rgba(145, 85, 253, 0.2)',
          marginTop: '-90px',
          color: '#000',
          display: 'flex',
          p: 2,
          border: '1px solid #9155FD',
          borderRadius: '5px',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '0',
            height: '0',
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '10px solid rgba(145, 85, 253, 0.2)'
          }
        }}
      >
        <Typography sx={{ mr: 3 }}>평면도 위치 저장</Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <CustomAddCancelButton onCancelClick={onCancel} onSaveClick={onSave} />
        </Box>
      </Box>
    </CustomOverlayMap>
  )
}

export default MapOverlay
