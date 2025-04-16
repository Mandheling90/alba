import { Button } from '@mui/material'
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

  return (
    <Container>
      <TitleContainer>
        {isOther ? (
          <div></div>
        ) : (
          <Button
            variant='outlined'
            size='small'
            sx={{ height: '24px', minWidth: '10px', padding: '4px 4px', color: '#333', borderColor: '#9155fd' }}
          >
            영업일
          </Button>
        )}
        <span>{dayNumberText}</span>
      </TitleContainer>

      {isOther || (
        <>
          <WorkTimeFont>영업시간</WorkTimeFont>
          <TimeInputContainer>
            <select value={startTime} onChange={e => setStartTime(e.target.value)}>
              <option value=''>-</option>
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
              <option value=''>-</option>
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
        </>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  padding: 4px;
  width: 100%;
`

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`
export const TimeInputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
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

const WorkTimeFont = styled.span`
  margin-top: auto;
  font-weight: 400;
  font-size: 12px;
  line-height: 16.87px;
  margin-bottom: 4px;
  letter-spacing: 0px;
`

export default DateItem
