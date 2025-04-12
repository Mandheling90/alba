import { Button, InputAdornment, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'

interface IDuplicateText {
  value: string
  valueOrg: string
  setValue: (value: string) => void
  placeholder: string
  duplicateCheck: () => Promise<boolean>
  setDuplicateCheck: (value: boolean) => void
}

const DuplicateText: React.FC<IDuplicateText> = ({
  value,
  valueOrg,
  setValue,
  placeholder,
  duplicateCheck,
  setDuplicateCheck
}) => {
  const [isChange, setIsChange] = useState(false)

  useEffect(() => {
    setIsChange(false)
  }, [valueOrg])

  useEffect(() => {
    if (isChange) {
      setDuplicateCheck(true)
    }
  }, [isChange])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChange(e.target.value !== valueOrg)
    setValue(e.target.value)
  }

  return (
    <TextField
      size='small'
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
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
              onClick={async () => {
                const res = await duplicateCheck()
                if (res) {
                  setIsChange(false)
                }
              }}
              disabled={!isChange}
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
