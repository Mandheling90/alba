import { useMemo, useState } from 'react'
import CustomSelectBox from 'src/@core/components/molecule/CustomSelectBox'
import styled from 'styled-components'
import { useGateList } from '../queries'

const GateSelect = () => {
  const [value, setValue] = useState('')
  const { data } = useGateList()
  const options = useMemo(() => {
    return (
      data?.data?.map(item => {
        return {
          key: item.id,
          value: item.id,
          label: item.name
        }
      }) ?? []
    )
  }, [data])

  return (
    <Wrapper>
      캘린더 표시장소
      <Container>
        <CustomSelectBox
          backgroundColor='#fff'
          options={options}
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      </Container>
    </Wrapper>
  )
}

const Container = styled.div`
  width: 200px;
  height: 40px;
`
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
  margin-bottom: -72px;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: #717171;
`

export default GateSelect
