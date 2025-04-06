import { Box, Button, Dialog, Typography } from '@mui/material'
import React from 'react'
import DialogCustomContent from './DialogCustomContent'

interface ModalProps {
  open: boolean
  onClose: () => void
  onConfirm?: () => void
  title?: string
  contents?: string
  buttonText?: string
  isConfirm?: boolean
  useClose?: boolean
  contentsHtml?: React.ReactNode
}

const SimpleDialogModal: React.FC<ModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  contents,
  buttonText,
  isConfirm,
  useClose = true,
  contentsHtml
}) => {
  return (
    <Dialog
      fullWidth
      maxWidth='sm'
      scroll='body'
      onClose={() => {
        onClose()
      }}
      open={open}
    >
      <DialogCustomContent
        onClose={() => {
          onClose()
        }}
        useClose={useClose}
      >
        {title && (
          <Typography
            id='modal-title'
            variant='body1'
            sx={{ color: 'rgba(58, 53, 65, 0.6)', fontSize: 20, fontWeight: 500 }}
          >
            {title}
          </Typography>
        )}

        {contentsHtml && contentsHtml}

        {contents && (
          <Typography
            id='modal-description'
            sx={{ mt: 2, color: 'rgba(58, 53, 65, 0.6)', fontSize: 16, fontWeight: 400 }}
          >
            {contents.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 8, mb: 5 }}>
          {isConfirm ? (
            <>
              <Button
                variant='contained'
                onClick={() => {
                  onConfirm ? onConfirm() : onClose()
                }}
              >
                확인
              </Button>

              <Button
                variant='outlined'
                onClick={() => {
                  onClose()
                }}
              >
                취소
              </Button>
            </>
          ) : (
            <Button
              variant='contained'
              onClick={() => {
                onConfirm ? onConfirm() : onClose()
              }}
            >
              {buttonText ? buttonText : '확인'}
            </Button>
          )}
        </Box>
      </DialogCustomContent>
    </Dialog>
  )
}

export default SimpleDialogModal
