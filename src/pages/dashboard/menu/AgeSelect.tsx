import { Box, Typography } from '@mui/material'
import { FC } from 'react'
import CustomSelectCheckBox from 'src/@core/components/molecule/CustomSelectCheckBox'
import IconCustom from 'src/layouts/components/IconCustom'

interface IAgeSelect {
  value: string[]
  onChange: (values: string[]) => void
}

const ageOptions = [
  { key: 'ALL', value: 'ALL', label: '전체' },
  { key: '0', value: '0', label: '10대이하' },
  { key: '1', value: '1', label: '10대' },
  { key: '2', value: '2', label: '20대' },
  { key: '3', value: '3', label: '30대' },
  { key: '4', value: '4', label: '40대' },
  { key: '5', value: '5', label: '50대' },
  { key: '6', value: '6', label: '60대 이상' }
]

const AgeSelect: FC<IAgeSelect> = ({ value, onChange }) => {
  const handleChange = (event: any, newSelectedValues: string[]) => {
    // 전체(ALL)가 선택된 경우
    if (newSelectedValues[newSelectedValues.length - 1] === 'ALL') {
      onChange(['ALL'])
    }

    // 다른 옵션이 선택된 경우
    else if (newSelectedValues.length > 0) {
      // ALL이 선택되어 있으면 제거
      const filteredValues = newSelectedValues.filter(value => value !== 'ALL')
      onChange(filteredValues)
    }

    // 아무것도 선택되지 않은 경우
    else {
      onChange([])
    }
  }

  return (
    <Box display={'flex'} alignItems={'center'} gap={2}>
      <Typography variant='h6' fontWeight={500}>
        연령대
      </Typography>
      <CustomSelectCheckBox
        width='185px'
        value={value}
        onChange={handleChange}
        options={ageOptions}
        renderValue={value.map(v => ageOptions.find(option => option.key === v)?.label).join(', ') || '연령대 선택'}
        renderIcone={<IconCustom isCommon icon='map' />}
        placeholder='연령대 선택'
      />
    </Box>
  )
}

export default AgeSelect
