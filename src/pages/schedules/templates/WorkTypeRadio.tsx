import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { WorkType } from 'src/service/schedule/scheduleService'
import { useBatchItem } from '../contexts/batchItemContext'

interface IWorkTypeRadio {
  workType: WorkType
  onChange: (workType: WorkType) => void
}

const WorkTypeRadio = ({ workType, onChange }: IWorkTypeRadio) => {
  const { setApplyStatus } = useBatchItem()
  const handleChange = (workType: WorkType) => {
    setApplyStatus('writing')
    onChange(workType)
  }

  return (
    <RadioContainer>
      <RadioItem isActive={workType === 'work'} onClick={() => handleChange('work')} color='#9155FD'>
        영업일
      </RadioItem>
      <RadioItem isActive={workType === 'holiday'} onClick={() => handleChange('holiday')} color='red'>
        휴업일
      </RadioItem>
    </RadioContainer>
  )
}

const RadioContainer = styled.div`
  display: flex;
  gap: 12px;
`

const RadioItem = styled.button<{ isActive: boolean; color: string }>`
  display: flex;
  align-items: center;
  gap: 12px;
  outline: none;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #c5c4c4;
  color: #c5c4c4;
  background-color: transparent;
  ${({ isActive, color }) =>
    isActive
      ? css`
          background-color: ${color};
          border-color: ${color};
          color: #fff;
        `
      : css`
          &:hover {
            border-color: ${color};
            color: ${color};
          }
        `}
`

export default WorkTypeRadio
