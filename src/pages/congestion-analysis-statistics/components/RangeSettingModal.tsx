import { Box, Typography } from '@mui/material'
import { padding } from '@mui/system'
import { useModal } from 'src/hooks/useModal'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { StyledTextField } from 'src/@core/styles/StyledComponents'
import { statusLevelColorList } from 'src/enum/statisticsEnum'
import styled from 'styled-components'

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
  const { setSimpleDialogModalProps } = useModal()

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

    setSimpleDialogModalProps({
      open: true,
      isConfirm: false,
      size: 'small',
      title: <CustomModalTitle>점유율 단계 설정 오류</CustomModalTitle>,
      contents: '각 단계의 시작값과 종료값이 다른 단계와 겹치지 않도록 설정해주세요',
      confirmText: '확인'
    })

    return false
  }

  useImperativeHandle(ref, () => ({
    handleConfirm
  }))

  return (
    <Box display={'flex'} justifyContent={'center'} sx={{ padding: '20px 0' }}>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        {[0, 1, 2, 3].map(index => (
          <Box key={index} display={'flex'} alignItems={'center'} gap={3}>
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
            <Box display={'flex'} alignItems={'center'} gap={2}>
              <StyledTextField
                value={rangeValues[index].min.toString()}
                onChange={e => handleRangeChange(index, 'min', e.target.value)}
                size='small'
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
                sx={{ '& .MuiOutlinedInput-root': { height: '44px!important' } }}
              />{' '}
              %
            </Box>

            {index === 3 ? (
              <>
                <div style={{ width: '10px' }}></div>
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} gap={2} minWidth={50}>
                  <Typography>이상</Typography>
                </Box>
              </>
            ) : (
              <>
                ~
                <Box display={'flex'} alignItems={'center'} gap={2}>
                  <StyledTextField
                    value={rangeValues[index].max.toString()}
                    onChange={e => handleRangeChange(index, 'max', e.target.value)}
                    size='small'
                    inputProps={{
                      inputMode: 'numeric',
                      pattern: '[0-9]*'
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { height: '44px!important' } }}
                  />{' '}
                  %
                </Box>
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
    </Box>
  )
})

RangeSettingModal.displayName = 'RangeSettingModal'

const CustomModalTitle = styled.span`
  display: inline-block;
  font-size: 20px;
  color: #5e5b65;
  margin: 0 auto;
  font-weight: 600;
  padding-left: 30px;
  min-height: 24px;
  background: center left / 24px url('/images/caution/ALM0000005.svg') no-repeat;
`

export default RangeSettingModal
