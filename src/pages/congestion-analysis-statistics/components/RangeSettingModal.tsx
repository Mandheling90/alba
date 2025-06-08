import { Box, Typography } from '@mui/material'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { StyledTextField } from 'src/@core/styles/StyledComponents'
import { statusLevelColorList } from 'src/enum/statisticsEnum'

interface RangeValue {
  min: number
  max: number
}

interface RangeSettingModalProps {
  onConfirm: (ranges: RangeValue[]) => void
}

export interface RangeSettingModalRef {
  handleConfirm: () => boolean
}

const RangeSettingModal = forwardRef<RangeSettingModalRef, RangeSettingModalProps>(({ onConfirm }, ref) => {
  const [rangeValues, setRangeValues] = useState<RangeValue[]>([
    { min: 1, max: 10 },
    { min: 11, max: 20 },
    { min: 21, max: 30 },
    { min: 31, max: 100 }
  ])
  const [errorMessage, setErrorMessage] = useState<string>('')

  const validateRanges = (ranges: RangeValue[]): boolean => {
    // min이 max보다 큰 경우 체크
    for (let i = 0; i < ranges.length; i++) {
      if (ranges[i].min >= ranges[i].max) {
        setErrorMessage(`${i + 1}단계의 최소값은 최대값보다 작아야 합니다.`)

        return false
      }
    }

    // 범위가 겹치는지 체크
    for (let i = 0; i < ranges.length; i++) {
      for (let j = i + 1; j < ranges.length; j++) {
        if (
          (ranges[i].min <= ranges[j].max && ranges[i].max >= ranges[j].min) ||
          (ranges[j].min <= ranges[i].max && ranges[j].max >= ranges[i].min)
        ) {
          setErrorMessage(`${i + 1}단계와 ${j + 1}단계의 범위가 겹칩니다.`)

          return false
        }
      }
    }
    setErrorMessage('')

    return true
  }

  const handleRangeChange = (index: number, type: 'min' | 'max', value: string) => {
    // 숫자만 입력 가능하도록 처리
    const numValue = value === '' ? 0 : Number(value)
    if (isNaN(numValue)) return

    const newRanges = [...rangeValues]
    newRanges[index] = { ...newRanges[index], [type]: numValue }
    setRangeValues(newRanges)
    validateRanges(newRanges)
  }

  const handleConfirm = () => {
    if (validateRanges(rangeValues)) {
      onConfirm(rangeValues)

      return true
    }

    return false
  }

  useImperativeHandle(ref, () => ({
    handleConfirm
  }))

  return (
    <Box display={'flex'} flexDirection={'column'} gap={2}>
      {[0, 1, 2, 3].map(index => (
        <Box key={index} display={'flex'} alignItems={'center'} gap={1}>
          <Typography
            sx={{
              backgroundColor: statusLevelColorList[index],
              borderRadius: '4px',
              padding: '10px',
              minWidth: '60px',
              textAlign: 'center'
            }}
          >
            {index + 1}단계
          </Typography>
          <StyledTextField
            value={rangeValues[index].min.toString()}
            onChange={e => handleRangeChange(index, 'min', e.target.value)}
            size='small'
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*'
            }}
          />{' '}
          %
          {index === 3 ? (
            <Typography>이상</Typography>
          ) : (
            <>
              ~
              <StyledTextField
                value={rangeValues[index].max.toString()}
                onChange={e => handleRangeChange(index, 'max', e.target.value)}
                size='small'
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
              />{' '}
              %
            </>
          )}
        </Box>
      ))}
      {errorMessage && (
        <Typography color='error' sx={{ mt: 1 }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  )
})

RangeSettingModal.displayName = 'RangeSettingModal'

export default RangeSettingModal
