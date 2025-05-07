import { Button, InputAdornment, TextField, TextFieldProps } from '@mui/material'
import React, { useEffect, useState } from 'react'

interface IDuplicateText extends Omit<TextFieldProps, 'value' | 'onChange'> {
  value: string
  placeholder: string
  duplicateCheck: (value: string) => Promise<boolean>
  setDuplicateCheck: (value: boolean) => void
}

const DuplicateText: React.FC<IDuplicateText> = ({
  value,
  placeholder,
  duplicateCheck,
  setDuplicateCheck,
  ...textFieldProps
}) => {
  const [isChange, setIsChange] = useState(false)

  const [text, setText] = useState(value)
  const [textOrigin, setTextOrigin] = useState(value)

  useEffect(() => {
    setText(value)
    setTextOrigin(value)
  }, [value])

  const handleDuplicateCheck = async () => {
    const res = await duplicateCheck(text)

    setIsChange(!res)
    setDuplicateCheck(!res)
  }

  return (
    <TextField
      value={text}
      placeholder={placeholder}
      onChange={e => {
        setText(e.target.value)
        setIsChange(e.target.value !== textOrigin)
        setDuplicateCheck(e.target.value !== textOrigin)
      }}
      {...textFieldProps}
      InputProps={{
        ...textFieldProps.InputProps,
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
              onClick={handleDuplicateCheck}
              disabled={!isChange || !text}
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
