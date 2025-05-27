// ** React Imports
import { useEffect, useRef, useState } from 'react'

// ** MUI Imports

// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import PickersComponent from './PickersComponent'

// ** Custom Component Imports
import { IconButton, useTheme } from '@mui/material'
import format from 'date-fns/format'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import IconCustom from 'src/layouts/components/IconCustom'

export type DateType = Date | null | undefined

const PickersRange = ({
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
  useNotDefaultStyle = false,
  isSingleDate = false,
  alwaysShowIcon = false,
  clearable = true,
  showTwoCalendars = false
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
  isSingleDate?: boolean
  alwaysShowIcon?: boolean
  clearable?: boolean
  showTwoCalendars?: boolean
}) => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const [startDate, setStartDate] = useState<DateType>()
  const [endDate, setEndDate] = useState<DateType>()

  // Create a ref for the DatePicker
  const datePickerRef = useRef<any>(null)

  useEffect(() => {
    if (selectedStartDate) {
      const validStartDate = new Date(selectedStartDate)
      if (!isNaN(validStartDate.getTime())) {
        setStartDate(validStartDate)
      }
    }

    if (selectedEndDate && !isSingleDate) {
      const validEndDate = new Date(selectedEndDate)
      if (!isNaN(validEndDate.getTime())) {
        setEndDate(validEndDate)
      }
    }
  }, [selectedStartDate, selectedEndDate, isSingleDate])

  const handleOnChange = (dates: any) => {
    if (isSingleDate) {
      const date = dates
      setStartDate(date)
      if (date) onChange(format(date, returnFormat), '')
    } else {
      const [start, end] = dates
      setStartDate(start)
      setEndDate(end)
      if (start && end) onChange(format(start, returnFormat), format(end, returnFormat))
    }
  }

  const handleIconClick = () => {
    // Focus the DatePicker to open the calendar
    if (datePickerRef.current) {
      datePickerRef.current.setFocus()
    }
  }

  return (
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
          <IconCustom icon='calendar' isCommon style={{ cursor: 'pointer' }} />
        </IconButton>
      )}

      <DatePicker
        ref={datePickerRef}
        selectsRange={!isSingleDate}
        isClearable={clearable && !isDisabled}
        endDate={isSingleDate ? undefined : endDate}
        selected={startDate}
        startDate={isSingleDate ? undefined : startDate}
        id='date-range-picker'
        onChange={handleOnChange}
        shouldCloseOnSelect={isSingleDate}
        popperPlacement={popperPlacement}
        monthsShown={showTwoCalendars ? 2 : 1}
        customInput={
          <PickersComponent
            label={
              placeholder && !startDate && !endDate
                ? placeholder
                : label
                ? label
                : isSingleDate
                ? '날짜 선택'
                : '기간설정'
            }
            start={startDate as Date | number}
            end={endDate as Date | number}
            useIcon={useIcon}
            placeholderColor={placeholderColor && !startDate && !endDate ? placeholderColor : undefined}
            alwaysShowIcon={alwaysShowIcon}
            clearable={clearable}
          />
        }
        disabled={isDisabled}
      />
    </DatePickerWrapper>
  )
}

export default PickersRange
