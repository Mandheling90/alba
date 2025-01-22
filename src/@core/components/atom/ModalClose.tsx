import { Box, IconButton } from '@mui/material'
import React from 'react'
import IconCustom from 'src/layouts/components/IconCustom'

interface ModalProps {
  onClose: () => void
}

const ModalClose: React.FC<ModalProps> = ({ onClose }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <IconButton onClick={() => onClose()}>
        <IconCustom isCommon icon='close-button' />
      </IconButton>
    </Box>
  )
}

export default ModalClose
