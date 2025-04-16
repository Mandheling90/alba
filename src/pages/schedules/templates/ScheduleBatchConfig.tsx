import styled from '@emotion/styled'
import { useState } from 'react'
import BatchItem from './BatchItem'
import GateSelect from './GateSelect'

const ScheduleConfig = () => {
  const [selectedGates, setSelectedGates] = useState<string[]>([])

  return (
    <Container>
      <GateSelect
        fullWidth
        label='스케쥴 적용장소'
        multiple
        value={selectedGates}
        onChange={event => setSelectedGates(event.target.value as string[])}
      />
      <BatchItem number='01' title='매주 휴업 요일 지정'>
        <BatchItem.Handler />
      </BatchItem>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #fff;
  height: 100%;
  padding: 12px 40px;
  margin-top: -12px;
  border-radius: 8px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  min-width: 550px;
  margin-right: 48px;
`

export default ScheduleConfig
