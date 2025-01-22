import { InputAdornment, TextField } from '@mui/material'
import format from 'date-fns/format'
import { forwardRef } from 'react'
import IconCustom from 'src/layouts/components/IconCustom'

interface PickerProps {
  label?: string
  readOnly?: boolean
  end?: Date | number
  start?: Date | number
  useIcon?: boolean

  placeholderColor?: string
}

const PickersComponent = forwardRef(
  ({ label, readOnly = true, useIcon = false, placeholderColor, ...restProps }: PickerProps, ref) => {
    if (restProps.start && restProps.end) {
      const startDate = format(restProps.start, 'yyyy-MM-dd')
      const endDate = restProps.end !== null ? ` - ${format(restProps.end, 'yyyy-MM-dd')}` : null
      const value = `${startDate}${endDate !== null ? endDate : ''}`

      return (
        <TextField
          inputRef={ref}
          label={label || ''}
          {...restProps}
          value={value}
          size='small'
          InputLabelProps={{
            style: { color: placeholderColor, opacity: placeholderColor ? 0.5 : 1 } // 원하는 색상으로 label 색상 설정
          }}
        />
      )
    }

    if (restProps.start) {
      const startDate = format(restProps.start, 'yyyy-MM-dd')

      return (
        <TextField
          inputRef={ref}
          {...restProps}
          value={startDate}
          label={label || ''}
          {...(readOnly && { inputProps: { readOnly: true } })}
          size='small'
          InputLabelProps={{
            style: { color: placeholderColor, opacity: placeholderColor ? 0.5 : 1 } // 원하는 색상으로 label 색상 설정
          }}
        />
      )
    }

    return (
      <TextField
        inputRef={ref}
        {...restProps}
        label={label || ''}
        size='small'
        InputProps={{
          readOnly: true,
          startAdornment: useIcon ? (
            <InputAdornment position='start'>
              <IconCustom icon='carbon_calendar' isCommon />
            </InputAdornment>
          ) : null
        }}
        InputLabelProps={{
          shrink: false,
          style: {
            paddingLeft: useIcon ? '34px' : '0',
            color: placeholderColor ? placeholderColor : undefined, // 원하는 색상으로 label 색상 설정
            opacity: placeholderColor ? 0.5 : 1
          }
        }}
      />
    )
  }
)

export default PickersComponent
