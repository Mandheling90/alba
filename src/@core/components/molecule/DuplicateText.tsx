import { Button, InputAdornment, TextField } from '@mui/material'
import React from 'react'

interface IDuplicateText {
  value: string
  setValue: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  duplicateCheck: () => void
  isDuplicate: boolean
}

const DuplicateText: React.FC<IDuplicateText> = ({ value, setValue, placeholder, duplicateCheck, isDuplicate }) => {
  return (
    <TextField
      size='small'
      value={value}
      placeholder={placeholder}
      onChange={setValue}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <Button
              variant='outlined'
              size='small'
              sx={{
                minWidth: 'auto',
                height: '25px',
                backgroundColor: '#9155FD14',
                color: '#9155FD',
                '&:hover': {
                  backgroundColor: 'rgba(145, 85, 253, 0.2)'
                },
                '&:disabled': {
                  backgroundColor: '#ffffff',
                  color: '#3A354142'
                }
              }}
              onClick={duplicateCheck}
              disabled={isDuplicate}
            >
              중복확인
            </Button>
          </InputAdornment>
        )
      }}
    />
  )
}

export default DuplicateText
