// ** React Imports
import { useEffect, useRef, useState } from 'react'

// ** MUI Imports

// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import PickersComponent from './PickersComponent'

// ** Custom Component Imports
import { IconButton } from '@mui/material'
import format from 'date-fns/format'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import IconCustom from 'src/layouts/components/IconCustom'

export type DateType = Date | null | undefined

const PickersRange = ({
  popperPlacement,
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
  placeholderColor
}: {
  popperPlacement: ReactDatePickerProps['popperPlacement']
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
}) => {
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
    <DatePickerWrapper
      sx={{
        '& .react-datepicker-wrapper': { width: width ? `${width}px` : '100%' },
        '& .MuiFormControl-root': { width: width ? `${width}px` : '100%' },
        display: useFrontIcon ? 'flex' : '',
        alignItems: 'center'
      }}
    >
      {useFrontIcon && (
        <IconButton onClick={handleIconClick}>
          <IconCustom icon='carbon_calendar' isCommon style={{ cursor: 'pointer' }} />
        </IconButton>
      )}

      <DatePicker
        ref={datePickerRef} // Attach the ref to the DatePicker
        selectsRange
        isClearable={!isDisabled}
        endDate={endDate}
        selected={startDate}
        startDate={startDate}
        id='date-range-picker'
        onChange={handleOnChange}
        shouldCloseOnSelect={false}
        popperPlacement={popperPlacement}
        customInput={
          <PickersComponent
            label={placeholder && !startDate && !endDate ? placeholder : label ? label : '기간설정'}
            start={startDate as Date | number}
            end={endDate as Date | number}
            useIcon={useIcon}
            placeholderColor={placeholderColor && !startDate && !endDate ? placeholderColor : undefined}
          />
        }
        disabled={isDisabled}
      />
    </DatePickerWrapper>
  )
}

export default PickersRange
