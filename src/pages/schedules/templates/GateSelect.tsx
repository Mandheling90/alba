import { Checkbox, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import Image from 'next/image'
import { FC, useMemo } from 'react'
import styled from 'styled-components'
import { useGateList } from '../../../service/schedule/scheduleService'

interface IGateSelect<T = string | string[]> {
  value: T
  onChange: (event: SelectChangeEvent<T>) => void
  multiple?: boolean
  label?: string
  fullWidth?: boolean
}

const GateSelect: FC<IGateSelect> = ({ value, onChange, multiple = false, label, fullWidth = false }) => {
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
      <Label>{label}</Label>
      <Container fullWidth={fullWidth}>
        <Select
          value={value}
          onChange={onChange}
          multiple={multiple}
          sx={{
            width: fullWidth ? '100%' : '200px',
            height: '40px',
            paddingLeft: 8,
            fontSize: 12
          }}
          IconComponent={() => (
            <IconContainer>
              <Image src={'/images/map-poi-fill.svg'} alt='map-poi-fill' fill />
            </IconContainer>
          )}
          renderValue={selected => {
            const selectedValues = selected as string[]
            const labels = options.filter(option => selectedValues.includes(option.value)).map(option => option.label)
            const renderMultipleLabel = `${labels.slice(0, 4).join(', ')}${
              labels.length > 4 ? ` 외 ${labels.length - 4}곳` : ''
            }`

            return multiple ? renderMultipleLabel : labels[0]
          }}

          // inputProps={{
          //   sx:{

          //   }
          // }}
        >
          {options.map(option => (
            <MenuItem key={option.key} value={option.value}>
              {multiple ? <Checkbox checked={(value as string[]).includes(option.value)} /> : null}
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
      </Container>
    </Wrapper>
  )
}

const Container = styled.div<{ fullWidth?: boolean }>`
  width: ${props => (props.fullWidth ? '100%' : '200px')};
  height: 40px;
`
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 12px;
  align-items: flex-end;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.15px;
  flex-direction: column;
`

const Label = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: #717171;
`

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 18px;
  position: absolute;
  left: 12px;
`

export default GateSelect
