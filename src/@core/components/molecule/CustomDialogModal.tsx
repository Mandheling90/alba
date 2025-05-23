import { Box, Button, Dialog, Typography } from '@mui/material'
import React from 'react'
import DialogCustomContent from './DialogCustomContent'

export interface CustomIDialogProps {
  open: boolean
  title: string
  contents?: string
  confirmFn?: () => void
  isConfirm?: boolean
  resolve?: (value: boolean) => void
  actions:CustomDialogAction[]
}

export const CUSTOM_INITIAL_DIALOG_PROPS: CustomIDialogProps = {
  open: false,
  title: '',
  contents: '',
  isConfirm: false,
  actions:[]
}

type CustomDialogAction = {
  label: string;
  onClick?: () => void;
  variant: "contained" | "outlined"; 
};

interface CustomModalProps {
  open: boolean
  onClose: () => void
  onConfirm?: () => void
  title?: string
  contents?: string
  isConfirm?: boolean
  useClose?: boolean
  contentsHtml?: React.ReactNode
  actions: CustomDialogAction[];
  resolve?: (value: boolean) => void
}

const CustomSimpleDialogModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  contents,
  useClose = true,
  contentsHtml,
  actions,
  resolve
}) => {
  const handleClose = () => {
    onClose()
    resolve?.(false)
  }

  const handleConfirm = () => {
    onConfirm?.()
    onClose()
    resolve?.(true)
  }

  return (
    <Dialog fullWidth maxWidth='sm' scroll='body' onClose={handleClose} open={open}>
      <DialogCustomContent onClose={handleClose} useClose={useClose}>
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
          {actions.map((action, idx) => (
            <Button
              key={idx}
                onClick={() => {
                if(action.variant === 'outlined') handleClose()
                else if (action.variant === 'contained') handleConfirm()
                action.onClick?.()
              }}
              variant={action.variant}
            >
              {action.label}
            </Button>
        ))}
        </Box>
      </DialogCustomContent>
    </Dialog>
  )
}

export default CustomSimpleDialogModal
