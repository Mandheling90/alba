import { Box } from '@mui/material'
import React from 'react'
import IconCustom from 'src/layouts/components/IconCustom'

export interface MapControlButton {
  icon: string
  hoverIcon: string
  onClick: () => void
}

interface MapControlOverlayProps {
  buttons: MapControlButton[]
  top?: number
  right?: number
  zIndex?: number
}

const MapControlOverlay: React.FC<MapControlOverlayProps> = ({ buttons, top = 16, right = 16, zIndex = 1000 }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top,
        right,
        zIndex,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        alignItems: 'flex-end'
      }}
    >
      {buttons.map((button, index) => (
        <Box key={index} onClick={button.onClick}>
          <IconCustom isCommon path='camera' icon={button.icon} hoverIcon={button.hoverIcon} />
        </Box>
      ))}
    </Box>
  )
}

export default MapControlOverlay
