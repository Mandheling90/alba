import { Box, Button, Dialog, Typography } from '@mui/material'
import React from 'react'
import DialogCustomContent from './DialogCustomContent'

export interface IDialogProps {
  open: boolean
  title: string | React.ReactNode
  contents?: string | React.ReactNode
  confirmFn?: () => void
  isConfirm?: boolean
  resolve?: (value: boolean) => void
  size?: 'small' | 'medium' | 'large'
  confirmText?: string
  cancelText?: string
}

export const INITIAL_DIALOG_PROPS: IDialogProps = {
  open: false,
  title: '',
  contents: '',
  isConfirm: false,
  size: 'medium',
  confirmText: '확인',
  cancelText: '취소'
}

interface ModalProps {
  open: boolean
  onClose: () => void
  onConfirm?: () => boolean | void
  title?: string | React.ReactNode
  contents?: string | React.ReactNode
  buttonText?: string
  isConfirm?: boolean
  useClose?: boolean
  contentsHtml?: React.ReactNode
  resolve?: (value: boolean) => void
  size?: 'small' | 'medium' | 'large'
  confirmText?: string
  cancelText?: string
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
  contentsHtml,
  resolve,
  size = 'medium',
  confirmText = '확인',
  cancelText = '취소'
}) => {
  const handleClose = () => {
    onClose()
    resolve?.(false)
  }

  const handleConfirm = () => {
    const shouldClose = onConfirm?.()
    if (shouldClose !== false) {
      onClose()
      resolve?.(true)
    }
  }

  return (
    <Dialog
      fullWidth
      maxWidth={size === 'small' ? 'xs' : size === 'large' ? 'md' : 'sm'}
      scroll='body'
      onClose={handleClose}
      open={open}
    >
      <DialogCustomContent onClose={handleClose} useClose={useClose}>
        {title && (
          <Typography
            id='modal-title'
            variant='body1'
            sx={{ color: 'rgba(94,91,101,1)', fontSize: 20, fontWeight: 500 }}
          >
            {title}
          </Typography>
        )}

        {contentsHtml && contentsHtml}

        {contents &&
          (typeof contents === 'string' ? (
            <Typography
              id='modal-description'
              sx={{ mt: 2, color: 'rgba(94,91,101,1)', fontSize: 16, fontWeight: 400 }}
            >
              {contents.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </Typography>
          ) : (
            <Box sx={{ mt: 2 }}>{contents}</Box>
          ))}

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 8, mb: 5 }}>
          {isConfirm ? (
            <>
              <Button variant='contained' onClick={handleConfirm}>
                {confirmText}
              </Button>

              <Button variant='outlined' onClick={handleClose}>
                {cancelText}
              </Button>
            </>
          ) : (
            <Button variant='contained' onClick={handleConfirm}>
              {buttonText ? buttonText : confirmText}
            </Button>
          )}
        </Box>
      </DialogCustomContent>
    </Dialog>
  )
}

export default SimpleDialogModal
