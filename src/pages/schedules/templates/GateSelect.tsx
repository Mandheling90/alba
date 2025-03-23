import { useState } from 'react'
import CustomSelectBox from 'src/@core/components/molecule/CustomSelectBox'
import styled from 'styled-components'

const GateSelect = () => {
  const [value, setValue] = useState('1')

  return (
    <Container>
      <CustomSelectBox
        backgroundColor='#fff'
        options={[
          {
            key: '1',
            value: '1',
            label: '남문 출입구'
          },
          {
            key: '2',
            value: '2',
            label: '북문 출입구'
          },
          {
            key: '3',
            value: '3',
            label: '동문 출입구'
          },
          {
            key: '4',
            value: '4',
            label: '서문 출입구'
          }
        ]}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </Container>
  )
}

const Container = styled.div`
  width: 200px;
  height: 40px;
  margin-bottom: 10px;
`

export default GateSelect
