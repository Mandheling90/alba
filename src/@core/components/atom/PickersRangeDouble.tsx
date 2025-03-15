// ** React Imports
import { useEffect, useRef, useState } from 'react'

// ** MUI Imports
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

// ** Third Party Imports
import { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
import { IconButton, useTheme } from '@mui/material'
import format from 'date-fns/format'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import IconCustom from 'src/layouts/components/IconCustom'

export type DateType = Date | null | undefined

const PickersRangeDouble = ({
  label,
  width,
  onChange,
  useIcon = false,
  useFrontIcon,
  returnFormat = 'yyyyMMdd',
  selectedStartDate = '',
  selectedEndDate = '',
  isDisabled = false,
  placeholder,
  placeholderColor,
  inputStyle,
  useNotDefaultStyle = false
}: {
  label?: string
  width?: number
  onChange: (start: string, end: string) => void
  useIcon?: boolean
  useFrontIcon?: boolean
  returnFormat?: string
  selectedStartDate?: string
  selectedEndDate?: string
  isDisabled?: boolean
  placeholder?: string
  placeholderColor?: string
  inputStyle?: React.CSSProperties
  useNotDefaultStyle?: boolean
}) => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  // Create a ref for the DatePicker
  const datePickerRef = useRef<any>(null)

  useEffect(() => {
    if (selectedStartDate) {
      const validStartDate = new Date(selectedStartDate)
      if (!isNaN(validStartDate.getTime())) {
        setStartDate(validStartDate)
      }
    }

    if (selectedEndDate) {
      const validEndDate = new Date(selectedEndDate)
      if (!isNaN(validEndDate.getTime())) {
        setEndDate(validEndDate)
      }
    }
  }, [selectedStartDate, selectedEndDate])

  const handleOnChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)

    if (start && end) onChange(format(start, returnFormat), format(end, returnFormat))
  }

  const handleIconClick = () => {
    // Focus the DatePicker to open the calendar
    if (datePickerRef.current) {
      datePickerRef.current.setFocus()
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePickerWrapper
        sx={{
          '& .react-datepicker-wrapper': { width: width ? `${width}px` : '100%' },
          '& .MuiFormControl-root': { width: width ? `${width}px` : '100%' },
          display: useFrontIcon ? 'flex' : '',
          alignItems: 'center',
          '& .MuiInputBase-root': {
            ...inputStyle,
            ...(useNotDefaultStyle
              ? {
                  '&:before, &:after': {
                    display: 'none !important'
                  },
                  '& fieldset': {
                    border: 'none !important'
                  },
                  '&:hover fieldset': {
                    border: 'none !important'
                  },
                  '&.Mui-focused fieldset': {
                    border: 'none !important'
                  }
                }
              : {})
          }
        }}
      >
        {useFrontIcon && (
          <IconButton onClick={handleIconClick}>
            <IconCustom icon='carbon_calendar' isCommon style={{ cursor: 'pointer' }} />
          </IconButton>
        )}

        <DateRangeCalendar value={[startDate, endDate]} onChange={handleOnChange} disabled={isDisabled} />
      </DatePickerWrapper>
    </LocalizationProvider>
  )
}

export default PickersRangeDouble
