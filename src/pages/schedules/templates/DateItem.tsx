import { useState } from 'react'
import styled from 'styled-components'

interface IDateItem {
  dayNumberText: string
  isOther: boolean
}

const DateItem = ({ dayNumberText, isOther }: IDateItem) => {
  const [startTime, setStartTime] = useState<string>()
  const [endTime, setEndTime] = useState<string>()

  const timeOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
  console.log('dayNumberText, isOther', dayNumberText, isOther)

  return (
    <Container>
      <span>{dayNumberText}</span>
      {isOther || (
        <TimeInputContainer>
          <select value={startTime} onChange={e => setStartTime(e.target.value)}>
            {timeOptions.map(option => {
              const startTimeNumber = parseInt(option)
              const endTimeNumber = endTime ? parseInt(endTime) : 0

              const isDisabled = endTimeNumber ? startTimeNumber > endTimeNumber : false

              return (
                <option key={option} disabled={!!isDisabled}>
                  {option}
                </option>
              )
            })}
          </select>
          ~
          <select value={endTime} onChange={e => setEndTime(e.target.value)}>
            {timeOptions.map(option => {
              const endTimeNumber = parseInt(option)
              const startTimeNumber = startTime ? parseInt(startTime) : 0
              const isDisabled = startTimeNumber ? endTimeNumber < startTimeNumber : false

              return (
                <option key={option} disabled={!!isDisabled}>
                  {option}
                </option>
              )
            })}
          </select>
        </TimeInputContainer>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  height: 100%;
  padding: 4px;
`
const TimeInputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 4px;
  > select {
    flex: 1;
    height: 40px;
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

export default DateItem
