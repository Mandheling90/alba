import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { FC } from 'react'
import { BorderInput } from 'src/@core/styles/StyledComponents'

const slideUpAnimation = keyframes`
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
`

const slideDownAnimation = keyframes`
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
`

const AnimatedBorderInput = styled(BorderInput)`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`

const NumberWrapper = styled.div<{ isAnimating: boolean; isIncreasing: boolean }>`
  animation: ${props => (props.isAnimating ? (props.isIncreasing ? slideUpAnimation : slideDownAnimation) : 'none')}
    0.3s ease-out;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

interface AnimatedNumberProps {
  number: number
  animatingDigits: boolean[]
  isIncreasingDigits: boolean[]
  fontSize?: string
  padding?: string
  minWidth?: string
  backgroundColor?: string
  color?: string
}

const AnimatedNumber: FC<AnimatedNumberProps> = ({
  number,
  animatingDigits,
  isIncreasingDigits,
  fontSize = '1.5rem',
  padding = '0px',
  minWidth = 'auto',
  backgroundColor = 'transparent',
  color = 'inherit'
}) => {
  const formatNumber = (num: number): string[] => {
    return num.toString().padStart(3, '0').split('')
  }

  return (
    <>
      {formatNumber(number).map((digit, index) => (
        <AnimatedBorderInput
          key={index}
          fontSize={fontSize}
          padding={padding}
          minWidth={minWidth}
          backgroundColor={backgroundColor}
          color={color}
        >
          <NumberWrapper isAnimating={animatingDigits[index]} isIncreasing={isIncreasingDigits[index]}>
            {digit}
          </NumberWrapper>
        </AnimatedBorderInput>
      ))}
    </>
  )
}

export default AnimatedNumber
