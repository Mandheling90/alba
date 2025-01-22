import { Box, IconButton, Modal } from '@mui/material'
import React from 'react'
import IconCustom from 'src/layouts/components/IconCustom'

interface ImageModalProps {
  open: boolean
  onClose: () => void
  imageUrl: string
}

const ImageModal: React.FC<ImageModalProps> = ({ open, onClose, imageUrl }) => {
  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        sx={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '8px'
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            zIndex: 1
          }}
        >
          <IconCustom isCommon icon='close-button-white' />
        </IconButton>
        <img src={imageUrl} alt='Enlarged' style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px' }} />
      </Box>
    </Modal>
  )
}

export default ImageModal
