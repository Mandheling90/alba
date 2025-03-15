import { Box, Checkbox, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { FC } from 'react'

interface Option {
  key: string
  value: string
  label: string
}

interface ICustomSelectBox {
  value: string[]
  onChange: (event: SelectChangeEvent, selectedValues: string[]) => void
  options: Option[]
  placeholder?: string
  placeholderColor?: string
  backgroundColor?: string
  border?: boolean
  width?: string
  renderValue?: string
  renderIcone?: React.ReactNode
}

const CustomSelectCheckBox: FC<ICustomSelectBox> = ({
  value,
  onChange,
  options,
  placeholder,
  placeholderColor = '#757575',
  backgroundColor,
  border = true,
  width,
  renderValue,
  renderIcone
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    const selectedValue = event.target.value as string
    const newSelectedValues = value.includes(selectedValue)
      ? value.filter(v => v !== selectedValue)
      : [...value, selectedValue]

    onChange(event, newSelectedValues)
  }

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
      onChange={event => {
        const value = event.target.value
        onChange(event as SelectChangeEvent, typeof value === 'string' ? value.split(',') : value)
      }}
      displayEmpty
      renderValue={selected => {
        if (renderValue) {
          return (
            <Box display={'flex'} alignItems={'center'} gap={1}>
              {renderIcone}
              {renderValue}
            </Box>
          )
        }

        return selected.join(', ')
      }}
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
          },
          onClick: event => {
            event.stopPropagation()
          }
        }
      }}
      multiple
    >
      {placeholder && (
        <MenuItem value='' disabled sx={{ color: placeholderColor }}>
          {placeholder}
        </MenuItem>
      )}
      {options.map(option => (
        <MenuItem key={option.key} value={option.value}>
          <Checkbox checked={value.includes(option.value)} />
          <ListItemText primary={option.label} />
        </MenuItem>
      ))}
    </Select>
  )
}

export default CustomSelectCheckBox
