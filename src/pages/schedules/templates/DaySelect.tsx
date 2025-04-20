import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { useBatchItem } from '../contexts/batchItemContext'

interface IDaySelect {
  onChange: (days: string[]) => void
  selectedDays: string[]
}

const DaySelect = ({ onChange, selectedDays = [] }: IDaySelect) => {
  const { setApplyStatus } = useBatchItem()

  const handleDaySelect = (day: string) => {
    setApplyStatus('writing')
    if (selectedDays?.includes(day)) {
      onChange(selectedDays.filter(d => d !== day))
    } else {
      onChange([...selectedDays, day])
    }
  }

  return (
    <Container>
      <DaySelectItem
        selected={selectedDays?.includes('mon')}
        onClick={() => {
          handleDaySelect('mon')
        }}
      >
        월
      </DaySelectItem>
      <DaySelectItem
        selected={selectedDays?.includes('tue')}
        onClick={() => {
          handleDaySelect('tue')
        }}
      >
        화
      </DaySelectItem>
      <DaySelectItem
        selected={selectedDays?.includes('wed')}
        onClick={() => {
          handleDaySelect('wed')
        }}
      >
        수
      </DaySelectItem>
      <DaySelectItem
        selected={selectedDays?.includes('thu')}
        onClick={() => {
          handleDaySelect('thu')
        }}
      >
        목
      </DaySelectItem>
      <DaySelectItem
        selected={selectedDays?.includes('fri')}
        onClick={() => {
          handleDaySelect('fri')
        }}
      >
        금
      </DaySelectItem>
      <DaySelectItem
        selected={selectedDays?.includes('sat')}
        onClick={() => {
          handleDaySelect('sat')
        }}
      >
        토
      </DaySelectItem>
      <DaySelectItem
        selected={selectedDays?.includes('sun')}
        onClick={() => {
          handleDaySelect('sun')
        }}
      >
        일
      </DaySelectItem>
    </Container>
  )
}

const Container = styled.section`
  display: flex;
  gap: 8px;
`

const DaySelectItem = styled.button<{ selected: boolean }>`
  display: flex;
  align-items: center;
  border: 1px solid #9155fd;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #3a3541de;
  width: 20px;
  height: 20px;
  justify-content: center;
  outline: none;
  background: none;
  cursor: pointer;
  ${({ selected }) =>
    selected &&
    css`
      background: #9155fd;
      color: #fff;
    `}
`

export default DaySelect
