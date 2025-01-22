// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports

// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import PickersComponent from './PickersComponent'

// ** Custom Component Imports

import { format } from 'date-fns'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

export type DateType = Date | null | undefined

const PickersBasic = ({
  popperPlacement,
  onChange,
  label = '검색기간',
  width = 'auto'
}: {
  popperPlacement: ReactDatePickerProps['popperPlacement']
  onChange: (date: string) => void
  label?: string
  width?: string
}) => {
  const [date, setDate] = useState<DateType>(new Date())

  useEffect(() => {
    if (date) {
      onChange(format(date, 'yyyyMMdd'))
    }
  }, [date, onChange])

  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: { width } } }}>
      <DatePicker
        selected={date}
        id='basic-input'
        popperPlacement={popperPlacement}
        onChange={(date: Date) => {
          setDate(date)
        }}
        placeholderText='Click to select a date'
        customInput={<PickersComponent label={label} start={date as Date | number} />}
      />
    </DatePickerWrapper>
  )
}

export default PickersBasic
