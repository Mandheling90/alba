import { Button } from '@mui/material'
import { FC } from 'react'

interface ButtonGroupProps {
  onNext: () => void
  onBack: () => void

  // activeStep?: number
  // index?: number
}

const ButtonGroup: FC<ButtonGroupProps> = ({
  onNext,
  onBack

  // activeStep, index
}) => {
  // console.log(activeStep)

  // 현재 스텝이 아니거나 activeStep이 1일 때 disabled
  // const isDisabled = activeStep !== index
  const isDisabled = false

  return (
    <div className='button-wrapper'>
      <Button size='medium' variant='contained' onClick={onNext} sx={{ mr: 4 }} disabled={isDisabled}>
        등록
      </Button>

      <Button size='medium' color='secondary' variant='outlined' onClick={onBack} disabled={isDisabled}>
        취소
      </Button>
    </div>
  )
}

export default ButtonGroup
