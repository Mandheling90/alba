import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { FC } from 'react'

interface Option {
  key: string
  value: string
  label: string
}

interface ICustomSelectBox {
  value: string
  onChange: (event: SelectChangeEvent) => void
  options: Option[]
  placeholder?: string
  backgroundColor?: string
  border?: boolean
  width?: string
}

const CustomSelectBox: FC<ICustomSelectBox> = ({
  value,
  onChange,
  options,
  placeholder,
  backgroundColor,
  border = true,
  width
}) => {
  return (
    <Select
      sx={{
        width: width || '100%',
        height: '40px',
        textAlign: 'center',
        backgroundColor: backgroundColor || 'transparent',
        '& .MuiOutlinedInput-notchedOutline': {
          border: border ? '1px solid #ccc' : 'none'
        }
      }}
      value={value}
      size='small'
      onChange={onChange}
      displayEmpty
      MenuProps={{
        PaperProps: {
          sx: {
            '& .MuiMenuItem-root': {
              '&:nth-of-type(odd)': {
                backgroundColor: '#ffffff',
                '&:hover': {
                  backgroundColor: '#f0f0f0'
                }
              },
              '&:nth-of-type(even)': {
                backgroundColor: '#f5f5f5',
                '&:hover': {
                  backgroundColor: '#e8e8e8'
                }
              }
            }
          }
        }
      }}
    >
      {placeholder && (
        <MenuItem value='' disabled>
          {placeholder}
        </MenuItem>
      )}
      {options.map(option => (
        <MenuItem key={option.key} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  )
}

export default CustomSelectBox
