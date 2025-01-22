import { Box, DialogContent } from '@mui/material'
import React from 'react'
import ModalClose from '../atom/ModalClose'

interface ModalProps {
  onClose: () => void
  children: React.ReactNode
  modalClose?: React.ReactNode
  useClose?: boolean
}

const DialogCustomContent: React.FC<ModalProps> = ({ onClose, children, modalClose, useClose = true }) => {
  return (
    <DialogContent sx={{ p: 3 }}>
      {useClose &&
        (modalClose ? (
          modalClose
        ) : (
          <ModalClose
            onClose={() => {
              onClose()
            }}
          />
        ))}

      <Box p={3}>{children}</Box>
    </DialogContent>
  )
}

export default DialogCustomContent
