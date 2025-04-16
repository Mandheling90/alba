import styled from '@emotion/styled'
import Image from 'next/image'
import { useBatchItem } from '../contexts/batchItemContext'

interface IWorkTimeSelect {
  onChangeStartTime: (startTime: string) => void
  onChangeEndTime: (endTime: string) => void
  selectedStartTime?: string
  selectedEndTime?: string
}

const WorkTimeSelect = ({
  onChangeStartTime,
  onChangeEndTime,
  selectedStartTime,
  selectedEndTime
}: IWorkTimeSelect) => {
  const timeOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))

  const { setApplyStatus } = useBatchItem()
  const handleChange = (type: 'startTime' | 'endTime', value: string) => {
    setApplyStatus('writing')
    if (type === 'startTime') {
      onChangeStartTime(value)
    } else {
      onChangeEndTime(value)
    }
  }

  return (
    <Container>
      <Image src={'/images/time/time.svg'} alt='work-time-input' width={18} height={18} />
      <span>영업시간</span>
      <TimeInputContainer>
        <select value={selectedStartTime} onChange={e => handleChange('startTime', e.target.value)}>
          <option value=''>-</option>
          {timeOptions.map(option => {
            const startTimeNumber = parseInt(option)
            const endTimeNumber = selectedEndTime ? parseInt(selectedEndTime) : 0

            const isDisabled = endTimeNumber ? startTimeNumber > endTimeNumber : false

            return (
              <option key={option} disabled={!!isDisabled}>
                {option}
              </option>
            )
          })}
        </select>
        ~
        <select value={selectedEndTime} onChange={e => handleChange('endTime', e.target.value)}>
          <option value=''>-</option>
          {timeOptions.map(option => {
            const endTimeNumber = parseInt(option)
            const startTimeNumber = selectedStartTime ? parseInt(selectedStartTime) : 0
            const isDisabled = startTimeNumber ? endTimeNumber < startTimeNumber : false

            return (
              <option key={option} disabled={!!isDisabled}>
                {option}
              </option>
            )
          })}
        </select>
      </TimeInputContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex: 1;
  font-size: 13px;
`
export const TimeInputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  gap: 4px;
  > select {
    flex: 1;
    height: 24px;
    border-radius: 4px;
    border: 1px solid #ccc;
    padding: 0 8px;
    font-size: 14px;
    color: #333;
    background-color: #fff;
    outline: none;
    appearance: none;
    text-align: center;
  }
`

export default WorkTimeSelect
