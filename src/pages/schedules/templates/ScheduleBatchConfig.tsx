import styled from '@emotion/styled'
import { useState } from 'react'
import GateSelect from './GateSelect'

const ScheduleConfig = () => {
  const [selectedGates, setSelectedGates] = useState<string[]>([])

  return (
    <Container>
      <GateSelect
        label='스케쥴 적용장소'
        multiple
        value={selectedGates}
        onChange={event => setSelectedGates(event.target.value as string[])}
      />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #fff;
  height: 100%;
  padding: 12px;
  margin-top: -12px;
  border-radius: 8px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
`

export default ScheduleConfig
