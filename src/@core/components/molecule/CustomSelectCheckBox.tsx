import { Box, Checkbox, Collapse, IconButton, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { FC, useState } from 'react'
import IconCustom from 'src/layouts/components/IconCustom'

interface Option {
  key: string
  value: string
  label: string
  children?: Option[]
  disabled?: boolean
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
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }))
  }

  const renderMenuItem = (option: Option, level = 0, isChild = false) => {
    const hasChildren = Boolean(option.children && option.children.length > 0)
    const isExpanded = expandedGroups[option.key]

    return (
      <Box key={option.key}>
        <MenuItem
          value={option.value}
          sx={{
            pl: level * 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box display='flex' alignItems='center' sx={isChild ? { m: 2, ml: 5 } : {}}>
            {!isChild && (
              <Checkbox
                checked={value.includes(option.value)}
                disabled={option.disabled}
                onChange={e => {
                  const newValue = e.target.checked ? [...value, option.value] : value.filter(v => v !== option.value)
                  const event = {
                    target: {
                      value: newValue,
                      name: ''
                    }
                  } as unknown as SelectChangeEvent
                  onChange(event, newValue)
                }}
              />
            )}
            <ListItemText primary={option.label} />
          </Box>
          {hasChildren && (
            <IconButton
              size='small'
              onClick={e => {
                e.stopPropagation()
                toggleGroup(option.key)
              }}
            >
              {isExpanded ? <IconCustom isCommon icon='folding' /> : <IconCustom isCommon icon='Fold' />}
            </IconButton>
          )}
        </MenuItem>
        {hasChildren && (
          <Collapse in={isExpanded}>{option.children?.map(child => renderMenuItem(child, level + 1, true))}</Collapse>
        )}
      </Box>
    )
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
        const newValue = event.target.value
        onChange(event as SelectChangeEvent, typeof newValue === 'string' ? newValue.split(',') : newValue)
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
      {options.map(option => renderMenuItem(option))}
    </Select>
  )
}

export default CustomSelectCheckBox
