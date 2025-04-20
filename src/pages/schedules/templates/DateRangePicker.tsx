import PickersRange from 'src/@core/components/atom/PickersRange'
import { useBatchItem } from '../contexts/batchItemContext'

interface IDateRangePicker {
  onChange: (start: string, end: string) => void
  selectedStartDate?: string
  selectedEndDate?: string
}

const DateRangePicker = ({ onChange, selectedStartDate, selectedEndDate }: IDateRangePicker) => {
  const { setApplyStatus } = useBatchItem()
  const handleChange = (start: string, end: string) => {
    setApplyStatus('writing')
    onChange(start, end)
  }

  console.log('selectedDates', selectedStartDate, selectedEndDate)

  return (
    <PickersRange onChange={handleChange} selectedStartDate={selectedStartDate} selectedEndDate={selectedEndDate} />
  )
}

export default DateRangePicker
